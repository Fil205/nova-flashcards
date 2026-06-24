<?php

declare(strict_types=1);

namespace Falschcard\Core;

/**
 * HTTP request abstraction.
 * Parses URI, method, route params and body once per request.
 */
final class Request
{
    public readonly string $method;
    public readonly string $path;
    public readonly array  $query;
    private readonly array $body;
    public array $params = []; // route params injected by Router

    public function __construct()
    {
        $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

        // Strip query string from path and normalise
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $uri = strtok($uri, '?');
        $this->path = '/' . trim($uri, '/');

        parse_str($_SERVER['QUERY_STRING'] ?? '', $q);
        $this->query = $q;

        $this->body = $this->parseBody();
    }

    /** Return a copy with additional route params merged in. */
    public function withParams(array $params): self
    {
        $clone         = clone $this;
        $clone->params = array_merge($this->params, $params);
        return $clone;
    }

    /** Get a route param (e.g. "id"). */
    public function param(string $key): ?string
    {
        return isset($this->params[$key]) ? (string) $this->params[$key] : null;
    }

    /** Get integer route param. */
    public function intParam(string $key): ?int
    {
        $v = $this->param($key);
        return ($v !== null && ctype_digit($v)) ? (int) $v : null;
    }

    /** Get a body field. */
    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $default;
    }

    /** Get all body fields. */
    public function all(): array
    {
        return $this->body;
    }

    /** Get a query string param. */
    public function query(string $key, mixed $default = null): mixed
    {
        return $this->query[$key] ?? $default;
    }

    public function isMethod(string $method): bool
    {
        return $this->method === strtoupper($method);
    }

    // ── private ──────────────────────────────────────────────────────────────

    private function parseBody(): array
    {
        $ct = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($ct, 'application/json')) {
            $raw = file_get_contents('php://input');
            if ($raw === false || $raw === '') {
                return [];
            }
            $decoded = json_decode($raw, true);
            return is_array($decoded) ? $decoded : [];
        }
        // application/x-www-form-urlencoded or multipart
        return $_POST ?: [];
    }
}
