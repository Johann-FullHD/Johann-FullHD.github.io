/**
 * Admin Dashboard - Erweiterte Funktionen
 * JavaScript-Implementierung für das Admin Dashboard mit verschiedenen analytischen Funktionen
 * Autor: Johann Kramer
 * Erstellt: August 2025
 */

// Hauptklasse für das Admin Dashboard
class AdminDashboard {
    constructor() {
        this.initState = {
            isLoading: false,
            isMaintenanceMode: false,
            sessionTimeout: 30 * 60, // 30 Minuten in Sekunden
            remainingTime: 30 * 60,
            screenSizes: [
                { name: 'Mobile (S)', width: 320, height: 568 },
                { name: 'Mobile (M)', width: 375, height: 667 },
                { name: 'Mobile (L)', width: 425, height: 812 },
                { name: 'Tablet', width: 768, height: 1024 },
                { name: 'Laptop', width: 1024, height: 768 },
                { name: 'Desktop', width: 1440, height: 900 }
            ],
            activeModules: {
                screenPreview: true,
                heatmap: true,
                seoAnalysis: true,
                performanceMonitoring: true,
                activityLog: true,
                reports: true,
                securityDashboard: true,
                maintenanceMode: true
            },
            activityLog: [],
            seoScore: 76,
            seoIssues: [
                { severity: 'high', message: 'Einige Seiten haben keine Meta-Beschreibungen' },
                { severity: 'medium', message: 'Bilder ohne Alt-Text gefunden' },
                { severity: 'medium', message: 'Mehrere H1-Überschriften auf einigen Seiten' },
                { severity: 'low', message: 'Sitemap könnte aktualisiert werden' }
            ],
            securityIssues: [
                { severity: 'medium', message: 'Veraltete JavaScript-Bibliotheken' },
                { severity: 'low', message: 'HTTP statt HTTPS für einige externe Ressourcen' },
                { severity: 'low', message: 'Fehlende Content-Security-Policy' }
            ],
            performanceMetrics: {
                lcp: { value: '2.1', unit: 's', status: 'good' },
                fid: { value: '18', unit: 'ms', status: 'good' },
                cls: { value: '0.08', unit: '', status: 'good' },
                ttfb: { value: '320', unit: 'ms', status: 'needs-improvement' }
            }
        };

        this.state = { ...this.initState };
        this.sessionTimer = null;
        this.heatmapInstance = null;
    }

    /**
     * Initialisiert das Dashboard
     */
    init() {
        this.insertDashboardHTML();
        this.bindEvents();
        this.loadModules();
        this.startSessionTimer();
        this.logActivity('Admin Dashboard geladen');
    }

