<?php

declare(strict_types=1);

namespace Falschcard\Services;

use Falschcard\Core\Env;
use Falschcard\Repositories\SettingsRepository;
use Falschcard\Repositories\StudyRepository;

/**
 * Gemini API proxy.
 * Fetches the (decrypted) API key from the DB and forwards requests server-side.
 * The key is NEVER exposed in URLs, query strings, responses, or logs.
 *
 * Hardened: configurable timeouts, retry with exponential backoff on transient
 * failures (transport errors + HTTP 429/5xx), granular error mapping, structured
 * logging, and strict response validation.
 */
final class GeminiService
{
    private const BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

    /** HTTP statuses that are worth retrying (transient). */
    private const RETRYABLE = [429, 500, 502, 503, 504];

    /**
     * Well-known Gemini models (used as fallback list and as allowlist for URL safety).
     * The first entry is the default model.
     */
    public const DEFAULT_MODELS = [
        'gemini-3.5-flash',       // default
        'gemini-3.1-flash-lite',
    ];

    public function __construct(
        private readonly SettingsRepository $settings = new SettingsRepository(),
        private readonly StudyRepository    $study    = new StudyRepository(),
    ) {}

    /**
     * Non-streaming evaluate call.
     * Returns ['verdict' => ..., 'feedback' => ...]
     */
    public function evaluate(int $profileId, array $card, string $userAnswer): array
    {
        [$apiKey, $model] = $this->credentials($profileId);

        $systemPrompt = $this->evaluationSystemPrompt($card);
        $body = [
            'systemInstruction' => ['parts' => [['text' => $systemPrompt]]],
            'contents'          => [
                ['role' => 'user', 'parts' => [['text' => 'La mia risposta: ' . trim($userAnswer)]]]
            ],
            'generationConfig'  => [
                // Force structured JSON output — eliminates markdown fences and preamble text
                'responseMimeType' => 'application/json',
                'responseSchema'   => [
                    'type'       => 'object',
                    'properties' => [
                        'verdict'  => ['type' => 'string', 'enum' => ['correct', 'partial', 'wrong']],
                        'feedback' => ['type' => 'string'],
                    ],
                    'required'   => ['verdict', 'feedback'],
                ],
                // Disable reasoning ("thinking") for this simple classification task:
                // reasoning tokens consume output budget and add latency with no benefit here.
                'thinkingConfig'   => ['thinkingBudget' => 0],
                'maxOutputTokens'  => 800,
            ],
        ];

        $url = self::BASE . "/{$model}:generateContent";

        try {
            $raw  = $this->httpPost($url, $body, $apiKey, 'evaluate');
            $text = $this->extractText($raw);
        } catch (\RuntimeException $e) {
            $this->study->logGeneration($profileId, 'evaluate', $model, false, $e->getMessage());
            throw $e;
        }

        // Strip possible markdown fences (defence-in-depth in case a model ignores the mime type)
        $text = preg_replace('/```(?:json)?\s*\n?|\n?```/i', '', $text);
        $text = trim($text);
        // Extract JSON object from any surrounding prose
        if (!str_starts_with($text, '{')) {
            $start = strpos($text, '{');
            $end   = strrpos($text, '}');
            if ($start !== false && $end !== false && $end > $start) {
                $text = substr($text, $start, $end - $start + 1);
            }
        }
        $parsed = json_decode($text, true);
        if (!is_array($parsed) || !isset($parsed['verdict'], $parsed['feedback'])) {
            $this->study->logGeneration($profileId, 'evaluate', $model, false, 'unexpected format');
            throw new \RuntimeException('Risposta AI non nel formato atteso.');
        }
        if (!in_array($parsed['verdict'], ['correct', 'partial', 'wrong'], true)) {
            $this->study->logGeneration($profileId, 'evaluate', $model, false, 'invalid verdict');
            throw new \RuntimeException('Verdict non valido.');
        }

        $this->study->logGeneration($profileId, 'evaluate', $model, true);
        return $parsed;
    }

    /**
     * Streaming review call — proxies SSE from Gemini to the client.
     * This method sends HTTP headers and chunks directly; never returns normally.
     */
    public function streamReview(int $profileId, array $card, string $userAnswer): never
    {
        [$apiKey, $model] = $this->credentials($profileId);

        $systemPrompt = $this->answerReviewSystemPrompt($card);
        $body = [
            'systemInstruction' => ['parts' => [['text' => $systemPrompt]]],
            'contents'          => [
                ['role' => 'user', 'parts' => [['text' => 'La mia risposta: ' . trim($userAnswer)]]]
            ],
            'generationConfig'  => [
                // Disable reasoning so thinking tokens don't eat into the output budget
                // (otherwise the streamed explanation gets truncated mid-sentence).
                'thinkingConfig'  => ['thinkingBudget' => 0],
                'maxOutputTokens' => 1536,
            ],
        ];

        $url = self::BASE . "/{$model}:streamGenerateContent?alt=sse";
        $this->streamProxy($url, $body, $apiKey, $profileId, 'review', $model);
    }

