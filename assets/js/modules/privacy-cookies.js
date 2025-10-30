// Modul für Cookie-Scanner und Verwaltung
export const setupCookieScannerModule = () => {
  // Cookie-Scanner
  scanCookies();
  
  // Cookie-Einstellungen im Footer einrichten
  setupCookieSettings();
};

// Cookie-Scanner
function scanCookies() {
  const table = document.getElementById('cookie-scanner-table');
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  // Cookies von Drittanbietern können nicht direkt gescannt werden
  // Wir zeigen nur die First-Party-Cookies, die wir lesen können
  const cookies = document.cookie.split(';');
  
  // Performance-Optimierung: DocumentFragment verwenden
  const fragment = document.createDocumentFragment();
  
  // Erste Zeile ist bereits vorhanden und enthält die cookiePrefsV2
  let hasPrefsRow = false;
  
  // Cookies in Batches verarbeiten für bessere Performance
  cookies.forEach((cookie, index) => {
    if (!cookie.trim()) return;
    
    const parts = cookie.split('=');
    const name = parts[0].trim();
    
    // Prüfen, ob cookiePrefsV2 bereits in der Tabelle ist
    if (name === 'cookiePrefsV2') {
      hasPrefsRow = true;
      return;
    }
    
    // Neue Zeile erstellen
    const row = document.createElement('tr');
    
    // Name
    const nameCell = document.createElement('td');
    nameCell.textContent = name;
    row.appendChild(nameCell);
    
    // Anbieter
    const providerCell = document.createElement('td');
    providerCell.textContent = window.location.hostname;
    row.appendChild(providerCell);
    
    // Zweck
    const purposeCell = document.createElement('td');
    
    // Cookie-Zweck basierend auf Namen erraten
    const purpose = guessCookiePurpose(name);
    purposeCell.textContent = purpose;
    
    row.appendChild(purposeCell);
    
    // Speicherdauer
    const durationCell = document.createElement('td');
    const duration = guessCookieDuration(name);
    durationCell.textContent = duration;
    row.appendChild(durationCell);
    
    // Partitioniert
    const partitionedCell = document.createElement('td');
    
    // Prüfen, ob der Cookie partitioniert ist
    const isPartitioned = checkIfPartitioned(name);
    partitionedCell.textContent = isPartitioned ? 'Ja' : 'Nein';
    
    row.appendChild(partitionedCell);
    
    fragment.appendChild(row);
  });
  
  // Wenn cookiePrefsV2 noch nicht in der Tabelle ist, fügen wir es hinzu
  if (!hasPrefsRow && document.cookie.includes('cookiePrefsV2')) {
    const row = document.createElement('tr');
    
    const nameCell = document.createElement('td');
    nameCell.textContent = 'cookiePrefsV2';
    row.appendChild(nameCell);
    
    const providerCell = document.createElement('td');
    providerCell.textContent = window.location.hostname;
    row.appendChild(providerCell);
    
    const purposeCell = document.createElement('td');
    purposeCell.textContent = 'Speichert Ihre Cookie-Einstellungen';
    row.appendChild(purposeCell);
    
    const durationCell = document.createElement('td');
    durationCell.textContent = '1 Jahr';
    row.appendChild(durationCell);
    
    const partitionedCell = document.createElement('td');
    partitionedCell.textContent = 'Nein';
    row.appendChild(partitionedCell);
    
    fragment.appendChild(row);
  }
  
  // Alles auf einmal zum DOM hinzufügen
  tbody.appendChild(fragment);
}

// Cookie-Zweck anhand des Namens erraten
function guessCookiePurpose(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('consent') || lowerName.includes('gdpr') || lowerName.includes('cookie')) {
    return 'Cookie-Einwilligung';
  } else if (lowerName.includes('session')) {
    return 'Sitzungsverwaltung';
  } else if (lowerName.includes('auth') || lowerName.includes('login')) {
    return 'Authentifizierung';
  } else if (lowerName.includes('utm_') || lowerName.includes('gclid')) {
    return 'Marketing/Tracking';
  } else if (lowerName.includes('_ga') || lowerName.includes('analytics')) {
    return 'Analyse';
  } else if (lowerName.includes('lang') || lowerName.includes('locale')) {
    return 'Spracheinstellungen';
  } else if (lowerName.includes('theme') || lowerName.includes('mode')) {
    return 'Darstellungseinstellungen';
  } else if (lowerName.includes('font')) {
    return 'Schriftarteinstellungen';
  } else {
    return 'Website-Funktionalität';
  }
}

