<?php

declare(strict_types=1);

namespace Falschcard\Services;

use Falschcard\Repositories\ProfileRepository;
use Falschcard\Repositories\SettingsRepository;
use Falschcard\Repositories\DeckRepository;
use Falschcard\Repositories\CardReviewRepository;

/**
 * Assembles the bootstrap payload sent on first load.
 * Returns: { profile, settings (hasApiKey, no raw key), decks (with card_count) }
 */
final class BootstrapService
{
    public function __construct(
        private readonly ProfileRepository    $profiles    = new ProfileRepository(),
        private readonly SettingsRepository   $settings    = new SettingsRepository(),
        private readonly DeckRepository       $decks       = new DeckRepository(),
        private readonly CardReviewRepository $cardReviews = new CardReviewRepository(),
    ) {}

    /** @throws \RuntimeException when profile not found */
    public function forProfile(int $profileId): array
    {
        $profile = $this->profiles->findById($profileId);
        if ($profile === null) {
            throw new \RuntimeException("Profile {$profileId} not found", 404);
        }

        $settings = $this->settings->findByProfile($profileId);
        if ($settings === null) {
            // Settings row missing — create defaults and re-fetch
            $this->settings->create($profileId);
            $settings = $this->settings->findByProfile($profileId);
        }

        $decks = $this->decks->findByProfile($profileId);

        // Cast numeric stats
        foreach ($decks as &$deck) {
            $deck['card_count']    = (int)   $deck['card_count'];
            $deck['times_studied'] = (int)   $deck['times_studied'];
            $deck['last_score']    = $deck['last_score']  !== null ? (float) $deck['last_score']  : null;
            $deck['mastery']       = $deck['mastery']     !== null ? (float) $deck['mastery']     : null;
        }
        unset($deck);

        $unknownCards = $this->cardReviews->listForProfile($profileId);

        return [
            'profile'       => $profile,
            'settings'      => $settings,
            'decks'         => $decks,
            'unknown_cards' => $unknownCards,
        ];
    }
}
