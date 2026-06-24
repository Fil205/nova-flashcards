/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="webworker"/>
/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

declare let self: ServiceWorkerGlobalScope;

/**
 * Falschcard service worker.
 *
 * Strategy:
 *  - install  → precache the entire app shell (build assets + static files + index.html)
 *  - activate → delete stale caches from previous versions
 *  - fetch:
 *      /_app/immutable/*  → cache-first (content-hashed, safe forever)
 *      navigations        → network-first (always get the fresh index.html from the server
 *                           so it points to current chunk hashes; fall back to cache offline)
 *      other same-origin  → cache-first with network fill (icons, manifest, etc.)
 *      /api/*             → bypass (always live, never intercepted)
 *
 * The network-first strategy for navigations prevents the classic re-deploy black screen:
 * old index.html in cache → references deleted chunks → import fails → blank page.
 */

const CACHE = `falschcard-${version}`;

// Precache: hashed JS/CSS chunks + static files + the SPA shell itself.
// index.html must be explicit because adapter-static does not include it in `build` or `files`.
const PRECACHE_ASSETS = [...build, ...files, '/index.html'];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())    // activate immediately, no waiting
      .catch((err) => {
        // If precaching fails (offline during install), skip silently — the app
        // won't be cached but will still work online.
        console.warn('[SW] Precache failed, falling back to network:', err);
        return self.skipWaiting();
      })
  );
});

// ── Activate ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)  // delete all caches except the current version
            .map((key)  => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())      // take control of existing open tabs
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip: non-GET, cross-origin, or API calls (always go to the network)
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // ── Immutable hashed assets: cache-first ──────────────────────────────────
  // /_app/immutable/ files carry a content hash in their name → safe to serve
  // forever from cache; no stale-content risk.
  if (url.pathname.startsWith('/_app/immutable/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // ── Page navigations: network-first ──────────────────────────────────────
  // Always try to fetch a fresh index.html from the server so it references
  // the current chunk hashes.  This prevents the "black screen after re-deploy"
  // bug where the cached shell points to chunks that no longer exist on the server.
  // On network failure (offline) fall back to the cached shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            // Update the cached shell so offline fallback is always fresh.
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put('/index.html', clone));
          }
          return response;
        })
        .catch(() => {
          // Offline: serve the last-known-good shell from cache.
          return caches.match('/index.html') as Promise<Response>;
        })
    );
    return;
  }

  // ── Everything else (icons, manifest, fonts, …): cache-first ─────────────
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => Response.error());
    })
  );
});
