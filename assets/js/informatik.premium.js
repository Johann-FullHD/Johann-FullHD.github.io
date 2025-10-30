(function () {
  "use strict";
  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function qsa(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }
  function slugify(t) {
    return t
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  function trapFocus(container) {
    const FOCUSABLE =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const nodes = qsa(FOCUSABLE, container);
    if (nodes.length === 0) return () => {};
    const first = nodes[0],
      last = nodes[nodes.length - 1];
    function handler(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    container.addEventListener("keydown", handler);
    return () => container.removeEventListener("keydown", handler);
  }
  function hasAnalyticsConsent() {
    try {
      const p = JSON.parse(localStorage.getItem("cookiePrefsV2"));
      return !!(p && p.analytics);
    } catch (e) {
      return false;
    }
  }
  function applyConsentMode() {
    try {
      if (typeof gtag !== "function") return;
      const prefs = JSON.parse(localStorage.getItem("cookiePrefsV2") || "{}");
      const analytics = !!prefs.analytics;
      gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: analytics ? "granted" : "denied",
      });
    } catch (_) {}
  }
  // Session-ID & Event-Deduplikation
  function getSessionId() {
    try {
      let sid = sessionStorage.getItem("sid");
      if (!sid) {
        sid =
          self.crypto && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        sessionStorage.setItem("sid", sid);
      }
      return sid;
    } catch (_) {
      return "nosid";
    }
  }
  function isEventSent(key) {
    try {
      const raw = sessionStorage.getItem("evSent") || "{}";
      const map = JSON.parse(raw);
      return !!map[key];
    } catch (_) {
      return false;
    }
  }
  function markEventSent(key) {
    try {
      const raw = sessionStorage.getItem("evSent") || "{}";
      const map = JSON.parse(raw);
      map[key] = 1;
      sessionStorage.setItem("evSent", JSON.stringify(map));
    } catch (_) {}
  }
  function getPremiumLevel() {
    try {
      const logged = sessionStorage.getItem("userLoggedIn") === "true";
      if (!logged) return "none";
      return sessionStorage.getItem("premiumLevel") || "basic";
    } catch (_) {
      return "none";
    }
  }

  const AQ_KEY = "pgAnalyticsQueue";
  function enqueueEvent(name, params) {
    try {
      const q = JSON.parse(localStorage.getItem(AQ_KEY) || "[]");
      q.push({ name, params, t: Date.now() });
      localStorage.setItem(AQ_KEY, JSON.stringify(q));
    } catch (_) {}
  }
  function flushAnalyticsQueue() {
    if (!hasAnalyticsConsent()) return;
    try {
      const q = JSON.parse(localStorage.getItem(AQ_KEY) || "[]");
      if (!q.length) return;
      q.forEach((ev) => {
        try {
          if (typeof gtag === "function") {
            gtag("event", ev.name, ev.params || {});
          }
        } catch (_) {}
      });
      localStorage.setItem(AQ_KEY, "[]");
    } catch (_) {}
  }
  async function registerAnalyticsSync() {
    try {
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        if ("sync" in reg) await reg.sync.register("sync-analytics");
      }
    } catch (_) {}
  }
  window.addEventListener("online", flushAnalyticsQueue);
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (e) => {
      if (e && e.data && e.data.type === "flush-analytics") {
        flushAnalyticsQueue();
      }
    });
  }

  function track(name, params) {
    const sid = getSessionId();
    const ctx = {
      premium_level: (getPremiumLevel() || "none").toLowerCase(),
      filters:
        typeof currentFilters !== "undefined"
          ? currentFilters.has("all")
            ? "all"
            : Array.from(currentFilters).join(",")
          : "",
      search_term: typeof currentSearch !== "undefined" ? currentSearch : "",
      sid,
    };
    const payload = Object.assign({ method: "web" }, ctx, params || {});
    const dedupKey = params && params.dedupKey;
    if (dedupKey && isEventSent(dedupKey)) return;
    if (
      typeof gtag === "function" &&
      hasAnalyticsConsent() &&
      navigator.onLine
    ) {
      gtag("event", name, payload);
      if (dedupKey) markEventSent(dedupKey);
    } else {
      enqueueEvent(name, payload);
      registerAnalyticsSync();
    }
  }

  const __MODULE_START =
    performance && performance.now ? performance.now() : Date.now();
  let __ttfrTracked = false;
  function initErrorTracking() {
    if (!hasAnalyticsConsent()) return;
    const dsn = window.SENTRY_DSN || localStorage.getItem("sentryDsn") || "";
    if (!dsn) return;
    const load = (u, cb) => {
      const s = document.createElement("script");
      s.src = u;
      s.crossOrigin = "anonymous";
      s.onload = cb;
      document.head.appendChild(s);
    };
    load("https://browser.sentry-cdn.com/7.113.0/bundle.tracing.min.js", () => {
      if (window.Sentry) {
        window.Sentry.init({
          dsn,
          integrations: [new window.Sentry.BrowserTracing()],
          tracesSampleRate: 0.1,
          release: window.APP_RELEASE || new Date().toISOString().slice(0, 10),
        });
        window.Sentry.setTag("premium_level", getPremiumLevel());
        const showFeedback = (eventId) => {
          try {
            if (sessionStorage.getItem("sentryFeedbackShown") === "1") return;
            sessionStorage.setItem("sentryFeedbackShown", "1");
            window.Sentry.showReportDialog({
              eventId,
              title: "Es ist ein Fehler aufgetreten",
              subtitle: "Hilf mit, das Problem zu verbessern. (Optional)",
            });
          } catch (_) {}
        };
        window.addEventListener("error", (e) => {
          try {
            const id = window.Sentry.captureException(
              e.error || new Error(e.message || "Unknown Error")
            );
            showFeedback(id);
          } catch (_) {}
        });
        window.addEventListener("unhandledrejection", (e) => {
          try {
            const id = window.Sentry.captureException(
              e.reason || new Error("Unhandled rejection")
            );
            showFeedback(id);
          } catch (_) {}
        });
      }
    });
  }

  const _0x2f1a=['xfnt7Q==','dTVFs3==','o1Be8w==','c7Hj5Z==','b3Up9Q==','Psd25@','25pdsfös€8!','DKTVsig','48ZS42ST6607','6264!D@u','51ZÜ5'];
  function _0xd37c(_0x516c00,_0x25a6fd){const _0x3baa9c=_0x2f1a;return _0xd37c=function(_0x1afc75,_0x57630c){_0x1afc75=_0x1afc75-0x1cf;let _0x1411c5=_0x3baa9c[_0x1afc75];return _0x1411c5;},_0xd37c(_0x516c00,_0x25a6fd);}
  function _verifyCredentials(level, user, password) {
    const l = level ? level.toLowerCase() : '';
    if(l === 'basic' && user === 'Psd25@' && password === '25pdsfös€8!') return true;
    if(l === 'pro' && user === 'DKTVsig' && password === '48ZS42ST6607') return true; 
    if(l === 'ultimate' && user === '6264!D@u' && password === '51ZÜ5') return true;
    return false;
  }
  function showPremiumLoginPopup(preselectLevel) {
    if (qs("#premium-login-popup")) return;
    const opener = document.activeElement;
    const wrap = document.createElement("div");
    wrap.id = "premium-login-popup";
    wrap.className = "premium-login-popup";
    wrap.innerHTML = `
      <div class="popup-content" role="dialog" aria-modal="true" aria-labelledby="premium-login-title">
        <button class="popup-close" aria-label="Schließen">&times;</button>
        <div class="popup-header">
          <h3 id="premium-login-title" class="popup-title"><i class="ri-vip-crown-line" aria-hidden="true"></i> Premium Login</h3>
          <p class="popup-subtitle">Loggen Sie sich mit Ihren Zugangsdaten ein, um Premium-Inhalte zu nutzen.</p>
        </div>
        <form id="premium-login-form">
          <div class="form-row">
            <label for="pl-user">Benutzername</label>
            <input id="pl-user" name="user" type="text" required autocomplete="off" placeholder="Benutzername eingeben" />
          </div>
          <div class="form-row">
            <label for="pl-pass">Passwort</label>
            <input id="pl-pass" name="pass" type="password" required autocomplete="off" placeholder="Passwort eingeben" />
          </div>
          <div class="form-row premium-level-selector">
            <label>Premium-Stufe auswählen</label>
            <div class="premium-tiers">
              <button type="button" class="premium-tier tier-basic" data-level="basic"><span class="tier-icon"><i class="ri-leaf-line" aria-hidden="true"></i></span><span class="tier-name">Basic</span></button>
              <button type="button" class="premium-tier tier-pro" data-level="pro"><span class="tier-icon"><i class="ri-rocket-line" aria-hidden="true"></i></span><span class="tier-name">Pro</span></button>
              <button type="button" class="premium-tier tier-ultimate" data-level="ultimate"><span class="tier-icon"><i class="ri-vip-crown-2-line" aria-hidden="true"></i></span><span class="tier-name">Ultimate</span></button>
            </div>
          </div>
          <button class="login-submit premium-login-btn" type="submit"><i class="ri-login-circle-line" aria-hidden="true"></i> <span>Einloggen</span></button>
        </form>
      </div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add("active"));
    document.body.classList.add("no-scroll");
    const content = qs(".popup-content", wrap);
    const untrap = trapFocus(content);
    const userInput = qs("#pl-user", wrap);
    if (userInput) userInput.focus();
    function close() {
      wrap.classList.remove("active");
      setTimeout(() => {
        wrap.remove();
        document.body.classList.remove("no-scroll");
        untrap();
        if (opener && opener.focus) opener.focus();
      }, 200);
      document.removeEventListener("keydown", esc);
    }
    function esc(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", esc);
    qs(".popup-close", wrap).addEventListener("click", close);
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) close();
    });
    // Premium-Stufen Auswahl
    qsa(".premium-tier", wrap).forEach((btn) => {
      btn.addEventListener("click", () => {
        qsa(".premium-tier", wrap).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const lvl = btn.getAttribute("data-level");
        
        // Keine Passwörter mehr vorgeben
        if (window.Sentry)
          window.Sentry.addBreadcrumb({
            category: "ui.action",
            message: "premium_level_select",
            level: "info",
            data: { level: lvl },
          });
        track("premium_level_select", { level: lvl });
      });
    });
    
    // Optional vorselektieren
    if (preselectLevel) {
      const btn = qs(`.premium-tier[data-level="${preselectLevel}"]`, wrap);
      if (btn) btn.click();
    }
    
    // Submit mit Credential-Prüfung
    qs("#premium-login-form", wrap).addEventListener("submit", function (e) {
      e.preventDefault();
      const user = this.user.value.trim();
      const password = this.pass.value;
      const active = qs(".premium-tier.active", wrap);
      const level = active ? active.getAttribute("data-level") : "basic";
      
      // Credentials überprüfen mit versteckter Funktion
      if (_verifyCredentials(level, user, password)) {
        try {
          sessionStorage.setItem("userLoggedIn", "true");
          sessionStorage.setItem("premiumUser", user);
          sessionStorage.setItem("premiumLevel", level);
        } catch (_) {}
        updatePremiumStatus();
        track("login_success", { level });
        // Konversion je Premium-Stufe (Login)
        track("conversion", { stage: "login", achieved_level: level });
        showToast(`Premium-Zugang (${level.toUpperCase()}) erfolgreich aktiviert`, 'success');
        close();
      } else {
        // Ungültige Anmeldedaten
        showToast('Ungültige Anmeldedaten für die gewählte Stufe', 'error');
        this.pass.value = '';
        this.pass.focus();
        track("login_failed", { level });
      }
    });
  }

  function renderPremiumTable() {
    const host = qs("#premium-content");
    if (!host) return;
    if (qs("#premium-tiers")) return;
    const wrap = document.createElement("div");
    wrap.className = "premium-tiers-comparison";
    wrap.id = "premium-tiers";
    wrap.innerHTML = `<table class="tiers-table" aria-label="Premium Vergleich"><thead><tr><th>Feature</th><th>Basic</th><th>Pro</th><th>Ultimate</th></tr></thead><tbody>
      <tr><td>Vorlagen</td><td class="check">✔</td><td class="check">✔</td><td class="check">✔</td></tr>
      <tr><td>Premium Projekte</td><td class="cross">✖</td><td class="check">✔</td><td class="check">✔</td></tr>
      <tr><td>Uneingeschränkter Zugriff</td><td class="cross">✖</td><td class="cross">✖</td><td class="check">✔</td></tr>
    </tbody></table>`;
    host.appendChild(wrap);
  }

  function updatePremiumStatus() {
    const status = qs("#premium-status");
    const content = qs("#premium-content");
    const loginBtn = qs("#premium-login-btn");
    const loggedIn = sessionStorage.getItem("userLoggedIn") === "true";
    const user = sessionStorage.getItem("premiumUser") || "User";
    const level = (
      sessionStorage.getItem("premiumLevel") || "basic"
    ).toLowerCase();
    if (status) {
      if (loggedIn) {
        status.innerHTML = `<span class="premium-user"><span class="premium-user-avatar" aria-hidden="true">${user
          .charAt(0)
          .toUpperCase()}</span> ${user}</span> <span class="premium-level premium-${level}">Stufe: ${
          level.charAt(0).toUpperCase() + level.slice(1)
        }</span> <button id="premium-logout" class="btn secondary">Logout</button>`;
      } else {
        status.innerHTML =
          '<span class="premium-level"><i class="ri-user-line" aria-hidden="true"></i> Nicht angemeldet</span>';
      }
    }
    if (content) {
      if (loggedIn) {
        content.innerHTML = `<div class="premium-welcome">Willkommen, <b>${user}</b>! Du hast Zugriff auf <b>${
          level.charAt(0).toUpperCase() + level.slice(1)
        }</b>-Premium-Inhalte.</div>`;
      } else {
        content.innerHTML =
          '<div class="premium-hint"><i class="ri-lock-line" aria-hidden="true"></i> Bitte logge dich ein, um Premium-Inhalte zu sehen.</div>';
      }
      renderPremiumTable();
    }
    if (loginBtn) loginBtn.style.display = loggedIn ? "none" : "inline-flex";
    const lo = qs("#premium-logout");
    if (lo)
      lo.onclick = function () {
        try {
          sessionStorage.clear();
        } catch (_) {}
        updatePremiumStatus();
      };
  }
  function initPremiumLogin() {
    const btn = qs("#premium-login-btn");
    if (btn) btn.addEventListener("click", () => showPremiumLoginPopup());
    updatePremiumStatus();
  }

  // URL-State
  function parseState() {
    const usp = new URLSearchParams(location.search);
    const sSearch = (usp.get("search") || "").toLowerCase();
    const sSort = usp.get("sort") || "name-asc";
    const sFilters = usp.get("filters") || "all";
    const filters = new Set(
      sFilters === "all" ? ["all"] : sFilters.split(",").filter(Boolean)
    );
    return { sSearch, sSort, filters };
  }
  function writeState() {
    const usp = new URLSearchParams(location.search);
    const filters = currentFilters.has("all")
      ? "all"
      : Array.from(currentFilters).join(",");
    if (currentSearch) usp.set("search", currentSearch);
    else usp.delete("search");
    usp.set("sort", currentSort);
    usp.set("filters", filters || "all");
    history.replaceState(
      null,
      "",
      location.pathname + "?" + usp.toString() + location.hash
    );
  }
  function savePrefs() {
    try {
      const prefs = {
        filters: currentFilters.has("all")
          ? "all"
          : Array.from(currentFilters).join(","),
        sort: currentSort,
      };
      localStorage.setItem("pgPrefs", JSON.stringify(prefs));
    } catch (_) {}
  }
  function loadPrefs() {
    try {
      const p = JSON.parse(localStorage.getItem("pgPrefs") || "{}");
      return p || {};
    } catch (_) {
      return {};
    }
  }

  // Projekte
  const projects = [
    {
      title: "KDownloader",
      cat: "python",
      img: "assets/img/Informatik/photo-1551033406-611cf9a28f67.avif",
      desc: "Python-Tool zum Herunterladen von Videos von vielen Plattformen.",
      live: "#",
      code: "https://github.com/Johann-FullHD/KDownloader",
      premium: true,
      level: "ultimate",
      tags: ["python", "cli", "downloader"],
      added: "2025-08-12",
    },
    {
      title: "EXIF-Viewer",
      cat: "tools",
      img: "assets/img/Informatik/photo-1551033406-611cf9a28f67.avif",
      desc: "EXIF-/Metadaten-Viewer für Bilder.",
      live: "#",
      code: "https://github.com/Johann-FullHD/EXIF_VIEWER",
      premium: false,
      tags: ["images", "exif", "python"],
      added: "2025-08-16",
    },
    {
      title: "System-Access-Point",
      cat: "python",
      img: "assets/img/Informatik/photo-1551033406-611cf9a28f67.avif",
      desc: "Toolkit zum Überwachen und Interagieren mit Systemkomponenten.",
      live: "#",
      code: "https://github.com/Johann-FullHD/System-Components-Access-Point",
      premium: true,
      level: "pro",
      tags: ["monitoring", "system", "python"],
      added: "2025-07-30",
    },
    {
      title: "Visual Basic Script (.vbs)",
      cat: "docs",
      img: "assets/img/Informatik/photo-1551033406-611cf9a28f67.avif",
      desc: "Sammlung nützlicher .vbs-Befehle.",
      live: "#",
      code: "https://github.com/Johann-FullHD/Visual-Basic-Script",
      premium: false,
      tags: ["vbs", "windows", "scripts"],
      added: "2025-07-20",
    },
    {
      title: "CMD-Commands",
      cat: "docs",
      img: "assets/img/Informatik/photo-1551033406-611cf9a28f67.avif",
      desc: "Praktische CMD-Befehle im Überblick.",
      live: "#",
      code: "https://github.com/Johann-FullHD/Good-to-know-CMD-Commands",
      premium: false,
      tags: ["cmd", "windows", "cheatsheet"],
      added: "2025-07-28",
    },
    {
      title: "Julia",
      cat: "education",
      img: "assets/img/Informatik/photo-1551033406-611cf9a28f67.avif",
      desc: "Gesammelte Julia-Beispiele und Snippets.",
      live: "#",
      code: "https://github.com/Johann-FullHD/Calculate-with-Julia",
      premium: false,
      tags: ["julia", "math"],
      added: "2025-08-05",
    },
    {
      title: "Website Template",
      cat: "web",
      img: "assets/img/Informatik/DB_BR_143_270_(16528029695).jpg",
      desc: "Schulprojekt: BR 143 – Statische Website mit PWA.",
      live: "https://johann-fullhd.github.io/BR-143/",
      code: "https://github.com/Johann-FullHD/BR-143",
      premium: false,
      liveTest: true,
      tags: ["web", "pwa", "html"],
      added: "2025-07-22",
    },
    {
      title: "EOS Templates",
      cat: "tools",
      img: "assets/img/Informatik/eos.jpg",
      desc: "Mehrere Vorlagen für EOS als ZIP-Download.",
      live: "#",
      code: "downloads/EOS-Templates.zip",
      premium: true,
      level: "basic",
      tags: ["templates", "zip", "download"],
      added: "2025-08-02",
    },
  ];
  projects.forEach((p) => (p.slug = slugify(p.title)));

  function updateJsonLd() {
    let el = qs("#projects-jsonld");
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = "projects-jsonld";
      document.head.appendChild(el);
    }
    const graph = projects.map((p) => {
      const isCode = p.code && p.code !== "#";
      const base = {
        "@context": "https://schema.org",
        name: p.title,
        url: location.origin + location.pathname + "#project=" + p.slug,
        description: p.desc,
        image: location.origin + "/" + p.img,
      };
      if (isCode) {
        const lang = (p.tags || []).find((t) => /python|julia|html|css|js|vbs|theme/i.test(t)) || p.cat || "Code";
        return Object.assign(base, {
          "@type": "SoftwareSourceCode",
          codeRepository: p.code,
          programmingLanguage: String(lang).toUpperCase(),
          runtimePlatform: navigator.userAgent,
          targetProduct: p.premium ? (p.level || "basic").toUpperCase() : "PUBLIC",
        });
      }
      return Object.assign(base, { "@type": "CreativeWork" });
    });
    el.textContent = JSON.stringify(graph);
  }

  // Filter/Suche/Sort + Virtualization
  let currentFilters = new Set(["all"]);
  let currentSearch = "";
  let currentSort = "name-asc";
  let filtered = [];
  let renderIndex = 0;
  const PAGE = 9;
  let sentinel;
  let io;

  // Leichte Fuzzy-Suche (Subsequence-Score mit Nähe-Bonus)
  function fuzzyScore(query, text) {
    if (!query) return 1;
    let qi = 0,
      score = 0,
      streak = 0;
    const q = query.toLowerCase();
    const t = text.toLowerCase();
    for (let i = 0; i < t.length && qi < q.length; i++) {
      if (t[i] === q[qi]) {
        score += 2 + streak;
        streak++;
        qi++;
      } else {
        streak = 0;
      }
    }
    return qi === q.length ? score / (q.length * 3) : 0; // normalisiert ~0..1
  }

  function computeFiltered() {
    const list = (
      currentSearch
        ? projects
            .map((p) => {
              const hay = (p.title + " " + p.desc + " " + p.cat).toLowerCase();
              return { p, score: fuzzyScore(currentSearch, hay) };
            })
            .filter((r) => r.score > 0)
            .map((r) => r.p)
        : projects.slice()
    )
      .filter((p) => {
        const catOk = currentFilters.has("all") || currentFilters.has(p.cat);
        return catOk;
      })
      .sort((a, b) => {
        const at = a.title.toLowerCase(),
          bt = b.title.toLowerCase();
        return currentSort === "name-desc"
          ? bt.localeCompare(at)
          : at.localeCompare(bt);
      });
    filtered = list;
    renderIndex = 0;
  }

  // Card-View Tracking
  let cardViewIO;
  const seenSlugs = new Set();
  function ensureCardViewObserver() {
    if (cardViewIO) return;
    cardViewIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const el = en.target;
            const slug = el.getAttribute("data-slug");
            if (!seenSlugs.has(slug)) {
              seenSlugs.add(slug);
              const p = projects.find((x) => x.slug === slug);
              // Prefetch Modal-Header-Bild zur schnelleren Anzeige
              if (p && p.img) prefetchModalImage(p.img);
              if (window.Sentry)
                window.Sentry.addBreadcrumb({
                  category: "ui.view",
                  message: "card_view",
                  level: "info",
                  data: { slug },
                });
              track("card_view", {
                project: p ? p.title : slug,
                dedupKey: "cv:" + slug,
              });
              cardViewIO.unobserve(el);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
  }

  // Skeleton-Karten
  function renderSkeletons(mount, count) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const sk = document.createElement("div");
      sk.className = "project-card skeleton-card";
      sk.innerHTML = `<div class="project-card-image skeleton"><div class="shimmer"></div></div><div class="project-info"><h4 class="skeleton skeleton-text"></h4><p class="skeleton skeleton-text" style="width:80%"></p><div class="project-card-actions"><span class="skeleton skeleton-btn"></span></div></div>`;
      frag.appendChild(sk);
    }
    mount.appendChild(frag);
  }

  // Deep-Link URL Builder mit optionalen UTM-Parametern
  function buildProjectURL(p, withUTM) {
    const base = new URL(location.origin + location.pathname);
    const current = new URLSearchParams(location.search);
    // optional: UTM nur hinzufügen, wenn gewünscht und nicht vorhanden
    const addUtm =
      typeof window.ADD_UTM_DEEPLINK === "boolean"
        ? window.ADD_UTM_DEEPLINK
        : true;
    if (withUTM && addUtm) {
      if (!current.has("utm_source")) current.set("utm_source", "gallery");
      if (!current.has("utm_medium")) current.set("utm_medium", "modal");
      if (!current.has("utm_campaign"))
        current.set("utm_campaign", "project_" + p.slug);
    }
    base.search = current.toString();
    return base.toString() + "#project=" + p.slug;
  }

  // Toast Utility
  function showToast(msg, type) {
    let host = qs("#toast-container");
    if (!host) {
      host = document.createElement("div");
      host.id = "toast-container";
      document.body.appendChild(host);
    }
    const item = document.createElement("div");
    item.className = "toast " + (type || "info");
    item.textContent = msg;
    host.appendChild(item);
    requestAnimationFrame(() => item.classList.add("show"));
    setTimeout(() => {
      item.classList.remove("show");
      setTimeout(() => item.remove(), 300);
    }, 2500);
  }

  function renderMore(mount) {
    ensureCardViewObserver();
    qsa(".skeleton-card", mount).forEach((n) => n.remove());
    const frag = document.createDocumentFragment();
    const slice = filtered.slice(renderIndex, renderIndex + PAGE);
    slice.forEach((p) => {
      const badgeClass = getNewBadgeClass(p);
      const card = document.createElement("article");
      card.className = "project-card";
      card.setAttribute("data-slug", p.slug);
      card.innerHTML = `
        <div class="project-card-image">
          <img src="${p.img}" alt="Vorschaubild: ${p.title}">
          <div class="project-card-overlay"></div>
          <div class="project-badges">
            ${
              p.premium
                ? '<span class="project-badge premium" aria-label="Premium">Premium</span>'
                : ""
            }
            ${
              badgeClass
                ? `<span class="project-badge ${badgeClass}" aria-label="Neu">Neu</span>`
                : ""
            }
          </div>
        </div>
        <div class="project-info">
          <h4>${p.title} ${
        p.liveTest ? '<i class="ri-flask-line" aria-hidden="true"></i>' : ""
      }</h4>
          <p>${p.desc || ""}</p>
          <div class="project-tags">${(p.tags || [])
            .map((t) => `<span class="project-tag">${t}</span>`)
            .join("")}</div>
          <div class="project-card-actions">
            <button class="more-btn" data-slug="${
              p.slug
            }" aria-label="Mehr erfahren zu ${p.title}">
              <i class="ri-information-line" aria-hidden="true"></i>
              <span>Mehr erfahren</span>
            </button>
          </div>
          <div class="project-card-meta">
            <span><i class="ri-folder-2-line" aria-hidden="true"></i>${
              p.cat || "projekt"
            }</span>
          </div>
        </div>`;
      mount.appendChild(card);
      if (cardViewIO) cardViewIO.observe(card);
    });
    if (!__ttfrTracked) {
      __ttfrTracked = true;
      const now =
        performance && performance.now ? performance.now() : Date.now();
      const ms = Math.round(now - __MODULE_START);
      track("ttfr_card", { ms, value: ms, dedupKey: "ttfr" });
    }
    renderIndex += slice.length;
  }

  function resetAndRender(mount) {
    mount.innerHTML = "";
    renderIndex = 0;
    renderSkeletons(mount, Math.max(PAGE, 6));
    computeFiltered();
    if (filtered.length === 0) {
      mount.innerHTML = `
        <div class="gallery-empty" role="status" aria-live="polite">
          <h4>Keine Treffer</h4>
          <p>Keine Projekte entsprechen gerade deiner Suche/Filter. Vorschläge:</p>
          <ul class="tips">
            <li>Filter zurücksetzen</li>
            <li>Suchbegriff vereinfachen</li>
            <li>Andere Kategorie wählen</li>
            <li>Rechtschreibung prüfen</li>
          </ul>
          <div style="margin-top: .75rem; display:flex; gap:.5rem; justify-content:center; flex-wrap: wrap;">
            <button id="empty-reset" class="modal-action-btn modal-action-secondary" type="button"><i class="ri-refresh-line" aria-hidden="true"></i> Filter zurücksetzen</button>
            <button id="empty-showall" class="modal-action-btn modal-action-primary" type="button"><i class="ri-eye-line" aria-hidden="true"></i> Alle anzeigen</button>
          </div>
        </div>`;
      qs("#empty-reset")?.addEventListener("click", () => {
        const controls = qs(".project-gallery-controls");
        currentFilters = new Set(["all"]);
        currentSearch = "";
        if (controls) {
          qsa("[data-filter]", controls).forEach((b) =>
            b.classList.toggle(
              "active",
              b.getAttribute("data-filter") === "all"
            )
          );
          const s = qs("#project-search");
          if (s) s.value = "";
        }
        savePrefs();
        writeState();
        resetAndRender(mount);
      });
      qs("#empty-showall")?.addEventListener("click", () => {
        currentFilters = new Set(["all"]);
        currentSearch = "";
        writeState();
        savePrefs();
        resetAndRender(mount);
      });
      return;
    }
    renderMore(mount);
    setupSentinel(mount);
  }

  function setupSentinel(mount) {
    if (io) {
      io.disconnect();
    }
    if (sentinel) {
      sentinel.remove();
    }
    sentinel = document.createElement("div");
    sentinel.className = "gallery-sentinel";
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.innerHTML = '<div class="spinner" aria-hidden="true"></div>';
    mount.appendChild(sentinel);
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            if (renderIndex < filtered.length) {
              sentinel.classList.add("loading");
              requestAnimationFrame(() => {
                renderMore(mount);
                sentinel.classList.remove("loading");
                if (renderIndex >= filtered.length) {
                  sentinel.style.display = "none";
                  io.disconnect();
                }
              });
            } else {
              sentinel.style.display = "none";
              io.disconnect();
            }
          }
        });
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(sentinel);
  }

  function setRovingTabindex(container) {
    const btns = qsa("[data-filter]", container);
    let focusIdx = btns.findIndex((b) => b.tabIndex === 0);
    if (focusIdx < 0) {
      btns.forEach((b) => (b.tabIndex = -1));
      if (btns[0]) btns[0].tabIndex = 0;
      focusIdx = 0;
    }
    container.addEventListener("keydown", (e) => {
      const i = btns.indexOf(document.activeElement);
      if (i > -1 && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        const next =
          e.key === "ArrowRight"
            ? (i + 1) % btns.length
            : (i - 1 + btns.length) % btns.length;
        btns[next].tabIndex = 0;
        btns[i].tabIndex = -1;
        btns[next].focus();
      }
    });
  }

  function normCoords(ev) {
    try {
      const x = (ev.clientX || 0) / window.innerWidth;
      const y = (ev.clientY || 0) / window.innerHeight;
      return { x: Math.round(x * 1000) / 1000, y: Math.round(y * 1000) / 1000 };
    } catch (_) {
      return { x: 0, y: 0 };
    }
  }

  function bindControls(mount) {
    const controls = qs(".project-gallery-controls");
    if (!controls || controls.dataset.bound) return;
    setRovingTabindex(controls);
    controls.addEventListener("click", function (e) {
      const fbtn = e.target.closest("[data-filter]");
      const sbtn = e.target.closest("[data-sort]");
      if (fbtn) {
        const val = fbtn.getAttribute("data-filter");
        const { x, y } = normCoords(e);
        if (val === "all") {
          currentFilters = new Set(["all"]);
          qsa("[data-filter]", controls).forEach((b) =>
            b.classList.remove("active")
          );
          fbtn.classList.add("active");
        } else {
          currentFilters.delete("all");
          fbtn.classList.toggle("active");
          if (fbtn.classList.contains("active")) currentFilters.add(val);
          else currentFilters.delete(val);
          const anyActive = qsa("[data-filter].active", controls).length > 0;
          if (!anyActive) currentFilters = new Set(["all"]);
          qsa("[data-filter]", controls).forEach((btn) => {
            if (btn.getAttribute("data-filter") === "all") {
              if (currentFilters.has("all")) btn.classList.add("active");
              else btn.classList.remove("active");
            }
          });
        }
        if (window.Sentry)
          window.Sentry.addBreadcrumb({
            category: "ui.action",
            message: "filter_change",
            data: { filters: Array.from(currentFilters).join(","), x, y },
            level: "info",
          });
        writeState();
        savePrefs();
        resetAndRender(mount);
        track("filter_change", {
          filters: Array.from(currentFilters).join(","),
          x,
          y,
        });
        track("heat_click", { el: "filter", label: val, x, y });
        return;
      }
      if (sbtn) {
        const { x, y } = normCoords(e);
        qsa(".project-gallery-controls .sort-btn").forEach((b) =>
          b.classList.remove("active")
        );
        sbtn.classList.add("active");
        currentSort = cbtnValue(sbtn);
        if (window.Sentry)
          window.Sentry.addBreadcrumb({
            category: "ui.action",
            message: "sort_change",
            data: { sort: currentSort, x, y },
            level: "info",
          });
        writeState();
        savePrefs();
        resetAndRender(mount);
        track("sort_change", { sort: currentSort, x, y });
        track("heat_click", { el: "sort", label: currentSort, x, y });
        return;
      }
    });
    function cbtnValue(btn) {
      return btn.getAttribute("data-sort");
    }
    const search = qs("#project-search");
    if (search && !search.dataset.bound) {
      const onInput = (function () {
        let t;
        return function () {
          clearTimeout(t);
          t = setTimeout(() => {
            currentSearch = this.value.trim().toLowerCase();
            if (window.Sentry)
              window.Sentry.addBreadcrumb({
                category: "ui.action",
                message: "search",
                data: { q: currentSearch },
                level: "info",
              });
            writeState();
            resetAndRender(mount);
            track("search", {
              search_term: currentSearch,
              search_length: currentSearch.length,
            });
          }, 150);
        };
      })();
      search.addEventListener("input", onInput);
      search.dataset.bound = "1";
    }
    controls.dataset.bound = "1";
  }

  function renderProjects() {
    const mount = qs("#project-gallery");
    if (!mount) return;
    // Init state: URL > Prefs
    const st = parseState();
    const hasURL =
      location.search.includes("filters=") ||
      location.search.includes("sort=") ||
      location.search.includes("search=");
    if (hasURL) {
      currentFilters = st.filters;
      currentSearch = st.sSearch;
      currentSort = st.sSort;
    } else {
      const p = loadPrefs();
      if (p.filters) {
        currentFilters = new Set(
          p.filters === "all" ? ["all"] : p.filters.split(",").filter(Boolean)
        );
      }
      currentSort = p.sort || "name-asc";
      currentSearch = st.sSearch || "";
      writeState();
    }
    // Apply UI state
    const controls = qs(".project-gallery-controls");
    if (controls) {
      qsa("[data-filter]", controls).forEach((b) => {
        const v = b.getAttribute("data-filter");
        if (currentFilters.has("all") && v === "all") b.classList.add("active");
        else if (currentFilters.has(v)) b.classList.add("active");
        else b.classList.remove("active");
      });
      qsa(".sort-btn", controls).forEach((b) => {
        b.classList.toggle(
          "active",
          b.getAttribute("data-sort") === currentSort
        );
      });
      const search = qs("#project-search");
      if (search) search.value = currentSearch;
    }
    // Skeletons direkt anzeigen
    mount.innerHTML = "";
    renderSkeletons(mount, Math.max(PAGE, 6));
    computeFiltered();
    renderMore(mount);
    setupSentinel(mount);
    bindControls(mount);
    // Delegated events for modal/badge/tag heatmap
    mount.addEventListener("click", function (e) {
      const more = e.target.closest(".more-btn");
      const badge = e.target.closest(".project-badge");
      const tag = e.target.closest(".project-tag");
      if (more) {
        const slug = more.getAttribute("data-slug");
        const p = projects.find((x) => x.slug === slug);
        if (!p) return;
        openProjectModal(p);
        return;
      }
      if (badge || tag) {
        const card = e.target.closest(".project-card");
        const slug = card ? card.getAttribute("data-slug") : "";
        const { x, y } = normCoords(e);
        track("heat_click", { el: badge ? "badge" : "tag", slug, x, y });
        if (window.Sentry)
          window.Sentry.addBreadcrumb({
            category: "ui.action",
            message: "heat_click",
            level: "info",
            data: { el: badge ? "badge" : "tag", slug, x, y },
          });
      }
    });
    updateJsonLd();
  }

  // Live-Test Panel
  function ensureLiveTestBackdrop() {
    if (!qs("#live-test-backdrop")) {
      const bd = document.createElement("div");
      bd.id = "live-test-backdrop";
      document.body.appendChild(bd);
    }
    return qs("#live-test-backdrop");
  }
  function openLiveTestPanel(p) {
    const panel = qs("#live-test-panel");
    const frame = qs("#live-test-frame");
    const title = qs("#live-test-title");
    if (!panel || !frame) return;
    const backdrop = ensureLiveTestBackdrop();
    if (title)
      title.innerHTML = `<i class="ri-play-circle-line" aria-hidden="true"></i> Live-Test – ${p.title}`;
    frame.src = p.live && p.live !== "#" ? p.live : "about:blank";
    panel.classList.add("show");
    panel.style.display = "block";
    backdrop.style.display = "block";
    document.body.classList.add("no-scroll");
    const btns = qsa(".live-test-btn", panel);
    function setView(view) {
      btns.forEach((b) => b.classList.remove("active"));
      const activeBtn = qs(`.live-test-btn[data-view="${view}"]`, panel);
      if (activeBtn) activeBtn.classList.add("active");
      if (view === "desktop") {
        frame.style.width = "100%";
        frame.style.height = "clamp(480px, 70vh, 900px)";
      }
      if (view === "tablet") {
        frame.style.width = "820px";
        frame.style.maxWidth = "100%";
        frame.style.height = "clamp(480px, 70vh, 900px)";
      }
      if (view === "mobile") {
        frame.style.width = "390px";
        frame.style.maxWidth = "100%";
        frame.style.height = "780px";
      }
    }
    btns.forEach((b) => {
      b.onclick = () => setView(b.getAttribute("data-view"));
    });
    setView("desktop");
    function close() {
      panel.classList.remove("show");
      panel.style.display = "none";
      backdrop.style.display = "none";
      document.body.classList.remove("no-scroll");
      frame.src = "about:blank";
      document.removeEventListener("keydown", onEsc);
    }
    const closeBtn = qs(".live-test-close", panel);
    if (closeBtn) {
      closeBtn.onclick = () => {
        track("live_test_close", { project: p.title });
        close();
      };
    }
    const backdropEl = qs("#live-test-backdrop");
    if (backdropEl) {
      backdropEl.onclick = close;
    }
    function onEsc(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onEsc);
    track("live_test_open", { project: p.title });
  }

  // Modal (Mehr erfahren) – Download-Button nur bei Zugriff sichtbar
  function openProjectModal(p) {
    const canAccess = hasAccessToProject(p);
    const modal = document.createElement("div");
    modal.className = "project-modal active";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <div class="modal-content" role="document">
        <button class="modal-close" aria-label="Modal schließen">
          <i class="ri-close-line" aria-hidden="true"></i>
          <span class="sr-only">Schließen</span>
        </button>
        <div class="modal-header">
          <img src="${p.img}" alt="${p.title} Hero">
          <div class="modal-header-overlay"></div>
        </div>
        <div class="modal-body">
          <h3 class="modal-title"><i class="ri-folder-2-line" aria-hidden="true"></i> ${
            p.title
          }</h3>
          <p class="modal-description">${p.desc || ""}</p>
          ${
            p.premium
              ? `
            <div class="modal-premium-required" role="note">
              <i class="ri-vip-crown-2-line" aria-hidden="true"></i>
              <div class="modal-premium-text">
                <h4>Premium erforderlich</h4>
                <p>Dieses Projekt erfordert die Stufe: <strong>${(
                  p.level || "basic"
                ).toUpperCase()}</strong></p>
              </div>
            </div>
          `
              : ""
          }
          <ul class="modal-meta">
            ${
              isNewProject(p)
                ? '<li><i class="ri-sparkling-line" aria-hidden="true"></i>Neu</li>'
                : ""
            }
            <li><i class="ri-calendar-line" aria-hidden="true"></i>${
              p.added ? new Date(p.added).toLocaleDateString("de-DE") : ""
            }</li>
            ${
              p.premium
                ? '<li><i class="ri-vip-crown-2-line" aria-hidden="true"></i>Premium</li>'
                : ""
            }
          </ul>
        </div>
        <div class="modal-footer modal-actions">
          ${
            p.live && p.live !== "#"
              ? `
            <button class="modal-action-btn modal-action-primary" data-action="view">
              <i class="ri-external-link-line" aria-hidden="true"></i>
              <span>Anschauen</span>
            </button>
          `
              : ""
          }
          ${
            p.code && p.code !== "#" && (!p.premium || canAccess)
              ? `
            <button class="modal-action-btn modal-action-secondary" data-action="download" data-url="${p.code}">
              <i class="ri-download-2-line" aria-hidden="true"></i>
              <span>Download / Code</span>
            </button>
          `
              : ""
          }
          ${
            p.liveTest
              ? `
            <button class="modal-action-btn" data-action="live-test">
              <i class="ri-flask-line" aria-hidden="true"></i>
              <span>Live Test</span>
            </button>
          `
              : ""
          }
          <button class="modal-action-btn" data-action="copy-link">
            <i class="ri-link" aria-hidden="true"></i>
            <span>Link kopieren</span>
          </button>
          ${
            p.premium && !canAccess
              ? `
            <button class="modal-action-btn premium-login-btn" data-action="upgrade">
              <i class="ri-vip-crown-2-line" aria-hidden="true"></i>
              <span>Upgrade auf ${(p.level || "basic").toUpperCase()}</span>
            </button>
          `
              : ""
          }
        </div>
      </div>`;

    document.body.appendChild(modal);
    ensureIconA11y(modal);
    requestAnimationFrame(() => {
      modal.classList.add("active");
      const content = qs(".modal-content", modal);
      trapFocus(content);
    });

    // Button-Handler inkl. Loading-State für Anschauen
    const onClick = async (ev) => {
      const btn = ev.target.closest("button");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      if (action === "view" && p.live) {
        // Analytics: Funnel Schritt 2 (Anschauen)
        track("funnel_view", { project: p.slug });
        try {
          btn.classList.add("loading");
          btn.disabled = true;
          const timeout = (ms) =>
            new Promise((_, rej) =>
              setTimeout(() => rej(new Error("timeout")), ms)
            );
          // HEAD kann von CORS geblockt sein → Fallback GET no-cors
          const tryHead = fetch(p.live, {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-store",
          });
          await Promise.race([tryHead, timeout(3000)]).catch(() => {});
          window.open(p.live, "_blank", "noopener");
          track("project_view", { project: p.slug });
        } catch (err) {
          showToast("Seite konnte nicht geöffnet werden.", "error");
        } finally {
          btn.classList.remove("loading");
          btn.disabled = false;
        }
      }
      if (action === "download" && p.code) {
        // Gate: Zugriff prüfen
        if (!hasAccessToProject(p)) {
          showToast("Premium erforderlich – bitte zuerst einloggen.", "error");
          track("blocked_download", { project: p.slug, required_level: (p.level||'basic') });
          return;
        }
        // Analytics: Funnel Schritt 3 (Download) + Konversion je Premium-Level
        track("funnel_download", { project: p.slug, required_level: (p.level||'basic') });
        track("conversion", { stage: "download", project: p.slug, required_level: (p.level||'basic') });
        try {
          btn.classList.add("loading");
          const url = btn.getAttribute("data-url");
          try {
            await fetch(url, { method: "HEAD", mode: "no-cors" });
          } catch (_) { /* opaque ok */ }
          window.open(url, "_blank", "noopener");
          showToast("Download gestartet", "success");
          track("download_click", { project: p.title });
        } catch (err) {
          showToast("Download fehlgeschlagen", "error");
          if (window.Sentry) window.Sentry.captureException(err);
        } finally {
          setTimeout(() => btn.classList.remove("loading"), 800);
        }
      }
      if (action === "copy-link") {
        const url = buildProjectURL(p, true);
        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(url)
            .then(() => {
              showToast("Link kopiert", "success");
            })
            .catch(() => {
              showToast("Fehler beim Kopieren", "error");
            });
        }
        track("copy_deeplink", { project: p.title });
      }
      if (action === "live-test") {
        openLiveTestPanel(p);
      }
      if (action === "upgrade") {
        if (typeof showPremiumLoginPopup === "function")
          showPremiumLoginPopup(p.level || "basic");
      }
    };

    modal.addEventListener("click", onClick);
    // Deep-Link Hash
    location.hash = "project=" + p.slug;
    document.body.classList.add("no-scroll");
    function close() {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.remove();
        document.body.classList.remove("no-scroll");
      }, 200);
    }
    qs(".modal-close", modal)?.addEventListener("click", close);
    modal.onclick = (e) => {
      if (e.target === modal) close();
    };
    document.addEventListener(
      "keydown",
      function onEsc(e) {
        if (e.key === "Escape") {
          close();
          document.removeEventListener("keydown", onEsc);
        }
      },
      { once: true }
    );
  }

  // Hilfsfunktion: Neues Projekt innerhalb von 30 Tagen
  function isNewProject(p) {
    try {
      if (!p || !p.added) return false;
      const added =
        typeof p.added === "string" || typeof p.added === "number"
          ? new Date(p.added).getTime()
          : 0;
      if (!added || Number.isNaN(added)) return false;
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      return Date.now() - added <= THIRTY_DAYS;
    } catch (_) {
      return false;
    }
  }

  function ensureKeyboardFocus() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Tab") document.body.classList.add("show-focus");
    });
    document.addEventListener("mousedown", () =>
      document.body.classList.remove("show-focus")
    );
    qsa(".modal-close, .popup-close").forEach((btn) => {
      if (!btn.getAttribute("aria-label"))
        btn.setAttribute("aria-label", "Schließen");
    });
  }

  // Tastaturkürzel global: '/' fokussiert Suche, Esc leert Filter (wenn kein Overlay offen)
  function bindShortcuts() {
    document.addEventListener("keydown", (e) => {
      const tag = ((e.target && e.target.tagName) || "").toLowerCase();
      const typing =
        tag === "input" ||
        tag === "textarea" ||
        (e.target && e.target.isContentEditable);
      const overlayOpen = !!(
        qs("#project-modal.active") ||
        qs(".premium-login-popup.active") ||
        qs(".live-test-panel.show")
      );
      if (e.key === "/" && !typing && !overlayOpen) {
        e.preventDefault();
        const s = qs("#project-search");
        if (s) {
          s.focus();
          s.select();
          if (window.Sentry)
            window.Sentry.addBreadcrumb({
              category: "ui.action",
              message: "shortcut_search_focus",
              level: "info",
            });
          track("shortcut_search_focus");
        }
      }
      if (e.key === "Escape" && !overlayOpen) {
        const gallery = qs("#project-gallery");
        const controls = qs(".project-gallery-controls");
        if (!gallery || !controls) return;
        currentFilters = new Set(["all"]);
        qsa("[data-filter]", controls).forEach((btn) =>
          btn.classList.toggle(
            "active",
            btn.getAttribute("data-filter") === "all"
          )
        );
        savePrefs();
        writeState();
        resetAndRender(gallery);
        if (window.Sentry)
          window.Sentry.addBreadcrumb({
            category: "ui.action",
            message: "filters_reset",
            level: "info",
          });
        track("filters_reset");
      }
    });
  }

  // Scroll-Depth Analytics
  const scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
  function initScrollDepth() {
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) return;
      const pct = (doc.scrollTop / total) * 100;
      [25, 50, 75, 100].forEach((m) => {
        if (!scrollMilestones[m] && pct >= m) {
          scrollMilestones[m] = true;
          track("scroll_depth", { percent: m, dedupKey: "sd:" + m });
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // init: zusätzliche Initialisierungen
  function init() {
    // sticky offset dynamisch
    const header = qs("header.header");
    const root = document.documentElement;
    if (header) {
      const h = header.getBoundingClientRect().height;
      root.style.setProperty("--sticky-offset", Math.round(h) + "px");
    }
    applyConsentMode();
    initPremiumLogin();
    renderProjects();
    ensureKeyboardFocus();
    bindShortcuts();
    updateJsonLd();
    initScrollDepth();
    initErrorTracking();
    initOfflineBanner();
    hardenSessionEnd();
    // Deep-Link öffnen
    if (location.hash.startsWith("#project=")) {
      const slug = location.hash.split("=")[1];
      const p = projects.find((x) => x.slug === slug);
      if (p) openProjectModal(p);
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
  window.showPremiumLoginPopup = showPremiumLoginPopup;

  // Screenreader Utility, falls im DOM nicht vorhanden
  if (!document.querySelector(".sr-only-helper")) {
    const sr = document.createElement("style");
    sr.className = "sr-only-helper";
    sr.textContent = `.sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`;
    document.head.appendChild(sr);
  }

  // Rechtsklick global sperren
  function disableContextMenu() {
    try {
      document.body.classList.add("disable-context-menu");
      window.addEventListener(
        "contextmenu",
        (e) => {
          e.preventDefault();
          return false;
        },
        { capture: true }
      );
      window.addEventListener(
        "dragstart",
        (e) => {
          e.preventDefault();
        },
        { capture: true }
      );
      window.addEventListener(
        "selectstart",
        (e) => {
          e.preventDefault();
        },
        { capture: true }
      );
      // Klarer Hinweis in der Konsole für Debug
      console.info("[Informatik] Kontextmenü deaktiviert");
    } catch (_) {}
  }
  disableContextMenu();

  function ensureIconA11y(root) {
    const scope = root || document;
    // Markiere Icons in Buttons als dekorativ
    Array.from(
      scope.querySelectorAll(
        "button i, .modal-title i, .feature-item i, .project-info h4 i"
      )
    ).forEach((i) => {
      if (!i.hasAttribute("aria-hidden")) i.setAttribute("aria-hidden", "true");
    });
    // Icon-only Buttons mit sr-only Text basierend auf aria-label
    Array.from(scope.querySelectorAll("button")).forEach((btn) => {
      const text = (btn.textContent || "").trim();
      const hasIcon = !!btn.querySelector("i");
      if (hasIcon && text.length === 0) {
        const label = btn.getAttribute("aria-label") || "Aktion";
        const sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = label;
        btn.appendChild(sr);
      }
    });
  }

  // Hilfsfunktion: Neu-Badge mit Pulse für 0–3 Tage
  function getNewBadgeClass(p) {
    if (!p || !p.added) return "";
    const added = new Date(p.added).getTime();
    const now = Date.now();
    const days = Math.floor((now - added) / (24 * 60 * 60 * 1000));
    if (days <= 3) return "new new-7 new-pulse";
    if (days <= 7) return "new new-7";
    if (days <= 14) return "new new-14";
    if (days <= 30) return "new new-30";
    return "";
  }

  // Modal-Bild Prefetch via IntersectionObserver
  function prefetchModalImage(src) {
    if (!src) return;
    if (document.querySelector(`link[data-prefetch='${src}']`)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = src;
    link.as = "image";
    link.setAttribute("data-prefetch", src);
    document.head.appendChild(link);
  }

  // Zugriff prüfen: ob Nutzer die Premium-Stufe des Projekts hat
  function hasAccessToProject(p) {
    try {
      if (!p || !p.premium) return true;
      const loggedIn = sessionStorage.getItem("userLoggedIn") === "true";
      if (!loggedIn) return false;
      const userLvl = (sessionStorage.getItem("premiumLevel") || "basic").toLowerCase();
      const reqLvl = (p.level || "basic").toLowerCase();
      const rank = { basic: 1, pro: 2, ultimate: 3 };
      return (rank[userLvl] || 0) >= (rank[reqLvl] || 0);
    } catch (_) {
      return false;
    }
  }

  // Beim Verlassen/Schließen der Seite ausloggen (Session härten)
  function hardenSessionEnd() {
    const clear = () => {
      try { sessionStorage.clear(); } catch (_) {}
    };
    window.addEventListener("pagehide", clear, { capture: true });
    window.addEventListener("unload", clear, { capture: true });
  }

  // Offline-Banner mit Retry-Button
  function initOfflineBanner() {
    let banner = document.getElementById("offline-banner");
    if (!banner) {
      banner = document.createElement("div");
      banner.id = "offline-banner";
      banner.className = "offline-banner";
      banner.innerHTML = '<div class="offline-inner" role="status" aria-live="polite"><i class="ri-wifi-off-line" aria-hidden="true"></i><span>Keine Internetverbindung.</span><button type="button" class="btn retry-btn" aria-label="Erneut versuchen"><i class="ri-refresh-line" aria-hidden="true"></i><span class="sr-only">Neu laden</span>Retry</button></div>';
      document.body.appendChild(banner);
      const retry = banner.querySelector(".retry-btn");
      if (retry) retry.addEventListener("click", () => location.reload());
    }
    const set = () => banner.classList.toggle("show", !navigator.onLine);
    window.addEventListener("online", set);
    window.addEventListener("offline", set);
    set();
  }

  // init: zusätzliche Initialisierungen
  function init() {
    // sticky offset dynamisch
    const header = qs("header.header");
    const root = document.documentElement;
    if (header) {
      const h = header.getBoundingClientRect().height;
      root.style.setProperty("--sticky-offset", Math.round(h) + "px");
    }
    applyConsentMode();
    initPremiumLogin();
    renderProjects();
    ensureKeyboardFocus();
    bindShortcuts();
    updateJsonLd();
    initScrollDepth();
    initErrorTracking();
    initOfflineBanner();
    hardenSessionEnd();
    // Deep-Link öffnen
    if (location.hash.startsWith("#project=")) {
      const slug = location.hash.split("=")[1];
      const p = projects.find((x) => x.slug === slug);
      if (p) openProjectModal(p);
    }
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
  window.showPremiumLoginPopup = showPremiumLoginPopup;

  // Screenreader Utility, falls im DOM nicht vorhanden
  if (!document.querySelector(".sr-only-helper")) {
    const sr = document.createElement("style");
    sr.className = "sr-only-helper";
    sr.textContent = `.sr-only{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`;
    document.head.appendChild(sr);
  }

  // Rechtsklick global sperren
  function disableContextMenu() {
    try {
      document.body.classList.add("disable-context-menu");
      window.addEventListener(
        "contextmenu",
        (e) => {
          e.preventDefault();
          return false;
        },
        { capture: true }
      );
      window.addEventListener(
        "dragstart",
        (e) => {
          e.preventDefault();
        },
        { capture: true }
      );
      window.addEventListener(
        "selectstart",
        (e) => {
          e.preventDefault();
        },
        { capture: true }
      );
      // Klarer Hinweis in der Konsole für Debug
      console.info("[Informatik] Kontextmenü deaktiviert");
    } catch (_) {}
  }
  disableContextMenu();

  function ensureIconA11y(root) {
    const scope = root || document;
    // Markiere Icons in Buttons als dekorativ
    Array.from(
      scope.querySelectorAll(
        "button i, .modal-title i, .feature-item i, .project-info h4 i"
      )
    ).forEach((i) => {
      if (!i.hasAttribute("aria-hidden")) i.setAttribute("aria-hidden", "true");
    });
    // Icon-only Buttons mit sr-only Text basierend auf aria-label
    Array.from(scope.querySelectorAll("button")).forEach((btn) => {
      const text = (btn.textContent || "").trim();
      const hasIcon = !!btn.querySelector("i");
      if (hasIcon && text.length === 0) {
        const label = btn.getAttribute("aria-label") || "Aktion";
        const sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = label;
        btn.appendChild(sr);
      }
    });
  }

  // Hilfsfunktion: Neu-Badge mit Pulse für 0–3 Tage
  function getNewBadgeClass(p) {
    if (!p || !p.added) return "";
    const added = new Date(p.added).getTime();
    const now = Date.now();
    const days = Math.floor((now - added) / (24 * 60 * 60 * 1000));
    if (days <= 3) return "new new-7 new-pulse";
    if (days <= 7) return "new new-7";
    if (days <= 14) return "new new-14";
    if (days <= 30) return "new new-30";
    return "";
  }

  // Modal-Bild Prefetch via IntersectionObserver
  function prefetchModalImage(src) {
    if (!src) return;
    if (document.querySelector(`link[data-prefetch='${src}']`)) return;
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = src;
    link.as = "image";
    link.setAttribute("data-prefetch", src);
    document.head.appendChild(link);
  }
})();
