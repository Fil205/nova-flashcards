const BASE = "/api";
class ApiError extends Error {
  constructor(code, message, status) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "ApiError";
  }
}
async function request(method, path, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" }
  };
  if (body !== void 0) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(BASE + path, opts);
  if (res.status === 204) {
    return void 0;
  }
  const data = await res.json().catch(() => ({ error: { code: "PARSE_ERROR", message: "Invalid JSON response" } }));
  if (!res.ok) {
    const err = data?.error ?? {};
    throw new ApiError(err.code ?? "UNKNOWN", err.message ?? `HTTP ${res.status}`, res.status);
  }
  return data;
}
const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path)
};
function isNetworkError(err) {
  return !(err instanceof ApiError);
}
function friendlyError(err) {
  if (err instanceof ApiError) {
    if (err.status === 404) return err.message;
    if (err.status === 409) return err.message;
    if (err.status === 422) return "Dati non validi. Controlla i campi.";
    if (err.status === 400) return err.message;
    if (err.status >= 500) return err.message || "Errore del server. Riprova tra qualche secondo.";
    return err.message || "Errore del server.";
  }
  if (err instanceof Error) return err.message;
  return "Si è verificato un errore imprevisto.";
}
function streamPost(path, body, onDelta, onComplete, onError) {
  const controller = new AbortController();
  let cancelled = false;
  (async () => {
    try {
      const res = await fetch(BASE + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new ApiError(
          data?.error?.code ?? "ERROR",
          data?.error?.message ?? `HTTP ${res.status}`,
          res.status
        );
      }
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let buffer = "";
      while (true) {
        if (cancelled) break;
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (cancelled) break;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed?.error) {
              onError(typeof parsed.error === "string" ? parsed.error : "Errore del server.");
              cancelled = true;
              break;
            }
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            if (text) {
              fullText += text;
              onDelta(text);
            }
          } catch {
          }
        }
      }
      if (!cancelled && buffer.startsWith("data: ")) {
        const jsonStr = buffer.slice(6).trim();
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed?.error) {
              onError(typeof parsed.error === "string" ? parsed.error : "Errore del server.");
              cancelled = true;
            } else {
              const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
              if (text) {
                fullText += text;
                onDelta(text);
              }
            }
          } catch {
          }
        }
      }
      if (!cancelled) onComplete(fullText);
    } catch (err) {
      if (!cancelled) {
        onError(friendlyError(err));
      }
    }
  })();
  return () => {
    cancelled = true;
    controller.abort();
  };
}
const KEYS = {
  profiles: "fc.cache.profiles",
  bootstrap: (id) => `fc.cache.bootstrap.${id}`,
  deck: (id) => `fc.cache.deck.${id}`
};
function get(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
}
function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
  }
}
function getProfiles() {
  return get(KEYS.profiles);
}
function setProfiles(profiles) {
  set(KEYS.profiles, profiles);
}
function getBootstrap(profileId) {
  return get(KEYS.bootstrap(profileId));
}
function setBootstrap(profileId, data) {
  set(KEYS.bootstrap(profileId), data);
}
function getDeck(deckId) {
  return get(KEYS.deck(deckId));
}
function setDeck(deckId, deck) {
  set(KEYS.deck(deckId), deck);
}
function clearProfile(profileId) {
  const bootstrap = getBootstrap(profileId);
  if (bootstrap) {
    for (const d of bootstrap.decks) {
      remove(KEYS.deck(d.id));
    }
  }
  remove(KEYS.bootstrap(profileId));
}
function hasDeck(deckId) {
  return get(KEYS.deck(deckId)) !== null;
}
export {
  ApiError as A,
  api as a,
  setProfiles as b,
  setBootstrap as c,
  getBootstrap as d,
  clearProfile as e,
  friendlyError as f,
  getProfiles as g,
  setDeck as h,
  isNetworkError as i,
  getDeck as j,
  hasDeck as k,
  streamPost as s
};
