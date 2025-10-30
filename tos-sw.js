// Service Worker für Nutzungsbedingungen
const TOS_CACHE = 'tos-cache-v1';
const STATIC_CACHE = 'static-cache-v3';
const DYNAMIC_CACHE = 'dynamic-cache-v2';

// Kritische Assets, die sofort beim Installieren gecacht werden
const CRITICAL_ASSETS = [
  '/terms-of-service.html',
  '/offline.html',
  '/assets/css/styles.css',
  '/assets/css/footer.css',
  '/assets/js/nav.js',
  '/assets/js/footer.js',
  '/assets/img/Icons/Logo_footer_transparent.png',
  'https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css'
];

// Cache-Strategie: Netzwerk zuerst, bei Fehler aus Cache
const NETWORK_FIRST_STRATEGY = async (request) => {
  try {
    // Versuche zuerst vom Netzwerk zu laden
    const networkResponse = await fetch(request);
    
    // Cache aktualisieren
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Bei Netzwerkfehler aus dem Cache laden
    const cachedResponse = await caches.match(request);
    
    // Wenn im Cache vorhanden, diesen zurückgeben
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Bei Dokumentanfragen die Offline-Seite anzeigen
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    // Für andere Ressourcen einen Fehler zurückgeben
    return new Response('Ressource nicht verfügbar', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Cache-Strategie: Cache zuerst, bei Fehler vom Netzwerk und Cache aktualisieren
const CACHE_FIRST_STRATEGY = async (request) => {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Im Hintergrund aktualisieren
    fetch(request)
      .then(response => {
        caches.open(DYNAMIC_CACHE)
          .then(cache => cache.put(request, response));
      })
      .catch(() => {});
    
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    return new Response('Ressource nicht verfügbar', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Beim Installieren kritische Assets cachen
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(TOS_CACHE)
      .then(cache => cache.addAll(CRITICAL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Beim Aktivieren alte Caches löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (
            cacheName !== TOS_CACHE && 
            cacheName !== STATIC_CACHE && 
            cacheName !== DYNAMIC_CACHE
          ) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch-Event-Handler
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Strategie basierend auf Ressourcentyp auswählen
  if (request.method !== 'GET') {
    return; // Nur GET-Anfragen cachen
  }
  
  // Terms of Service Seite oder kritische Assets
  if (url.pathname === '/terms-of-service.html' || 
      CRITICAL_ASSETS.includes(url.pathname)) {
    event.respondWith(CACHE_FIRST_STRATEGY(request));
    return;
  }
  
  // Für Bilder Cache-First-Strategie
  if (request.destination === 'image') {
    event.respondWith(CACHE_FIRST_STRATEGY(request));
    return;
  }
  
  // Für alle anderen Ressourcen Netzwerk-First-Strategie
  event.respondWith(NETWORK_FIRST_STRATEGY(request));
});

// Push-Benachrichtigungen verarbeiten
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'Neue Nutzungsbedingungen verfügbar',
    icon: '/assets/img/Icons/Logo_icon_transparent_v2.ico',
    badge: '/assets/img/Icons/Logo_icon_transparent_v2.ico',
    data: {
      url: data.url || '/terms-of-service.html'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Nutzungsbedingungen Update', 
      options
    )
  );
});

// Klick auf Benachrichtigung verarbeiten
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  const urlToOpen = event.notification.data && 
                    event.notification.data.url ? 
                    event.notification.data.url : 
                    '/terms-of-service.html';
  
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then(clientList => {
        // Wenn bereits ein Fenster geöffnet ist, fokussieren und navigieren
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Ansonsten neues Fenster öffnen
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
