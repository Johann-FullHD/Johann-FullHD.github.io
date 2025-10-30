// Modul für die Suchfunktionalität
export const setupSearchModule = () => {
  const searchInput = document.getElementById('privacy-search-input');
  if (!searchInput) return;
  
  // Web Worker für Suchvorgänge initialisieren
  let searchWorker;
  if (window.Worker) {
    try {
      searchWorker = new Worker('./search-worker.js');
      searchWorker.onmessage = function(e) {
        handleSearchResults(e.data);
      };
    } catch (error) {
      console.error('Web Worker konnte nicht initialisiert werden:', error);
      searchWorker = null;
    }
  }
  
  // Status für die Suche
  let searchActive = false;
  let searchResultCount = 0;
  let currentHighlightIndex = -1;
  let highlightElements = [];
  
  // Status-Element für Suchergebnisse erstellen
  const searchStatus = document.createElement('div');
  searchStatus.className = 'privacy-search-status';
  searchStatus.setAttribute('aria-live', 'polite');
  searchInput.parentNode.insertAdjacentElement('afterend', searchStatus);
  
  // Navigation für Treffer hinzufügen
  const searchNav = document.createElement('div');
  searchNav.className = 'privacy-search-nav';
  searchNav.style.display = 'none';
  searchNav.innerHTML = `
    <button class="privacy-search-prev" aria-label="Zum vorherigen Treffer">
      <i class="ri-arrow-up-s-line" aria-hidden="true"></i>
    </button>
    <span class="privacy-search-count"></span>
    <button class="privacy-search-next" aria-label="Zum nächsten Treffer">
      <i class="ri-arrow-down-s-line" aria-hidden="true"></i>
    </button>
  `;
  searchStatus.appendChild(searchNav);
  
  const prevButton = searchNav.querySelector('.privacy-search-prev');
  const nextButton = searchNav.querySelector('.privacy-search-next');
  const countDisplay = searchNav.querySelector('.privacy-search-count');
  
  prevButton.addEventListener('click', () => navigateHighlights(-1));
  nextButton.addEventListener('click', () => navigateHighlights(1));
  
  // Funktion zum Ausführen der Suche
  const performSearch = debounce(function() {
    const query = searchInput.value.toLowerCase().trim();
    
    // Alle bestehenden Hervorhebungen zurücksetzen
    resetHighlights();
    
    searchResultCount = 0;
    currentHighlightIndex = -1;
    highlightElements = [];
    
    if (query.length < 2) {
      searchActive = false;
      searchStatus.textContent = '';
      searchNav.style.display = 'none';
      return;
    }
    
    searchActive = true;
    
    // Web Worker verwenden, wenn verfügbar
    if (searchWorker) {
      const contentElements = document.querySelectorAll('.privacy-section p, .privacy-section li, .privacy-section h2, .privacy-section h3, .privacy-section h4');
      const contentData = Array.from(contentElements).map(element => ({
        id: element.id || `search-element-${Math.random().toString(36).substring(2, 9)}`,
        text: element.textContent,
        path: element.closest('.privacy-section')?.id || '',
        type: element.tagName.toLowerCase()
      }));
      
      searchWorker.postMessage({
        action: 'search',
        query: query,
        content: contentData
      });
    } else {
      // Fallback: Suche im Hauptthread
      searchInMainThread(query);
    }
  }, 300);
  
  // Fallback-Funktion für Suche im Hauptthread
  function searchInMainThread(query) {
    const elements = document.querySelectorAll('.privacy-section p, .privacy-section li, .privacy-section h2, .privacy-section h3, .privacy-section h4');
    let firstMatchSection = null;
    
    elements.forEach(element => {
      // Nach Übereinstimmungen suchen und Text markieren
      const result = highlightText(element, query);
      
      if (result.hasMatch) {
        searchResultCount += result.matchCount;
        highlightElements = highlightElements.concat(result.highlights);
        
        const section = element.closest('.privacy-section');
        if (!firstMatchSection && section) {
          firstMatchSection = section;
        }
      }
    });
    
    updateSearchResults(searchResultCount, firstMatchSection);
  }
  
  // Verarbeitet die Suchergebnisse vom Worker oder direkt
  function handleSearchResults(results) {
    searchResultCount = results.totalMatches;
    highlightElements = [];
    
    // Markierungen anwenden
    results.matches.forEach(match => {
      const element = document.getElementById(match.elementId) || 
                      document.querySelector(`${match.type}:contains("${match.textBefore.substring(0, 30)}")`);
      
      if (element) {
        const result = highlightText(element, match.query);
        if (result.hasMatch) {
          highlightElements = highlightElements.concat(result.highlights);
        }
      }
    });
    
    let firstMatchSection = null;
    if (results.matches.length > 0) {
      const firstMatchId = results.matches[0].sectionId;
      firstMatchSection = document.getElementById(firstMatchId);
    }
    
    updateSearchResults(searchResultCount, firstMatchSection);
  }
  
  // Aktualisiert die Anzeige der Suchergebnisse
  function updateSearchResults(count, firstMatchSection) {
    if (count > 0) {
      searchStatus.textContent = `${count} Treffer gefunden`;
      searchStatus.classList.add('has-results');
      
      // Zum ersten Treffer scrollen
      if (firstMatchSection) {
        firstMatchSection.scrollIntoView({ 
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
        
        // Ersten Treffer auswählen
        if (highlightElements.length > 0) {
          navigateHighlights(1);
        }
      }
      
      // Wenn wir mehr als einen Treffer haben, zeigen wir die Navigation
      if (count > 1) {
        searchNav.style.display = 'flex';
        updateCountDisplay();
      } else {
        searchNav.style.display = 'none';
      }
    } else {
      searchStatus.textContent = 'Keine Treffer gefunden';
      searchStatus.classList.remove('has-results');
      searchNav.style.display = 'none';
    }
  }
  
  // Navigation durch Treffer
  function navigateHighlights(direction) {
    if (highlightElements.length === 0) return;
    
    // Aktuelle Hervorhebung zurücksetzen
    if (currentHighlightIndex >= 0 && currentHighlightIndex < highlightElements.length) {
      highlightElements[currentHighlightIndex].classList.remove('active');
    }
    
    // Zum nächsten/vorherigen Treffer
    currentHighlightIndex += direction;
    
    // Wraparound
    if (currentHighlightIndex < 0) currentHighlightIndex = highlightElements.length - 1;
    if (currentHighlightIndex >= highlightElements.length) currentHighlightIndex = 0;
    
    // Neuen Treffer markieren und anzeigen
    const highlight = highlightElements[currentHighlightIndex];
    highlight.classList.add('active');
    highlight.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center',
      inline: 'nearest'
    });
    
    updateCountDisplay();
  }
  
  // Anzeige der aktuellen Position aktualisieren
  function updateCountDisplay() {
    countDisplay.textContent = `${currentHighlightIndex + 1} von ${highlightElements.length}`;
  }
  
  // Highlights zurücksetzen
  function resetHighlights() {
    document.querySelectorAll('.highlight').forEach(el => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    });
  }
  
  // Text in einem Element markieren
  function highlightText(element, query) {
    const originalHTML = element.innerHTML;
    const text = element.textContent;
    const lowerText = text.toLowerCase();
    
    if (!lowerText.includes(query)) {
      return { hasMatch: false, matchCount: 0, highlights: [], element };
    }
    
    // Text mit Hervorhebung ersetzen
    let newHtml = '';
    let lastIndex = 0;
    let index;
    let matchCount = 0;
    let highlightIds = [];
    
    // Alle Vorkommen markieren
    while ((index = lowerText.indexOf(query, lastIndex)) !== -1) {
      const highlightId = `highlight-${Math.random().toString(36).substring(2, 9)}`;
      newHtml += escapeHTML(text.substring(lastIndex, index));
      newHtml += `<span id="${highlightId}" class="highlight" tabindex="-1">${escapeHTML(text.substring(index, index + query.length))}</span>`;
      lastIndex = index + query.length;
      matchCount++;
      highlightIds.push(highlightId);
    }
    
    newHtml += escapeHTML(text.substring(lastIndex));
    element.innerHTML = newHtml;
    
    // Referenzen auf die neu erstellten Highlight-Elemente sammeln
    const highlights = highlightIds.map(id => document.getElementById(id));
    
    return { 
      hasMatch: true, 
      matchCount, 
      highlights,
      element 
    };
  }
  
  // HTML-Sonderzeichen escapen
  function escapeHTML(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // Event-Handler für Suche
  searchInput.addEventListener('input', performSearch);
  
  // Tastatur-Navigation für Suchergebnisse
  searchInput.addEventListener('keydown', function(e) {
    if (searchActive && searchResultCount > 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        navigateHighlights(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHighlights(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHighlights(-1);
      }
    }
    
    if (e.key === 'Escape') {
      searchInput.value = '';
      resetHighlights();
      searchStatus.textContent = '';
      searchStatus.classList.remove('has-results');
      searchNav.style.display = 'none';
      searchActive = false;
      e.preventDefault();
    }
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
};

// jQuery-ähnlicher Selektor für Text-Enthält
document.querySelectorAll = document.querySelectorAll || function(selectors) {
  return document.querySelectorAll(selectors);
};

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || 
                              Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
