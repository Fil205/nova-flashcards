<?php

declare(strict_types=1);

namespace Falschcard\Repositories;

use Falschcard\Core\Database;

/**
 * card_images repository.
 *
 * Stores only metadata; the actual files live on disk under public/uploads/.
 * Callers that delete cards/decks must use the *path-returning* delete methods
 * here and unlink the files themselves — the DB CASCADE does NOT touch the disk.
 */
final class ImageRepository
{
    public const SECTIONS  = ['question', 'answer', 'explanation'];
    public const MAX_PER_SECTION = 3;

    /** All images for a card, ordered by section + position. */
    public function findByCard(int $cardId): array
    {
        return Database::fetchAll(
            'SELECT id, card_id, section, position, path, width, height, bytes, alt, created_at
             FROM card_images WHERE card_id = ? ORDER BY section ASC, position ASC, id ASC',
            [$cardId]
        );
    }

    /**
     * All images for a set of card ids (avoids N+1 when hydrating a deck).
     * Returns a flat array; group by card_id in the caller.
     *
     * @param int[] $cardIds
     */
    public function findByCardIds(array $cardIds): array
    {
        if (empty($cardIds)) {
            return [];
        }
        // Build a parameter placeholder list (ints already cast by caller).
        $ph = implode(',', array_fill(0, count($cardIds), '?'));
        return Database::fetchAll(
            "SELECT id, card_id, section, position, path, width, height, bytes, alt, created_at
             FROM card_images WHERE card_id IN ($ph)
             ORDER BY card_id ASC, section ASC, position ASC, id ASC",
            array_values($cardIds)
        );
    }

    /** Find a single image row by id (includes path for file deletion). */
    public function findById(int $id): ?array
    {
        return Database::fetchOne(
            'SELECT id, card_id, section, position, path, width, height, bytes, alt, created_at
             FROM card_images WHERE id = ?',
            [$id]
        );
    }

    /** Count images already stored in a given section of a card. */
    public function countInSection(int $cardId, string $section): int
    {
        $row = Database::fetchOne(
            'SELECT COUNT(*) AS c FROM card_images WHERE card_id = ? AND section = ?',
            [$cardId, $section]
        );
        return (int) ($row['c'] ?? 0);
    }

    /**
     * Insert an image row. Position is auto-assigned (MAX+1 within the section).
     * Returns the new image id.
     */
    public function create(int $cardId, array $data): int
    {
        $row = Database::fetchOne(
            'SELECT COALESCE(MAX(position), -1) AS m FROM card_images WHERE card_id = ? AND section = ?',
            [$cardId, $data['section']]
        );
        $pos = (int) ($row['m'] ?? -1) + 1;

        Database::run(
            'INSERT INTO card_images (card_id, section, position, path, width, height, bytes, alt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $cardId,
                $data['section'],
                $pos,
                $data['path'],
                $data['width']  ?? null,
                $data['height'] ?? null,
                $data['bytes']  ?? null,
                $data['alt']    ?? null,
            ]
        );

        return Database::lastInsertId();
    }

    /**
     * Delete a single image row. Returns the deleted row (with `path`) so the
     * caller can unlink the file, or null if it did not exist.
     */
    public function delete(int $id): ?array
    {
        $row = $this->findById($id);
        if ($row === null) {
            return null;
        }
        Database::run('DELETE FROM card_images WHERE id = ?', [$id]);
        return $row;
    }

    /**
     * Return the file paths of all images belonging to the given cards, without
     * deleting the rows (the DB CASCADE will remove the rows when the card/deck
     * goes away). Used to clean up files on card/deck deletion.
     *
     * @param int[] $cardIds
     * @return string[] relative paths
     */
    public function pathsForCards(array $cardIds): array
    {
        if (empty($cardIds)) {
            return [];
        }
        $ph   = implode(',', array_fill(0, count($cardIds), '?'));
        $rows = Database::fetchAll(
            "SELECT path FROM card_images WHERE card_id IN ($ph)",
            array_values($cardIds)
        );
        return array_map(static fn ($r) => (string) $r['path'], $rows);
    }

    /**
     * Return the file paths of every image in a deck (across all its cards),
     * for cleanup when a whole deck is deleted.
     *
     * @return string[] relative paths
     */
    public function pathsForDeck(int $deckId): array
    {
        $rows = Database::fetchAll(
            'SELECT ci.path
             FROM card_images ci
             JOIN flashcards f ON f.id = ci.card_id
             WHERE f.deck_id = ?',
            [$deckId]
        );
        return array_map(static fn ($r) => (string) $r['path'], $rows);
    }
}
