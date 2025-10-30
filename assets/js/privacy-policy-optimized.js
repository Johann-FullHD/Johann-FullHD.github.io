// Service Worker für Offline-Funktionalität
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/privacy-policy-sw.js').then(function(registration) {
      console.log('ServiceWorker registriert für den Umfang: ', registration.scope);
    }).catch(function(error) {
      console.log('ServiceWorker-Registrierung fehlgeschlagen: ', error);
    });
  });
}

// Code-Splitting durch dynamischen Import
const importModules = async () => {
  // Nur Kernfunktionen sofort laden, andere Module bei Bedarf
  const { setupSearchModule } = await import('./modules/privacy-search.js');
  const { setupUIModule } = await import('./modules/privacy-ui.js');
  
  // Module initialisieren
  setupSearchModule();
  setupUIModule();
  
  // Weitere Module nur bei Bedarf laden
  if (document.getElementById('cookie-scanner-table')) {
    const { setupCookieScannerModule } = await import('./modules/privacy-cookies.js');
    setupCookieScannerModule();
  }
};

// Web Worker für intensive Berechnungen
let searchWorker;
if (window.Worker) {
  searchWorker = new Worker('./search-worker.js');
  searchWorker.onmessage = function(e) {
    // Suchergebnisse vom Worker erhalten
    handleSearchResults(e.data);
  };
}

// Hauptfunktionalität
document.addEventListener('DOMContentLoaded', function() {
  // Kritische CSS und JS zuerst laden
  loadCriticalResources();
  
  // Module dynamisch importieren
  importModules().catch(error => console.error('Module konnten nicht geladen werden:', error));
  
  // Offlinestatus überwachen
  setupOfflineStatus();
  
  // Inhaltsverzeichnis generieren (einmal statt doppelt)
  generateTOC();
  
  // Initialisiere alle notwendigen Funktionen
  initializeEssentialFeatures();
  
  // Lazy-Loading für Bilder
  setupLazyLoading();
  
  // Lokales Caching für Offline-Nutzung
  setupLocalCaching();
  
  // Memory Leak Prevention
  setupMemoryLeakPrevention();
  
  // GPU-beschleunigte Animationen
  setupOptimizedAnimations();
});

// Kritische Ressourcen laden
function loadCriticalResources() {
  // Kritisches CSS inline laden, Rest asynchron
  const nonCriticalCss = [
    { href: 'assets/css/privacy-policy-print.css', media: 'print' }
  ];
  
  nonCriticalCss.forEach(item => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = item.href;
    if (item.media) link.media = item.media;
    link.setAttribute('data-load', 'async');
    document.head.appendChild(link);
  });
}

// Offlinestatus überwachen
function setupOfflineStatus() {
  const banner = document.getElementById('offline-banner');
  if (!banner) return;
  
  function updateOnlineStatus() {
    if (navigator.onLine) {
      banner.classList.remove('visible');
      banner.classList.remove('show');
    } else {
      banner.classList.add('visible');
      banner.classList.add('show');
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
}

// Inhaltsverzeichnis generieren
function generateTOC() {
  const tocList = document.getElementById('toc-list');
  if (!tocList) return;
  
  const sections = document.querySelectorAll('.privacy-section');
  
  // TOC-Liste leeren um doppelte Einträge zu vermeiden
  tocList.innerHTML = '';
  
  sections.forEach(section => {
    const heading = section.querySelector('h2');
    if (!heading) return;
    
    const id = section.id;
    const title = heading.textContent;
    
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = title;
    
    listItem.appendChild(link);
    tocList.appendChild(listItem);
  });
  
  // Aktiven Abschnitt im Inhaltsverzeichnis hervorheben
  setupActiveHighlighting();
}

// Aktiven Abschnitt hervorheben
function setupActiveHighlighting() {
  const tocLinks = document.querySelectorAll('.privacy-toc a');
  
  // Verwendung des Intersection Observers für bessere Performance
  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -60% 0px',
    threshold: 0
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        
        tocLinks.forEach(link => {
          const href = link.getAttribute('href').substring(1);
          link.classList.toggle('active', href === id);
        });
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.privacy-section').forEach(section => {
    observer.observe(section);
  });
}

