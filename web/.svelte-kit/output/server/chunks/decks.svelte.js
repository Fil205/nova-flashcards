import "clsx";
import { a as api, h as setDeck, i as isNetworkError, j as getDeck, k as hasDeck } from "./cache.js";
const decksApi = {
  list(profileId) {
    return api.get(`/profiles/${profileId}/decks`);
  },
  create(profileId, data) {
    return api.post(`/profiles/${profileId}/decks`, data);
  },
  get(deckId) {
    return api.get(`/decks/${deckId}`);
  },
  update(deckId, data) {
    return api.patch(`/decks/${deckId}`, data);
  },
  delete(deckId) {
    return api.delete(`/decks/${deckId}`);
  },
  recordStudy(deckId, result) {
    return api.post(`/decks/${deckId}/study`, result);
  }
};
const cardsApi = {
  create(deckId, card) {
    return api.post(`/decks/${deckId}/cards`, card);
  },
  bulkCreate(deckId, cards) {
    return api.post(`/decks/${deckId}/cards/bulk`, { cards });
  },
  update(cardId, data) {
    return api.patch(`/cards/${cardId}`, data);
  },
  delete(cardId) {
    return api.delete(`/cards/${cardId}`);
  }
};
const KEY = "fc.outbox";
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function save(entries) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
  } catch {
  }
}
function enqueue(deckId, payload) {
  const entries = load();
  entries.push({
    id: crypto.randomUUID(),
    deckId,
    payload,
    queuedAt: Date.now()
  });
  save(entries);
}
class DecksStore {
  decks = [];
  loading = false;
  error = null;
  // The currently open deck (full with cards)
  currentDeck = null;
  /** Hydrate from bootstrap data (no extra network call). */
  hydrate(decks) {
    this.decks = decks;
  }
  /** Clear all decks (on profile switch). */
  clear() {
    this.decks = [];
    this.currentDeck = null;
  }
  /** Load deck list for a profile from server. */
  async load(profileId) {
    this.loading = true;
    this.error = null;
    try {
      const { decks } = await decksApi.list(profileId);
      this.decks = decks;
    } catch {
      this.error = "Impossibile caricare i mazzi.";
    } finally {
      this.loading = false;
    }
  }
  /** Load a single deck with all cards. */
  async loadDeck(deckId) {
    try {
      const { deck } = await decksApi.get(deckId);
      this.currentDeck = deck;
      setDeck(deckId, deck);
      return deck;
    } catch (err) {
      if (isNetworkError(err)) {
        const cached = getDeck(deckId);
        if (cached) {
          this.currentDeck = cached;
          return cached;
        }
      }
      return null;
    }
  }
  /**
   * Prefetch all decks in the current list that are not yet cached.
   * Called in the background after a successful online bootstrap so every
   * deck is available offline without the user having to open each one.
   * Max 3 concurrent requests to avoid hammering the server.
   */
  async prefetchAll() {
    const uncached = this.decks.filter((d) => !hasDeck(d.id));
    if (uncached.length === 0) return;
    for (let i = 0; i < uncached.length; i += 3) {
      const batch = uncached.slice(i, i + 3);
      await Promise.all(batch.map(async (summary) => {
        try {
          const { deck } = await decksApi.get(summary.id);
          setDeck(summary.id, deck);
        } catch {
        }
      }));
    }
  }
  /** Create a new deck. */
  async create(profileId, data) {
    const { deck } = await decksApi.create(profileId, data);
    const summary = { ...deck, card_count: 0 };
    this.decks = [...this.decks, summary];
    this.currentDeck = deck;
    return deck;
  }
  /** Update deck metadata. */
  async update(deckId, data) {
    const { deck } = await decksApi.update(deckId, data);
    this.decks = this.decks.map((d) => d.id === deckId ? {
      ...d,
      name: deck.name,
      description: deck.description,
      lang: deck.lang
    } : d);
    if (this.currentDeck?.id === deckId) {
      this.currentDeck = deck;
    }
  }
  /** Delete a deck. */
  async delete(deckId) {
    await decksApi.delete(deckId);
    this.decks = this.decks.filter((d) => d.id !== deckId);
    if (this.currentDeck?.id === deckId) {
      this.currentDeck = null;
    }
  }
  /** Record a completed study session. */
  async recordStudy(deckId, result) {
    try {
      await decksApi.recordStudy(deckId, result);
    } catch (err) {
      if (isNetworkError(err)) {
        enqueue(deckId, result);
      } else {
        throw err;
      }
    }
    this.decks = this.decks.map((d) => d.id === deckId ? {
      ...d,
      times_studied: d.times_studied + 1,
      last_score: result.score,
      last_studied_at: /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString(),
      mastery: result.score
    } : d);
  }
  // ── Card operations ───────────────────────────────────────────────────────
  /** Add a card to current deck. */
  async addCard(deckId, card) {
    const { card: newCard } = await cardsApi.create(deckId, card);
    if (this.currentDeck?.id === deckId) {
      this.currentDeck = {
        ...this.currentDeck,
        cards: [...this.currentDeck.cards, newCard],
        card_count: this.currentDeck.card_count + 1
      };
    }
    this.decks = this.decks.map((d) => d.id === deckId ? { ...d, card_count: d.card_count + 1 } : d);
    return newCard;
  }
  /** Bulk import cards into a deck. */
  async bulkAddCards(deckId, cards) {
    const { inserted } = await cardsApi.bulkCreate(deckId, cards);
    await this.loadDeck(deckId);
    this.decks = this.decks.map((d) => d.id === deckId ? { ...d, card_count: d.card_count + inserted } : d);
    return inserted;
  }
  /** Update a card. */
  async updateCard(cardId, data) {
    const { card } = await cardsApi.update(cardId, data);
    if (this.currentDeck) {
      this.currentDeck = {
        ...this.currentDeck,
        cards: this.currentDeck.cards.map((c) => c.id === cardId ? card : c)
      };
    }
  }
  /** Delete a card. */
  async deleteCard(cardId, deckId) {
    await cardsApi.delete(cardId);
    if (this.currentDeck?.id === deckId) {
      this.currentDeck = {
        ...this.currentDeck,
        cards: this.currentDeck.cards.filter((c) => c.id !== cardId),
        card_count: Math.max(0, this.currentDeck.card_count - 1)
      };
    }
    this.decks = this.decks.map((d) => d.id === deckId ? { ...d, card_count: Math.max(0, d.card_count - 1) } : d);
  }
  /** Derived: find a deck summary by id. */
  findById(id) {
    return this.decks.find((d) => d.id === id);
  }
}
const deckStore = new DecksStore();
export {
  deckStore as d
};
