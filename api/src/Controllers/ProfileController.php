<?php

declare(strict_types=1);

namespace Falschcard\Controllers;

use Falschcard\Core\{Database, Request, Response, Validator};
use Falschcard\Repositories\{ProfileRepository, SettingsRepository};
use Falschcard\Services\BootstrapService;

final class ProfileController extends BaseController
{
    private ProfileRepository  $profiles;
    private SettingsRepository $settings;
    private BootstrapService   $bootstrap;

    public function __construct(
        ProfileRepository  $profiles  = new ProfileRepository(),
        SettingsRepository $settings  = new SettingsRepository(),
        BootstrapService   $bootstrap = new BootstrapService(),
    ) {
        $this->profiles  = $profiles;
        $this->settings  = $settings;
        $this->bootstrap = $bootstrap;
    }

    /** GET /api/profiles */
    public function index(Request $req): void
    {
        Response::json(['profiles' => $this->profiles->findAll()]);
    }

    /** POST /api/profiles */
    public function create(Request $req): void
    {
        $name = trim((string) $req->input('name', ''));

        (new Validator())
            ->required('name', $name, 'Nome')
            ->string('name', $name, 1, 80, 'Nome')
            ->failFast();

        if ($this->profiles->findByName($name) !== null) {
            Response::conflict("Un profilo con il nome \"{$name}\" esiste già.");
        }

        // Wrap profile + default settings creation in a single transaction
        // so a failure cannot leave an orphan profile row.
        $id = Database::transaction(function () use ($name): int {
            $profileId = $this->profiles->create($name);
            $this->settings->create($profileId);
            return $profileId;
        });

        $profile = $this->profiles->findById($id);
        Response::json(['profile' => $profile], 201);
    }

    /** PATCH /api/profiles/{id} */
    public function update(Request $req): void
    {
        $id   = $this->requireIntParam($req);
        $name = trim((string) $req->input('name', ''));

        (new Validator())
            ->required('name', $name, 'Nome')
            ->string('name', $name, 1, 80, 'Nome')
            ->failFast();

        if ($this->profiles->findById($id) === null) {
            Response::notFound("Profilo {$id} non trovato.");
        }

        $existing = $this->profiles->findByName($name);
        if ($existing !== null && (int) $existing['id'] !== $id) {
            Response::conflict("Un profilo con il nome \"{$name}\" esiste già.");
        }

        $this->profiles->rename($id, $name);
        Response::json(['profile' => $this->profiles->findById($id)]);
    }

    /** DELETE /api/profiles/{id} */
    public function delete(Request $req): void
    {
        $id = $this->requireIntParam($req);

        if ($this->profiles->findById($id) === null) {
            Response::notFound("Profilo {$id} non trovato.");
        }

        $this->profiles->delete($id);
        Response::noContent();
    }

    /** GET /api/profiles/{id}/bootstrap */
    public function bootstrap(Request $req): void
    {
        $id = $this->requireIntParam($req);

        try {
            $data = $this->bootstrap->forProfile($id);
            Response::json($data);
        } catch (\RuntimeException $e) {
            if ($e->getCode() === 404) {
                Response::notFound($e->getMessage());
            }
            Response::serverError('Errore interno del server.');
        }
    }
}
