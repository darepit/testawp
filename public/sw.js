const manifestUrl = new URL(self.location).searchParams.get("manifestUrl");
// Create window object for the manifest to set __remixManifest on
let window = {};
self.importScripts(manifestUrl);

const manifest = window.__remixManifest;
const cachePrefix = "manifest-";
const currentCache = cachePrefix + manifest.version;

self.addEventListener("install", (event) => {
  const manifestUrls = parseUrlsFromManifest(manifest);
  event.waitUntil(
    caches
      .open(currentCache)
      .then((cache) => {
        return cache.addAll(manifestUrls);
      })
      .then(() => {
        console.log(
          "Caching %s assets from manifest %s",
          manifestUrls.length,
          manifest.version
        );
      })
  );
});

self.addEventListener("activate", function (event) {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            // Return true if you want to remove this cache, but remember that caches are
            // shared across the whole origin
            return (
              cacheName.startsWith(cachePrefix) && cacheName !== currentCache
            );
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  // Ignore non-GET requests
  if (event.request.method.toUpperCase() !== "GET") {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("Cache hit for " + event.request.url);
        return response;
      } else {
        console.log("Cache miss for " + event.request.url);
        return fetch(event.request);
      }
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    data: data.data,
  });
});

// Parse URLs from imported manifest ---------------------------------
function parseUrlsFromManifest(manifest) {
  const modules = new Set();
  const chunks = new Set();
  const moduleObjects = [manifest.entry, ...Object.values(manifest.routes)];
  moduleObjects.forEach((obj) => {
    modules.add(obj.module);
    obj.imports?.forEach((chunk) => {
      chunks.add(chunk);
    });
  });
  return [...modules, ...chunks, manifest.url];
}

addEventListener("notificationclick", (event) => {
  self.clients.openWindow(event.notification.data.url);
});
