/**
 * Zeigt eine Benachrichtigung über Synchronisierungsstatus an
 * @param {string} message - Anzuzeigende Nachricht
 * @param {boolean} isError - Ob es sich um einen Fehler handelt
 */
function showSyncNotification(message, isError = false) {
  // Bestehende Benachrichtigung suchen oder erstellen
  let notificationElement = document.getElementById('sync-notification');
  
  if (!notificationElement) {
    notificationElement = document.createElement('div');
    notificationElement.id = 'sync-notification';
    notificationElement.classList.add('sync-notification');
    document.body.appendChild(notificationElement);
    
    // Schließen-Button hinzufügen
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => {
      notificationElement.classList.add('hidden');
    });
    
    notificationElement.appendChild(closeButton);
    
    // Nachrichtencontainer
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('notification-message');
    notificationElement.appendChild(messageContainer);
  }
  
  // Nachrichtencontainer aktualisieren
  const messageContainer = notificationElement.querySelector('.notification-message');
  messageContainer.textContent = message;
  
  // Klassen aktualisieren
  notificationElement.classList.remove('hidden', 'error', 'success');
  notificationElement.classList.add(isError ? 'error' : 'success');
  
  // Nach einiger Zeit ausblenden
  setTimeout(() => {
    notificationElement.classList.add('hidden');
  }, isError ? 10000 : 5000);
}

/**
 * Verarbeitet die Queue mit gespeicherten DSGVO-Anfragen
 */
function processQueue() {
  try {
    const queue = JSON.parse(localStorage.getItem('dsgvoRequestQueue') || '[]');
    if (queue.length === 0) return;
    
    console.log(`${queue.length} Anfragen aus der Queue verarbeiten`);
    
    // Service Worker zur Synchronisierung auffordern
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_DSGVO_REQUESTS'
      });
    } else {
      // Fallback für direkte Verarbeitung
      queue.forEach(async (request) => {
        try {
          // API-Anfrage simulieren (in Produktionsumgebung echter API-Aufruf)
          await new Promise(resolve => setTimeout(resolve, 500));
          console.log('Anfrage verarbeitet:', request.id);
        } catch (error) {
          console.error('Fehler bei Anfrage:', error);
        }
      });
      
      // Queue leeren nach erfolgreicher Verarbeitung
      localStorage.setItem('dsgvoRequestQueue', '[]');
    }
  } catch (error) {
    console.error('Fehler beim Verarbeiten der Queue:', error);
    showSyncNotification('Fehler beim Verarbeiten der Queue: ' + error.message, true);
  }
}