// Initialisiere alle notwendigen Funktionen
function initializeEssentialFeatures() {
  // Breadcrumbs aus JSON-LD generieren
  generateBreadcrumbs();
  
  // "Zurück nach oben" Button
  setupBackToTop();
  
  // Dark Mode Toggle
  setupDarkModeToggle();
  
  // Exportfunktionen
  setupExportFunctions();
  
  // Lesedauer berechnen
  calculateReadingTime();
}

// Breadcrumbs aus JSON-LD generieren
function generateBreadcrumbs() {
  const breadcrumbsContainer = document.querySelector('.breadcrumbs');
  if (!breadcrumbsContainer) return;
  
  // JSON-LD aus Script-Tag extrahieren
  const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
  let breadcrumbData = null;
  
  for (const script of scriptTags) {
    try {
      const data = JSON.parse(script.textContent);
      if (data['@type'] === 'BreadcrumbList') {
        breadcrumbData = data;
        break;
      }
    } catch (e) {
      console.error('Error parsing JSON-LD:', e);
    }
  }
  
  if (!breadcrumbData) return;
  
  // Breadcrumbs aus den Daten generieren
  const items = breadcrumbData.itemListElement || [];
  
  // Bestehende Elemente löschen
  breadcrumbsContainer.innerHTML = '';
  
  items.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'breadcrumbs-item';
    
    if (index < items.length - 1) {
      const link = document.createElement('a');
      link.href = item.item;
      link.className = 'breadcrumbs-link';
      
      // Icon hinzufügen
      if (index === 0) {
        const icon = document.createElement('i');
        icon.className = 'ri-home-4-line';
        link.appendChild(icon);
      }
      
      link.appendChild(document.createTextNode(' ' + item.name));
      listItem.appendChild(link);
    } else {
      // Letztes Element als aktuell markieren
      const span = document.createElement('span');
      span.className = 'breadcrumbs-current';
      
      const icon = document.createElement('i');
      icon.className = 'ri-shield-line';
      span.appendChild(icon);
      
      span.appendChild(document.createTextNode(' ' + item.name));
      listItem.appendChild(span);
    }
    
    breadcrumbsContainer.appendChild(listItem);
  });
}

// "Zurück nach oben" Button
function setupBackToTop() {
  const backToTopButton = document.getElementById('backToTop');
  if (!backToTopButton) return;
  
  // Intersection Observer für bessere Performance
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    backToTopButton.classList.toggle('show', !entry.isIntersecting);
  }, { threshold: 0, rootMargin: '0px 0px -90% 0px' });
  
  // Beobachte den Header-Bereich
  const header = document.querySelector('.privacy-header');
  if (header) observer.observe(header);
  
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });
  });
}

