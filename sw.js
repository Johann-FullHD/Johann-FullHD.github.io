/* Enhanced Service Worker with Background Sync Support */
const SW_VERSION = 'v8';
const CACHE_STATIC = `static-${SW_VERSION}`;
const CACHE_RUNTIME = `runtime-${SW_VERSION}`;
const DSGVO_STORE = 'dsgvo-requests';
const PRECACHE = [
  '/',
  '/index.html',
  '/gallerie.html',
  '/privacy-policy.html',
  '/offline.html',
  '/sitemap.xml',
  '/manifest.webmanifest',
  '/assets/css/styles.css',
  '/assets/css/privacy-policy.css',
  '/assets/css/privacy-form.css',
  '/assets/js/nav.js',
  '/assets/js/gallery.js',
  '/assets/js/privacy-policy.js',
  '/assets/img/Background_Index.png'
];

// Verbesserte Installation mit Navigation Preload
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_STATIC).then(c=>c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    Promise.all([
      // Alte Caches löschen
      caches.keys().then(keys=>Promise.all(keys.filter(k=>![CACHE_STATIC,CACHE_RUNTIME].includes(k)).map(k=>caches.delete(k)))),
      // Navigation Preload aktivieren falls unterstützt
      self.registration.navigationPreload?.enable(),
      // Clients übernehmen
      self.clients.claim()
    ])
  );
});

// Request-Klassifizierung
function isHTML(req){return req.destination==='document'||req.headers.get('accept')?.includes('text/html');}
function isAPI(req){return req.url.includes('/api/') || req.url.includes('?api=');}

// Verbesserte Cache-Strategien
async function networkFirst(req, preloadResponse){
  try {
    // Navigation Preload nutzen falls verfügbar
    const preloaded = await preloadResponse;
    if (preloaded) {
      const cache = await caches.open(CACHE_RUNTIME);
      cache.put(req, preloaded.clone());
      return preloaded;
    }

    const net = await fetch(req);
    const cache = await caches.open(CACHE_RUNTIME);
    cache.put(req, net.clone());
    return net;
  } catch(e) {
    const cache = await caches.match(req);
    return cache || await caches.match('/offline.html');
  }
}

async function staleWhileRevalidate(req){
  const cache = await caches.open(CACHE_RUNTIME);
  const cached = await cache.match(req);
  
  // Cache-Control Header auswerten für besseres Caching
  const fetchPromise = fetch(req).then(res => {
    // Only cache successful responses
    if (res && res.ok) {
      // Stale-While-Revalidate Header analysieren
      const cacheControl = res.headers.get('Cache-Control');
      if (cacheControl && !cacheControl.includes('no-store')) {
        cache.put(req, res.clone());
      }
    }
    return res;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  
  // Nur GET-Anfragen cachen
  if (req.method !== 'GET') return;
  
  // DSGVO-API-Anfragen abfangen und in Queue speichern, wenn offline
  if (req.method === 'POST' && req.url.includes('/api/dsgvo-request')) {
    e.respondWith(
      fetch(req.clone())
        .catch(err => {
          return req.clone().json()
            .then(data => {
              // In IndexedDB speichern
              return saveToIndexedDB(DSGVO_STORE, data)
                .then(() => {
                  // Background Sync registrieren
                  return self.registration.sync.register('sync-dsgvo-requests')
                    .then(() => {
                      return new Response(JSON.stringify({
                        success: true,
                        queued: true,
                        message: 'Anfrage wurde für spätere Synchronisierung gespeichert'
                      }), {
                        headers: { 'Content-Type': 'application/json' }
                      });
                    });
                });
            })
            .catch(err => {
              return new Response(JSON.stringify({
                success: false,
                message: 'Konnte Anfrage nicht speichern'
              }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503
              });
            });
        })
    );
    return;
  }
  
  // Navigation Preload nutzen
  const preloadResponse = e.preloadResponse;
  
  // HTML-Dokumente mit Network-First laden
  if (isHTML(req)) {
    e.respondWith(networkFirst(req, preloadResponse));
    return;
  }
  
  // API-Anfragen nicht cachen
  if (isAPI(req)) {
    e.respondWith(fetch(req).catch(() => new Response(JSON.stringify({error: 'offline'}), {
      headers: {'Content-Type': 'application/json'}
    })));
    return;
  }
  
  // Alle anderen Ressourcen mit Stale-While-Revalidate laden
  e.respondWith(staleWhileRevalidate(req));
});

// Verbesserte Messaging
self.addEventListener('message', event => { 
  const data = event.data;
  if (!data) return;
  
  // Cache-Status prüfen
  if (data.type === 'CHECK_CACHED'){ 
    caches.match(data.url).then(r => { 
      event.source?.postMessage({
        type: 'IS_CACHED',
        url: data.url, 
        isCached: !!r,
        timestamp: Date.now()
      }); 
    }); 
  }
  
  // DSGVO-Anfragen synchronisieren
  if (data.type === 'SYNC_DSGVO_REQUESTS') {
    notifyClients('SYNC_DSGVO_REQUESTS');
  }
  
  // DSGVO-Anfrage manuell hinzufügen
  if (data.type === 'ADD_DSGVO_REQUEST' && data.request) {
    saveToIndexedDB(DSGVO_STORE, data.request)
      .then(() => {
        self.registration.sync.register('sync-dsgvo-requests');
        event.source?.postMessage({
          type: 'DSGVO_REQUEST_QUEUED',
          success: true,
          id: data.request.id,
          timestamp: Date.now()
        });
      })
      .catch(err => {
        event.source?.postMessage({
          type: 'DSGVO_REQUEST_QUEUED',
          success: false,
          error: err.message,
          timestamp: Date.now()
        });
      });
  }
});

/* Background Sync für DSGVO-Anfragen */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-dsgvo-requests') {
    event.waitUntil(syncDsgvoRequests());
  }
});

