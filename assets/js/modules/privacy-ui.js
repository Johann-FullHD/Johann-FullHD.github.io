// Modul für UI-Funktionalität
export const setupUIModule = () => {
  // Schriftgröße anpassen
  setupFontSizeAdjustment();
  
  // Vereinfachte Sprache umschalten
  setupSimplifiedLanguage();
  
  // Lesefortschritt anzeigen
  setupReadingProgress();
  
  // Touch-Optimierungen
  setupTouchOptimizations();
};

// Schriftgröße anpassen
function setupFontSizeAdjustment() {
  const increaseButton = document.getElementById('font-size-increase');
  const decreaseButton = document.getElementById('font-size-decrease');
  if (!increaseButton || !decreaseButton) return;
  
  // Aktuelle Schriftgröße aus dem CSS holen
  const contentElement = document.querySelector('.privacy-content');
  const computedStyle = window.getComputedStyle(contentElement);
  let currentSize = parseInt(computedStyle.fontSize);
  
  // Gespeicherte Schriftgröße laden
  const savedSize = localStorage.getItem('privacy-font-size');
  if (savedSize) {
    currentSize = parseInt(savedSize);
    contentElement.style.fontSize = currentSize + 'px';
  }
  
  // Schriftgröße anpassen und für Screenreader ankündigen
  function updateFontSize(newSize) {
    contentElement.style.fontSize = newSize + 'px';
    localStorage.setItem('privacy-font-size', newSize);
    
    // Erstelle oder aktualisiere eine aria-live Region für Screenreader
    let announcer = document.getElementById('font-size-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'font-size-announcer';
      announcer.setAttribute('aria-live', 'polite');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    announcer.textContent = `Schriftgröße wurde auf ${newSize} Pixel geändert`;
  }
  
  increaseButton.addEventListener('click', function() {
    if (currentSize < 24) {
      currentSize += 2;
      updateFontSize(currentSize);
      
      // Visuelles Feedback anzeigen
      const originalText = increaseButton.innerHTML;
      increaseButton.innerHTML = '<i class="ri-zoom-in-line"></i> ' + currentSize + 'px';
      increaseButton.classList.add('active');
      
      setTimeout(() => {
        increaseButton.innerHTML = originalText;
        increaseButton.classList.remove('active');
      }, 1000);
    }
  });
  
  decreaseButton.addEventListener('click', function() {
    if (currentSize > 12) {
      currentSize -= 2;
      updateFontSize(currentSize);
      
      // Visuelles Feedback anzeigen
      const originalText = decreaseButton.innerHTML;
      decreaseButton.innerHTML = '<i class="ri-zoom-out-line"></i> ' + currentSize + 'px';
      decreaseButton.classList.add('active');
      
      setTimeout(() => {
        decreaseButton.innerHTML = originalText;
        decreaseButton.classList.remove('active');
      }, 1000);
    }
  });
}

// Vereinfachte Sprache umschalten
function setupSimplifiedLanguage() {
  const toggleButton = document.getElementById('toggle-simplified');
  if (!toggleButton) return;
  
  let simplified = localStorage.getItem('privacy-simplified') === 'true';
  
  // Vereinfachte Versionen der Texte
  const simplifiedTexts = {
    'introduction': 'Wir erklären hier, welche Daten wir von Ihnen sammeln und was wir damit machen. Diese Regeln folgen dem Datenschutzgesetz der EU.',
    'basics': 'Wir sammeln nur Daten, die wir wirklich brauchen. Wir benutzen sie nur für den Zweck, für den wir sie gesammelt haben. Wir speichern sie nur so lange wie nötig.',
    'responsible': 'Johann Kramer ist verantwortlich für den Schutz Ihrer Daten. Bei Fragen schreiben Sie an privacy@johann-fullhd.github.io.',
    'storage-period': 'Wir löschen Ihre Daten, sobald wir sie nicht mehr brauchen. Manchmal müssen wir sie länger aufbewahren, weil das Gesetz es vorschreibt.',
    'rights': 'Sie haben das Recht zu erfahren, welche Daten wir von Ihnen haben. Sie können verlangen, dass wir sie korrigieren oder löschen. Sie können auch der Verarbeitung widersprechen.',
    'changes': 'Diese Datenschutzerklärung kann sich ändern. Die aktuelle Version finden Sie immer hier.',
    'web-analytics': 'Wir nutzen Google Analytics nur, wenn Sie zustimmen. Es hilft uns zu verstehen, wie Besucher unsere Seite nutzen.',
    'external-tools': 'Wir nutzen Dienste wie Schriftarten und Icons von anderen Anbietern. Dabei werden möglicherweise Daten übertragen.'
  };
  
  function applySimplifiedMode() {
    if (simplified) {
      toggleButton.innerHTML = '<i class="ri-translate-2"></i> Normale Sprache';
      
      Object.keys(simplifiedTexts).forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
          const firstParagraph = section.querySelector('p:not(.text-large):not([data-original])');
          if (firstParagraph) {
            firstParagraph.setAttribute('data-original', firstParagraph.textContent);
            firstParagraph.textContent = simplifiedTexts[sectionId];
            firstParagraph.classList.add('simplified-text');
          }
        }
      });
    } else {
      toggleButton.innerHTML = '<i class="ri-translate-2"></i> Vereinfachte Sprache';
      
      document.querySelectorAll('p[data-original]').forEach(p => {
        p.textContent = p.getAttribute('data-original');
        p.removeAttribute('data-original');
        p.classList.remove('simplified-text');
      });
    }
  }
  
  // Initial anwenden
  applySimplifiedMode();
  
  toggleButton.addEventListener('click', function() {
    simplified = !simplified;
    localStorage.setItem('privacy-simplified', simplified);
    applySimplifiedMode();
  });
}

