<?php

declare(strict_types=1);

namespace Falschcard\Repositories;

use Falschcard\Core\Database;

final class StudyRepository
{
    /** Record a completed study session. */
    public function record(int $profileId, int $deckId, array $data): int
    {
        Database::run(
            'INSERT INTO study_sessions
             (profile_id, deck_id, mode, total, correct, partial, wrong, score, duration_ms)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                $profileId,
                $deckId,
                $data['mode']        ?? 'sequential',
                $data['total']       ?? 0,
                $data['correct']     ?? 0,
                $data['partial']     ?? 0,
                $data['wrong']       ?? 0,
                $data['score']       ?? 0.0,
                $data['duration_ms'] ?? null,
            ]
        );
        return Database::lastInsertId();
    }

    /** Get recent sessions for a deck (last N). */
    public function findByDeck(int $deckId, int $limit = 10): array
    {
        // LIMIT must be inlined as an int literal: PDO native prepares (EMULATE_PREPARES=false)
        // bind all params as strings, which MySQL rejects for LIMIT clauses.
        $limit = max(1, $limit);
        return Database::fetchAll(
            "SELECT id, profile_id, deck_id, mode, total, correct, partial, wrong, score, duration_ms, created_at
             FROM study_sessions WHERE deck_id = ? ORDER BY created_at DESC LIMIT {$limit}",
            [$deckId]
        );
    }

    /** Log an AI generation event. */
    public function logGeneration(int $profileId, string $kind, string $model, bool $ok, ?string $error = null): void
    {
        Database::run(
            'INSERT INTO generation_logs (profile_id, kind, model, ok, error) VALUES (?, ?, ?, ?, ?)',
            [$profileId, $kind, $model, $ok ? 1 : 0, $error]
        );
    }
}
