// Service Worker für Datenschutzerklärung - Optimierte Version
const CACHE_NAME = 'privacy-policy-cache-v2';
const STATIC_CACHE_NAME = 'privacy-static-cache-v2';
const DYNAMIC_CACHE_NAME = 'privacy-dynamic-cache-v2';

// Assets nach Priorität gruppieren
const CRITICAL_RESOURCES = [
  '/privacy-policy.html',
  '/assets/css/privacy-policy.css',
  '/assets/css/styles.css',
  '/assets/css/footer.css',
  '/assets/js/privacy-policy-optimized.js',
  '/offline.html'
];

const SECONDARY_RESOURCES = [
  '/assets/js/modules/privacy-search.js',
  '/assets/js/modules/privacy-ui.js',
  '/assets/js/modules/privacy-cookies.js',
  'https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css',
  '/assets/img/Background_Index.png'
];

const RESOURCE_HINTS = [
  '/assets/css/privacy-policy-print.css',
  '/assets/js/nav.js',
  '/assets/js/footer.js',
  '/index.html',
  '/about.html',
  '/terms-of-service.html'
];

// Verbesserte Installation: Ressourcen in separaten Caches nach Priorität speichern
self.addEventListener('install', event => {
  console.log('Service Worker wird installiert...');
  
  // Prioritätsbasiertes Caching mit Promise.all für parallele Verarbeitung
  event.waitUntil(
    Promise.all([
      // Kritische Ressourcen sofort cachen
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Kritische Ressourcen werden gecached');
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      
      // Sekundäre Ressourcen cachen
      caches.open(CACHE_NAME).then(cache => {
        console.log('Sekundäre Ressourcen werden gecached');
        return cache.addAll(SECONDARY_RESOURCES);
      }),
      
      // Ressourcen-Hints vorausladen, wenn möglich
      caches.open(DYNAMIC_CACHE_NAME).then(cache => {
        console.log('Zusätzliche Ressourcen werden vorgeladen');
        // Wir ignorieren Fehler beim Vorladen, um die Installation nicht zu blockieren
        return Promise.allSettled(
          RESOURCE_HINTS.map(url => 
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response);
                }
                return Promise.resolve();
              })
              .catch(() => Promise.resolve())
          )
        );
      })
    ])
    .then(() => self.skipWaiting())
    .catch(error => {
      console.error('Cache-Installation fehlgeschlagen:', error);
      // Trotz Fehler fortfahren, damit der Service Worker funktioniert
      return self.skipWaiting();
    })
  );
});

// Verbesserte Aktivierung: Alte Caches intelligent bereinigen
self.addEventListener('activate', event => {
  console.log('Service Worker wird aktiviert...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Nur Caches löschen, die zu unserer App gehören und veraltet sind
          return (cacheName.startsWith('privacy-') || cacheName.startsWith('static-')) && 
                 !([CACHE_NAME, STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME].includes(cacheName));
        }).map(cacheName => {
          console.log('Lösche alten Cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => {
      // Kontrolle über alle Clients übernehmen, ohne Neuladen zu erzwingen
      return self.clients.claim();
    })
    .then(() => {
      // Hintergrund-Synchronisierung für neue Ressourcen registrieren
      if ('sync' in self.registration) {
        return self.registration.sync.register('update-caches');
      }
    })
  );
});

