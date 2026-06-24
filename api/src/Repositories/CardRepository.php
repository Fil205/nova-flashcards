<?php

declare(strict_types=1);

namespace Falschcard\Repositories;

use Falschcard\Core\Database;

final class CardRepository
{
    private ?ImageRepository $images = null;

    private function images(): ImageRepository
    {
        return $this->images ??= new ImageRepository();
    }

    /** Get all cards for a deck ordered by position, each with its images[]. */
    public function findByDeck(int $deckId): array
    {
        $cards = Database::fetchAll(
            'SELECT id, deck_id, question, answer, explanation, position, created_at, updated_at
             FROM flashcards WHERE deck_id = ? ORDER BY position ASC, id ASC',
            [$deckId]
        );
        return self::attachImages($cards, $this->images());
    }

    /** Find a single card by id, with its images[]. */
    public function findById(int $id): ?array
    {
        $card = Database::fetchOne(
            'SELECT id, deck_id, question, answer, explanation, position, created_at, updated_at
             FROM flashcards WHERE id = ?',
            [$id]
        );
        if ($card === null) {
            return null;
        }
        $card['images'] = self::imagesWithUrl($this->images()->findByCard($id));
        return $card;
    }

    /**
     * Attach an `images` array (with public `url`) to each card in $cards.
     * Single bulk query → no N+1. Shared by CardRepository + DeckRepository.
     */
    public static function attachImages(array $cards, ImageRepository $images): array
    {
        if (empty($cards)) {
            return $cards;
        }
        $ids = array_map(static fn ($c) => (int) $c['id'], $cards);
        $byCard = [];
        foreach ($images->findByCardIds($ids) as $img) {
            $byCard[(int) $img['card_id']][] = self::withUrl($img);
        }
        foreach ($cards as &$card) {
            $card['images'] = $byCard[(int) $card['id']] ?? [];
        }
        unset($card);
        return $cards;
    }

    /** Add a public `url` to each image row. */
    private static function imagesWithUrl(array $images): array
    {
        return array_map(static fn ($img) => self::withUrl($img), $images);
    }

    private static function withUrl(array $img): array
    {
        $img['url'] = \Falschcard\Controllers\ImageController::toUrl((string) $img['path']);
        return $img;
    }

    /**
     * Create a card inside an atomic transaction.
     * Returns the new card id.
     */
    public function create(int $deckId, array $data): int
    {
        return Database::transaction(function () use ($deckId, $data): int {
            $maxPos = $this->nextPosition($deckId);

            Database::run(
                'INSERT INTO flashcards (deck_id, question, answer, explanation, position)
                 VALUES (?, ?, ?, ?, ?)',
                [
                    $deckId,
                    $data['question'],
                    $data['answer'],
                    $data['explanation'] ?? null,
                    $maxPos,
                ]
            );

            $id = Database::lastInsertId();

            Database::run('UPDATE decks SET updated_at = NOW() WHERE id = ?', [$deckId]);

            return $id;
        });
    }

    /**
     * Bulk-create cards in a single transaction.
     * Returns count of inserted rows.
     */
    public function bulkCreate(int $deckId, array $cards): int
    {
        return Database::transaction(function () use ($deckId, $cards): int {
            $pos   = $this->nextPosition($deckId);
            $count = 0;

            foreach ($cards as $card) {
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
                $count++;
            }

            Database::run('UPDATE decks SET updated_at = NOW() WHERE id = ?', [$deckId]);

            return $count;
        });
    }

    /**
     * Update mutable card fields inside an atomic transaction.
     * The caller must pass `deck_id` in $fields (from the card already looked up) so we
     * avoid a redundant SELECT here.
     *
     * @param array $fields  Subset of: question, answer, explanation, position, deck_id
     */
    public function update(int $id, array $fields): int
    {
        $writable = ['question', 'answer', 'explanation', 'position'];
        $set      = [];
        $params   = [];

        foreach ($writable as $col) {
            if (array_key_exists($col, $fields)) {
                $set[]    = "{$col} = ?";
                $params[] = $fields[$col];
            }
        }

        if (empty($set)) {
            return 0;
        }

        $params[] = $id;

        return Database::transaction(function () use ($set, $params, $id, $fields): int {
            $stmt = Database::run(
                'UPDATE flashcards SET ' . implode(', ', $set) . ' WHERE id = ?',
                $params
            );

            // deck_id must be supplied by the caller to avoid a round-trip SELECT
            if (isset($fields['deck_id'])) {
                Database::run('UPDATE decks SET updated_at = NOW() WHERE id = ?', [$fields['deck_id']]);
            }

            return $stmt->rowCount();
        });
    }

    /**
     * Delete a card inside an atomic transaction.
     * The caller must pass `deck_id` in $meta to avoid a round-trip SELECT.
     *
     * @param array $meta  Must contain 'deck_id'.
     */
    public function delete(int $id, array $meta): int
    {
        return Database::transaction(function () use ($id, $meta): int {
            $stmt = Database::run('DELETE FROM flashcards WHERE id = ?', [$id]);
            if (isset($meta['deck_id'])) {
                Database::run('UPDATE decks SET updated_at = NOW() WHERE id = ?', [$meta['deck_id']]);
            }
            return $stmt->rowCount();
        });
    }

    // ── private ───────────────────────────────────────────────────────────────

    /** Return the next available position for a deck (MAX + 1). */
    private function nextPosition(int $deckId): int
    {
        $row = Database::fetchOne(
            'SELECT COALESCE(MAX(position), 0) AS m FROM flashcards WHERE deck_id = ?',
            [$deckId]
        );
        return (int) ($row['m'] ?? 0) + 1;
    }
}
