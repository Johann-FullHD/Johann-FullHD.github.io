document.addEventListener("DOMContentLoaded", function () {
  // Offlinestatus überwachen
  function updateOnlineStatus() {
    const banner = document.getElementById("offline-banner");
    if (!banner) return;

    if (navigator.onLine) {
      banner.classList.remove("visible");
      banner.classList.remove("show");
    } else {
      banner.classList.add("visible");
      banner.classList.add("show");
    }
  }

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
  updateOnlineStatus();

  // Inhaltsverzeichnis generieren
  function generateTOC() {
    const tocList = document.getElementById("toc-list");
    if (!tocList) return;

    const sections = document.querySelectorAll(".privacy-section");

    sections.forEach((section) => {
      const heading = section.querySelector("h2");
      if (!heading) return;

      const id = section.id;
      const title = heading.textContent;

      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${id}`;
      link.textContent = title;

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });
  }

  // Aktiven Abschnitt im Inhaltsverzeichnis hervorheben
  function highlightActiveTocItem() {
    const tocLinks = document.querySelectorAll(".privacy-toc a");
    const sections = document.querySelectorAll(".privacy-section");

    let currentSectionId = "";

    // Bestimme den aktuell sichtbaren Abschnitt
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom >= 100) {
        currentSectionId = section.id;
      }
    });

    // Aktiven Link hervorheben
    tocLinks.forEach((link) => {
      const href = link.getAttribute("href").substring(1);

      if (href === currentSectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", highlightActiveTocItem);

  // Verbesserte Suchfunktion mit Accessibility und besserer UX
  function setupSearch() {
    const searchInput = document.getElementById("privacy-search-input");
    if (!searchInput) return;

    // Debounce-Funktion, um die Suche zu optimieren
    function debounce(func, wait) {
      let timeout;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          func.apply(context, args);
        }, wait);
      };
    }

    // Status für die Suche
    let searchActive = false;
    let searchResultCount = 0;
    let currentHighlightIndex = -1;
    let highlightElements = [];

    // Status-Element für Suchergebnisse erstellen
    const searchStatus = document.createElement("div");
    searchStatus.className = "privacy-search-status";
    searchStatus.setAttribute("aria-live", "polite");
    searchInput.parentNode.insertAdjacentElement("afterend", searchStatus);

    // Navigation für Treffer hinzufügen, wenn wir mehrere Treffer haben
    const searchNav = document.createElement("div");
    searchNav.className = "privacy-search-nav";
    searchNav.style.display = "none";
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

    const prevButton = searchNav.querySelector(".privacy-search-prev");
    const nextButton = searchNav.querySelector(".privacy-search-next");
    const countDisplay = searchNav.querySelector(".privacy-search-count");

    prevButton.addEventListener("click", () => navigateHighlights(-1));
    nextButton.addEventListener("click", () => navigateHighlights(1));

    // Funktion zum Ausführen der Suche
    const performSearch = debounce(function () {
      const query = searchInput.value.toLowerCase().trim();
      searchResultCount = 0;
      currentHighlightIndex = -1;
      highlightElements = [];

      // Alle bestehenden Hervorhebungen zurücksetzen
      resetHighlights();

      if (query.length < 2) {
        searchActive = false;
        searchStatus.textContent = "";
        searchNav.style.display = "none";
        return;
      }

      searchActive = true;

      // Text in allen Absätzen und Überschriften suchen
      const elements = document.querySelectorAll(
        ".privacy-section p, .privacy-section li, .privacy-section h2, .privacy-section h3, .privacy-section h4"
      );
      let firstMatchSection = null;

      elements.forEach((element) => {
        // Nach Übereinstimmungen suchen und Text markieren
        const result = highlightText(element, query);

        if (result.hasMatch) {
          searchResultCount += result.matchCount;
          highlightElements = highlightElements.concat(result.highlights);

          const section = element.closest(".privacy-section");
          if (!firstMatchSection && section) {
            firstMatchSection = section;
          }
        }
      });

      // Status aktualisieren
      if (searchResultCount > 0) {
        searchStatus.textContent = `${searchResultCount} Treffer gefunden`;
        searchStatus.classList.add("has-results");

        // Zum ersten Treffer scrollen
        if (firstMatchSection) {
          firstMatchSection.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
            block: "start",
            inline: "nearest",
          });

          // Ersten Treffer auswählen
          if (highlightElements.length > 0) {
            navigateHighlights(1);
          }
        }

        // Wenn wir mehr als einen Treffer haben, zeigen wir die Navigation
        if (searchResultCount > 1) {
          searchNav.style.display = "flex";
          updateCountDisplay();
        } else {
          searchNav.style.display = "none";
        }
      } else {
        searchStatus.textContent = "Keine Treffer gefunden";
        searchStatus.classList.remove("has-results");
        searchNav.style.display = "none";
      }
    }, 300);

    // Navigation durch Treffer
    function navigateHighlights(direction) {
      if (highlightElements.length === 0) return;

      // Aktuelle Hervorhebung zurücksetzen
      if (
        currentHighlightIndex >= 0 &&
        currentHighlightIndex < highlightElements.length
      ) {
        highlightElements[currentHighlightIndex].classList.remove("active");
      }

      // Zum nächsten/vorherigen Treffer
      currentHighlightIndex += direction;

      // Wraparound
      if (currentHighlightIndex < 0)
        currentHighlightIndex = highlightElements.length - 1;
      if (currentHighlightIndex >= highlightElements.length)
        currentHighlightIndex = 0;

      // Neuen Treffer markieren und anzeigen
      const highlight = highlightElements[currentHighlightIndex];
      highlight.classList.add("active");
      highlight.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "center",
        inline: "nearest",
      });

      updateCountDisplay();
    }

    // Anzeige der aktuellen Position aktualisieren
    function updateCountDisplay() {
      countDisplay.textContent = `${currentHighlightIndex + 1} von ${
        highlightElements.length
      }`;
    }

    // Highlights zurücksetzen
    function resetHighlights() {
      document.querySelectorAll(".highlight").forEach((el) => {
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
      let newHtml = "";
      let lastIndex = 0;
      let index;
      let matchCount = 0;
      let highlightIds = [];

      // Alle Vorkommen markieren
      while ((index = lowerText.indexOf(query, lastIndex)) !== -1) {
        const highlightId = `highlight-${Math.random()
          .toString(36)
          .substring(2, 9)}`;
        newHtml += escapeHTML(text.substring(lastIndex, index));
        newHtml += `<span id="${highlightId}" class="highlight" tabindex="-1">${escapeHTML(
          text.substring(index, index + query.length)
        )}</span>`;
        lastIndex = index + query.length;
        matchCount++;
        highlightIds.push(highlightId);
      }

      newHtml += escapeHTML(text.substring(lastIndex));
      element.innerHTML = newHtml;

      // Referenzen auf die neu erstellten Highlight-Elemente sammeln
      const highlights = highlightIds.map((id) => document.getElementById(id));

      return {
        hasMatch: true,
        matchCount,
        highlights,
        element,
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
    searchInput.addEventListener("input", performSearch);

    // Tastatur-Navigation für Suchergebnisse
    searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && searchActive && searchResultCount > 0) {
        // Fokus auf den nächsten Treffer setzen (nicht implementiert)
        e.preventDefault();
      }

      if (e.key === "Escape") {
        searchInput.value = "";
        resetHighlights();
        searchStatus.textContent = "";
        searchStatus.classList.remove("has-results");
        searchActive = false;
        e.preventDefault();
      }
    });
  }

  // Breadcrumbs aus JSON-LD generieren
  function generateBreadcrumbs() {
    const breadcrumbsContainer = document.querySelector(".breadcrumbs");
    if (!breadcrumbsContainer) return;

    // JSON-LD aus Script-Tag extrahieren
    const scriptTags = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );
    let breadcrumbData = null;

    scriptTags.forEach((script) => {
      try {
        const data = JSON.parse(script.textContent);
        if (data["@type"] === "BreadcrumbList") {
          breadcrumbData = data;
        }
      } catch (e) {
        console.error("Error parsing JSON-LD:", e);
      }
    });

    if (!breadcrumbData) return;

    // Breadcrumbs aus den Daten generieren
    const items = breadcrumbData.itemListElement || [];

    // Bestehende Elemente löschen
    breadcrumbsContainer.innerHTML = "";

    items.forEach((item, index) => {
      const listItem = document.createElement("li");
      listItem.className = "breadcrumbs-item";

      if (index < items.length - 1) {
        const link = document.createElement("a");
        link.href = item.item;
        link.className = "breadcrumbs-link";

        // Icon hinzufügen
        if (index === 0) {
          const icon = document.createElement("i");
          icon.className = "ri-home-4-line";
          link.appendChild(icon);
        }

        link.appendChild(document.createTextNode(" " + item.name));
        listItem.appendChild(link);
      } else {
        // Letztes Element als aktuell markieren
        const span = document.createElement("span");
        span.className = "breadcrumbs-current";

        const icon = document.createElement("i");
        icon.className = "ri-shield-line";
        span.appendChild(icon);

        span.appendChild(document.createTextNode(" " + item.name));
        listItem.appendChild(span);
      }

      breadcrumbsContainer.appendChild(listItem);
    });
  }

  // Cookie-Scanner
  function scanCookies() {
    const table = document.getElementById("cookie-scanner-table");
    if (!table) return;

    const tbody = table.querySelector("tbody");
    const cookies = document.cookie.split(";");

    // Erste Zeile ist bereits vorhanden und enthält die cookiePrefsV2

    cookies.forEach((cookie) => {
      if (!cookie.trim()) return;

      const parts = cookie.split("=");
      const name = parts[0].trim();

      // cookiePrefsV2 überspringen, da bereits in der Tabelle
      if (name === "cookiePrefsV2") return;

      const row = document.createElement("tr");

      // Name
      const nameCell = document.createElement("td");
      nameCell.textContent = name;
      row.appendChild(nameCell);

      // Anbieter
      const providerCell = document.createElement("td");
      providerCell.textContent = "johann-fullhd.github.io";
      row.appendChild(providerCell);

      // Zweck
      const purposeCell = document.createElement("td");
      purposeCell.textContent = "Website-Funktionalität";
      row.appendChild(purposeCell);

      // Speicherdauer
      const durationCell = document.createElement("td");
      durationCell.textContent = "Sitzung";
      row.appendChild(durationCell);

      // Partitioniert
      const partitionedCell = document.createElement("td");

      // Prüfen, ob der Cookie partitioniert ist
      const isPartitioned = checkIfPartitioned(name);
      partitionedCell.textContent = isPartitioned ? "Ja" : "Nein";

      row.appendChild(partitionedCell);

      tbody.appendChild(row);
    });
  }

  // Prüft, ob ein Cookie partitioniert ist
  function checkIfPartitioned(cookieName) {
    // Die Erkennung ist nicht perfekt, da es keine direkte API gibt
    // Wir prüfen, ob der Browser Partitioned Cookies unterstützt

    // Firefox: ab Version 109 (Januar 2023)
    const isFirefox = navigator.userAgent.includes("Firefox");
    const firefoxMatch = navigator.userAgent.match(/Firefox\/(\d+)/);
    const firefoxVersion = firefoxMatch ? parseInt(firefoxMatch[1], 10) : 0;

    // Chrome: ab Version 118 (Oktober 2023)
    const isChrome =
      navigator.userAgent.includes("Chrome") &&
      !navigator.userAgent.includes("Edg");
    const chromeMatch = navigator.userAgent.match(/Chrome\/(\d+)/);
    const chromeVersion = chromeMatch ? parseInt(chromeMatch[1], 10) : 0;

    // Safari: ab Version 16.4 (März 2023)
    const isSafari =
      navigator.userAgent.includes("Safari") &&
      !navigator.userAgent.includes("Chrome");
    const safariMatch = navigator.userAgent.match(/Version\/(\d+\.\d+)/);
    const safariVersion = safariMatch ? parseFloat(safariMatch[1]) : 0;

    // Edge basiert auf Chromium, gleiche Versionen wie Chrome
    const isEdge = navigator.userAgent.includes("Edg");
    const edgeMatch = navigator.userAgent.match(/Edg\/(\d+)/);
    const edgeVersion = edgeMatch ? parseInt(edgeMatch[1], 10) : 0;

    const supportsPartitioning =
      (isFirefox && firefoxVersion >= 109) ||
      (isChrome && chromeVersion >= 118) ||
      (isSafari && safariVersion >= 16.4) ||
      (isEdge && edgeVersion >= 118);

    // Heuristik: Drittanbieter-Cookies oder Cookies mit speziellen Präfixen
    // könnten partitioniert sein
    const potentiallyPartitioned =
      cookieName.includes("_") ||
      cookieName.startsWith("_ga") ||
      cookieName.startsWith("_gid");

    return supportsPartitioning && potentiallyPartitioned;
  }

  // Als Markdown exportieren
  function setupMarkdownExport() {
    const exportBtn = document.getElementById("export-markdown");
    if (!exportBtn) return;

    exportBtn.addEventListener("click", function () {
      // Inhalt der Datenschutzerklärung als Markdown konvertieren
      let markdown = "# Datenschutzerklärung\n\n";
      markdown +=
        "> Stand: " +
        new Date().toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) +
        "\n\n";

      document.querySelectorAll(".privacy-section").forEach((section) => {
        const heading = section.querySelector("h2");
        if (heading) {
          markdown += `## ${heading.textContent}\n\n`;
        }

        section.querySelectorAll("p").forEach((p) => {
          markdown += `${p.textContent}\n\n`;
        });

        section.querySelectorAll("h3").forEach((h3) => {
          markdown += `### ${h3.textContent}\n\n`;
        });

        section.querySelectorAll("ul").forEach((ul) => {
          ul.querySelectorAll("li").forEach((li) => {
            markdown += `* ${li.textContent}\n`;
          });
          markdown += "\n";
        });

        section.querySelectorAll("ol").forEach((ol) => {
          let i = 1;
          ol.querySelectorAll("li").forEach((li) => {
            markdown += `${i}. ${li.textContent}\n`;
            i++;
          });
          markdown += "\n";
        });
      });

      // Markdown herunterladen
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        "datenschutzerklaerung-" +
        new Date().toISOString().split("T")[0] +
        ".md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Link zum aktuellen Abschnitt kopieren
  function setupLinkCopy() {
    const copyBtn = document.getElementById("copy-link-button");
    if (!copyBtn) return;

    copyBtn.addEventListener("click", function () {
      // Aktuellen Hash aus der URL holen oder ersten Abschnitt verwenden
      let hash = window.location.hash;
      if (!hash) {
        const firstSection = document.querySelector(".privacy-section");
        if (firstSection && firstSection.id) {
          hash = "#" + firstSection.id;
        }
      }

      // Vollständige URL mit Hash erstellen
      const url = window.location.origin + window.location.pathname + hash;

      // In die Zwischenablage kopieren
      navigator.clipboard
        .writeText(url)
        .then(() => {
          // Feedback anzeigen
          const originalText = copyBtn.innerHTML;
          copyBtn.innerHTML = '<i class="ri-check-line"></i> Link kopiert!';
          setTimeout(() => {
            copyBtn.innerHTML = originalText;
          }, 2000);
        })
        .catch((err) => {
          console.error("Fehler beim Kopieren des Links:", err);
        });
    });
  }

  // Schriftgröße anpassen
  function setupFontSizeAdjustment() {
    const increaseButton = document.getElementById("font-size-increase");
    const decreaseButton = document.getElementById("font-size-decrease");
    if (!increaseButton || !decreaseButton) return;

    // Aktuelle Schriftgröße aus dem CSS holen
    const contentElement = document.querySelector(".privacy-content");
    const computedStyle = window.getComputedStyle(contentElement);
    let currentSize = parseInt(computedStyle.fontSize);

    // Gespeicherte Schriftgröße laden
    const savedSize = localStorage.getItem("privacy-font-size");
    if (savedSize) {
      currentSize = parseInt(savedSize);
      contentElement.style.fontSize = currentSize + "px";
    }

    // Schriftgröße anpassen und für Screenreader ankündigen
    function updateFontSize(newSize) {
      contentElement.style.fontSize = newSize + "px";
      localStorage.setItem("privacy-font-size", newSize);

      // Erstelle oder aktualisiere eine aria-live Region für Screenreader
      let announcer = document.getElementById("font-size-announcer");
      if (!announcer) {
        announcer = document.createElement("div");
        announcer.id = "font-size-announcer";
        announcer.setAttribute("aria-live", "polite");
        announcer.className = "sr-only";
        document.body.appendChild(announcer);
      }
      announcer.textContent = `Schriftgröße wurde auf ${newSize} Pixel geändert`;
    }

    increaseButton.addEventListener("click", function () {
      if (currentSize < 24) {
        currentSize += 2;
        updateFontSize(currentSize);

        // Visuelles Feedback anzeigen
        const originalText = increaseButton.innerHTML;
        increaseButton.innerHTML =
          '<i class="ri-zoom-in-line"></i> ' + currentSize + "px";
        increaseButton.classList.add("active");

        setTimeout(() => {
          increaseButton.innerHTML = originalText;
          increaseButton.classList.remove("active");
        }, 1000);
      }
    });

    decreaseButton.addEventListener("click", function () {
      if (currentSize > 12) {
        currentSize -= 2;
        updateFontSize(currentSize);

        // Visuelles Feedback anzeigen
        const originalText = decreaseButton.innerHTML;
        decreaseButton.innerHTML =
          '<i class="ri-zoom-out-line"></i> ' + currentSize + "px";
        decreaseButton.classList.add("active");

        setTimeout(() => {
          decreaseButton.innerHTML = originalText;
          decreaseButton.classList.remove("active");
        }, 1000);
      }
    });
  }

  // Vereinfachte Sprache umschalten
  function setupSimplifiedLanguage() {
    const toggleButton = document.getElementById("toggle-simplified");
    if (!toggleButton) return;

    let simplified = localStorage.getItem("privacy-simplified") === "true";

    // Vereinfachte Versionen der Texte
    const simplifiedTexts = {
      introduction:
        "Wir erklären hier, welche Daten wir von Ihnen sammeln und was wir damit machen. Diese Regeln folgen dem Datenschutzgesetz der EU.",
      basics:
        "Wir sammeln nur Daten, die wir wirklich brauchen. Wir benutzen sie nur für den Zweck, für den wir sie gesammelt haben. Wir speichern sie nur so lange wie nötig.",
      responsible:
        "Johann Kramer ist verantwortlich für den Schutz Ihrer Daten. Bei Fragen schreiben Sie an privacy@johann-fullhd.github.io.",
      "storage-period":
        "Wir löschen Ihre Daten, sobald wir sie nicht mehr brauchen. Manchmal müssen wir sie länger aufbewahren, weil das Gesetz es vorschreibt.",
      rights:
        "Sie haben das Recht zu erfahren, welche Daten wir von Ihnen haben. Sie können verlangen, dass wir sie korrigieren oder löschen. Sie können auch der Verarbeitung widersprechen.",
      changes:
        "Diese Datenschutzerklärung kann sich ändern. Die aktuelle Version finden Sie immer hier.",
      "web-analytics":
        "Wir nutzen Google Analytics nur, wenn Sie zustimmen. Es hilft uns zu verstehen, wie Besucher unsere Seite nutzen.",
      "external-tools":
        "Wir nutzen Dienste wie Schriftarten und Icons von anderen Anbietern. Dabei werden möglicherweise Daten übertragen.",
    };

    function applySimplifiedMode() {
      if (simplified) {
        toggleButton.innerHTML =
          '<i class="ri-translate-2"></i> Normale Sprache';

        Object.keys(simplifiedTexts).forEach((sectionId) => {
          const section = document.getElementById(sectionId);
          if (section) {
            const firstParagraph = section.querySelector(
              "p:not(.text-large):not([data-original])"
            );
            if (firstParagraph) {
              firstParagraph.setAttribute(
                "data-original",
                firstParagraph.textContent
              );
              firstParagraph.textContent = simplifiedTexts[sectionId];
              firstParagraph.classList.add("simplified-text");
            }
          }
        });
      } else {
        toggleButton.innerHTML =
          '<i class="ri-translate-2"></i> Vereinfachte Sprache';

        document.querySelectorAll("p[data-original]").forEach((p) => {
          p.textContent = p.getAttribute("data-original");
          p.removeAttribute("data-original");
          p.classList.remove("simplified-text");
        });
      }
    }

    // Initial anwenden
    applySimplifiedMode();

    toggleButton.addEventListener("click", function () {
      simplified = !simplified;
      localStorage.setItem("privacy-simplified", simplified);
      applySimplifiedMode();
    });
  }

  // Lesefortschritt anzeigen
  function setupReadingProgress() {
    const progressBar = document.getElementById("privacy-progress-bar");
    if (!progressBar) return;

    window.addEventListener("scroll", function () {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + "%";
    });
  }

  // "Zurück nach oben" Button
  function setupBackToTop() {
    const backToTopButton = document.getElementById("backToTop");
    if (!backToTopButton) return;

    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("show");
      } else {
        backToTopButton.classList.remove("show");
      }
    });

    backToTopButton.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Verbesserte Dark Mode Toggle mit Animation und Accessibility
  function setupDarkModeToggle() {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    if (!darkModeToggle) return;

    // Prüfen, ob Dark Mode aktiv ist
    let isDarkMode = localStorage.getItem("privacy-dark-mode") === "true";

    // Wenn keine Einstellung vorhanden ist, das System-Farbschema verwenden
    if (localStorage.getItem("privacy-dark-mode") === null) {
      isDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function updateDarkMode(darkMode) {
      if (darkMode) {
        document.documentElement.classList.add("dark-mode");
        darkModeToggle.innerHTML = '<i class="ri-sun-line"></i> Light Mode';
        darkModeToggle.setAttribute("aria-pressed", "true");
        darkModeToggle.setAttribute(
          "aria-label",
          "Zu Light Mode wechseln (aktuell: Dark Mode)"
        );

        // Meta Theme Color für Browser-UI anpassen
        const metaThemeColor = document.querySelector(
          'meta[name="theme-color"]'
        );
        if (metaThemeColor) {
          metaThemeColor.setAttribute("content", "#1e293b");
        }
      } else {
        document.documentElement.classList.remove("dark-mode");
        darkModeToggle.innerHTML = '<i class="ri-moon-line"></i> Dark Mode';
        darkModeToggle.setAttribute("aria-pressed", "false");
        darkModeToggle.setAttribute(
          "aria-label",
          "Zu Dark Mode wechseln (aktuell: Light Mode)"
        );

        // Meta Theme Color für Browser-UI anpassen
        const metaThemeColor = document.querySelector(
          'meta[name="theme-color"]'
        );
        if (metaThemeColor) {
          metaThemeColor.setAttribute("content", "#0a84ff");
        }
      }

      // Event für andere Komponenten auslösen
      const event = new CustomEvent("darkModeChanged", {
        detail: { darkMode: darkMode },
      });
      document.dispatchEvent(event);

      // Transition für sanfteren Übergang
      document.documentElement.style.transition =
        "background-color 0.5s ease, color 0.5s ease";
      setTimeout(() => {
        document.documentElement.style.transition = "";
      }, 500);
    }

    // Initial anwenden
    updateDarkMode(isDarkMode);

    darkModeToggle.addEventListener("click", function () {
      isDarkMode = !document.documentElement.classList.contains("dark-mode");
      localStorage.setItem("privacy-dark-mode", isDarkMode);
      updateDarkMode(isDarkMode);

      // Visuelles und akustisches Feedback
      darkModeToggle.classList.add("active");

      // Animation basierend auf Übergang
      const transitionClass = isDarkMode
        ? "dark-transition"
        : "light-transition";
      document.documentElement.classList.add(transitionClass);

      // Animation nach Abschluss entfernen
      setTimeout(() => {
        darkModeToggle.classList.remove("active");
        document.documentElement.classList.remove(transitionClass);

        // Screenreader-Ankündigung
        let announcer = document.getElementById("dark-mode-announcer");
        if (!announcer) {
          announcer = document.createElement("div");
          announcer.id = "dark-mode-announcer";
          announcer.setAttribute("aria-live", "polite");
          announcer.className = "sr-only";
          document.body.appendChild(announcer);
        }
        announcer.textContent = isDarkMode
          ? "Dark Mode aktiviert"
          : "Light Mode aktiviert";
      }, 500);
    });

    // Auf Systemänderungen reagieren
    try {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // Moderne Browser: addEventListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", (e) => {
          // Nur anwenden, wenn keine Benutzereinstellung vorhanden ist
          if (localStorage.getItem("privacy-dark-mode") === null) {
            isDarkMode = e.matches;
            updateDarkMode(isDarkMode);
          }
        });
      }
      // Ältere Browser: addListener (veraltet)
      else if (mediaQuery.addListener) {
        mediaQuery.addListener((e) => {
          if (localStorage.getItem("privacy-dark-mode") === null) {
            isDarkMode = e.matches;
            updateDarkMode(isDarkMode);
          }
        });
      }
    } catch (e) {
      console.log("Browser unterstützt keine matchMedia-Events:", e);
    }
  }

  // Letzte Aktualisierung anzeigen
  function setupLastUpdated() {
    const lastUpdatedElement = document.getElementById("last-updated");
    if (lastUpdatedElement) {
      const updateDate = new Date("2025-08-27");
      lastUpdatedElement.textContent = updateDate.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  }

  // Lesedauer berechnen
  function calculateReadingTime() {
    const readingTimeElement = document.getElementById("reading-time");
    if (!readingTimeElement) return;

    // Text aus allen Absätzen holen
    const text = Array.from(
      document.querySelectorAll(".privacy-section p, .privacy-section li")
    )
      .map((el) => el.textContent)
      .join(" ");

    // Wörter zählen (durchschnittliche deutsche Wortlänge ist länger als englische)
    const words = text.trim().split(/\s+/).length;

    // Durchschnittliche Lesegeschwindigkeit: 200 Wörter pro Minute
    const minutes = Math.ceil(words / 200);

    readingTimeElement.textContent = `~${minutes} Minuten`;
  }

  // Funktionen initialisieren
  generateTOC();
  highlightActiveTocItem();
  setupSearch();
  generateBreadcrumbs();
  scanCookies();
  setupMarkdownExport();
  setupLinkCopy();
  setupFontSizeAdjustment();
  setupSimplifiedLanguage();
  setupReadingProgress();
  setupBackToTop();
  setupDarkModeToggle();
  setupLastUpdated();
  calculateReadingTime();
});
