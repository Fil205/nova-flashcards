<?php

declare(strict_types=1);

namespace Falschcard\Repositories;

use Falschcard\Core\Database;

/**
 * Manages the card_reviews table.
 * Tracks which cards a given profile has marked as "didn't know".
 */
final class CardReviewRepository
{
    /**
     * Upsert multiple card IDs as missed for a profile.
     * Increments missed_count and updates last_missed_at on conflict.
     *
     * @param int   $profileId
     * @param int[] $cardIds
     */
    public function upsertMissed(int $profileId, array $cardIds): void
    {
        if (empty($cardIds)) {
            return;
        }

        $placeholders = implode(',', array_fill(0, count($cardIds), '(?, ?)'));
        $params       = [];
        foreach ($cardIds as $cardId) {
            $params[] = $profileId;
            $params[] = (int) $cardId;
        }

        $sql = "INSERT INTO card_reviews (profile_id, card_id)
                VALUES {$placeholders}
                ON DUPLICATE KEY UPDATE
                    missed_count   = missed_count + 1,
                    last_missed_at = NOW()";

        Database::run($sql, $params);
    }

    /**
     * Remove card IDs from the review list (user answered correctly).
     *
     * @param int   $profileId
     * @param int[] $cardIds
     */
    public function clearKnown(int $profileId, array $cardIds): void
    {
        if (empty($cardIds)) {
            return;
        }

        $placeholders = implode(',', array_fill(0, count($cardIds), '?'));
        $params       = array_merge([$profileId], array_map('intval', $cardIds));

        $sql = "DELETE FROM card_reviews
                WHERE profile_id = ?
                  AND card_id IN ({$placeholders})";

        Database::run($sql, $params);
    }

    /**
     * List all unknown cards for a profile, with their deck_id (for the frontend filter).
     *
     * @param int $profileId
     * @return array{deck_id: int, card_id: int}[]
     */
    public function listForProfile(int $profileId): array
    {
        $sql = "SELECT f.deck_id, cr.card_id
                FROM card_reviews cr
                JOIN flashcards f ON f.id = cr.card_id
                WHERE cr.profile_id = ?
                ORDER BY cr.last_missed_at DESC";

        $rows = Database::fetchAll($sql, [$profileId]);

        // Cast to ints for clean JSON encoding
        return array_map(static fn($r) => [
            'deck_id' => (int) $r['deck_id'],
            'card_id' => (int) $r['card_id'],
        ], $rows);
    }
}
