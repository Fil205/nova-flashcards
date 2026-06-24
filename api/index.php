<?php

/**
 * Falschcard API — front controller.
 *
 * Nginx routes all /api/* requests here via fastcgi_pass with:
 *   fastcgi_param SCRIPT_FILENAME /var/www/falschcard/api/index.php;
 *
 * In dev: php -S 127.0.0.1:8787 api/index.php
 */

declare(strict_types=1);

// ── Bootstrap ─────────────────────────────────────────────────────────────────

define('ROOT_DIR', dirname(__DIR__));

require_once ROOT_DIR . '/api/src/Core/Env.php';
require_once ROOT_DIR . '/api/src/Core/Database.php';
require_once ROOT_DIR . '/api/src/Core/Router.php';
require_once ROOT_DIR . '/api/src/Core/Request.php';
require_once ROOT_DIR . '/api/src/Core/Response.php';
require_once ROOT_DIR . '/api/src/Core/Validator.php';
require_once ROOT_DIR . '/api/src/Core/Crypto.php';

require_once ROOT_DIR . '/api/src/Repositories/ProfileRepository.php';
require_once ROOT_DIR . '/api/src/Repositories/SettingsRepository.php';
require_once ROOT_DIR . '/api/src/Repositories/DeckRepository.php';
require_once ROOT_DIR . '/api/src/Repositories/CardRepository.php';
require_once ROOT_DIR . '/api/src/Repositories/ImageRepository.php';
require_once ROOT_DIR . '/api/src/Repositories/StudyRepository.php';
require_once ROOT_DIR . '/api/src/Repositories/CardReviewRepository.php';

require_once ROOT_DIR . '/api/src/Services/BootstrapService.php';
require_once ROOT_DIR . '/api/src/Services/GeminiService.php';

require_once ROOT_DIR . '/api/src/Controllers/BaseController.php';
require_once ROOT_DIR . '/api/src/Controllers/ProfileController.php';
require_once ROOT_DIR . '/api/src/Controllers/SettingsController.php';
require_once ROOT_DIR . '/api/src/Controllers/DeckController.php';
require_once ROOT_DIR . '/api/src/Controllers/CardController.php';
require_once ROOT_DIR . '/api/src/Controllers/ImageController.php';
require_once ROOT_DIR . '/api/src/Controllers/AiController.php';
require_once ROOT_DIR . '/api/src/Controllers/ImportExportController.php';

// Use Falschcard namespace classes
use Falschcard\Core\{Env, Request, Response, Router};
use Falschcard\Controllers\{
    ProfileController, SettingsController,
    DeckController, CardController, ImageController,
    AiController, ImportExportController,
};

// ── Namespace aliases (since we use bare require_once, not Composer) ──────────
// Assign namespace manually to make classes reachable
spl_autoload_register(function (string $class): void {
    // Already loaded manually above; this is a no-op fallback
});

// Initialise config/env
Env::init();

// ── Global error handling ──────────────────────────────────────────────────────

set_exception_handler(function (\Throwable $e) {
    if (!headers_sent()) {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
    }
    $msg = Env::isDebug() ? $e->getMessage() : 'Internal server error';
    echo json_encode(['error' => ['code' => 'SERVER_ERROR', 'message' => $msg]]);
    exit;
});

// ── CORS pre-flight (OPTIONS) ──────────────────────────────────────────────────
// Non-OPTIONS requests get CORS headers via Response::headers() → Response::cors().
// We only call cors() explicitly here for the preflight 204 path.

if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    Response::cors();
    http_response_code(204);
    exit;
}

// ── Request + Router ─────────────────────────────────────────────────────────

$req    = new Request();
$router = new Router($req);

// ── Health check (handled before router) ────────────────────────────────────

if ($req->path === '/api/health' && $req->method === 'GET') {
    Response::json(['ok' => true, 'ts' => time()]);
}

// ── Route definitions ────────────────────────────────────────────────────────

// Profiles
$router->get('/api/profiles',                             [ProfileController::class, 'index']);
$router->post('/api/profiles',                            [ProfileController::class, 'create']);
$router->patch('/api/profiles/{id}',                      [ProfileController::class, 'update']);
$router->delete('/api/profiles/{id}',                     [ProfileController::class, 'delete']);
$router->get('/api/profiles/{id}/bootstrap',              [ProfileController::class, 'bootstrap']);

// Settings & Gemini key (per-profile)
$router->get('/api/profiles/{id}/settings',               [SettingsController::class, 'show']);
$router->put('/api/profiles/{id}/settings',               [SettingsController::class, 'update']);
$router->put('/api/profiles/{id}/gemini-key',             [SettingsController::class, 'updateGeminiKey']);
$router->delete('/api/profiles/{id}/gemini-key',          [SettingsController::class, 'deleteGeminiKey']);
$router->get('/api/profiles/{id}/gemini-models',          [SettingsController::class, 'listGeminiModels']);

// Decks (scoped to profile)
$router->get('/api/profiles/{id}/decks',                  [DeckController::class, 'index']);
$router->post('/api/profiles/{id}/decks',                 [DeckController::class, 'create']);

// Decks (by deck id)
$router->get('/api/decks/{id}',                           [DeckController::class, 'show']);
$router->patch('/api/decks/{id}',                         [DeckController::class, 'update']);
$router->delete('/api/decks/{id}',                        [DeckController::class, 'delete']);
$router->post('/api/decks/{id}/study',                    [DeckController::class, 'recordStudy']);

// Cards
$router->post('/api/decks/{id}/cards',                    [CardController::class, 'create']);
$router->post('/api/decks/{id}/cards/bulk',               [CardController::class, 'bulkCreate']);
$router->patch('/api/cards/{id}',                         [CardController::class, 'update']);
$router->delete('/api/cards/{id}',                        [CardController::class, 'delete']);

// Card images
$router->post('/api/cards/{id}/images',                   [ImageController::class, 'create']);
$router->delete('/api/images/{id}',                       [ImageController::class, 'delete']);

// AI proxy
$router->post('/api/profiles/{id}/ai/evaluate',           [AiController::class, 'evaluate']);
$router->post('/api/profiles/{id}/ai/review',             [AiController::class, 'review']);
$router->post('/api/profiles/{id}/ai/tutor',              [AiController::class, 'tutor']);
$router->post('/api/profiles/{id}/ai/fix-import',         [AiController::class, 'fixImport']);

// Import / Export
$router->get('/api/profiles/{id}/export',                 [ImportExportController::class, 'export']);
$router->post('/api/profiles/{id}/import',                [ImportExportController::class, 'import']);

// ── Dispatch ─────────────────────────────────────────────────────────────────

$router->dispatch();
