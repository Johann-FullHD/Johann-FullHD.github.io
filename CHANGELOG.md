# Wartungs- & Änderungsprotokoll

Hier finden Sie eine Übersicht aller wichtigen Änderungen, Verbesserungen und laufenden Arbeiten an der Website von Johann Kramer. Während Wartungsarbeiten können Sie hier transparent nachvollziehen, was zuletzt passiert ist und was als Nächstes geplant ist.

---

## Zuletzt umgesetzt (Stand: 2024-05-14)

### Navigation & Layout
- Einheitliche, barrierefreie Navigation und Footer auf allen Seiten.
- Dropdown-Menüs für IT und Fotografie, Sprachumschaltung (DE/EN).
- Footer mit Social-Links, rechtlichen Links und Build-Info.

### Galerie
- Galerie mit Tag-Filter, Suchfeld und dynamischer Bildanzeige.
- Tag-Chips-Filter (Mehrfachauswahl), Blur-Up-Lazy-Loading für Bilder.
- Lightbox mit Zoom-Steuerung per +/- Tasten.

### Projekte
- Projekte werden aus `projects.json` dynamisch geladen.
- Karten mit Skeleton-Loader, passwortgeschützte Downloads.

### Barrierefreiheit & A11y
- Verbesserte Fokus-Styles, Tastaturnavigation, ARIA-Attribute.
- Barrierefreiheitserklärung ergänzt.

### Consent & Analytics
- Cookie-Consent-Banner mit Opt-In für Analytics.
- Web Vitals (FCP, LCP, CLS, INP, FID) werden gemessen.
- Fehler- und Promise-Logging für bessere Diagnose.

### Service Worker & PWA
- Service Worker mit Cache-Strategien für Assets und Projekte.
- Offline-Seite und PWA-Manifest.
- `/en/`-Pfad für englische Versionen vorbereitet.

### Build & CI/CD
- AVIF-Konvertierung für Bilder, automatisierte i18n-Builds.
- Security-Header-Dokumentation, automatisierte CI/CD-Pipeline.
- Sitemap- und Hash-Generierung automatisiert.

### Sicherheit
- Strikte Content-Security-Policy, Referrer-Policy, Permissions-Policy.
- Login mit Rate-Limiting (clientseitig), Passwort-Modal für Downloads.
- SHA256-Hash-Worker für Datei-Integritätsprüfung.

### Sonstiges
- Blur-Up- und Skeleton-Styles in CSS ergänzt.
- Dark-Mode-Flash-Prevention durch frühe Theme-Initialisierung.
- Diverse statische Seiten (Impressum, Datenschutz, Nutzungsbedingungen, 404, etc.) vereinheitlicht.
- Robots.txt, security.txt und weitere Metadaten hinzugefügt.

---

## Vorschau: Was kommt demnächst?

- **Mehrsprachigkeit:** Ausbau der englischen Inhalte und automatische Sprachwahl.
- **Projekte:** Neue Open-Source-Tools und Beispielprojekte.
- **Barrierefreiheit:** Weitere Optimierungen für Screenreader und mobile Geräte.
- **Performance:** Noch schnellere Ladezeiten durch Bildoptimierung und Prefetch.
- **Sicherheit:** 2FA für Admin-Login, weitere Security-Header.
- **Feedback:** Verbesserte Kontaktformulare und FAQ-Bereich.
- **PWA:** Installierbare App mit Offline-Funktion für alle Seiten.
- **Dark/Light-Mode:** Feinschliff und mehr Nutzeroptionen.

---

**Hinweis:**  
## Contact

![Github](https://img.shields.io/badge/GitHub-Johann_FullHD-blue?style=flat-square&logo=github)

For any additional questions or feedback, feel free to reach out to me:
- **Johann Kramer**
- **Website**: [https://johann-fullhd.github.io/](https://johann-fullhd.github.io/)
- **Email**: [kjohann1908@gmail.com](mailto:kjohann1908@gmail.com)
- **Instagram:** [trainspotter.dresden](https://www.instagram.com/trainspotter.dresden/)


_Thank you for visiting, and happy commanding!_