// Dark Mode Toggle
function setupDarkModeToggle() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (!darkModeToggle) return;
  
  // Prüfen, ob Dark Mode aktiv ist
  let isDarkMode = localStorage.getItem('privacy-dark-mode') === 'true';
  
  // Wenn keine Einstellung vorhanden ist, das System-Farbschema verwenden
  if (localStorage.getItem('privacy-dark-mode') === null) {
    isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  function updateDarkMode(darkMode) {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      darkModeToggle.innerHTML = '<i class="ri-sun-line"></i> Light Mode';
      darkModeToggle.setAttribute('aria-pressed', 'true');
      darkModeToggle.setAttribute('aria-label', 'Zu Light Mode wechseln (aktuell: Dark Mode)');
      
      // Meta Theme Color für Browser-UI anpassen
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#1e293b');
      }
    } else {
      document.documentElement.classList.remove('dark-mode');
      darkModeToggle.innerHTML = '<i class="ri-moon-line"></i> Dark Mode';
      darkModeToggle.setAttribute('aria-pressed', 'false');
      darkModeToggle.setAttribute('aria-label', 'Zu Dark Mode wechseln (aktuell: Light Mode)');
      
      // Meta Theme Color für Browser-UI anpassen
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#0a84ff');
      }
    }
    
    // Event für andere Komponenten auslösen
    document.dispatchEvent(new CustomEvent('darkModeChanged', {
      detail: { darkMode: darkMode }
    }));
    
    // GPU-beschleunigte Transition
    document.documentElement.style.willChange = 'background-color, color';
    document.documentElement.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    setTimeout(() => {
      document.documentElement.style.willChange = 'auto';
      document.documentElement.style.transition = '';
    }, 500);
  }
  
  // Initial anwenden
  updateDarkMode(isDarkMode);
  
  darkModeToggle.addEventListener('click', function() {
    isDarkMode = !document.documentElement.classList.contains('dark-mode');
    localStorage.setItem('privacy-dark-mode', isDarkMode);
    updateDarkMode(isDarkMode);
    
    // Visuelles und akustisches Feedback
    darkModeToggle.classList.add('active');
    
    // Animation basierend auf Übergang
    const transitionClass = isDarkMode ? 'dark-transition' : 'light-transition';
    document.documentElement.classList.add(transitionClass);
    
    // Animation nach Abschluss entfernen
    setTimeout(() => {
      darkModeToggle.classList.remove('active');
      document.documentElement.classList.remove(transitionClass);
      
      // Screenreader-Ankündigung
      let announcer = document.getElementById('dark-mode-announcer');
      if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'dark-mode-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);
      }
      announcer.textContent = isDarkMode ? 'Dark Mode aktiviert' : 'Light Mode aktiviert';
    }, 500);
  });
  
  // Auf Systemänderungen reagieren
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = e => {
      // Nur anwenden, wenn keine Benutzereinstellung vorhanden ist
      if (localStorage.getItem('privacy-dark-mode') === null) {
        isDarkMode = e.matches;
        updateDarkMode(isDarkMode);
      }
    };
    
    // Moderne Browser
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }
    // Ältere Browser
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }
  } catch (e) {
    console.log('Browser unterstützt keine matchMedia-Events:', e);
  }
}

// Export Funktionen
function setupExportFunctions() {
  const exportBtn = document.getElementById('export-markdown');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      // Daten für den Export im Web Worker berechnen
      if (window.Worker && typeof exportWorker !== 'undefined') {
        exportWorker.postMessage({
          action: 'exportMarkdown',
          sections: Array.from(document.querySelectorAll('.privacy-section')).map(section => section.outerHTML)
        });
      } else {
        // Fallback für Browser ohne Web Worker Support
        exportMarkdown();
      }
    });
  }
  
  const copyBtn = document.getElementById('copy-link-button');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      const hash = window.location.hash || '#introduction';
      const url = window.location.origin + window.location.pathname + hash;
      
      navigator.clipboard.writeText(url).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="ri-check-line"></i> Link kopiert!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Fehler beim Kopieren des Links:', err);
      });
    });
  }
}

// Berechne die Lesedauer
function calculateReadingTime() {
  const readingTimeElement = document.querySelector('.privacy-meta span:nth-child(2)');
  if (!readingTimeElement) return;
  
  // Verwende den IntersectionObserver um zu prüfen, wann der Content sichtbar ist
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Text aus allen Absätzen holen
      const text = Array.from(document.querySelectorAll('.privacy-section p, .privacy-section li'))
        .map(el => el.textContent)
        .join(' ');
      
      // Wörter zählen (durchschnittliche deutsche Wortlänge ist länger als englische)
      const words = text.trim().split(/\s+/).length;
      
      // Durchschnittliche Lesegeschwindigkeit: 200 Wörter pro Minute
      const minutes = Math.ceil(words / 200);
      
      readingTimeElement.innerHTML = `<i class="ri-time-line"></i> Lesezeit: ~${minutes} Minuten`;
      
      // Beobachtung beenden, da wir den Wert bereits berechnet haben
      observer.disconnect();
    }
  });
  
  // Beobachte den Hauptinhalt
  const mainContent = document.querySelector('.privacy-main');
  if (mainContent) observer.observe(mainContent);
}

