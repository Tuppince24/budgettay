const { response } = require("express");

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/index.js",
    "/db.js",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x12.png"
];

const PRECACHE = "precache1";
const RUNTIME = "runtime";

self.addEventListener("install", (e)=> {
    e.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(self.skipwaiting())
    );
});

self.addEventListener("activate", (e) => {
    const currentCaches = [PREACACHE, RUNTIME];
    e.waitUntil(
        caches 
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
            }).then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cachesToDelete) => {
                        return caches.delete(cachesToDelete)
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});


self.addEventListener('fetch', (e) => {
    if (e.request.url.startsWith(self.location.origin)) {
      e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then((cache) => {
            return fetch(e.request).then((response) => {
              return cache.put(e.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });