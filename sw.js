// Reiseplaner Service Worker – App-Dateien offline verfügbar, Firebase läuft weiter direkt
const CACHE = "reiseplaner-v2";
const FILES = ["/reiseplaner/", "/reiseplaner/index.html", "/reiseplaner/manifest.json", "/reiseplaner/icon-192.png", "/reiseplaner/icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => fetch(f).then(r => { if (r.ok) return c.put(f, r); }).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;          // Firebase/CDN nicht anfassen
  // Netz zuerst (damit Updates sofort ankommen), Cache nur als Fallback – und nur gute Antworten merken
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return r;
    }).catch(() => caches.match(e.request).then(m => m || (e.request.mode === "navigate" ? caches.match("/reiseplaner/index.html") : undefined)))
  );
});
