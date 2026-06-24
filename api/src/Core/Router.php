<?php

declare(strict_types=1);

namespace Falschcard\Core;

/**
 * Simple regex-based front controller router.
 *
 * Usage:
 *   $router = new Router($request);
 *   $router->get('/api/profiles',         [ProfileController::class, 'index']);
 *   $router->post('/api/profiles',        [ProfileController::class, 'create']);
 *   $router->get('/api/profiles/{id}',    [ProfileController::class, 'show']);
 *   $router->dispatch();
 */
final class Router
{
    private array $routes = [];

    public function __construct(private readonly Request $request) {}

    public function get(string $pattern, array $handler): self
    {
        return $this->add('GET', $pattern, $handler);
    }

    public function post(string $pattern, array $handler): self
    {
        return $this->add('POST', $pattern, $handler);
    }

    public function put(string $pattern, array $handler): self
    {
        return $this->add('PUT', $pattern, $handler);
    }

    public function patch(string $pattern, array $handler): self
    {
        return $this->add('PATCH', $pattern, $handler);
    }

    public function delete(string $pattern, array $handler): self
    {
        return $this->add('DELETE', $pattern, $handler);
    }

    /** Match and dispatch; sends 405 or 404 if no route matches. */
    public function dispatch(): never
    {
        // Handle preflight
        if ($this->request->method === 'OPTIONS') {
            Response::cors();
            http_response_code(204);
            exit;
        }

        $methodMatched = false;

        foreach ($this->routes as $route) {
            [$method, $regex, $paramNames, $handler] = $route;

            if (!preg_match($regex, $this->request->path, $matches)) {
                continue;
            }

            if ($method !== $this->request->method) {
                $methodMatched = true;
                continue;
            }

            // Extract named params
            $params = [];
            foreach ($paramNames as $name) {
                $params[$name] = $matches[$name] ?? '';
            }

            // Inject params into request and call handler
            $reqWithParams = $this->request->withParams($params);
            [$class, $action] = $handler;
            $controller = new $class();
            $controller->$action($reqWithParams);
            exit; // handler should have exited via Response; guard against leaks
        }

        if ($methodMatched) {
            Response::error('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
        }

        Response::notFound('No route matched: ' . $this->request->method . ' ' . $this->request->path);
    }

    // ── private ──────────────────────────────────────────────────────────────

    private function add(string $method, string $pattern, array $handler): self
    {
        // Convert {param} placeholders to named capture groups
        $paramNames = [];
        $regex = preg_replace_callback('/\{(\w+)\}/', function ($m) use (&$paramNames) {
            $paramNames[] = $m[1];
            return '(?P<' . $m[1] . '>[^/]+)';
        }, $pattern);

        $regex = '#^' . $regex . '$#';

        $this->routes[] = [$method, $regex, $paramNames, $handler];
        return $this;
    }
}