    /**
     * Fügt das HTML für die zusätzlichen Dashboard-Funktionen ein
     */
    insertDashboardHTML() {
        const adminMainElement = document.getElementById('admin-main');
        if (!adminMainElement) return;

        // CSS Datei einbinden
        if (!document.querySelector('link[href*="admin-dashboard.css"]')) {
            const dashboardCSS = document.createElement('link');
            dashboardCSS.rel = 'stylesheet';
            dashboardCSS.href = 'assets/css/admin-dashboard.css';
            document.head.appendChild(dashboardCSS);
        }

        // Dashboard-Erweiterungen erstellen
        const dashboardHTML = `
            <section class="admin-section" data-aos="fade-up">
                <h2 class="section-title"><i class="ri-dashboard-line"></i> Erweiterte Analytics</h2>
                
                <!-- Bildschirmgrößen-Vorschau -->
                <div class="admin-card span-2" id="screen-preview-card">
                    <h3><i class="ri-device-line"></i> Bildschirmgrößen-Vorschau</h3>
                    <div class="screen-preview-container">
                        <div class="screen-size-controls">
                            <select class="screen-size-select" id="screen-size-select">
                                ${this.state.screenSizes.map(size => 
                                    `<option value="${size.width}x${size.height}">${size.name} (${size.width}x${size.height})</option>`
                                ).join('')}
                            </select>
                            <button type="button" class="btn-accent" id="preview-url-btn">
                                <i class="ri-refresh-line"></i> Aktualisieren
                            </button>
                        </div>
                        <div class="preview-frame-wrapper">
                            <div class="preview-size-info" id="preview-size-info">375x667</div>
                            <iframe class="preview-frame" id="preview-frame" src="about:blank" 
                                    sandbox="allow-same-origin allow-scripts" 
                                    title="Webseiten-Vorschau"></iframe>
                        </div>
                    </div>
                </div>

                <!-- Heatmap -->
                <div class="admin-card span-2" id="heatmap-card">
                    <h3><i class="ri-fire-line"></i> Heatmap</h3>
                    <div class="heatmap-controls">
                        <select id="heatmap-page-select" class="form-select">
                            <option value="index">Startseite</option>
                            <option value="about">Über Mich</option>
                            <option value="gallerie">Galerie</option>
                            <option value="informatik">Informatik</option>
                        </select>
                        <select id="heatmap-period-select" class="form-select">
                            <option value="7">Letzte 7 Tage</option>
                            <option value="30">Letzte 30 Tage</option>
                            <option value="90">Letzte 90 Tage</option>
                        </select>
                    </div>
                    <div class="heatmap-container" id="heatmap-container"></div>
                    <div class="heatmap-legend"></div>
                    <div class="heatmap-legend-label">
                        <span>Weniger</span>
                        <span>Mehr</span>
                    </div>
                </div>

                <!-- SEO-Analyse -->
                <div class="admin-card span-2" id="seo-card">
                    <h3><i class="ri-line-chart-line"></i> SEO-Analyse</h3>
                    <div class="seo-overview">
                        <div>
                            <div class="seo-score-container">
                                <canvas id="seo-score-chart"></canvas>
                                <div class="chart-center-score">
                                    ${this.state.seoScore}<small>/100</small>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4>Erkannte Probleme</h4>
                            <ul class="seo-issues-list">
                                ${this.state.seoIssues.map(issue => `
                                    <li class="seo-issue seo-issue-${issue.severity}">
                                        <span class="issue-indicator"></span>
                                        ${issue.message}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Performance-Monitoring -->
                <div class="admin-card span-2" id="performance-card">
                    <h3><i class="ri-speed-line"></i> Performance-Monitoring</h3>
                    <div class="core-web-vitals">
                        <div class="vitals-metric ${this.state.performanceMetrics.lcp.status}">
                            <div class="vitals-name">LCP</div>
                            <div class="vitals-value">${this.state.performanceMetrics.lcp.value}${this.state.performanceMetrics.lcp.unit}</div>
                            <div class="vitals-label">Largest Contentful Paint</div>
                        </div>
                        <div class="vitals-metric ${this.state.performanceMetrics.fid.status}">
                            <div class="vitals-name">FID</div>
                            <div class="vitals-value">${this.state.performanceMetrics.fid.value}${this.state.performanceMetrics.fid.unit}</div>
                            <div class="vitals-label">First Input Delay</div>
                        </div>
                        <div class="vitals-metric ${this.state.performanceMetrics.cls.status}">
                            <div class="vitals-name">CLS</div>
                            <div class="vitals-value">${this.state.performanceMetrics.cls.value}</div>
                            <div class="vitals-label">Cumulative Layout Shift</div>
                        </div>
                        <div class="vitals-metric ${this.state.performanceMetrics.ttfb.status}">
                            <div class="vitals-name">TTFB</div>
                            <div class="vitals-value">${this.state.performanceMetrics.ttfb.value}${this.state.performanceMetrics.ttfb.unit}</div>
                            <div class="vitals-label">Time to First Byte</div>
                        </div>
                    </div>
                    <canvas id="performance-history-chart"></canvas>
                </div>

                <!-- Berichte -->
                <div class="admin-card span-2" id="reports-card">
                    <h3><i class="ri-file-chart-line"></i> Berichte & Export</h3>
                    <div class="report-options">
                        <div class="report-option">
                            <label for="report-type">Berichtstyp</label>
                            <select id="report-type" class="form-select">
                                <option value="traffic">Traffic-Bericht</option>
                                <option value="content">Inhalts-Bericht</option>
                                <option value="performance">Performance-Bericht</option>
                                <option value="seo">SEO-Bericht</option>
                            </select>
                        </div>
                        <div class="report-option">
                            <label for="report-period">Zeitraum</label>
                            <select id="report-period" class="form-select">
                                <option value="7">Letzte Woche</option>
                                <option value="30" selected>Letzter Monat</option>
                                <option value="90">Letztes Quartal</option>
                                <option value="365">Letztes Jahr</option>
                            </select>
                        </div>
                        <div class="report-option">
                            <label for="report-format">Format</label>
                            <select id="report-format" class="form-select">
                                <option value="pdf">PDF</option>
                                <option value="csv">CSV</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                    </div>
                    <div class="export-buttons">
                        <button type="button" class="btn-accent" id="generate-report-btn">
                            <i class="ri-file-line"></i> Bericht generieren
                        </button>
                        <button type="button" class="btn-success" id="export-report-btn">
                            <i class="ri-download-line"></i> Exportieren
                        </button>
                    </div>
                    <div class="report-preview" id="report-preview">
                        <p class="placeholder-message">Bericht wird hier angezeigt, wenn er generiert wurde.</p>
                    </div>
                </div>

                <!-- Aktivitätsprotokoll -->
                <div class="admin-card span-2" id="activity-log-card">
                    <h3><i class="ri-history-line"></i> Aktivitätsprotokoll</h3>
                    <div class="responsive-table-wrapper">
                        <table class="admin-table activity-log-table">
                            <thead>
                                <tr>
                                    <th>Datum</th>
                                    <th>Benutzer</th>
                                    <th>Aktion</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody id="activity-log-tbody">
                                <tr>
                                    <td colspan="4" class="text-center">Aktivitätsprotokoll wird geladen...</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Sicherheits-Dashboard -->
                <div class="admin-card span-2" id="security-card">
                    <h3><i class="ri-shield-check-line"></i> Sicherheits-Dashboard</h3>
                    <div class="security-overview">
                        <div>
                            <h4>Sicherheitsstatus</h4>
                            <canvas id="security-chart"></canvas>
                        </div>
                        <div>
                            <h4>Sicherheitsprobleme</h4>
                            <ul class="admin-list">
                                ${this.state.securityIssues.map(issue => `
                                    <li class="security-issue-${issue.severity}">
                                        <span class="severity-indicator"></span>
                                        ${issue.message}
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Wartungsmodus -->
                <div class="admin-card" id="maintenance-card">
                    <h3><i class="ri-tools-fill"></i> Wartungsmodus</h3>
                    <div class="maintenance-toggle">
                        <label class="toggle-switch">
                            <input type="checkbox" id="maintenance-toggle">
                            <span class="toggle-slider"></span>
                        </label>
                        <div>
                            <strong class="maintenance-status">Wartungsmodus ist deaktiviert</strong>
                            <p>Aktivieren Sie den Wartungsmodus, um die Webseite für Besucher zu sperren, während Sie Änderungen vornehmen.</p>
                        </div>
                    </div>
                    <div class="maintenance-settings" style="display: none;">
                        <label for="maintenance-message">Wartungsnachricht</label>
                        <textarea id="maintenance-message" class="form-control" rows="3">Diese Webseite wird gerade gewartet. Bitte versuchen Sie es später noch einmal.</textarea>
                        <button type="button" class="btn-accent mt-2" id="save-maintenance-btn">
                            <i class="ri-save-line"></i> Einstellungen speichern
                        </button>
                    </div>
                </div>
            </section>

            <!-- Session Countdown (versteckt) -->
            <div class="session-countdown hidden" id="session-countdown">
                <div class="countdown-title">Sitzungs-Timeout</div>
                <div class="countdown-message">Ihre Sitzung läuft in kurzer Zeit ab.</div>
                <div class="countdown-timer" id="countdown-timer">30:00</div>
                <div class="countdown-actions">
                    <button type="button" class="btn-accent" id="extend-session-btn">
                        <i class="ri-time-line"></i> Verlängern
                    </button>
                    <button type="button" class="btn-neutral" id="logout-now-btn">
                        <i class="ri-logout-box-line"></i> Jetzt abmelden
                    </button>
                </div>
            </div>
        `;

        // Füge den HTML-Code nach dem ersten Admin-Grid ein
        const adminGrid = adminMainElement.querySelector('.admin-grid');
        if (adminGrid) {
            adminGrid.insertAdjacentHTML('afterend', dashboardHTML);
        }
    }

    /**
     * Ereignisbehandlung für Benutzerinteraktionen
     */
    bindEvents() {
        // Screen Preview
        const screenSizeSelect = document.getElementById('screen-size-select');
        const previewUrlBtn = document.getElementById('preview-url-btn');
        const previewFrame = document.getElementById('preview-frame');
        
        if (screenSizeSelect && previewFrame) {
            screenSizeSelect.addEventListener('change', () => this.updateScreenPreview());
            if (previewUrlBtn) {
                previewUrlBtn.addEventListener('click', () => this.updateScreenPreview());
            }
        }

        // Wartungsmodus
        const maintenanceToggle = document.getElementById('maintenance-toggle');
        const saveMaintenanceBtn = document.getElementById('save-maintenance-btn');
        
        if (maintenanceToggle) {
            maintenanceToggle.addEventListener('change', () => {
                const maintenanceSettings = document.querySelector('.maintenance-settings');
                const maintenanceStatus = document.querySelector('.maintenance-status');
                
                if (maintenanceToggle.checked) {
                    this.state.isMaintenanceMode = true;
                    maintenanceStatus.textContent = 'Wartungsmodus ist aktiviert';
                    if (maintenanceSettings) maintenanceSettings.style.display = 'block';
                } else {
                    this.state.isMaintenanceMode = false;
                    maintenanceStatus.textContent = 'Wartungsmodus ist deaktiviert';
                    if (maintenanceSettings) maintenanceSettings.style.display = 'none';
                }
                
                this.logActivity(`Wartungsmodus ${maintenanceToggle.checked ? 'aktiviert' : 'deaktiviert'}`);
            });
        }
        
        if (saveMaintenanceBtn) {
            saveMaintenanceBtn.addEventListener('click', () => {
                const message = document.getElementById('maintenance-message')?.value || '';
                this.logActivity(`Wartungsmodus-Nachricht gespeichert: "${message.substring(0, 30)}..."`);
                this.showToast('Wartungsmodus-Einstellungen gespeichert', 'success');
            });
        }

        // Berichterstellung
        const generateReportBtn = document.getElementById('generate-report-btn');
        const exportReportBtn = document.getElementById('export-report-btn');
        
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => this.generateReport());
        }
        
        if (exportReportBtn) {
            exportReportBtn.addEventListener('click', () => this.exportReport());
        }

        // Session-Timeout
        const extendSessionBtn = document.getElementById('extend-session-btn');
        const logoutNowBtn = document.getElementById('logout-now-btn');
        
        if (extendSessionBtn) {
            extendSessionBtn.addEventListener('click', () => this.extendSession());
        }
        
        if (logoutNowBtn) {
            logoutNowBtn.addEventListener('click', () => this.logout());
        }

        // Heatmap-Steuerung
        const heatmapPageSelect = document.getElementById('heatmap-page-select');
        const heatmapPeriodSelect = document.getElementById('heatmap-period-select');
        
        if (heatmapPageSelect && heatmapPeriodSelect) {
            heatmapPageSelect.addEventListener('change', () => this.updateHeatmap());
            heatmapPeriodSelect.addEventListener('change', () => this.updateHeatmap());
        }
    }

