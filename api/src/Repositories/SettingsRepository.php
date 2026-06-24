<?php

declare(strict_types=1);

namespace Falschcard\Repositories;

use Falschcard\Core\Database;
use Falschcard\Core\Crypto;

final class SettingsRepository
{
    /** Return settings row for a profile (decrypted key status, never the raw key). */
    public function findByProfile(int $profileId): ?array
    {
        $row = Database::fetchOne(
            'SELECT profile_id, gemini_api_key, gemini_model,
                    auto_read_question, tts_voice_uri, tts_rate, tts_pitch, theme, extra, updated_at
             FROM profile_settings
             WHERE profile_id = ?',
            [$profileId]
        );

        if ($row === null) {
            return null;
        }

        return $this->sanitize($row);
    }

    /** Create default settings for a new profile. */
    public function create(int $profileId): void
    {
        Database::run(
            'INSERT IGNORE INTO profile_settings (profile_id) VALUES (?)',
            [$profileId]
        );
    }

    /**
     * Update non-key settings fields.
     * Uses INSERT ... ON DUPLICATE KEY UPDATE so the row is guaranteed to exist
     * even if settings were somehow never created for this profile.
     */
    public function update(int $profileId, array $fields): void
    {
        $allowed = [
            'gemini_model', 'auto_read_question',
            'tts_voice_uri', 'tts_rate', 'tts_pitch', 'theme', 'extra',
        ];

        $setClauses = [];
        $params     = [];

        foreach ($allowed as $col) {
            if (array_key_exists($col, $fields)) {
                $setClauses[] = "{$col} = ?";
                $value = $fields[$col];
                if ($col === 'extra' && is_array($value)) {
                    $value = json_encode($value, JSON_UNESCAPED_UNICODE);
                }
                $params[] = $value;
            }
        }

        if (empty($setClauses)) {
            return;
        }

        // Ensure the row exists first (idempotent)
        $this->create($profileId);

        $params[] = $profileId;
        Database::run(
            'UPDATE profile_settings SET ' . implode(', ', $setClauses) . ' WHERE profile_id = ?',
            $params
        );
    }

    /**
     * Return a defaults array in the same shape as findByProfile()
     * without touching the database. Used when no settings row exists yet.
     */
    public function defaults(int $profileId): array
    {
        return [
            'profile_id'         => $profileId,
            'has_api_key'        => false,
            'gemini_model'       => 'gemini-3.5-flash',
            'auto_read_question' => false,
            'tts_voice_uri'      => null,
            'tts_rate'           => 1.0,
            'tts_pitch'          => 1.0,
            'theme'              => 'dark',
            'extra'              => null,
            'updated_at'         => null,
        ];
    }

    /** Encrypt and store the Gemini API key. */
    public function saveGeminiKey(int $profileId, string $apiKey): void
    {
        $encrypted = Crypto::encryptBinary($apiKey);
        Database::run(
            'INSERT INTO profile_settings (profile_id, gemini_api_key) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE gemini_api_key = ?',
            [$profileId, $encrypted, $encrypted]
        );
    }

    /** Decrypt and return the raw Gemini API key (server-side only). */
    public function getDecryptedGeminiKey(int $profileId): ?string
    {
        $row = Database::fetchOne(
            'SELECT gemini_api_key FROM profile_settings WHERE profile_id = ?',
            [$profileId]
        );

        if ($row === null || $row['gemini_api_key'] === null) {
            return null;
        }

        try {
            return Crypto::decryptBinary($row['gemini_api_key']);
        } catch (\Throwable) {
            return null;
        }
    }

    /** Remove the stored Gemini API key. */
    public function deleteGeminiKey(int $profileId): void
    {
        Database::run(
            'UPDATE profile_settings SET gemini_api_key = NULL WHERE profile_id = ?',
            [$profileId]
        );
    }

    // ── private ──────────────────────────────────────────────────────────────

    private function sanitize(array $row): array
    {
        // Never expose the encrypted key; return only its presence
        $hasKey = $row['gemini_api_key'] !== null;
        unset($row['gemini_api_key']);
        $row['has_api_key'] = $hasKey;

        // Parse JSON extra
        if (isset($row['extra']) && is_string($row['extra'])) {
            $row['extra'] = json_decode($row['extra'], true) ?? [];
        }

        // Cast numeric fields
        $row['auto_read_question'] = (bool) $row['auto_read_question'];
        $row['tts_rate']           = (float) $row['tts_rate'];
        $row['tts_pitch']          = (float) $row['tts_pitch'];

        return $row;
    }
}