// Optimierte Strategie: Stale-While-Revalidate mit Prioritätsstufen
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Nur GET-Anfragen behandeln
  if (request.method !== 'GET') return;
  
  // API-Anfragen nicht cachen
  if (request.url.includes('/api/')) return;
  
  // URLs von CDNs und externen Ressourcen gesondert behandeln
  const isExternal = request.url.includes('cdn.jsdelivr.net') || 
                     request.url.includes('fonts.googleapis.com') ||
                     request.url.includes('cdnjs.cloudflare.com');
  
  // HTML-Anfragen (Navigationsziel)
  if (request.headers.get('Accept').includes('text/html')) {
    event.respondWith(
      // Netzwerk-Anfrage mit Timeout
      timeoutPromise(
        fetch(request)
          .then(response => {
            // Kopie der Antwort im Cache speichern
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(error => {
            console.log('Netzwerkfehler, versuche Cache:', error);
            return caches.match(request)
              .then(cachedResponse => {
                return cachedResponse || caches.match('/offline.html');
              });
          }),
        3000 // 3 Sekunden Timeout
      )
      // Wenn das Timeout erreicht wurde, vom Cache bedienen
      .catch(() => {
        console.log('Netzwerk-Timeout, versuche Cache');
        return caches.match(request)
          .then(cachedResponse => {
            return cachedResponse || caches.match('/offline.html');
          });
      })
    );
    return;
  }
  
  // CSS und JavaScript (kritische Assets)
  if (request.url.endsWith('.css') || request.url.endsWith('.js')) {
    event.respondWith(
      // Cache-First Strategie für schnellere Performance
      caches.match(request)
        .then(cachedResponse => {
          // Cache-Hit: Nutze gecachte Version und aktualisiere im Hintergrund
          if (cachedResponse) {
            // Im Hintergrund aktualisieren
            fetch(request)
              .then(networkResponse => {
                if (networkResponse.ok) {
                  caches.open(STATIC_CACHE_NAME)
                    .then(cache => cache.put(request, networkResponse));
                }
              })
              .catch(() => {});
            
            return cachedResponse;
          }
          
          // Cache-Miss: Vom Netzwerk laden und cachen
          return fetch(request)
            .then(networkResponse => {
              const responseClone = networkResponse.clone();
              caches.open(STATIC_CACHE_NAME)
                .then(cache => cache.put(request, responseClone));
              
              return networkResponse;
            })
            .catch(error => {
              // Fallback für JavaScript/CSS
              console.error('Fehler beim Laden von CSS/JS:', error);
              // Kein visueller Fallback für CSS/JS möglich
              return new Response('/* Ressource nicht verfügbar */', {
                headers: { 'Content-Type': request.url.endsWith('.css') ? 'text/css' : 'application/javascript' }
              });
            });
        })
    );
    return;
  }
  
  // Bilder und andere Assets (können verzögert geladen werden)
  if (request.url.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/)) {
    event.respondWith(
      // Stale-While-Revalidate für Bilder
      caches.match(request)
        .then(cachedResponse => {
          // Parallele Netzwerkanfrage
          const fetchPromise = fetch(request)
            .then(networkResponse => {
              // Neues Ergebnis im Cache speichern
              if (networkResponse.ok) {
                caches.open(DYNAMIC_CACHE_NAME)
                  .then(cache => cache.put(request, networkResponse.clone()));
              }
              return networkResponse;
            })
            .catch(() => {
              // Wenn das Bild nicht geladen werden kann, einen Platzhalter zurückgeben
              if (request.url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/)) {
                return caches.match('/assets/img/placeholder.svg')
                  .catch(() => {
                    // Wenn kein Platzhalter existiert, einen einfachen transparenten Platzhalter zurückgeben
                    return new Response(
                      'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                      { headers: { 'Content-Type': 'image/gif' } }
                    );
                  });
              }
              throw new Error('Network and cache failed');
            });
          
          // Cache-First: Wenn etwas im Cache ist, das zurückgeben und im Hintergrund aktualisieren
          return cachedResponse || fetchPromise;
        })
    );
    return;
  }
  
  // Externe Ressourcen (CDNs)
  if (isExternal) {
    event.respondWith(
      // Cache-First für externe Ressourcen, da diese sich selten ändern
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then(networkResponse => {
              // Cache nur, wenn die Antwort gültig ist
              if (networkResponse.ok) {
                const responseClone = networkResponse.clone();
                caches.open(DYNAMIC_CACHE_NAME)
                  .then(cache => {
                    // Für externe Ressourcen ein längeres Cache-Timeout setzen
                    const headers = new Headers(responseClone.headers);
                    headers.append('sw-fetched-on', new Date().toISOString());
                    headers.append('sw-cache-timeout', '604800'); // 7 Tage
                    
                    return responseClone.blob().then(body => {
                      return cache.put(request, new Response(body, {
                        status: responseClone.status,
                        statusText: responseClone.statusText,
                        headers: headers
                      }));
                    });
                  });
              }
              return networkResponse;
            })
            .catch(error => {
              console.error('Fehler beim Laden externer Ressource:', error);
              return new Response('/* Externe Ressource nicht verfügbar */', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
    return;
  }
  
  // Standard-Strategie für alle anderen Anfragen: Network-First mit Cache-Fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        // Nur erfolgreiche Antworten cachen
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // Bei Netzwerkfehlern aus dem Cache bedienen
        return caches.match(request)
          .then(cachedResponse => {
            return cachedResponse || new Response('Resource nicht verfügbar', {
              status: 404,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Daten im Cache aktualisieren, wenn online
self.addEventListener('sync', event => {
  console.log('Sync-Event ausgelöst:', event.tag);
  
  if (event.tag === 'update-caches' || event.tag === 'update-privacy-cache') {
    event.waitUntil(
      // Kritische Ressourcen aktualisieren
      Promise.all(
        CRITICAL_RESOURCES.map(url => 
          fetch(url)
            .then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                return caches.open(STATIC_CACHE_NAME)
                  .then(cache => cache.put(url, responseClone));
              }
              return Promise.resolve();
            })
            .catch(() => Promise.resolve())
        )
      )
      .then(() => {
        // Benachrichtigung anzeigen, dass die Daten aktualisiert wurden
        return self.registration.showNotification('Datenschutzerklärung aktualisiert', {
          body: 'Die neueste Version der Datenschutzerklärung wurde für die Offline-Nutzung gespeichert.',
          icon: '/assets/img/Icons/Logo_icon.png',
          badge: '/assets/img/Icons/badge.png',
          tag: 'cache-update',
          requireInteraction: false
        });
      })
    );
  }
});

// Push-Benachrichtigungen für wichtige Datenschutz-Updates
self.addEventListener('push', event => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    if (data.type === 'privacy-update') {
      const options = {
        body: data.message || 'Unsere Datenschutzerklärung wurde aktualisiert. Bitte lesen Sie die neuesten Änderungen.',
        icon: '/assets/img/Icons/Logo_icon.png',
        badge: '/assets/img/Icons/badge.png',
        data: {
          url: '/privacy-policy.html'
        },
        tag: 'privacy-update',  // Verhindert doppelte Benachrichtigungen
        requireInteraction: true,  // Benachrichtigung bleibt bestehen, bis der Nutzer interagiert
        actions: [
          {
            action: 'view',
            title: 'Jetzt ansehen'
          },
          {
            action: 'later',
            title: 'Später'
          }
        ]
      };
      
      event.waitUntil(
        self.registration.showNotification('Datenschutz-Update', options)
      );
    }
  } catch (error) {
    console.error('Fehler bei Push-Benachrichtigung:', error);
    
    // Fallback für ungültige JSON-Daten
    event.waitUntil(
      self.registration.showNotification('Neue Benachrichtigung', {
        body: 'Es gibt eine neue Information zu unserer Datenschutzerklärung.',
        icon: '/assets/img/Icons/Logo_icon.png',
        badge: '/assets/img/Icons/badge.png'
      })
    );
  }
});

// Klick auf eine Benachrichtigung
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Aktion basierend auf dem geklickten Button
  if (event.action === 'view' || event.action === '') {
    event.waitUntil(
      clients.matchAll({type: 'window'})
        .then(clientList => {
          // Wenn bereits ein Tab mit der Seite offen ist, fokussieren
          for (const client of clientList) {
            if (client.url.includes('/privacy-policy.html') && 'focus' in client) {
              return client.focus();
            }
          }
          // Ansonsten neuen Tab öffnen
          if (clients.openWindow) {
            const url = event.notification.data?.url || '/privacy-policy.html';
            return clients.openWindow(url);
          }
        })
    );
  }
});

// Periodische Hintergrundaktualisierung, falls vom Browser unterstützt
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-privacy-content') {
    event.waitUntil(
      fetch('/privacy-policy.html?v=' + Date.now())
        .then(response => {
          if (response.ok) {
            const responseClone = response.clone();
            return caches.open(CACHE_NAME)
              .then(cache => cache.put('/privacy-policy.html', responseClone));
          }
        })
        .catch(error => {
          console.error('Fehler bei periodischer Aktualisierung:', error);
        })
    );
  }
});

