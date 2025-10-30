// Equipment Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // References to DOM elements
  const filterButtons = document.querySelectorAll('.filter-button');
  const equipmentCards = document.querySelectorAll('.equipment-card');
  const equipmentGrid = document.querySelector('.equipment-grid');
  const modal = document.querySelector('.equipment-modal');
  const modalClose = document.querySelector('.modal-close');
  const modalImage = document.querySelector('.modal-image img');
  const modalTitle = document.querySelector('.modal-title');
  const modalSubtitle = document.querySelector('.modal-subtitle');
  const modalSpecs = document.querySelector('.modal-specs');
  const modalDescription = document.querySelector('.modal-description');
  const statValues = document.querySelectorAll('.stat-value');
  
  // Equipment filtering
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Get filter value
      const filter = this.getAttribute('data-filter');
      
      // Filter equipment cards
      equipmentCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'block';
        } else {
          if (card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
      
      // Apply staggered animation
      applyStaggeredAnimation();
    });
  });
  
  // Equipment modal functionality
  document.querySelectorAll('.info-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const card = this.closest('.equipment-card');
      const imgEl = card.querySelector('.equipment-image img');
      const equipmentData = {
        image: imgEl.getAttribute('src'),
        srcset: imgEl.getAttribute('srcset') || '',
        sizes: imgEl.getAttribute('sizes') || '',
        decoding: imgEl.getAttribute('decoding') || '',
        title: card.querySelector('.equipment-name').textContent,
        category: card.querySelector('.equipment-category').textContent,
        description: card.querySelector('.equipment-description').textContent,
        specs: JSON.parse(card.getAttribute('data-specs') || '{}'),
        reviewAnchor: card.getAttribute('data-review') || ''
      };
      
      // Populate modal with equipment data
      if (equipmentData.srcset) modalImage.setAttribute('srcset', equipmentData.srcset);
      else modalImage.removeAttribute('srcset');
      if (equipmentData.sizes) modalImage.setAttribute('sizes', equipmentData.sizes);
      else modalImage.removeAttribute('sizes');
      if (equipmentData.decoding) modalImage.setAttribute('decoding', equipmentData.decoding);
      modalImage.setAttribute('loading', 'eager');
      modalImage.setAttribute('src', equipmentData.image);
      modalTitle.textContent = equipmentData.title;
      modalSubtitle.textContent = equipmentData.category;
      modalDescription.textContent = equipmentData.description;
      
      // Generate specs HTML
      let specsHTML = '';
      for (const [key, value] of Object.entries(equipmentData.specs)) {
        specsHTML += `
          <div class="spec-item">
            <span class="spec-label">${key}</span>
            <span class="spec-value">${value}</span>
          </div>
        `;
      }
      modalSpecs.innerHTML = specsHTML;
      
      // Review-Link setzen, wenn vorhanden
      const reviewLink = document.getElementById('modal-review-link');
      if (reviewLink) {
        if (equipmentData.reviewAnchor && document.querySelector(equipmentData.reviewAnchor)) {
          reviewLink.href = equipmentData.reviewAnchor;
          reviewLink.style.display = 'inline-flex';
          reviewLink.setAttribute('aria-label', 'Passendes Review ansehen');
          reviewLink.onclick = () => {
            trackEvent('review_click', {
              item_title: equipmentData.title,
              item_category: equipmentData.category,
              review_target: equipmentData.reviewAnchor
            });
          };
        } else {
          reviewLink.removeAttribute('href');
          reviewLink.style.display = 'none';
        }
      }
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Analytics
      trackEvent('modal_open', { item_title: equipmentData.title, item_category: equipmentData.category });
    });
  });
  
  // Analytics helper
  function hasAnalyticsConsent() {
    try {
      const p = JSON.parse(localStorage.getItem('cookiePrefsV2'));
      return p && p.analytics === true;
    } catch (e) { return false; }
  }
  function trackEvent(name, params) {
    if (typeof gtag === 'function' && hasAnalyticsConsent()) {
      try { gtag('event', name, Object.assign({ event_category: 'equipment' }, params || {})); }
      catch (_) { /* no-op */ }
    }
  }
  
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    trackEvent('modal_close', {});
  }
  
  // Animate stats with CountUp
  function animateStats() {
    statValues.forEach(stat => {
      const value = parseInt(stat.getAttribute('data-value'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      
      if (!stat.classList.contains('counted')) {
        animateCounter(stat, 0, value, 2000, suffix);
        stat.classList.add('counted');
      }
    });
  }
  
  function animateCounter(element, start, end, duration, suffix = '') {
    let startTime = null;
    
    // Animation function
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(start + (progress * (end - start)));
      element.textContent = value + suffix;
      
      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };
    
    window.requestAnimationFrame(animate);
  }
  
  // Image protection
  function protectImages() {
    document.addEventListener('contextmenu', function(e) {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    });
    
    document.addEventListener('dragstart', function(e) {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    });
    
    document.addEventListener('keydown', function(e) {
      // Prevent saving with Ctrl+S
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
      }
      
      // Prevent viewing source with Ctrl+U
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
      }
    });
  }
  
  // Apply staggered animation to cards
  function applyStaggeredAnimation() {
    const visibleCards = Array.from(equipmentCards).filter(card => 
      card.style.display !== 'none'
    );
    
    visibleCards.forEach((card, index) => {
      card.classList.remove('fade-in', 'delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-5');
      
      // Force reflow
      void card.offsetWidth;
      
      card.classList.add('fade-in');
      
      // Add appropriate delay class (max 5 delays, then repeat)
      const delayClass = `delay-${(index % 5) + 1}`;
      card.classList.add(delayClass);
    });
  }
  
  // Intersection Observer for animations
  function setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const sections = document.querySelectorAll('.animate-on-scroll');
      const statsSection = document.querySelector('.equipment-stats');
      
      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // If it's the stats section, animate the stats
            if (entry.target === statsSection) {
              animateStats();
            }
            
            sectionObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      sections.forEach(section => {
        sectionObserver.observe(section);
      });
      
      if (statsSection) {
        sectionObserver.observe(statsSection);
      }
    } else {
      // Fallback for browsers without IntersectionObserver
      document.querySelectorAll('.animate-on-scroll').forEach(section => {
        section.classList.add('fade-in');
      });
      
      animateStats();
    }
  }
  
  // Initialize
  function init() {
    // Apply initial staggered animation
    applyStaggeredAnimation();
    
    // Protect images
    protectImages();
    
    // Setup intersection observer
    setupIntersectionObserver();
    
    // Initialize equipment configurator
    initEquipmentConfigurator();
    
    // Initialize YouTube video lazy loading
    initYouTubeVideos();
  }
  
  // Equipment Configurator
  function initEquipmentConfigurator() {
    const configGenerate = document.getElementById('generate-config');
    const configReset = document.getElementById('reset-config');
    const configResult = document.getElementById('config-result');
    const resultItems = document.querySelector('.result-items');
    
    if (!configGenerate || !configReset || !configResult || !resultItems) return;
    
    // Equipment configuration database (angepasst an Canon/Sony Bestand)
    const configurations = {
      landscape: {
        bright: {
          high: [
            { name: "Canon EOS 2000D", type: "Kamera", description: "Leichte DSLR – ideal für Touren mit hoher Mobilität" },
            { name: "Canon EF-S 18-55mm", type: "Objektiv", description: "Kompaktes Standardzoom für flexible Landschaftsmotive" },
            { name: "SanDisk Extreme PRO SDXC 128GB", type: "Zubehör", description: "Schnelle Speicherkarte für Serien und RAW" }
          ],
          medium: [
            { name: "Canon EOS 2000D", type: "Kamera", description: "Solide DSLR mit gutem Handling im Gelände" },
            { name: "Sigma 18-300mm F3.5-6.3", type: "Objektiv", description: "Allround-Zoom – von Weitwinkel bis Tele in einem" },
            { name: "National Geographic NG-PT001", type: "Stativ", description: "Leichtes Stativ für Langzeitbelichtungen" },
            { name: "SanDisk Extreme PRO SDXC 128GB", type: "Zubehör", description: "Zuverlässige, schnelle Speicherkarte" }
          ],
          low: [
            { name: "Canon EOS 2000D", type: "Kamera", description: "DSLR mit optischem Sucher für präzises Arbeiten" },
            { name: "Sigma 18-300mm F3.5-6.3", type: "Objektiv", description: "Großer Brennweitenbereich – ideal für flexible Landschaften" },
            { name: "National Geographic NG-PT001", type: "Stativ", description: "Stabiles Stativ für maximale Schärfe" },
            { name: "BRISTOL DayPack 600+", type: "Zubehör", description: "Geräumiger Rucksack für längere Touren" }
          ]
        },
        low: {
          medium: [
            { name: "Canon EOS 2000D", type: "Kamera", description: "Robuste DSLR für Dämmerung und Nacht" },
            { name: "Sigma 18-300mm F3.5-6.3", type: "Objektiv", description: "Naheinstellgrenze gut für Stern- sowie Nightscapes nutzbar" },
            { name: "National Geographic NG-PT001", type: "Stativ", description: "Für Langzeitbelichtungen unverzichtbar" },
            { name: "SanDisk Extreme PRO SDXC 128GB", type: "Zubehör", description: "Hohe Schreibrate für lange Belichtungsreihen" }
          ]
        }
      },
      portrait: {
        bright: {
          medium: [
            { name: "Canon EOS 2000D", type: "Kamera", description: "Zuverlässige Portrait-DSLR mit gutem Hautton" },
            { name: "Canon EF-S 18-55mm", type: "Objektiv", description: "Standardzoom – bei 55mm schönes Portrait-FOV" },
            { name: "SanDisk Extreme PRO SDXC 128GB", type: "Zubehör", description: "Schnelle Karte für RAW-Serien" }
          ]
        },
        studio: {
          low: [
            { name: "Canon EOS 2000D", type: "Kamera", description: "Solide Basis für kontrolliertes Studiolicht" },
            { name: "Canon EF-S 18-55mm", type: "Objektiv", description: "Flexibel zwischen Halb- und Oberkörper" },
            { name: "National Geographic NG-PT001", type: "Stativ", description: "Für Setup- und Testshots praktisch" }
          ]
        }
      },
      street: {
        mixed: {
          high: [
            { name: "SONY DSC-WX220", type: "Kamera", description: "Unauffällige Kompakte – perfekt für Street" },
            { name: "SanDisk Extreme PRO SDXC 128GB", type: "Zubehör", description: "Zuverlässige Karte für spontanes Serienbild" },
            { name: "BRISTOL DayPack 600+", type: "Zubehör", description: "Leichter Tagesrucksack für unterwegs" }
          ],
          medium: [
            { name: "Canon EOS 2000D", type: "Kamera", description: "Kompakte DSLR für City-Touren" },
            { name: "Canon EF-S 18-55mm", type: "Objektiv", description: "Flexibles Zoom für Street-Situationen" },
            { name: "SanDisk Extreme PRO SDXC 128GB", type: "Zubehör", description: "Schnell für kurze Momente" }
          ]
        }
      },
      architecture: {
        bright: {
          medium: [
            { name: "Canon EOS 2000D", type: "Kamera", description: "Gute Basis für architektonische Details" },
            { name: "Canon EF-S 18-55mm", type: "Objektiv", description: "Weit bis Normal – ideal für Fassaden und Innenräume" },
            { name: "National Geographic NG-PT001", type: "Stativ", description: "Für ausgerichtete, verzerrungsfreie Shots" }
          ]
        }
      },
      macro: {
        bright: {
          medium: [
            { name: "Canon EOS 2000D", type: "Kamera", description: "Saubere RAWs mit guter Reserve" },
            { name: "Sigma 18-300mm F3.5-6.3", type: "Objektiv", description: "Sehr kurze Naheinstellgrenze – pseudo-Makro möglich" },
            { name: "National Geographic NG-PT001", type: "Stativ", description: "Ruhige Basis für Close-Ups" },
            { name: "SanDisk Extreme PRO SDXC 128GB", type: "Zubehör", description: "Platz für viele Detailaufnahmen" }
          ]
        }
      }
    };
    
    // Generate button event
    configGenerate.addEventListener('click', () => {
      // Get selected values
      const style = document.querySelector('input[name="style"]:checked').value;
      const light = document.querySelector('input[name="light"]:checked').value;
      const mobility = document.querySelector('input[name="mobility"]:checked').value;
      
      // Get configuration or fallback to default
      let equipment = [];
      
      try {
        if (configurations[style]?.[light]?.[mobility]) {
          equipment = configurations[style][light][mobility];
        } else {
          // Try to find close match
          const styleConfig = configurations[style];
          if (styleConfig) {
            // Try to match light
            const lightConfig = styleConfig[light] || Object.values(styleConfig)[0];
            if (lightConfig) {
              // Try to match mobility or get first
              equipment = lightConfig[mobility] || Object.values(lightConfig)[0] || [];
            }
          }
          
          // If still empty, use default (Canon-basierte Empfehlung)
          if (equipment.length === 0) {
            equipment = [
              { name: "Canon EOS 2000D", type: "Kamera", description: "Vielseitige DSLR für alle Situationen" },
              { name: "Canon EF-S 18-55mm", type: "Objektiv", description: "Universelles Standardzoom" }
            ];
          }
        }
      } catch (error) {
        console.error('Error generating equipment configuration:', error);
        equipment = [
          { name: "Canon EOS 2000D", type: "Kamera", description: "Vielseitige DSLR für alle Situationen" },
          { name: "Canon EF-S 18-55mm", type: "Objektiv", description: "Universelles Standardzoom" }
        ];
      }
      
      // Clear previous results
      resultItems.innerHTML = '';
      
      // Add each equipment item to results
      equipment.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'result-item';
        
        // Get icon based on type
        let icon = 'question-line';
        switch (item.type.toLowerCase()) {
          case 'kamera':
            icon = 'camera-line';
            break;
          case 'objektiv':
            icon = 'camera-lens-line';
            break;
          case 'stativ':
            icon = 'aspect-ratio-line';
            break;
          case 'blitz':
            icon = 'flashlight-line';
            break;
          case 'zubehör':
            icon = 'tools-line';
            break;
        }
        
        itemElement.innerHTML = `
          <div class="result-item-icon">
            <i class="ri-${icon}"></i>
          </div>
          <div class="result-item-details">
            <h4 class="result-item-name">${item.name}</h4>
            <div class="result-item-type">${item.type}</div>
            <p class="result-item-description">${item.description}</p>
          </div>
        `;
        
        resultItems.appendChild(itemElement);
      });
      
      // Show results
      configResult.style.display = 'block';
      configResult.classList.add('show');
      
      // Analytics
      trackEvent('config_generate', { style, light, mobility, result_count: equipment.length });
    });
    
    // Reset button event
    configReset.addEventListener('click', () => {
      // Reset form
      document.querySelector('input[id="style-landscape"]').checked = true;
      document.querySelector('input[id="light-bright"]').checked = true;
      document.querySelector('input[id="mobility-medium"]').checked = true;
      
      // Hide results
      configResult.classList.remove('show');
      setTimeout(() => {
        configResult.style.display = 'none';
      }, 300);
      
      // Analytics
      trackEvent('config_reset', {});
    });
  }
  
  // YouTube videos initialization
  function initYouTubeVideos() {
    const videos = document.querySelectorAll('.video-container iframe');
    
    if (!videos.length) return;
    
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const iframe = entry.target;
            videoObserver.unobserve(iframe);
          }
        });
      }, { threshold: 0.1 });
      
      videos.forEach(video => videoObserver.observe(video));
    }
  }
  
  // Initialize the page
  init();
});
