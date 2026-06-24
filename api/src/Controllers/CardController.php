<?php

declare(strict_types=1);

namespace Falschcard\Controllers;

use Falschcard\Core\{Request, Response, Validator};
use Falschcard\Repositories\{CardRepository, ImageRepository};

final class CardController extends BaseController
{
    private CardRepository  $cards;
    private ImageRepository $images;

    public function __construct(
        CardRepository  $cards  = new CardRepository(),
        ImageRepository $images = new ImageRepository(),
    ) {
        $this->cards  = $cards;
        $this->images = $images;
    }

    /** POST /api/decks/{id}/cards — create a single card */
    public function create(Request $req): void
    {
        $deckId = $this->requireIntParam($req);
        $this->assertDeck($deckId);

        $question    = trim((string) $req->input('question', ''));
        $answer      = trim((string) $req->input('answer', ''));
        $explanation = $req->input('explanation');

        (new Validator())
            ->required('question', $question, 'Domanda')
            ->required('answer', $answer, 'Risposta')
            ->string('question', $question, 1, 0, 'Domanda')
            ->string('answer', $answer, 1, 0, 'Risposta')
            ->failFast();

        $id = $this->cards->create($deckId, [
            'question'    => $question,
            'answer'      => $answer,
            'explanation' => $explanation !== null ? trim((string) $explanation) : null,
        ]);

        $card = $this->cards->findById($id);
        Response::json(['card' => $card], 201);
    }

    /** POST /api/decks/{id}/cards/bulk — bulk import (transactional) */
    public function bulkCreate(Request $req): void
    {
        $deckId = $this->requireIntParam($req);
        $this->assertDeck($deckId);

        $cards = $req->input('cards');

        (new Validator())
            ->required('cards', $cards, 'Carte')
            ->isArray('cards', $cards, 'Carte')
            ->failFast();

        if (empty($cards)) {
            Response::badRequest('Nessuna carta da importare.');
        }

        // Validate each card: question + answer must be non-empty strings
        $errors = [];
        foreach ($cards as $i => $card) {
            $q = isset($card['question']) ? trim((string) $card['question']) : '';
            $a = isset($card['answer'])   ? trim((string) $card['answer'])   : '';
            if ($q === '') {
                $errors["cards.{$i}.question"] = "Carta {$i}: domanda mancante";
            }
            if ($a === '') {
                $errors["cards.{$i}.answer"] = "Carta {$i}: risposta mancante";
            }
        }
        if (!empty($errors)) {
            Response::validationError($errors);
        }

        $count = $this->cards->bulkCreate($deckId, $cards);

        Response::json(['inserted' => $count], 201);
    }

    /** PATCH /api/cards/{id} */
    public function update(Request $req): void
    {
        $id   = $this->requireIntParam($req);
        $card = $this->cards->findById($id);

        if ($card === null) {
            Response::notFound("Carta {$id} non trovata.");
        }

        $body = $req->all();
        $v    = new Validator();

        foreach (['question', 'answer', 'explanation'] as $field) {
            if (isset($body[$field])) {
                $v->string($field, $body[$field], $field === 'explanation' ? 0 : 1, 0, ucfirst($field));
            }
        }
        if (isset($body['position'])) {
            $v->integer('position', $body['position'], 0, PHP_INT_MAX, 'Posizione');
        }
        $v->failFast();

        $fields = array_intersect_key($body, array_flip(['question', 'answer', 'explanation', 'position']));
        // Pass deck_id so CardRepository can touch the parent deck without an extra SELECT
        $fields['deck_id'] = (int) $card['deck_id'];

        $this->cards->update($id, $fields);

        Response::json(['card' => $this->cards->findById($id)]);
    }

    /** DELETE /api/cards/{id} */
    public function delete(Request $req): void
    {
        $id   = $this->requireIntParam($req);
        $card = $this->cards->findById($id);

        if ($card === null) {
            Response::notFound("Carta {$id} non trovata.");
        }

        // Collect image file paths before the row CASCADE removes them.
        $paths = $this->images->pathsForCards([$id]);

        // Pass deck_id so CardRepository can touch the parent deck without an extra SELECT
        $this->cards->delete($id, ['deck_id' => (int) $card['deck_id']]);

        // CASCADE removed the card_images rows; now remove the files from disk.
        ImageController::deleteFiles($paths);

        Response::noContent();
    }

}