// Lesefortschritt anzeigen
function setupReadingProgress() {
  const progressBar = document.getElementById('privacy-progress-bar');
  if (!progressBar) return;
  
  // Optimierter Scroll-Event-Handler mit requestAnimationFrame
  let ticking = false;
  let lastScrollY = window.scrollY;
  
  function updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // GPU-beschleunigte Animation
    progressBar.style.transform = `translateX(${scrolled - 100}%)`;
    
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
      window.requestAnimationFrame(function() {
        updateProgress();
        ticking = false;
      });
      
      ticking = true;
    }
  }, { passive: true });
}

// Touch-Optimierungen
function setupTouchOptimizations() {
  // Erkennen, ob es sich um ein Touch-Gerät handelt
  const isTouchDevice = ('ontouchstart' in window) || 
                        (navigator.maxTouchPoints > 0) || 
                        (navigator.msMaxTouchPoints > 0);
  
  if (!isTouchDevice) return;
  
  // Touch-optimierte Elemente
  const touchElements = document.querySelectorAll(
    '.privacy-button, .privacy-toc a, .privacy-right-card, .privacy-search input, .breadcrumbs-link'
  );
  
  touchElements.forEach(element => {
    // Größere Touch-Ziele
    if (element.tagName.toLowerCase() === 'a' || element.tagName.toLowerCase() === 'button') {
      element.style.minHeight = '44px';
      element.style.minWidth = '44px';
      
      // Mehr Padding für bessere Erreichbarkeit
      const currentPadding = window.getComputedStyle(element).padding;
      if (currentPadding === '0px' || parseFloat(currentPadding) < 12) {
        element.style.padding = '12px';
      }
    }
    
    // Active-Zustand für Touch-Feedback
    element.addEventListener('touchstart', function() {
      this.classList.add('touch-active');
    }, { passive: true });
    
    element.addEventListener('touchend', function() {
      this.classList.remove('touch-active');
    });
  });
  
  // Optimierte Scroll-Performance
  document.body.style.webkitOverflowScrolling = 'touch';
  
  // Verhindere Zoom bei doppeltem Tippen auf Links
  const meta = document.querySelector('meta[name="viewport"]');
  if (meta) {
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
  } else {
    const newMeta = document.createElement('meta');
    newMeta.name = 'viewport';
    newMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.head.appendChild(newMeta);
  }
}
