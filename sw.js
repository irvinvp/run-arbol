// Registrar el Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => {
      console.log("Service Worker registrado exitosamente");
    })
    .catch((error) => {
      console.error("Error al registrar el Service Worker:", error);
    });
}

// Instalar y activar el Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v2").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        // Agrega aquí todas las rutas de las imágenes que deseas almacenar en caché
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Eliminar cachés antiguas si es necesario
          })
          .map((cacheName) => {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

// Interceptar y manejar las solicitudes de imágenes
self.addEventListener("fetch", (event) => {
  if (event.request.destination === "image") {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((response) => {
          return caches.open("v2").then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
