<?php

declare(strict_types=1);

namespace Falschcard\Controllers;

use Falschcard\Core\{Request, Response, Database};
use Falschcard\Repositories\{DeckRepository, SettingsRepository};

final class ImportExportController extends BaseController
{
    private DeckRepository     $decks;
    private SettingsRepository $settings;

    public function __construct(
        DeckRepository     $decks    = new DeckRepository(),
        SettingsRepository $settings = new SettingsRepository(),
    ) {
        $this->decks    = $decks;
        $this->settings = $settings;
    }

    /**
     * GET /api/profiles/{id}/export
     * Returns a full JSON backup: decks + cards + settings (no API key).
     */
    public function export(Request $req): void
    {
        $profileId = $this->requireIntParam($req);
        $this->assertProfile($profileId);

        $settings  = $this->settings->findByProfile($profileId);
        $decksList = $this->decks->findByProfile($profileId);

        // Attach cards to each deck, embedding images as portable base64.
        $decksWithCards = [];
        foreach ($decksList as $deck) {
            $full = $this->decks->findByIdWithCards((int) $deck['id']);
            if ($full !== null && !empty($full['cards'])) {
                foreach ($full['cards'] as &$card) {
                    $card['images'] = $this->embedImages($card['images'] ?? []);
                }
                unset($card);
            }
            $decksWithCards[] = $full;
        }

        // assertProfile already fetched the profile via BaseController's lazy repo;
        // we need the name — re-fetch only the name via the same lazy repo.
        // Use a fresh lookup to avoid coupling to BaseController internals.
        $profileRepo = new \Falschcard\Repositories\ProfileRepository();
        $profile     = $profileRepo->findById($profileId);

        $payload = [
            'version'     => 2,
            'exported_at' => date('c'),
            'profile'     => ['name' => $profile['name'] ?? ''],
            'settings'    => array_intersect_key($settings ?? [], array_flip([
                'gemini_model', 'auto_read_question',
                'tts_voice_uri', 'tts_rate', 'tts_pitch', 'theme',
            ])),
            'decks' => $decksWithCards,
        ];

        header('Content-Type: application/json; charset=utf-8');
        header('Content-Disposition: attachment; filename="falschcard-backup-' . date('Y-m-d') . '.json"');
        Response::cors();
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * POST /api/profiles/{id}/import
     * Body: { decks: [{name, description, lang, source, cards:[...]}] }
     * Bulk-imports decks + cards within a transaction.
     */
    public function import(Request $req): void
    {
        $profileId = $this->requireIntParam($req);
        $this->assertProfile($profileId);

        $decks = $req->input('decks');
        if (!is_array($decks) || empty($decks)) {
            Response::badRequest('Nessun mazzo nell\'archivio.');
        }

        try {
            $newIds = Database::transaction(
                fn () => $this->decks->bulkImport($profileId, $decks)
            );

            Response::json([
                'imported' => count($newIds),
                'deck_ids' => $newIds,
            ], 201);
        } catch (\Throwable $e) {
            Response::serverError('Importazione fallita: ' . $e->getMessage());
        }
    }

    /**
     * Turn stored image rows into portable export entries with base64 data.
     * Skips files that can no longer be read on disk.
     *
     * @param array $images rows from card_images (with `path`)
     * @return array<int, array{section:string, position:int, alt:?string, mime:string, data:string}>
     */
    private function embedImages(array $images): array
    {
        $mimeByExt = [
            'webp' => 'image/webp', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg',
            'png'  => 'image/png',  'gif' => 'image/gif',
        ];
        $out = [];
        foreach ($images as $img) {
            $rel  = (string) ($img['path'] ?? '');
            $full = ImageController::publicDir() . '/' . ltrim($rel, '/');
            if ($rel === '' || !is_file($full)) {
                continue;
            }
            $binary = @file_get_contents($full);
            if ($binary === false) {
                continue;
            }
            $ext = strtolower(pathinfo($rel, PATHINFO_EXTENSION));
            $out[] = [
                'section'  => (string) $img['section'],
                'position' => (int) $img['position'],
                'alt'      => $img['alt'] ?? null,
                'mime'     => $mimeByExt[$ext] ?? 'image/webp',
                'data'     => base64_encode($binary),
            ];
        }
        return $out;
    }
}