    /**
     * Lädt alle Dashboard-Module
     */
    loadModules() {
        // Lade nur die aktivierten Module
        if (this.state.activeModules.screenPreview) {
            this.initScreenPreview();
        }
        
        if (this.state.activeModules.seoAnalysis) {
            this.initSEOAnalysis();
        }
        
        if (this.state.activeModules.performanceMonitoring) {
            this.initPerformanceMonitoring();
        }
        
        if (this.state.activeModules.heatmap) {
            this.initHeatmap();
        }
        
        if (this.state.activeModules.activityLog) {
            this.loadActivityLog();
        }
        
        if (this.state.activeModules.securityDashboard) {
            this.initSecurityDashboard();
        }
    }

    /**
     * Initialisiert die Bildschirmgrößen-Vorschau
     */
    initScreenPreview() {
        // Standard-URL für die Vorschau festlegen (aktuelle Seite ohne Admin-Parameter)
        const currentUrl = new URL(window.location.href);
        const previewUrl = currentUrl.origin + '/index.html';
        
        const previewFrame = document.getElementById('preview-frame');
        if (previewFrame) {
            previewFrame.src = previewUrl;
        }
        
        // Standard-Bildschirmgröße festlegen
        this.updateScreenPreview();
    }

    /**
     * Aktualisiert die Bildschirmgrößen-Vorschau basierend auf der ausgewählten Größe
     */
    updateScreenPreview() {
        const screenSizeSelect = document.getElementById('screen-size-select');
        const previewFrame = document.getElementById('preview-frame');
        const previewSizeInfo = document.getElementById('preview-size-info');
        
        if (screenSizeSelect && previewFrame) {
            const [width, height] = screenSizeSelect.value.split('x');
            
            previewFrame.style.width = `${width}px`;
            previewFrame.style.height = `${height}px`;
            
            if (previewSizeInfo) {
                previewSizeInfo.textContent = `${width}x${height}`;
            }
            
            this.logActivity(`Bildschirmvorschau auf ${width}x${height} geändert`);
        }
    }

