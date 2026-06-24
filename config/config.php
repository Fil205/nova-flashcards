<?php
/**
 * Application configuration.
 * Reads from config/.env (never from web root).
 * Called once; result cached in a static variable.
 */

declare(strict_types=1);

function fc_config(): array
{
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }

    // .env lives next to this file
    $envFile = __DIR__ . '/.env';
    if (!file_exists($envFile)) {
        throw new RuntimeException('.env file not found. Copy .env.example → .env and fill in the values.');
    }

    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env   = [];
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (!str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $env[trim($key)] = trim($value);
    }

    $cfg = [
        'app_env'     => $env['APP_ENV']    ?? 'production',
        'app_name'    => $env['APP_NAME']   ?? 'Falschcard',
        'db_host'     => $env['DB_HOST']    ?? '127.0.0.1',
        'db_port'     => (int) ($env['DB_PORT'] ?? 3306),
        'db_name'     => $env['DB_NAME']    ?? 'falschcard',
        'db_user'     => $env['DB_USER']    ?? '',
        'db_pass'     => $env['DB_PASS']    ?? '',
        'crypto_key'  => $env['APP_CRYPTO_KEY'] ?? '',
        'cors_origin' => $env['CORS_ORIGIN'] ?? '',

        // AI (Gemini) request tuning
        'ai_timeout'        => (int) ($env['AI_TIMEOUT']        ?? 30),
        'ai_stream_timeout' => (int) ($env['AI_STREAM_TIMEOUT'] ?? 120),
        'ai_max_retries'    => (int) ($env['AI_MAX_RETRIES']    ?? 2),
        'ai_retry_base_ms'  => (int) ($env['AI_RETRY_BASE_MS']  ?? 400),
    ];

    return $cfg;
}
