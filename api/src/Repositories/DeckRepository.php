<?php

declare(strict_types=1);

namespace Falschcard\Repositories;

use Falschcard\Core\Database;

final class DeckRepository
{
    /** All decks for a profile with card counts. */
    public function findByProfile(int $profileId): array
    {
        return Database::fetchAll(
            'SELECT d.id, d.profile_id, d.name, d.description, d.lang, d.source, d.position,
                    d.times_studied, d.last_score, d.last_studied_at, d.mastery,
                    d.created_at, d.updated_at,
                    COUNT(f.id) AS card_count
             FROM decks d
             LEFT JOIN flashcards f ON f.deck_id = d.id
             WHERE d.profile_id = ?
             GROUP BY d.id
             ORDER BY d.position ASC, d.created_at ASC',
            [$profileId]
        );
    }

    /** Single deck (no cards). */
    public function findById(int $id): ?array
    {
        return Database::fetchOne(
            'SELECT id, profile_id, name, description, lang, source, position,
                    times_studied, last_score, last_studied_at, mastery, created_at, updated_at
             FROM decks WHERE id = ?',
            [$id]
        );
    }

    /** Single deck with full cards array (for study/detail view). */
    public function findByIdWithCards(int $id): ?array
    {
        $deck = $this->findById($id);
        if ($deck === null) {
            return null;
        }

        $cards = Database::fetchAll(
            'SELECT id, deck_id, question, answer, explanation, position, created_at, updated_at
             FROM flashcards WHERE deck_id = ? ORDER BY position ASC, id ASC',
            [$id]
        );

        $deck['cards'] = CardRepository::attachImages($cards, new ImageRepository());
        $deck['card_count'] = count($cards);
        return $deck;
    }

    /** Create a new deck. Returns its id. */
    public function create(int $profileId, array $data): int
    {
        $maxPos = (int) (Database::fetchOne(
            'SELECT COALESCE(MAX(position),0) AS m FROM decks WHERE profile_id = ?',
            [$profileId]
        )['m'] ?? 0);

        Database::run(
            'INSERT INTO decks (profile_id, name, description, lang, source, position)
             VALUES (?, ?, ?, ?, ?, ?)',
            [
                $profileId,
                $data['name'],
                $data['description'] ?? null,
                $data['lang']        ?? null,
                $data['source']      ?? 'manual',
                $maxPos + 1,
            ]
        );
        return Database::lastInsertId();
    }

    /** Update mutable deck fields. */
    public function update(int $id, array $fields): void
    {
        $allowed = ['name', 'description', 'lang', 'position'];
        $set     = [];
        $params  = [];

        foreach ($allowed as $col) {
            if (array_key_exists($col, $fields)) {
                $set[]    = "{$col} = ?";
                $params[] = $fields[$col];
            }
        }

        if (empty($set)) {
            return;
        }

        $params[] = $id;
        Database::run(
            'UPDATE decks SET ' . implode(', ', $set) . ' WHERE id = ?',
            $params
        );
    }

    /** Record a study session result and update deck stats. */
    public function recordStudy(int $id, float $score, array $sessionData = []): void
    {
        Database::run(
            'UPDATE decks
             SET times_studied   = times_studied + 1,
                 last_score      = ?,
                 last_studied_at = NOW(),
                 mastery         = ?
             WHERE id = ?',
            [$score, $sessionData['mastery'] ?? $score, $id]
        );
    }

    /** Delete a deck (cascades to flashcards). */
    public function delete(int $id): int
    {
        $stmt = Database::run('DELETE FROM decks WHERE id = ?', [$id]);
        return $stmt->rowCount();
    }

    /** Bulk-insert decks + cards (used for import). Returns array of new ids. */
    public function bulkImport(int $profileId, array $decks): array
    {
        $newIds = [];
        foreach ($decks as $deck) {
            $deckId = $this->create($profileId, [
                'name'        => $deck['name']        ?? 'Imported',
                'description' => $deck['description'] ?? null,
                'lang'        => $deck['lang']        ?? null,
                'source'      => 'import-json',
            ]);
            $newIds[] = $deckId;

            if (!empty($deck['cards']) && is_array($deck['cards'])) {
                $pos = 0;
                foreach ($deck['cards'] as $card) {
                    Database::run(
                        'INSERT INTO flashcards (deck_id, question, answer, explanation, position)
                         VALUES (?, ?, ?, ?, ?)',
                        [
                            $deckId,
                            $card['question']    ?? '',
                            $card['answer']      ?? '',
                            $card['explanation'] ?? null,
                            $pos++,
                        ]
                    );
                    if (!empty($card['images']) && is_array($card['images'])) {
                        $this->importImages(Database::lastInsertId(), $card['images']);
                    }
                }
            }
        }
        return $newIds;
    }

    /**
     * Persist base64 images from an import payload as files + card_images rows.
     * Each entry: { section, position?, alt?, mime, data(base64) }.
     * Best-effort per image: malformed/oversized entries are skipped silently
     * so one bad image never aborts the whole import.
     *
     * @param array $images
     */
    private function importImages(int $cardId, array $images): void
    {
        $extByMime = [
            'image/webp' => 'webp', 'image/jpeg' => 'jpg',
            'image/png'  => 'png',  'image/gif'  => 'gif',
        ];
        $perSection = ['question' => 0, 'answer' => 0, 'explanation' => 0];

        foreach ($images as $img) {
            $section = (string) ($img['section'] ?? '');
            $mime    = (string) ($img['mime'] ?? '');
            $b64     = (string) ($img['data'] ?? '');
            if (!isset($perSection[$section]) || !isset($extByMime[$mime]) || $b64 === '') {
                continue;
            }
            if ($perSection[$section] >= 3) {
                continue; // enforce the 3-per-section cap on import too
            }
            $binary = base64_decode($b64, true);
            if ($binary === false || strlen($binary) > 10 * 1024 * 1024) {
                continue;
            }
            $path = \Falschcard\Controllers\ImageController::storeBinary($binary, $extByMime[$mime]);
            if ($path === null) {
                continue;
            }
            [$w, $h] = \Falschcard\Controllers\ImageController::dimensions($binary);
            Database::run(
                'INSERT INTO card_images (card_id, section, position, path, width, height, bytes, alt)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    $cardId,
                    $section,
                    $perSection[$section]++,
                    $path,
                    $w,
                    $h,
                    strlen($binary),
                    isset($img['alt']) ? mb_substr((string) $img['alt'], 0, 255) : null,
                ]
            );
        }
    }
}
