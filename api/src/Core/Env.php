<?php

declare(strict_types=1);

namespace Falschcard\Core;

/**
 * Thin wrapper around fc_config() from config/config.php.
 * Provides typed, static accessors for the configuration values.
 */
final class Env
{
    private static array $cfg = [];

    public static function init(): void
    {
        if (!empty(self::$cfg)) {
            return;
        }
        // config.php defines fc_config()
        require_once ROOT_DIR . '/config/config.php';
        self::$cfg = fc_config();
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        self::init();
        return self::$cfg[$key] ?? $default;
    }

    public static function appEnv(): string
    {
        return (string) self::get('app_env', 'production');
    }

    public static function isDebug(): bool
    {
        return self::appEnv() === 'development';
    }

    public static function dbHost(): string   { return (string) self::get('db_host', '127.0.0.1'); }
    public static function dbPort(): int      { return (int)    self::get('db_port', 3306); }
    public static function dbName(): string   { return (string) self::get('db_name', 'falschcard'); }
    public static function dbUser(): string   { return (string) self::get('db_user', ''); }
    public static function dbPass(): string   { return (string) self::get('db_pass', ''); }
    public static function cryptoKey(): string { return (string) self::get('crypto_key', ''); }
    public static function corsOrigin(): string { return (string) self::get('cors_origin', ''); }

    public static function aiTimeout(): int       { return (int) self::get('ai_timeout', 30); }
    public static function aiStreamTimeout(): int { return (int) self::get('ai_stream_timeout', 120); }
    public static function aiMaxRetries(): int    { return max(0, (int) self::get('ai_max_retries', 2)); }
    public static function aiRetryBaseMs(): int   { return max(0, (int) self::get('ai_retry_base_ms', 400)); }
}
