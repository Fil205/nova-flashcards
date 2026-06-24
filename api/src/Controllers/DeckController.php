<?php

declare(strict_types=1);

namespace Falschcard\Controllers;

use Falschcard\Core\{Request, Response, Validator};
use Falschcard\Repositories\{DeckRepository, StudyRepository, CardReviewRepository, ImageRepository};

final class DeckController extends BaseController
{
    private DeckRepository       $decks;
    private StudyRepository      $study;
    private CardReviewRepository $cardReviews;
    private ImageRepository      $images;

    public function __construct(
        DeckRepository       $decks       = new DeckRepository(),
        StudyRepository      $study       = new StudyRepository(),
        CardReviewRepository $cardReviews = new CardReviewRepository(),
        ImageRepository      $images      = new ImageRepository(),
    ) {
        $this->decks       = $decks;
        $this->study       = $study;
        $this->cardReviews = $cardReviews;
        $this->images      = $images;
    }

    /** GET /api/profiles/{id}/decks */
    public function index(Request $req): void
    {
        $profileId = $this->requireIntParam($req);
        $this->assertProfile($profileId);

        $decks = $this->decks->findByProfile($profileId);

        foreach ($decks as &$d) {
            $d['card_count']    = (int)   $d['card_count'];
            $d['times_studied'] = (int)   $d['times_studied'];
            $d['last_score']    = $d['last_score'] !== null ? (float) $d['last_score'] : null;
            $d['mastery']       = $d['mastery']    !== null ? (float) $d['mastery']    : null;
        }
        unset($d);

        Response::json(['decks' => $decks]);
    }

    /** POST /api/profiles/{id}/decks */
    public function create(Request $req): void
    {
        $profileId = $this->requireIntParam($req);
        $this->assertProfile($profileId);

        $name = trim((string) $req->input('name', ''));

        $v = (new Validator())
            ->required('name', $name, 'Nome')
            ->string('name', $name, 1, 120, 'Nome');

        $source = $req->input('source');
        if ($source !== null) {
            $v->inList('source', $source, ['manual', 'import-txt', 'import-json', 'ai', 'example'], 'Sorgente');
        }
        $v->failFast();

        $deckId = $this->decks->create($profileId, [
            'name'        => $name,
            'description' => $req->input('description'),
            'lang'        => $req->input('lang'),
            'source'      => $source ?? 'manual',
        ]);

        $deck = $this->decks->findByIdWithCards($deckId);
        Response::json(['deck' => $deck], 201);
    }

    /** GET /api/decks/{id} */
    public function show(Request $req): void
    {
        $id   = $this->requireIntParam($req);
        $deck = $this->decks->findByIdWithCards($id);

        if ($deck === null) {
            Response::notFound("Mazzo {$id} non trovato.");
        }

        Response::json(['deck' => $deck]);
    }

    /** PATCH /api/decks/{id} */
    public function update(Request $req): void
    {
        $id = $this->requireIntParam($req);
        $this->assertDeck($id);

        $body = $req->all();
        $v    = new Validator();

        if (isset($body['name'])) {
            $v->string('name', $body['name'], 1, 120, 'Nome');
        }
        $v->failFast();

        $this->decks->update($id, array_intersect_key($body, array_flip(['name', 'description', 'lang', 'position'])));

        Response::json(['deck' => $this->decks->findByIdWithCards($id)]);
    }

    /** DELETE /api/decks/{id} */
    public function delete(Request $req): void
    {
        $id = $this->requireIntParam($req);
        $this->assertDeck($id);

        // Collect image file paths before the row CASCADE removes them.
        $paths = $this->images->pathsForDeck($id);

        $this->decks->delete($id);

        // CASCADE removed the card_images rows; now remove the files from disk.
        ImageController::deleteFiles($paths);

        Response::noContent();
    }

    /** POST /api/decks/{id}/study — record session result */
    public function recordStudy(Request $req): void
    {
        $deckId = $this->requireIntParam($req);
        $deck   = $this->assertDeck($deckId);   // returns the row

        $body  = $req->all();
        $score = (float) ($body['score'] ?? 0);

        (new Validator())
            ->numeric('score', $score, 0.0, 1.0, 'Score')
            ->failFast();

        $this->decks->recordStudy($deckId, $score, ['mastery' => $score]);

        $this->study->record(
            (int) $deck['profile_id'],
            $deckId,
            [
                'mode'        => $body['mode']        ?? 'sequential',
                'total'       => (int) ($body['total']       ?? 0),
                'correct'     => (int) ($body['correct']     ?? 0),
                'partial'     => (int) ($body['partial']     ?? 0),
                'wrong'       => (int) ($body['wrong']       ?? 0),
                'score'       => $score,
                'duration_ms' => isset($body['duration_ms']) ? (int) $body['duration_ms'] : null,
            ]
        );

        // ── Card review updates: persist "didn't know" history ────────────────
        $profileId    = (int) $deck['profile_id'];
        $wrongCardIds = array_values(array_filter(
            array_map('intval', (array) ($body['wrong_card_ids'] ?? [])),
            static fn (int $id): bool => $id > 0
        ));
        $knownCardIds = array_values(array_filter(
            array_map('intval', (array) ($body['known_card_ids'] ?? [])),
            static fn (int $id): bool => $id > 0
        ));

        if (!empty($wrongCardIds)) {
            $this->cardReviews->upsertMissed($profileId, $wrongCardIds);
        }
        if (!empty($knownCardIds)) {
            $this->cardReviews->clearKnown($profileId, $knownCardIds);
        }

        Response::json(['ok' => true, 'score' => $score]);
    }
}