    /**
     * Streaming tutor call.
     */
    public function streamTutor(int $profileId, array $card, array $history, string $message): never
    {
        [$apiKey, $model] = $this->credentials($profileId);

        $systemPrompt = $this->tutorSystemPrompt($card);
        $contents = [];
        foreach ($history as $msg) {
            // Validate each history entry — skip malformed items
            if (!is_array($msg) || !isset($msg['role'], $msg['content'])) {
                continue;
            }
            $contents[] = [
                'role'  => $msg['role'] === 'user' ? 'user' : 'model',
                'parts' => [['text' => (string) $msg['content']]],
            ];
        }
        $contents[] = ['role' => 'user', 'parts' => [['text' => $message]]];

        $body = [
            'systemInstruction' => ['parts' => [['text' => $systemPrompt]]],
            'contents'          => $contents,
            'generationConfig'  => [
                // Disable reasoning so thinking tokens don't eat into the output budget.
                'thinkingConfig'  => ['thinkingBudget' => 0],
                'maxOutputTokens' => 2048,
            ],
        ];

        $url = self::BASE . "/{$model}:streamGenerateContent?alt=sse";
        $this->streamProxy($url, $body, $apiKey, $profileId, 'tutor', $model);
    }

    /**
     * Send malformed import text to Gemini; returns ['fixed' => $cleanJson].
     * The AI extracts and repairs flashcard JSON from any input format.
     */
    public function fixImport(int $profileId, string $rawText): array
    {
        [$apiKey, $model] = $this->credentials($profileId);

        $systemPrompt = <<<'PROMPT'
Sei un assistente specializzato nel recupero e correzione di dati JSON per flashcard.
L'utente ti fornisce del testo che dovrebbe contenere un array JSON di flashcard nel formato:
[{"question":"...","answer":"...","explanation":"..."}]

Il tuo compito:
1. Analizza il testo e individua tutte le flashcard presenti, anche se il formato è sbagliato, parziale o il testo è in formato libero.
2. Correggi tutti gli errori di sintassi JSON: virgole mancanti o in eccesso, parentesi non chiuse, apici singoli invece di doppi, caratteri speciali non escapati, trailing commas, ecc.
3. Se "explanation" manca in qualche carta, aggiungine una breve basandoti su "question" e "answer".
4. Restituisci ESCLUSIVAMENTE un array JSON valido e completo.

Regole assolute di output:
- Nessun testo prima o dopo l'array
- Nessun blocco markdown (no ```json)
- L'output inizia con [ e termina con ]
- Ogni oggetto ha esattamente i campi: "question", "answer", "explanation"
- Le virgolette doppie dentro i valori sono escapate come \"
PROMPT;

        $body = [
            'systemInstruction' => ['parts' => [['text' => $systemPrompt]]],
            'contents'          => [
                ['role' => 'user', 'parts' => [['text' => $rawText]]]
            ],
            'generationConfig'  => ['maxOutputTokens' => 8192],
        ];

        $url = self::BASE . "/{$model}:generateContent";

        try {
            $raw  = $this->httpPost($url, $body, $apiKey, 'fix-import');
            $text = $this->extractText($raw);
        } catch (\RuntimeException $e) {
            $this->study->logGeneration($profileId, 'fix-import', $model, false, $e->getMessage());
            throw $e;
        }

        // Strip markdown fences Gemini may add despite instructions
        $text = preg_replace('/```(?:json)?\s*\n?|\n?```/i', '', $text);
        $text = trim($text);

        // Extract JSON array or object from surrounding prose (Gemini often adds preamble text)
        if (!str_starts_with($text, '[') && !str_starts_with($text, '{')) {
            $arrStart = strpos($text, '[');
            $arrEnd   = strrpos($text, ']');
            if ($arrStart !== false && $arrEnd !== false && $arrEnd > $arrStart) {
                $text = substr($text, $arrStart, $arrEnd - $arrStart + 1);
            } else {
                $objStart = strpos($text, '{');
                $objEnd   = strrpos($text, '}');
                if ($objStart !== false && $objEnd !== false && $objEnd > $objStart) {
                    $text = substr($text, $objStart, $objEnd - $objStart + 1);
                }
            }
        }

        // Validate the result is parseable JSON before returning
        $decoded = json_decode($text, true);
        if (!is_array($decoded)) {
            $this->study->logGeneration($profileId, 'fix-import', $model, false, 'non-JSON output');
            throw new \RuntimeException("Impossibile correggere il testo: l'AI non ha restituito JSON valido.");
        }

        $this->study->logGeneration($profileId, 'fix-import', $model, true);
        return ['fixed' => $text];
    }

    /**
     * Return available Gemini models for this profile's key.
     * Falls back to the hardcoded list if the API call fails.
     */
    public function listModels(int $profileId): array
    {
        try {
            [$apiKey] = $this->credentials($profileId);
            $url  = 'https://generativelanguage.googleapis.com/v1beta/models';
            $resp = $this->httpGet($url, $apiKey, 'list-models');

            $models = [];
            foreach (($resp['models'] ?? []) as $m) {
                $name = $m['name'] ?? '';
                if (str_starts_with($name, 'models/') && str_contains($name, 'gemini')) {
                    $models[] = str_replace('models/', '', $name);
                }
            }
            return $models ?: self::DEFAULT_MODELS;
        } catch (\Throwable) {
            // Best-effort: return the known fallback list
            return self::DEFAULT_MODELS;
        }
    }

    // ── private helpers ───────────────────────────────────────────────────────

    /**
     * Resolve API key + model for a profile.
     * Validates the model against the allowlist; if unknown, falls back to the default.
     *
     * @return array{0: string, 1: string}  [apiKey, model]
     */
    private function credentials(int $profileId): array
    {
        $apiKey = $this->settings->getDecryptedGeminiKey($profileId);
        if ($apiKey === null || $apiKey === '') {
            throw new \RuntimeException('Nessuna API key Gemini configurata per questo profilo.', 400);
        }

        $row   = $this->settings->findByProfile($profileId);
        $model = $row['gemini_model'] ?? self::DEFAULT_MODELS[0];

        // Allowlist check: reject unknown model values to prevent URL parameter injection
        if (!in_array($model, self::DEFAULT_MODELS, true)) {
            $model = self::DEFAULT_MODELS[0];
        }

        return [$apiKey, $model];
    }

    /**
     * POST JSON to a Gemini endpoint with retry + exponential backoff.
     * Retries on transport errors and HTTP 429/5xx; never retries 4xx (except 429).
     * The API key is sent via the x-goog-api-key header (never in the URL).
     *
     * @throws \RuntimeException with a user-facing (Italian) message on final failure.
     */
    private function httpPost(string $url, array $body, string $apiKey, string $kind): array
    {
        $maxRetries = Env::aiMaxRetries();
        $timeout    = Env::aiTimeout();
        $payload    = json_encode($body);

        for ($attempt = 0; ; $attempt++) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $payload,
                CURLOPT_HTTPHEADER     => [
                    'Content-Type: application/json',
                    'x-goog-api-key: ' . $apiKey,
                ],
                CURLOPT_TIMEOUT        => $timeout,
            ]);
            $resp      = curl_exec($ch);
            $status    = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlErrNo = curl_errno($ch);
            $curlErr   = $curlErrNo ? curl_error($ch) : null;
            curl_close($ch);

            $transport = ($resp === false || $curlErrNo !== 0);

            // Success path
            if (!$transport && $status >= 200 && $status < 300) {
                $data = json_decode((string) $resp, true);
                if (!is_array($data)) {
                    throw new \RuntimeException('Risposta Gemini non valida (non JSON).');
                }
                return $data;
            }

            $retryable = $transport || in_array($status, self::RETRYABLE, true);
            if ($retryable && $attempt < $maxRetries) {
                $this->logError('ai.http.retry', [
                    'kind' => $kind, 'status' => $status, 'attempt' => $attempt,
                    'transport' => $transport, 'curl_err' => $curlErr,
                ]);
                $this->backoff($attempt);
                continue;
            }

            // Final failure
            if ($transport) {
                $this->logError('ai.http.transport', ['kind' => $kind, 'attempts' => $attempt + 1, 'curl_err' => $curlErr]);
                throw new \RuntimeException('Errore di connessione al servizio AI.');
            }
            $this->logError('ai.http.status', ['kind' => $kind, 'status' => $status, 'attempts' => $attempt + 1]);
            throw new \RuntimeException($this->mapStatusMessage($status));
        }
    }

    /**
     * GET from a Gemini endpoint with retry (used for listing models).
     */
    private function httpGet(string $url, string $apiKey, string $kind): array
    {
        $maxRetries = Env::aiMaxRetries();
        $timeout    = max(5, (int) (Env::aiTimeout() / 2));

        for ($attempt = 0; ; $attempt++) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPGET        => true,
                CURLOPT_HTTPHEADER     => ['x-goog-api-key: ' . $apiKey],
                CURLOPT_TIMEOUT        => $timeout,
            ]);
            $resp      = curl_exec($ch);
            $status    = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $curlErrNo = curl_errno($ch);
            curl_close($ch);

            $transport = ($resp === false || $curlErrNo !== 0);
            if (!$transport && $status >= 200 && $status < 300) {
                $data = json_decode((string) $resp, true);
                if (!is_array($data)) {
                    throw new \RuntimeException('Non-JSON response');
                }
                return $data;
            }

            $retryable = $transport || in_array($status, self::RETRYABLE, true);
            if ($retryable && $attempt < $maxRetries) {
                $this->backoff($attempt);
                continue;
            }
            throw new \RuntimeException($transport ? 'transport error' : "HTTP {$status}");
        }
    }

    /**
     * Extract the model text from a Gemini generateContent response, with strict
     * validation: detects prompt-level blocks and empty/blocked candidates.
     */
    private function extractText(array $raw): string
    {
        // Prompt blocked before generation (safety filters, etc.)
        $blockReason = $raw['promptFeedback']['blockReason'] ?? null;
        if ($blockReason !== null) {
            throw new \RuntimeException('Richiesta bloccata dai filtri di sicurezza dell\'AI.');
        }

        $candidate = $raw['candidates'][0] ?? null;
        if ($candidate === null) {
            throw new \RuntimeException('Risposta AI vuota: nessun contenuto generato.');
        }

        $finish = $candidate['finishReason'] ?? null;
        $text   = $candidate['content']['parts'][0]['text'] ?? null;

        if ($text === null || $text === '') {
            if ($finish !== null && $finish !== 'STOP') {
                throw new \RuntimeException("Generazione AI interrotta ({$finish}).");
            }
            throw new \RuntimeException('Risposta AI inattesa: nessun testo.');
        }

        return $text;
    }

    /** Sleep with exponential backoff + jitter before the next attempt. */
    private function backoff(int $attempt): void
    {
        $base  = Env::aiRetryBaseMs();
        if ($base <= 0) {
            return;
        }
        $delay = $base * (2 ** $attempt);           // 400, 800, 1600 …
        $delay += random_int(0, $base);              // jitter
        usleep($delay * 1000);
    }

    /** Map an upstream HTTP status to a clear, safe Italian message. */
    private function mapStatusMessage(int $status): string
    {
        return match (true) {
            $status === 400              => 'Richiesta non valida al servizio AI.',
            $status === 401, $status === 403
                                         => 'Chiave API Gemini non valida o non autorizzata.',
            $status === 404              => 'Modello AI non disponibile.',
            $status === 429              => 'Troppe richieste al servizio AI. Riprova tra qualche secondo.',
            $status >= 500               => 'Servizio AI temporaneamente non disponibile. Riprova.',
            default                      => "Servizio AI non disponibile (HTTP {$status}).",
        };
    }

    /** Structured, key-safe error log (single JSON line). */
    private function logError(string $context, array $fields): void
    {
        $fields = array_filter($fields, static fn ($v) => $v !== null);
        error_log('GeminiService ' . $context . ' ' . json_encode(['ctx' => $context] + $fields));
    }

    /**
     * Proxy SSE from Gemini directly to the browser.
     * Retries connection setup (transport / 429 / 5xx) with backoff, but ONLY before
     * any byte has been streamed to the client. Upstream error bodies are never
     * forwarded; a clean error event is emitted instead. The API key is never leaked.
     * Exits when done.
     */
    private function streamProxy(
        string $url,
        array  $body,
        string $apiKey,
        int    $profileId,
        string $kind,
        string $model
    ): never {
        // Disable output buffering and set SSE headers
        while (ob_get_level() > 0) {
            ob_end_flush();
        }
        @ini_set('output_buffering', 'off');
        @ini_set('implicit_flush', '1');

        header('Content-Type: text/event-stream');
        header('Cache-Control: no-cache');
        header('Connection: keep-alive');
        header('X-Accel-Buffering: no');

        $maxRetries = Env::aiMaxRetries();
        $timeout    = Env::aiStreamTimeout();
        $payload    = json_encode($body);

        $ok       = false;
        $logError = null;

        for ($attempt = 0; ; $attempt++) {
            $httpStatus = 0;
            $streamed   = false;

            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_POST          => true,
                CURLOPT_POSTFIELDS    => $payload,
                CURLOPT_HTTPHEADER    => [
                    'Content-Type: application/json',
                    'x-goog-api-key: ' . $apiKey,
                ],
                CURLOPT_TIMEOUT       => $timeout,
                CURLOPT_WRITEFUNCTION => static function ($ch, $data) use (&$httpStatus, &$streamed): int {
                    // Only forward the body once we know the upstream status is OK.
                    // Error bodies (status >= 400) are swallowed so we can retry cleanly.
                    if ($httpStatus > 0 && $httpStatus < 400) {
                        echo $data;
                        flush();
                        $streamed = true;
                    }
                    return strlen($data);
                },
                CURLOPT_HEADERFUNCTION => static function ($ch, $header) use (&$httpStatus): int {
                    if (preg_match('/^HTTP\/\S+\s+(\d{3})/i', $header, $m)) {
                        $httpStatus = (int) $m[1];
                    }
                    return strlen($header);
                },
            ]);

            curl_exec($ch);
            $curlErrNo = curl_errno($ch);
            curl_close($ch);

            $transport = ($curlErrNo !== 0);

            // Success: a 2xx response that streamed (or produced no error)
            if (!$transport && $httpStatus >= 200 && $httpStatus < 300) {
                $ok = true;
                break;
            }

            $retryable = ($transport || in_array($httpStatus, self::RETRYABLE, true)) && !$streamed;
            if ($retryable && $attempt < $maxRetries) {
                $this->logError('ai.stream.retry', [
                    'kind' => $kind, 'status' => $httpStatus, 'attempt' => $attempt,
                    'transport' => $transport, 'curl_err' => $curlErrNo ?: null,
                ]);
                $this->backoff($attempt);
                continue;
            }

            // Final failure — emit a single clean error event (unless we already streamed)
            if ($transport) {
                $logError = 'transport error ' . $curlErrNo;
                $msg = 'Errore di connessione al servizio AI.';
            } else {
                $logError = "HTTP {$httpStatus}";
                $msg = $this->mapStatusMessage($httpStatus);
            }
            $this->logError('ai.stream.fail', ['kind' => $kind, 'status' => $httpStatus, 'attempts' => $attempt + 1]);
            if (!$streamed) {
                echo 'data: ' . json_encode(['error' => $msg]) . "\n\n";
                flush();
            }
            break;
        }

        try {
            $this->study->logGeneration($profileId, $kind, $model, $ok, $logError);
        } catch (\Throwable) {
            // Log failure must not crash the stream response
        }

        exit;
    }

    // ── prompts ───────────────────────────────────────────────────────────────

    private function evaluationSystemPrompt(array $card): string
    {
        $q = $card['question']    ?? '';
        $a = $card['answer']      ?? '';
        $e = $card['explanation'] ?? '';

        $explPart = $e ? "\nSpiegazione di riferimento: {$e}" : '';
        return <<<PROMPT
Sei un valutatore di risposte per flashcard educative. Rispondi SOLO con un oggetto JSON valido senza markdown.
Domanda: {$q}
Risposta corretta: {$a}{$explPart}

Valuta la risposta dello studente e rispondi con:
{"verdict":"correct|partial|wrong","feedback":"stringa in italiano con spiegazione breve"}
- "correct": la risposta è sostanzialmente corretta
- "partial": la risposta è parzialmente corretta
- "wrong": la risposta è errata o mancante
PROMPT;
    }

    private function answerReviewSystemPrompt(array $card): string
    {
        $q = $card['question']    ?? '';
        $a = $card['answer']      ?? '';
        $e = $card['explanation'] ?? '';
        $explPart = $e ? "\nSpiegazione: {$e}" : '';
        return <<<PROMPT
Sei un tutor educativo. Analizza la risposta dello studente, spiega brevemente cosa c'era di giusto e cosa di sbagliato, e approfondisci il concetto in modo utile.
Domanda: {$q}
Risposta corretta: {$a}{$explPart}
Rispondi in italiano, in modo conciso ma completo (max 3 paragrafi).
PROMPT;
    }

    private function tutorSystemPrompt(array $card): string
    {
        $q = $card['question']    ?? '';
        $a = $card['answer']      ?? '';
        $e = $card['explanation'] ?? '';
        $explPart = $e ? "\nSpiegazione: {$e}" : '';
        return <<<PROMPT
Sei un tutor AI che aiuta lo studente a capire meglio il contenuto di questa flashcard.
Domanda: {$q}
Risposta: {$a}{$explPart}
Rispondi in italiano. Sii chiaro, conciso e utile. Non ripetere la domanda nella risposta.
PROMPT;
    }
}
