<?php

declare(strict_types=1);

namespace Falschcard\Core;

/**
 * JSON response helpers. All methods send headers + body and exit.
 */
final class Response
{
    /** Send a successful JSON response. */
    public static function json(mixed $data, int $status = 200): never
    {
        self::headers($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    /** Send a successful response with no body (e.g. DELETE). */
    public static function noContent(): never
    {
        self::headers(204);
        exit;
    }

    /** Send a standardised error response. */
    public static function error(string $code, string $message, int $status = 400): never
    {
        self::headers($status);
        echo json_encode([
            'error' => [
                'code'    => $code,
                'message' => $message,
            ],
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function notFound(string $message = 'Resource not found'): never
    {
        self::error('NOT_FOUND', $message, 404);
    }

    public static function badRequest(string $message): never
    {
        self::error('BAD_REQUEST', $message, 400);
    }

    public static function conflict(string $message): never
    {
        self::error('CONFLICT', $message, 409);
    }

    public static function serverError(string $message = 'Internal server error'): never
    {
        self::error('SERVER_ERROR', $message, 500);
    }

    public static function validationError(array $errors): never
    {
        self::headers(422);
        echo json_encode([
            'error' => [
                'code'    => 'VALIDATION_ERROR',
                'message' => 'Validation failed',
                'errors'  => $errors,
            ],
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    public static function cors(): void
    {
        $origin = Env::corsOrigin();

        if ($origin !== '') {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            // Dev: allow all origins
            header('Access-Control-Allow-Origin: *');
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
        header('Access-Control-Max-Age: 86400');
    }

    // ── private ──────────────────────────────────────────────────────────────

    private static function headers(int $status): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        self::cors();
    }
}