// Lazy-Loading für Bilder
function setupLazyLoading() {
  // Prüfen, ob der Browser native lazy loading unterstützt
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading für alle Bilder aktivieren
    document.querySelectorAll('img').forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  } else {
    // Fallback für Browser ohne natives lazy loading
    // Hier könnte eine JavaScript-Bibliothek geladen werden
    const script = document.createElement('script');
    script.src = 'assets/js/lazysizes.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Bilder für lazysizes vorbereiten
    document.querySelectorAll('img').forEach(img => {
      if (!img.classList.contains('lazyload')) {
        img.classList.add('lazyload');
        img.setAttribute('data-src', img.src);
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
      }
    });
  }
}

// Lokales Caching für Offline-Nutzung
function setupLocalCaching() {
  // Prüfen ob localStorage verfügbar ist
  if (!storageAvailable('localStorage')) return;
  
  // Cache-Version zur Invalidierung bei Updates
  const CACHE_VERSION = '1.0.0';
  
  // Speichere die aktuelle Datenschutzerklärung im lokalen Speicher
  try {
    const privacyContent = document.querySelector('.privacy-main').innerHTML;
    const cachedData = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      content: privacyContent
    };
    
    localStorage.setItem('privacyPolicyCache', JSON.stringify(cachedData));
  } catch (e) {
    console.error('Fehler beim Caching der Datenschutzerklärung:', e);
  }
  
  // Prüfen ob localStorage verfügbar ist
  function storageAvailable(type) {
    let storage;
    try {
      storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch(e) {
      return e instanceof DOMException && (
        // Firefox
        e.code === 22 ||
        // Chrome
        e.code === 1014 ||
        // Test name field
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // Prüfen ob Storage nicht leer ist
        (storage && storage.length !== 0);
    }
  }
}

// Memory Leak Prevention
function setupMemoryLeakPrevention() {
  // Aufräumfunktionen für Event-Listener
  const cleanupFunctions = [];
  
  // Beispiel: Event-Listener für Resize mit Aufräumfunktion
  const resizeHandler = debounce(() => {
    // Resize-Funktionalität
  }, 200);
  
  window.addEventListener('resize', resizeHandler);
  cleanupFunctions.push(() => window.removeEventListener('resize', resizeHandler));
  
  // Bei Seitenwechsel oder unload alle Event-Listener entfernen
  window.addEventListener('unload', () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  });
  
  // Debounce-Funktion zur Verbesserung der Performance
  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
}

// GPU-beschleunigte Animationen
function setupOptimizedAnimations() {
  // Elemente, die animiert werden
  const animatedElements = [
    '.privacy-progress-bar',
    '.privacy-floating-action',
    '.privacy-button',
    '.privacy-search input',
    '.privacy-right-card',
    '.privacy-toc a'
  ];
  
  // will-change-Eigenschaft für bessere Performance hinzufügen
  animatedElements.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.style.willChange = 'transform, opacity';
      
      // Nach der Animation zurücksetzen, um Speicher zu sparen
      element.addEventListener('transitionend', function() {
        this.style.willChange = 'auto';
      });
    });
  });
  
  // Reduzierte Bewegung für Barrierefreiheit respektieren
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion');
  }
}