// Cookie-Dauer anhand des Namens schätzen
function guessCookieDuration(name) {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('session')) {
    return 'Sitzung';
  } else if (lowerName.includes('temp') || lowerName.includes('tmp')) {
    return 'Temporär';
  } else if (lowerName.includes('persist') || lowerName.includes('perm')) {
    return 'Dauerhaft';
  } else if (lowerName.includes('_ga')) {
    return '2 Jahre';
  } else if (lowerName.includes('consent') || lowerName.includes('prefs')) {
    return '1 Jahr';
  } else {
    return 'Variiert';
  }
}

// Prüft, ob ein Cookie partitioniert ist
function checkIfPartitioned(cookieName) {
  // Die Erkennung ist nicht perfekt, da es keine direkte API gibt
  // Wir prüfen, ob der Browser Partitioned Cookies unterstützt
  
  // Firefox: ab Version 109 (Januar 2023)
  const isFirefox = navigator.userAgent.includes('Firefox');
  const firefoxMatch = navigator.userAgent.match(/Firefox\/(\d+)/);
  const firefoxVersion = firefoxMatch ? parseInt(firefoxMatch[1], 10) : 0;
  
  // Chrome: ab Version 118 (Oktober 2023)
  const isChrome = navigator.userAgent.includes('Chrome') && !navigator.userAgent.includes('Edg');
  const chromeMatch = navigator.userAgent.match(/Chrome\/(\d+)/);
  const chromeVersion = chromeMatch ? parseInt(chromeMatch[1], 10) : 0;
  
  // Safari: ab Version 16.4 (März 2023)
  const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
  const safariMatch = navigator.userAgent.match(/Version\/(\d+\.\d+)/);
  const safariVersion = safariMatch ? parseFloat(safariMatch[1]) : 0;
  
  // Edge basiert auf Chromium, gleiche Versionen wie Chrome
  const isEdge = navigator.userAgent.includes('Edg');
  const edgeMatch = navigator.userAgent.match(/Edg\/(\d+)/);
  const edgeVersion = edgeMatch ? parseInt(edgeMatch[1], 10) : 0;
  
  const supportsPartitioning = (
    (isFirefox && firefoxVersion >= 109) ||
    (isChrome && chromeVersion >= 118) ||
    (isSafari && safariVersion >= 16.4) ||
    (isEdge && edgeVersion >= 118)
  );
  
  // Heuristik: Drittanbieter-Cookies oder Cookies mit speziellen Präfixen
  // könnten partitioniert sein
  const potentiallyPartitioned = cookieName.includes('_') || 
                                  cookieName.startsWith('_ga') || 
                                  cookieName.startsWith('_gid') ||
                                  cookieName.startsWith('_hj') ||
                                  cookieName.startsWith('_fb');
  
  return supportsPartitioning && potentiallyPartitioned;
}

// Cookie-Einstellungen im Footer einrichten
function setupCookieSettings() {
  // Event-Listener für Cookie-Einstellungen im Hauptbereich
  const settingsButtons = document.querySelectorAll('#cookie-settings-open, #cookie-settings-open-footer');
  const resetButtons = document.querySelectorAll('#cookie-settings-reset, #cookie-settings-reset-footer');
  
  settingsButtons.forEach(button => {
    button.addEventListener('click', function() {
      document.dispatchEvent(new CustomEvent('open-cookie-settings'));
    });
  });
  
  resetButtons.forEach(button => {
    button.addEventListener('click', function() {
      resetCookies();
    });
  });
}

// Cookies zurücksetzen
function resetCookies() {
  try {
    localStorage.removeItem('cookiePrefsV2');
    localStorage.removeItem('privacy-font-size');
    localStorage.removeItem('privacy-simplified');
    localStorage.removeItem('privacy-dark-mode');
    
    // Alle Cookies löschen
    document.cookie.split(';').forEach(function(c) {
      document.cookie = c.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    });
    
    // Feedback anzeigen
    alert('Alle Cookies wurden zurückgesetzt. Die Seite wird neu geladen.');
    
    // Seite neu laden
    window.location.reload();
  } catch (e) {
    console.error('Fehler beim Zurücksetzen der Cookies:', e);
    alert('Fehler beim Zurücksetzen der Cookies: ' + e.message);
  }
}
