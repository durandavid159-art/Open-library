const CACHE_NAME = "recomendador-lectura-v1";

const ARCHIVOS_PRINCIPALES = [
  "/index.html",
  "/pages/busqueda.html",
  "/pages/favoritos.html",
  "/pages/perfil.html",
  "/pages/cercadeti.html",
  "/Styles/index.css",
  "/Styles/busqueda.css",
  "/Styles/favoritos.css",
  "/Styles/perfil.css",
  "/Styles/cercadeti.css",
  "/Styles/inicio.css",
  "/javascript/app.js",
  "/javascript/api.js",
  "/javascript/libros.js",
  "/javascript/favoritos.js",
  "/javascript/perfil.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ARCHIVOS_PRINCIPALES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((nombres) =>
        Promise.all(
          nombres
            .filter((nombre) => nombre !== CACHE_NAME)
            .map((nombre) => caches.delete(nombre))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET") return;

  if (url.hostname.includes("openlibrary.org")) return;

  event.respondWith(
    caches.match(event.request).then((respuestaCache) => {
      if (respuestaCache) {
        return respuestaCache;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
        return new Response("", { status: 504, statusText: "Sin conexión" });
      });
    })
  );
});