// IndexedDB-Hilfsfunktionen
function openDsgvoDatabase() {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('dsgvo-queue-db', 1);
    
    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Sicherstellen, dass der ObjectStore existiert
      if (!db.objectStoreNames.contains(DSGVO_STORE)) {
        db.createObjectStore(DSGVO_STORE, { keyPath: 'id' });
      }
    };
    
    dbRequest.onsuccess = () => resolve(dbRequest.result);
    dbRequest.onerror = () => reject(dbRequest.error);
  });
}

function saveToIndexedDB(storeName, data) {
  return openDsgvoDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  });
}

function getAllFromIndexedDB(storeName) {
  return openDsgvoDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
}

function deleteFromIndexedDB(storeName, id) {
  return openDsgvoDatabase().then(db => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
}

async function syncDsgvoRequests() {
  try {
    // Alle gespeicherten Anfragen abrufen
    const requests = await getAllFromIndexedDB(DSGVO_STORE);
    if (!requests || requests.length === 0) {
      return true;  // Nichts zu synchronisieren
    }
    
    // Alle Clients benachrichtigen, dass synchronisiert wird
    notifyClients('SYNC_DSGVO_REQUESTS_STARTED', { count: requests.length });
    
    // Jeden Eintrag verarbeiten
    let syncedCount = 0;
    const failedRequests = [];
    
    for (const request of requests) {
      try {
        // API-Anfrage zum Senden der DSGVO-Anfrage
        const response = await fetch('/api/dsgvo-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        });
        
        if (response.ok) {
          // Erfolgreiche Anfrage aus Queue entfernen
          await deleteFromIndexedDB(DSGVO_STORE, request.id);
          syncedCount++;
        } else {
          failedRequests.push({
            request,
            error: `HTTP ${response.status}: ${response.statusText}`
          });
        }
      } catch (err) {
        failedRequests.push({
          request,
          error: err.message
        });
      }
    }
    
    // Clients über den Abschluss informieren
    notifyClients('SYNC_DSGVO_REQUESTS_COMPLETED', {
      totalCount: requests.length,
      syncedCount,
      failedCount: failedRequests.length
    });
    
    return true;
  } catch (err) {
    console.error('Fehler bei der DSGVO-Anfragen-Synchronisierung:', err);
    
    // Clients über den Fehler informieren
    notifyClients('SYNC_DSGVO_REQUESTS_ERROR', {
      error: err.message
    });
    
    return false;
  }
}

async function notifyClients(type, data = {}) {
  const allClients = await clients.matchAll({ includeUncontrolled: true });
  
  allClients.forEach(client => {
    client.postMessage({
      type,
      ...data,
      timestamp: Date.now()
    });
  });
}

/* Push & Notification Support */
self.addEventListener('push', evt => { 
  if(!evt.data) return; 
  
  try {
    const d = evt.data.json(); 
    evt.waitUntil(
      self.registration.showNotification(d.title || 'Update', { 
        body: d.body || 'Neue Inhalte verfügbar',
        icon: '/assets/img/Icons/Logo_icon.png',
        badge: '/assets/img/Icons/Logo_icon_small.png',
        data: {url: d.url || '/'},
        vibrate: [100, 50, 100],
        actions: [
          {action: 'open', title: 'Öffnen'},
          {action: 'close', title: 'Schließen'}
        ]
      })
    ); 
  } catch(e) {
    console.error('Push notification error', e);
  }
});

self.addEventListener('notificationclick', evt => { 
  evt.notification.close(); 
  
  // Auf Aktionen reagieren
  if (evt.action === 'close') return;
  
  const url = evt.notification.data?.url || '/';
  
  evt.waitUntil(
    clients.matchAll({type: 'window'}).then(list => { 
      // Existierendes Fenster fokussieren, falls vorhanden
      for(const c of list) { 
        if(c.url === url && 'focus' in c) return c.focus(); 
      }
      // Sonst neues Fenster öffnen 
      return clients.openWindow(url); 
    })
  ); 
});
