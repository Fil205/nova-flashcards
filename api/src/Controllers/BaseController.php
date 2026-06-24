<?php

declare(strict_types=1);

namespace Falschcard\Controllers;

use Falschcard\Core\{Request, Response};
use Falschcard\Repositories\{ProfileRepository, DeckRepository};

/**
 * Shared helpers for all controllers.
 *
 * Centralises the two most-repeated patterns:
 *  1. requireIntParam()  — parse an int route param or abort with 404.
 *  2. assertProfile()    — verify a profile exists or abort with 404.
 *  3. assertDeck()       — verify a deck exists or abort with 404.
 */
abstract class BaseController
{
    private ?ProfileRepository $profileRepo = null;
    private ?DeckRepository    $deckRepo    = null;

    // ── Route param helpers ───────────────────────────────────────────────────

    /**
     * Return the route param as a positive int, or respond 404 immediately.
     */
    protected function requireIntParam(Request $req, string $key = 'id'): int
    {
        $v = $req->intParam($key);
        if ($v === null) {
            Response::notFound(ucfirst($key) . ' non valido o mancante.');
        }
        return $v;
    }

    // ── Existence guards ──────────────────────────────────────────────────────

    /**
     * Abort with 404 if the profile does not exist.
     */
    protected function assertProfile(int $id): void
    {
        if ($this->profileRepo()->findById($id) === null) {
            Response::notFound("Profilo {$id} non trovato.");
        }
    }

    /**
     * Abort with 404 if the deck does not exist.
     * Returns the deck row so the caller can use it without another SELECT.
     */
    protected function assertDeck(int $id): array
    {
        $deck = $this->deckRepo()->findById($id);
        if ($deck === null) {
            Response::notFound("Mazzo {$id} non trovato.");
        }
        return $deck;
    }

    // ── Lazy repo accessors ───────────────────────────────────────────────────

    private function profileRepo(): ProfileRepository
    {
        return $this->profileRepo ??= new ProfileRepository();
    }

    private function deckRepo(): DeckRepository
    {
        return $this->deckRepo ??= new DeckRepository();
    }
}