// Offline-Tracking: Speichert fehlgeschlagene Anfragen, um sie später zu senden
const offlineQueue = [];

// Bei Fehlschlag einer Analyse-Anfrage, zur Queue hinzufügen
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/analytics') && !navigator.onLine) {
    event.respondWith(
      // Anfrage abfangen und für später speichern
      event.request.clone().text().then(payload => {
        offlineQueue.push({
          url: event.request.url,
          method: event.request.method,
          payload: payload,
          timestamp: Date.now()
        });
        
        // Erfolgreiche leere Antwort, damit die App weiterlaufen kann
        return new Response(JSON.stringify({ offline: true, queued: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
  }
});

// Wenn wieder online, versuche die gespeicherten Anfragen zu senden
self.addEventListener('sync', event => {
  if (event.tag === 'sync-analytics-data') {
    event.waitUntil(
      Promise.all(offlineQueue.map(item => {
        return fetch(item.url, {
          method: item.method,
          body: item.payload,
          headers: { 'Content-Type': 'application/json' }
        })
        .then(() => {
          // Erfolgreich gesendete Anfragen aus der Queue entfernen
          const index = offlineQueue.indexOf(item);
          if (index > -1) offlineQueue.splice(index, 1);
        });
      }))
    );
  }
});

// Hilfsfunktion: Promise mit Timeout
function timeoutPromise(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    // Timer für Timeout setzen
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout exceeded'));
    }, timeoutMs);
    
    // Promise ausführen und Timer löschen
    promise.then(
      result => {
        clearTimeout(timeoutId);
        resolve(result);
      },
      error => {
        clearTimeout(timeoutId);
        reject(error);
      }
    );
  });
}

// Cache-Größenbegrenzung
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // Lösche die ältesten Einträge
    const keysToDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
    console.log(`Cache ${cacheName} bereinigt: ${keysToDelete.length} Einträge entfernt`);
  }
}

// Regelmäßige Cache-Größenbegrenzung (alle 24 Stunden)
setInterval(() => {
  trimCache(DYNAMIC_CACHE_NAME, 100);  // Maximal 100 dynamische Ressourcen
}, 24 * 60 * 60 * 1000);

// Informationen über den Service Worker in der Konsole
console.log('Privacy Policy Service Worker v2 geladen');
console.log('Cache-Strategie: Stale-While-Revalidate mit Prioritätsstufen');
console.log('Features: Offline-Unterstützung, Push-Benachrichtigungen, Background Sync');