// Anonymisierte Nutzungsverfolgung (ohne personenbezogene Daten)
function setupAnonymousAnalytics() {
  // Nur wenn der Nutzer zugestimmt hat
  if (!localStorage.getItem('analytics-consent') === 'true') return;
  
  // Aufenthaltsdauer pro Abschnitt messen
  const sections = document.querySelectorAll('.privacy-section');
  const sectionTimes = new Map();
  
  // Intersection Observer für die Sichtbarkeit der Abschnitte
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const section = entry.target;
      const id = section.id;
      
      if (entry.isIntersecting) {
        // Startzeit speichern, wenn Abschnitt sichtbar wird
        sectionTimes.set(id, {
          startTime: Date.now(),
          visible: true
        });
      } else if (sectionTimes.has(id) && sectionTimes.get(id).visible) {
        // Dauer berechnen, wenn Abschnitt nicht mehr sichtbar ist
        const data = sectionTimes.get(id);
        const duration = Date.now() - data.startTime;
        data.duration = (data.duration || 0) + duration;
        data.visible = false;
        
        // Anonymisierte Daten an Server senden (ohne personenbezogene Daten)
        if (duration > 1000) {  // Nur senden, wenn mehr als 1 Sekunde
          sendAnonymousAnalytics(id, duration);
        }
      }
    });
  }, { threshold: 0.5 });  // Wenn 50% des Elements sichtbar ist
  
  sections.forEach(section => observer.observe(section));
  
  // Anonymisierte Daten senden (ohne personenbezogene Daten)
  function sendAnonymousAnalytics(sectionId, duration) {
    // Hier würde ein API-Aufruf stehen, der keine personenbezogenen Daten überträgt
    // Stattdessen speichern wir lokal
    try {
      const analyticsData = JSON.parse(localStorage.getItem('privacy-analytics') || '{}');
      analyticsData[sectionId] = (analyticsData[sectionId] || 0) + duration;
      localStorage.setItem('privacy-analytics', JSON.stringify(analyticsData));
    } catch (e) {
      console.error('Fehler beim Speichern der Analysedaten:', e);
    }
  }
  
  // Aufräumen, wenn die Seite verlassen wird
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    
    // Finale Zeiten für noch sichtbare Abschnitte berechnen
    sectionTimes.forEach((data, id) => {
      if (data.visible) {
        const duration = Date.now() - data.startTime;
        sendAnonymousAnalytics(id, duration);
      }
    });
  });
}

// Funktionen für optimierte Mobilansicht
function setupMobileOptimizations() {
  // Prüfen, ob es sich um ein mobiles Gerät handelt
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Schriftgröße optimieren
    document.querySelector('.privacy-content').classList.add('mobile-optimized');
    
    // Bilder komprimieren
    document.querySelectorAll('img').forEach(img => {
      if (img.src.includes('?')) {
        img.src += '&quality=70&width=400';
      } else {
        img.src += '?quality=70&width=400';
      }
    });
    
    // Touch-Optimierungen
    document.querySelectorAll('.privacy-button, .privacy-toc a').forEach(el => {
      el.style.minHeight = '44px';  // Mindestgröße für Touch-Targets
    });
  }
}

// Schema.org-Markup erweitern
function enhanceSchemaMarkup() {
  // Bestehende Schema.org-Daten holen
  const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
  let schemaData = null;
  
  for (const script of scriptTags) {
    try {
      const data = JSON.parse(script.textContent);
      if (data['@type'] === 'WebPage') {
        schemaData = data;
        break;
      }
    } catch (e) {
      console.error('Error parsing Schema.org data:', e);
    }
  }
  
  if (!schemaData) return;
  
  // Schema.org-Daten erweitern
  const enhancedSchema = {
    ...schemaData,
    "mainEntity": {
      "@type": "Article",
      "name": "Datenschutzerklärung",
      "author": {
        "@type": "Person",
        "name": "Johann Kramer"
      },
      "datePublished": "2024-01-01T12:00:00+01:00",
      "dateModified": "2024-08-27T12:00:00+01:00",
      "headline": "Datenschutzerklärung – Johann Kramer",
      "keywords": "Datenschutz, DSGVO, Cookies, Datenschutzbestimmungen, Datenschutzerklärung",
      "articleSection": Array.from(document.querySelectorAll('.privacy-section h2')).map(h2 => h2.textContent)
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".privacy-section h2", ".privacy-summary p"]
    }
  };
  
  // Neues Schema hinzufügen
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(enhancedSchema);
  document.head.appendChild(script);
}
