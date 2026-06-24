<?php

declare(strict_types=1);

namespace Falschcard\Controllers;

use Falschcard\Core\{Request, Response, Validator};
use Falschcard\Services\GeminiService;

final class AiController extends BaseController
{
    private GeminiService $gemini;

    public function __construct(
        GeminiService $gemini = new GeminiService(),
    ) {
        $this->gemini = $gemini;
    }

    /**
     * POST /api/profiles/{id}/ai/evaluate
     * Body: { card: {question, answer, explanation?}, userAnswer: string }
     * Returns: { verdict, feedback }
     */
    public function evaluate(Request $req): void
    {
        $profileId  = $this->requireIntParam($req);
        $this->assertProfile($profileId);

        $card       = $req->input('card');
        $userAnswer = trim((string) $req->input('userAnswer', ''));

        $v = new Validator();
        $v->required('card', $card, 'Carta');
        $v->required('userAnswer', $userAnswer, 'Risposta');
        $v->isArray('card', $card, 'Carta');
        $v->failFast();

        $this->validateCard($card);

        try {
            $result = $this->gemini->evaluate($profileId, $card, $userAnswer);
            Response::json($result);
        } catch (\RuntimeException $e) {
            if ($e->getCode() === 400) {
                Response::badRequest($e->getMessage());
            }
            Response::serverError($e->getMessage() ?: 'Errore interno durante la valutazione.');
        }
    }

    /**
     * POST /api/profiles/{id}/ai/review
     * Streams SSE answer review.
     * Body: { card: {question, answer, explanation?}, userAnswer: string }
     */
    public function review(Request $req): never
    {
        $profileId  = $this->requireIntParam($req);
        $this->assertProfile($profileId);

        $card       = $req->input('card');
        $userAnswer = trim((string) $req->input('userAnswer', ''));

        $v = new Validator();
        $v->required('card', $card, 'Carta');
        $v->required('userAnswer', $userAnswer, 'Risposta');
        $v->isArray('card', $card, 'Carta');
        $v->failFast();

        $this->validateCard($card);

        try {
            $this->gemini->streamReview($profileId, $card, $userAnswer);
        } catch (\RuntimeException $e) {
            Response::badRequest($e->getMessage());
        }
    }

    /**
     * POST /api/profiles/{id}/ai/tutor
     * Streams SSE tutor response.
     * Body: { card: {...}, history: [{role,content},...], message: string }
     */
    public function tutor(Request $req): never
    {
        $profileId = $this->requireIntParam($req);
        $this->assertProfile($profileId);

        $card    = $req->input('card');
        $history = $req->input('history', []);
        $message = trim((string) $req->input('message', ''));

        $v = new Validator();
        $v->required('card', $card, 'Carta');
        $v->required('message', $message, 'Messaggio');
        $v->isArray('card', $card, 'Carta');
        $v->isArray('history', is_array($history) ? $history : null, 'Cronologia');
        $v->failFast();

        $this->validateCard($card);

        try {
            $this->gemini->streamTutor($profileId, $card, (array) $history, $message);
        } catch (\RuntimeException $e) {
            Response::badRequest($e->getMessage());
        }
    }

    /**
     * POST /api/profiles/{id}/ai/fix-import
     * Body: { text: string }
     * Returns: { fixed: string }  — corrected JSON ready to re-parse on the client.
     */
    public function fixImport(Request $req): void
    {
        $profileId = $this->requireIntParam($req);
        $this->assertProfile($profileId);

        $text = trim((string) $req->input('text', ''));

        $v = new Validator();
        $v->required('text', $text, 'Testo');
        $v->failFast();

        try {
            $result = $this->gemini->fixImport($profileId, $text);
            Response::json($result);
        } catch (\RuntimeException $e) {
            if ($e->getCode() === 400) {
                Response::badRequest($e->getMessage());
            }
            Response::serverError($e->getMessage() ?: 'Errore durante la correzione AI.');
        }
    }

    // ── private ──────────────────────────────────────────────────────────────

    /**
     * Abort with 400 if the card is missing required fields.
     * Extracted to avoid duplicating the check across evaluate/review/tutor.
     */
    private function validateCard(mixed $card): void
    {
        if (
            !is_array($card) ||
            !isset($card['question'], $card['answer']) ||
            trim((string) $card['question']) === '' ||
            trim((string) $card['answer'])   === ''
        ) {
            Response::badRequest('La carta deve avere domanda e risposta non vuote.');
        }
    }
}