    /**
     * Initialisiert die SEO-Analyse
     */
    initSEOAnalysis() {
        // Chart.js für die Darstellung des SEO-Scores verwenden
        if (typeof Chart !== 'undefined' && document.getElementById('seo-score-chart')) {
            new Chart(document.getElementById('seo-score-chart'), {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [this.state.seoScore, 100 - this.state.seoScore],
                        backgroundColor: [
                            this.state.seoScore >= 90 ? '#34c759' : 
                            this.state.seoScore >= 70 ? '#5ac8fa' : 
                            this.state.seoScore >= 50 ? '#ff9500' : '#ff3b30',
                            '#e5e5ea'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutout: '80%',
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        tooltip: { enabled: false },
                        legend: { display: false }
                    }
                }
            });
        } else {
            // Fallback, wenn Chart.js nicht verfügbar ist
            const scoreContainer = document.querySelector('.chart-center-score');
            if (scoreContainer) {
                scoreContainer.style.fontSize = '2rem';
            }
        }
    }

    /**
     * Initialisiert das Performance-Monitoring
     */
    initPerformanceMonitoring() {
        // Chart.js für die Darstellung des Performance-Verlaufs verwenden
        if (typeof Chart !== 'undefined' && document.getElementById('performance-history-chart')) {
            new Chart(document.getElementById('performance-history-chart'), {
                type: 'line',
                data: {
                    labels: ['01.08', '08.08', '15.08', '22.08', '29.08', '05.09', '12.09', '19.09'],
                    datasets: [
                        {
                            label: 'LCP (s)',
                            data: [2.8, 2.5, 2.3, 2.4, 2.2, 2.1, 2.0, 2.1],
                            borderColor: '#5ac8fa',
                            backgroundColor: 'rgba(90, 200, 250, 0.1)',
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'FID (ms)',
                            data: [28, 25, 22, 20, 19, 18, 18, 18],
                            borderColor: '#34c759',
                            backgroundColor: 'rgba(52, 199, 89, 0.1)',
                            tension: 0.3,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }

    /**
     * Initialisiert die Heatmap
     */
    initHeatmap() {
        const heatmapContainer = document.getElementById('heatmap-container');
        
        if (!heatmapContainer) return;
        
        // Mock-Daten für Heatmap
        const mockData = [];
        const width = heatmapContainer.offsetWidth;
        const height = heatmapContainer.offsetHeight;
        
        // Generiert 200 zufällige Punkte mit höherer Dichte in der Mitte
        for (let i = 0; i < 200; i++) {
            // Erzeugt eine Glockenkurvenverteilung um die Mitte
            const x = width / 2 + (Math.random() - 0.5) * width * 0.8;
            const y = height / 2 + (Math.random() - 0.5) * height * 0.8;
            const value = Math.random() * 100;
            
            mockData.push({ x, y, value });
        }
        
        // Heatmap mit h337 (heatmap.js) initialisieren, wenn verfügbar
        if (typeof h337 !== 'undefined') {
            this.heatmapInstance = h337.create({
                container: heatmapContainer,
                radius: 25,
                maxOpacity: 0.8,
                minOpacity: 0.1,
                blur: 0.8
            });
            
            this.heatmapInstance.setData({
                max: 100,
                data: mockData
            });
        } else {
            // Fallback, wenn heatmap.js nicht verfügbar ist
            heatmapContainer.innerHTML = '<div class="placeholder-message">Heatmap.js ist nicht geladen. Bitte installieren Sie die Bibliothek für diese Funktion.</div>';
        }
    }

    /**
     * Aktualisiert die Heatmap basierend auf der Seitenauswahl und dem Zeitraum
     */
    updateHeatmap() {
        const heatmapPageSelect = document.getElementById('heatmap-page-select');
        const heatmapPeriodSelect = document.getElementById('heatmap-period-select');
        
        if (!heatmapPageSelect || !heatmapPeriodSelect || !this.heatmapInstance) return;
        
        // Seite und Zeitraum aus den Auswahlfeldern lesen
        const page = heatmapPageSelect.value;
        const period = heatmapPeriodSelect.value;
        
        // Mock-Daten basierend auf Seite und Zeitraum
        // (Im realen Einsatz würden hier Daten vom Server abgerufen)
        this.logActivity(`Heatmap aktualisiert: ${page}, Zeitraum: ${period} Tage`);
        
        // Hier würde man normalerweise die Daten vom Server holen und aktualisieren
        // Für die Demo aktualisieren wir die Heatmap mit leicht veränderten Daten
        const heatmapContainer = document.getElementById('heatmap-container');
        if (!heatmapContainer) return;
        
        const width = heatmapContainer.offsetWidth;
        const height = heatmapContainer.offsetHeight;
        const mockData = [];
        
        // Unterschiedliche Verteilungen je nach Seite
        let xOffset = 0, yOffset = 0;
        
        switch (page) {
            case 'index': xOffset = -width * 0.2; yOffset = -height * 0.1; break;
            case 'about': xOffset = width * 0.2; yOffset = -height * 0.2; break;
            case 'gallerie': xOffset = 0; yOffset = height * 0.2; break;
            case 'informatik': xOffset = -width * 0.1; yOffset = height * 0.1; break;
        }
        
        // Generiert neue Punkte mit Verschiebung
        for (let i = 0; i < 200; i++) {
            const x = width / 2 + xOffset + (Math.random() - 0.5) * width * 0.8;
            const y = height / 2 + yOffset + (Math.random() - 0.5) * height * 0.8;
            const value = Math.random() * 100;
            
            mockData.push({ x, y, value });
        }
        
        this.heatmapInstance.setData({
            max: 100,
            data: mockData
        });
    }

    /**
     * Lädt das Aktivitätsprotokoll
     */
    loadActivityLog() {
        const activityLogTbody = document.getElementById('activity-log-tbody');
        
        if (!activityLogTbody) return;
        
        // Mock-Daten für das Aktivitätsprotokoll
        const mockActivities = [
            { date: '23.08.2025 15:45', user: 'admin', action: 'Login', details: 'Erfolgreiche Anmeldung' },
            { date: '23.08.2025 15:47', user: 'admin', action: 'Bearbeitung', details: 'Seite "Über mich" bearbeitet' },
            { date: '23.08.2025 16:12', user: 'admin', action: 'Upload', details: 'Neues Bild hochgeladen: "Projekt_neu.jpg"' },
            { date: '23.08.2025 16:30', user: 'admin', action: 'Einstellung', details: 'SEO-Einstellungen aktualisiert' },
            { date: '24.08.2025 09:18', user: 'admin', action: 'Login', details: 'Erfolgreiche Anmeldung' }
        ];
        
        // Zum Aktivitätsprotokoll hinzufügen
        this.state.activityLog = [...mockActivities];
        
        // Aktivitätsprotokoll anzeigen
        activityLogTbody.innerHTML = '';
        this.state.activityLog.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.date}</td>
                <td>${activity.user}</td>
                <td>${activity.action}</td>
                <td>${activity.details}</td>
            `;
            activityLogTbody.appendChild(row);
        });
    }

    /**
     * Initialisiert das Sicherheits-Dashboard
     */
    initSecurityDashboard() {
        // Chart.js für die Darstellung des Sicherheitsstatus verwenden
        if (typeof Chart !== 'undefined' && document.getElementById('security-chart')) {
            new Chart(document.getElementById('security-chart'), {
                type: 'radar',
                data: {
                    labels: ['Authentifizierung', 'Datenschutz', 'Updates', 'Netzwerk', 'Ressourcen'],
                    datasets: [{
                        label: 'Sicherheitsanalyse',
                        data: [85, 90, 70, 80, 95],
                        backgroundColor: 'rgba(90, 200, 250, 0.2)',
                        borderColor: '#5ac8fa',
                        pointBackgroundColor: '#5ac8fa'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        r: {
                            min: 0,
                            max: 100,
                            ticks: {
                                stepSize: 20,
                                display: false
                            }
                        }
                    }
                }
            });
        } else {
            // Fallback, wenn Chart.js nicht verfügbar ist
            document.getElementById('security-chart')?.parentElement?.classList.add('placeholder-message');
        }
    }

    /**
     * Generiert einen Bericht basierend auf den ausgewählten Optionen
     */
    generateReport() {
        const reportType = document.getElementById('report-type')?.value || 'traffic';
        const reportPeriod = document.getElementById('report-period')?.value || '30';
        const reportPreview = document.getElementById('report-preview');
        
        if (!reportPreview) return;
        
        // Simuliert das Laden eines Berichts
        reportPreview.innerHTML = '<p class="placeholder-message">Bericht wird geladen...</p>';
        
        setTimeout(() => {
            // Mock-Berichtsdaten
            let reportHTML = '';
            
            switch (reportType) {
                case 'traffic':
                    reportHTML = `
                        <h4>Traffic-Bericht für die letzten ${reportPeriod} Tage</h4>
                        <div style="margin-bottom: 1rem;">
                            <strong>Seitenaufrufe insgesamt:</strong> 1,245<br>
                            <strong>Eindeutige Besucher:</strong> 867<br>
                            <strong>Durchschnittliche Verweildauer:</strong> 2:34 min<br>
                            <strong>Absprungrate:</strong> 32%
                        </div>
                        <div>
                            <h5>Top-Seiten</h5>
                            <ol>
                                <li>Startseite (423 Aufrufe)</li>
                                <li>Gallerie (256 Aufrufe)</li>
                                <li>Über mich (187 Aufrufe)</li>
                                <li>Informatik (143 Aufrufe)</li>
                            </ol>
                        </div>
                    `;
                    break;
                    
                case 'content':
                    reportHTML = `
                        <h4>Inhalts-Bericht für die letzten ${reportPeriod} Tage</h4>
                        <div style="margin-bottom: 1rem;">
                            <strong>Aktive Seiten:</strong> 12<br>
                            <strong>Bilder insgesamt:</strong> 85<br>
                            <strong>Neueste Inhalte:</strong> Gallerie-Update (23.08.2025)<br>
                        </div>
                        <div>
                            <h5>Inhaltsperformance</h5>
                            <ul>
                                <li>Bilder mit fehlenden Alt-Tags: 7</li>
                                <li>Seiten ohne Meta-Beschreibung: 2</li>
                                <li>Seiten mit optimierter Ladezeit: 9 von 12</li>
                            </ul>
                        </div>
                    `;
                    break;
                    
                case 'performance':
                    reportHTML = `
                        <h4>Performance-Bericht für die letzten ${reportPeriod} Tage</h4>
                        <div style="margin-bottom: 1rem;">
                            <strong>Durchschnittliche Ladezeit:</strong> 1.85s<br>
                            <strong>Mobile Ladezeit:</strong> 2.3s<br>
                            <strong>Desktop Ladezeit:</strong> 1.4s<br>
                        </div>
                        <div>
                            <h5>Core Web Vitals</h5>
                            <ul>
                                <li>LCP: 2.1s (Gut)</li>
                                <li>FID: 18ms (Gut)</li>
                                <li>CLS: 0.08 (Gut)</li>
                                <li>TTFB: 320ms (Verbesserungswürdig)</li>
                            </ul>
                        </div>
                    `;
                    break;
                    
                case 'seo':
                    reportHTML = `
                        <h4>SEO-Bericht für die letzten ${reportPeriod} Tage</h4>
                        <div style="margin-bottom: 1rem;">
                            <strong>SEO-Score:</strong> ${this.state.seoScore}/100<br>
                            <strong>Indexierte Seiten:</strong> 11 von 12<br>
                            <strong>Sichtbarkeitsindex:</strong> 68%<br>
                        </div>
                        <div>
                            <h5>SEO-Probleme</h5>
                            <ul>
                                ${this.state.seoIssues.map(issue => `<li>${issue.message}</li>`).join('')}
                            </ul>
                        </div>
                    `;
                    break;
            }
            
            reportPreview.innerHTML = reportHTML;
            this.logActivity(`Bericht generiert: ${reportType} für ${reportPeriod} Tage`);
        }, 1500);
    }

    /**
     * Exportiert einen Bericht im ausgewählten Format
     */
    exportReport() {
        const reportType = document.getElementById('report-type')?.value || 'traffic';
        const reportPeriod = document.getElementById('report-period')?.value || '30';
        const reportFormat = document.getElementById('report-format')?.value || 'pdf';
        
        // Simuliert einen Export
        this.showToast(`Bericht wird als ${reportFormat.toUpperCase()} exportiert...`, 'info');
        
        setTimeout(() => {
            // Mock-Export (im Produktiveinsatz würde hier der Download erfolgen)
            this.showToast(`${reportType}-Bericht erfolgreich exportiert!`, 'success');
            this.logActivity(`Bericht exportiert: ${reportType} für ${reportPeriod} Tage als ${reportFormat.toUpperCase()}`);
        }, 2000);
    }

    /**
     * Startet den Session-Timer für automatische Abmeldung
     */
    startSessionTimer() {
        // Countdown-Timer initialisieren
        this.state.remainingTime = this.state.sessionTimeout;
        this.updateCountdown();
        
        // Timer starten
        this.sessionTimer = setInterval(() => {
            this.state.remainingTime--;
            this.updateCountdown();
            
            // Warnung anzeigen, wenn weniger als 5 Minuten verbleiben
            if (this.state.remainingTime === 300) {
                this.showSessionWarning();
            }
            
            // Automatische Abmeldung, wenn die Zeit abgelaufen ist
            if (this.state.remainingTime <= 0) {
                this.logout();
            }
        }, 1000);
        
        // Zurücksetzen des Timers bei Benutzeraktivität
        const resetTimer = () => {
            if (this.state.remainingTime < this.state.sessionTimeout - 60) {
                this.extendSession();
            }
        };
        
        // Events für Benutzeraktivität
        document.addEventListener('click', resetTimer);
        document.addEventListener('keydown', resetTimer);
        document.addEventListener('mousemove', () => {
            // Verhindert zu häufiges Zurücksetzen bei Mausbewegung
            clearTimeout(this.mouseMoveTimeout);
            this.mouseMoveTimeout = setTimeout(resetTimer, 5000);
        });
    }

    /**
     * Aktualisiert den Countdown-Timer
     */
    updateCountdown() {
        const countdownTimer = document.getElementById('countdown-timer');
        if (!countdownTimer) return;
        
        const minutes = Math.floor(this.state.remainingTime / 60);
        const seconds = this.state.remainingTime % 60;
        
        countdownTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Zeigt eine Warnung an, wenn die Sitzung bald abläuft
     */
    showSessionWarning() {
        const sessionCountdown = document.getElementById('session-countdown');
        if (sessionCountdown) {
            sessionCountdown.classList.remove('hidden');
        }
    }

    /**
     * Verlängert die Sitzung
     */
    extendSession() {
        this.state.remainingTime = this.state.sessionTimeout;
        this.updateCountdown();
        
        const sessionCountdown = document.getElementById('session-countdown');
        if (sessionCountdown) {
            sessionCountdown.classList.add('hidden');
        }
        
        this.logActivity('Sitzung verlängert');
        this.showToast('Ihre Sitzung wurde verlängert', 'success');
    }

    /**
     * Meldet den Benutzer ab
     */
    logout() {
        clearInterval(this.sessionTimer);
        this.logActivity('Benutzer abgemeldet');
        
        // Redirect zur Login-Seite
        window.location.href = 'login.html';
    }

    /**
     * Protokolliert eine Aktivität
     */
    logActivity(message) {
        const now = new Date();
        const timestamp = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        const activity = {
            date: timestamp,
            user: 'admin',
            action: 'System',
            details: message
        };
        
        this.state.activityLog.unshift(activity);
        
        // Aktualisiere das Aktivitätsprotokoll, wenn es sichtbar ist
        const activityLogTbody = document.getElementById('activity-log-tbody');
        if (activityLogTbody) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.date}</td>
                <td>${activity.user}</td>
                <td>${activity.action}</td>
                <td>${activity.details}</td>
            `;
            activityLogTbody.prepend(row);
            
            // Begrenze die Anzahl der angezeigten Einträge
            if (activityLogTbody.children.length > 50) {
                activityLogTbody.lastElementChild.remove();
            }
        }
        
        // Auch zum bestehenden Log-System hinzufügen
        const logList = document.getElementById('log-list');
        if (logList) {
            const li = document.createElement('li');
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = 'INFO';
            li.appendChild(badge);
            li.append(' ' + message);
            logList.prepend(li);
            
            // Begrenze die Anzahl der angezeigten Einträge
            while (logList.children.length > 50) {
                logList.lastElementChild.remove();
            }
        }
    }

    /**
     * Zeigt eine Toast-Benachrichtigung an
     */
    showToast(message, type = 'info') {
        // Prüfen, ob bereits ein Toast-Container existiert
        let toastContainer = document.querySelector('.toast-container');
        
        if (!toastContainer) {
            // Toast-Container erstellen
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        
        // Toast erstellen
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="ri-${type === 'success' ? 'check-line' : type === 'error' ? 'error-warning-line' : type === 'warn' ? 'alert-line' : 'information-line'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Toast zum Container hinzufügen
        toastContainer.appendChild(toast);
        
        // Toast nach kurzer Verzögerung einblenden
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Toast nach einiger Zeit ausblenden
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
                
                // Container entfernen, wenn keine Toasts mehr vorhanden sind
                if (toastContainer.children.length === 0) {
                    toastContainer.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Lade Chart.js dynamisch, wenn nicht vorhanden
function loadChartJS() {
    if (typeof Chart !== 'undefined') return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Lade heatmap.js dynamisch, wenn nicht vorhanden
function loadHeatmapJS() {
    if (typeof h337 !== 'undefined') return Promise.resolve();
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/heatmap.js@2.0.5/build/heatmap.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Dashboard initialisieren
document.addEventListener('DOMContentLoaded', () => {
    // Sicherheitsprüfung: Session-Flag prüfen
    let hasAdminSession = false;
    try { hasAdminSession = sessionStorage.getItem('admin_session') === '1'; } catch(e) {}
    const isLoginPage = window.location.href.includes('login.html');
    if (!hasAdminSession && !isLoginPage) {
        window.location.href = 'login.html?reason=' + encodeURIComponent('Neue Anmeldung erforderlich.');
        return;
    }
    
    // Bibliotheken laden und dann Dashboard initialisieren
    Promise.all([
        loadChartJS(),
        loadHeatmapJS()
    ]).then(() => {
        const dashboard = new AdminDashboard();
        dashboard.init();
        
        // Global zugänglich machen für Konsolen-Debugging
        window.adminDashboard = dashboard;
    }).catch(error => {
        console.warn('Konnte erforderliche Bibliotheken nicht laden:', error);
        
        // Trotzdem Dashboard ohne externe Bibliotheken initialisieren
        const dashboard = new AdminDashboard();
        dashboard.init();
    });
});
