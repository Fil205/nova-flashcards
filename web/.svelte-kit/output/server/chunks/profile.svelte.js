import "clsx";
import { a as api, b as setProfiles, g as getProfiles, c as setBootstrap, i as isNetworkError, d as getBootstrap, e as clearProfile } from "./cache.js";
const profilesApi = {
  list() {
    return api.get("/profiles");
  },
  create(name) {
    return api.post("/profiles", { name });
  },
  rename(id, name) {
    return api.patch(`/profiles/${id}`, { name });
  },
  delete(id) {
    return api.delete(`/profiles/${id}`);
  },
  bootstrap(id) {
    return api.get(`/profiles/${id}/bootstrap`);
  }
};
class ReviewStore {
  /** Set of card IDs the user has marked as "didn't know" (any profile). */
  unknownIds = /* @__PURE__ */ new Set();
  /** Hydrate from bootstrap payload. */
  hydrate(list) {
    this.unknownIds = new Set(list.map((x) => x.card_id));
  }
  /** Clear on profile switch / delete. */
  clear() {
    this.unknownIds = /* @__PURE__ */ new Set();
  }
  /** Returns card IDs that are unknown AND belong to this deck. */
  idsForDeck(deck) {
    return deck.cards.map((c) => c.id).filter((id) => this.unknownIds.has(id));
  }
  /** Optimistically mark cards as missed (adds to local set). */
  markMissed(cardIds) {
    if (cardIds.length === 0) return;
    const s = new Set(this.unknownIds);
    cardIds.forEach((id) => s.add(id));
    this.unknownIds = s;
  }
  /** Optimistically mark cards as known (removes from local set). */
  markKnown(cardIds) {
    if (cardIds.length === 0) return;
    const s = new Set(this.unknownIds);
    cardIds.forEach((id) => s.delete(id));
    this.unknownIds = s;
  }
}
const reviewStore = new ReviewStore();
const LS_KEY = "falschcard.activeProfileId";
class ProfileStore {
  // List of all profiles (for the switcher)
  profiles = [];
  // Currently active profile data (null = not selected / loading)
  active = null;
  settings = null;
  // Deck list lives here too (loaded on bootstrap, then managed by deckStore)
  bootstrapDecks = [];
  loading = false;
  error = null;
  /** ID stored in localStorage — may be stale (profile deleted on server). */
  get storedId() {
    if (typeof localStorage === "undefined") return null;
    const v = localStorage.getItem(LS_KEY);
    return v ? parseInt(v, 10) : null;
  }
  /** Save active profile ID to localStorage. */
  persist(id) {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LS_KEY, String(id));
    }
  }
  /** Clear stored profile from localStorage. */
  clearStored() {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(LS_KEY);
    }
  }
  /** Load the list of profiles from the server. */
  async loadProfiles() {
    try {
      const { profiles } = await profilesApi.list();
      this.profiles = profiles;
      setProfiles(profiles);
    } catch {
      this.profiles = getProfiles() ?? [];
    }
  }
  /**
   * Bootstrap the app with a profile.
   * Returns true if successful, false if the profile was not found.
   */
  async bootstrap(id) {
    this.loading = true;
    this.error = null;
    try {
      const data = await profilesApi.bootstrap(id);
      this.active = data.profile;
      this.settings = data.settings;
      this.bootstrapDecks = data.decks;
      reviewStore.hydrate(data.unknown_cards ?? []);
      this.persist(id);
      setBootstrap(id, data);
      return true;
    } catch (err) {
      const e = err;
      if (e?.status === 404) {
        this.clearStored();
        return false;
      }
      if (isNetworkError(err)) {
        const cached = getBootstrap(id);
        if (cached) {
          this.active = cached.profile;
          this.settings = cached.settings;
          this.bootstrapDecks = cached.decks;
          reviewStore.hydrate(cached.unknown_cards ?? []);
          return true;
        }
      }
      this.error = "Impossibile caricare il profilo. Controlla la connessione.";
      return false;
    } finally {
      this.loading = false;
    }
  }
  /** Create a new profile and immediately make it active. */
  async createAndActivate(name) {
    const { profile } = await profilesApi.create(name);
    this.profiles = [...this.profiles, profile];
    await this.bootstrap(profile.id);
    return profile;
  }
  /** Switch to a different profile. */
  async switchTo(id) {
    await this.bootstrap(id);
  }
  /** Update settings in-store (after API call). */
  updateSettings(patch) {
    if (this.settings) {
      this.settings = { ...this.settings, ...patch };
    }
  }
  /** Delete a profile and reset if it was active. */
  async deleteProfile(id) {
    await profilesApi.delete(id);
    this.profiles = this.profiles.filter((p) => p.id !== id);
    clearProfile(id);
    if (this.active?.id === id) {
      this.active = null;
      this.settings = null;
      this.bootstrapDecks = [];
      reviewStore.clear();
      this.clearStored();
    }
  }
  /** Rename active profile. */
  async renameProfile(id, name) {
    const { profile } = await profilesApi.rename(id, name);
    this.profiles = this.profiles.map((p) => p.id === id ? profile : p);
    if (this.active?.id === id) {
      this.active = profile;
    }
  }
}
const profileStore = new ProfileStore();
export {
  profileStore as p
};
