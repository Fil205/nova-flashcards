<?php

declare(strict_types=1);

namespace Falschcard\Controllers;

use Falschcard\Core\{Request, Response, Validator};
use Falschcard\Repositories\SettingsRepository;
use Falschcard\Services\GeminiService;

final class SettingsController extends BaseController
{
    private SettingsRepository $settings;
    private GeminiService      $gemini;

    public function __construct(
        SettingsRepository $settings = new SettingsRepository(),
        GeminiService      $gemini   = new GeminiService(),
    ) {
        $this->settings = $settings;
        $this->gemini   = $gemini;
    }

    /** GET /api/profiles/{id}/settings */
    public function show(Request $req): void
    {
        $id = $this->requireIntParam($req);
        $this->assertProfile($id);

        $s = $this->settings->findByProfile($id);

        // If no row exists yet, return defaults without writing — GET must be side-effect free.
        // The row is created lazily on the first settings write.
        if ($s === null) {
            $s = $this->settings->defaults($id);
        }

        Response::json(['settings' => $s]);
    }

    /** PUT /api/profiles/{id}/settings */
    public function update(Request $req): void
    {
        $id = $this->requireIntParam($req);
        $this->assertProfile($id);

        $body = $req->all();

        $v = new Validator();
        if (isset($body['gemini_model'])) {
            // Validate against the allowlist to prevent URL parameter injection in GeminiService
            $v->inList('gemini_model', $body['gemini_model'], GeminiService::DEFAULT_MODELS, 'Modello Gemini');
        }
        if (isset($body['tts_rate'])) {
            $v->numeric('tts_rate', $body['tts_rate'], 0.5, 2.0, 'Velocità TTS');
        }
        if (isset($body['tts_pitch'])) {
            $v->numeric('tts_pitch', $body['tts_pitch'], 0.0, 2.0, 'Tono TTS');
        }
        if (isset($body['theme'])) {
            $v->inList('theme', $body['theme'], ['dark', 'light', 'system'], 'Tema');
        }
        $v->failFast();

        $fields = array_intersect_key($body, array_flip([
            'gemini_model', 'auto_read_question',
            'tts_voice_uri', 'tts_rate', 'tts_pitch', 'theme', 'extra',
        ]));

        $this->settings->update($id, $fields);

        Response::json(['settings' => $this->settings->findByProfile($id)]);
    }

    /** PUT /api/profiles/{id}/gemini-key */
    public function updateGeminiKey(Request $req): void
    {
        $id     = $this->requireIntParam($req);
        $apiKey = trim((string) $req->input('api_key', ''));

        (new Validator())
            ->required('api_key', $apiKey, 'Chiave API')
            ->string('api_key', $apiKey, 10, 500, 'Chiave API')
            ->failFast();

        $this->assertProfile($id);
        $this->settings->saveGeminiKey($id, $apiKey);

        Response::json(['has_api_key' => true]);
    }

    /** DELETE /api/profiles/{id}/gemini-key */
    public function deleteGeminiKey(Request $req): void
    {
        $id = $this->requireIntParam($req);
        $this->assertProfile($id);

        $this->settings->deleteGeminiKey($id);

        Response::json(['has_api_key' => false]);
    }

    /** GET /api/profiles/{id}/gemini-models */
    public function listGeminiModels(Request $req): void
    {
        $id = $this->requireIntParam($req);
        $this->assertProfile($id);

        $models = $this->gemini->listModels($id);

        Response::json(['models' => $models]);
    }
}
