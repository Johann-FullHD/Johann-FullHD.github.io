// Informatik Seite JS
(function () {
  "use strict";

  // CountUp Animation für die KPIs
  function initCountUp() {
    const kpiElements = document.querySelectorAll(".if-kpi .val");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              !entry.target.classList.contains("counted")
            ) {
              const targetValue = parseInt(
                entry.target.getAttribute("data-value"),
                10
              );
              animateValue(entry.target, 0, targetValue, 2000);
              entry.target.classList.add("counted");
            }
          });
        },
        { threshold: 0.1 }
      );

      kpiElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback für Browser ohne IntersectionObserver
      kpiElements.forEach((el) => {
        const targetValue = parseInt(el.getAttribute("data-value"), 10);
        animateValue(el, 0, targetValue, 2000);
      });
    }
  }

  function animateValue(element, start, end, duration) {
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(start + progress * (end - start));
      element.textContent = value;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }

  // Demo-Login-Button verknüpfen
  function initDemoLogin() {
    const demoButton = document.getElementById("login-demo");
    if (demoButton) {
      demoButton.addEventListener("click", function () {
        // Wenn Premium-Login-Funktion existiert, diese aufrufen
        if (typeof showPremiumLoginPopup === "function") {
          showPremiumLoginPopup();
        }
      });
    }
  }

  // Alles initialisieren
  function init() {
    initCountUp();
    initDemoLogin();
  }

  // Beim Laden der Seite ausführen
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
