/**
 * Admin Dashboard - Erweitertes Funktionssystem
 * Implementiert erweiterte Analyse- und Monitoring-Funktionen
 */

// Dashboard-Modul mit Namensraum, um globalen Scope sauber zu halten
const Dashboard = (function() {
    // Private Variablen
    let config = {
        darkMode: false,
        refreshInterval: 30000, // 30 Sekunden
        sessionTimeout: 30 * 60 * 1000, // 30 Minuten
        toastDuration: 5000, // 5 Sekunden
        chartColors: {
            primary: '#0a84ff',
            secondary: '#5856d6',
            success: '#34c759',
            warning: '#ff9500',
            danger: '#ff3b30',
            info: '#5ac8fa',
            gray: '#8e8e93'
        }
    };

    // Inaktivitäts-Timer für Auto-Logout
    let inactivityTimer;
    let isMaintenanceMode = false;
    
    // DOM Cache
    const DOM = {};
    
    /**
     * DOM-Elemente initialisieren
     */
    function cacheDOMElements() {
        // Haupt-Container
        DOM.mainContainer = document.getElementById('dashboard-main');
        DOM.sidebar = document.getElementById('dashboard-sidebar');
        DOM.contentArea = document.getElementById('dashboard-content');
        
        // Navigation
        DOM.navItems = document.querySelectorAll('.dashboard-nav-item');
        DOM.navToggle = document.getElementById('nav-toggle');
        
        // Statistiken
        DOM.statCards = document.querySelectorAll('.stat-card');
        DOM.visitorsChart = document.getElementById('visitors-chart');
        DOM.pageviewsChart = document.getElementById('pageviews-chart');
        DOM.devicesChart = document.getElementById('devices-chart');
        
        // Screen Size Preview
        DOM.screenSizePreview = document.getElementById('screen-size-preview');
        DOM.screenSizeSelector = document.getElementById('screen-size-selector');
        DOM.previewFrame = document.getElementById('preview-iframe');
        
        // Heatmap
        DOM.heatmapContainer = document.getElementById('heatmap-container');
        DOM.heatmapSelector = document.getElementById('heatmap-page-selector');
        
        // Reports
        DOM.reportSection = document.getElementById('reports-section');
        DOM.exportBtn = document.getElementById('export-report-btn');
        DOM.reportTypeSelector = document.getElementById('report-type');
        DOM.dateRangePicker = document.getElementById('date-range-picker');
        
        // SEO Analysis
        DOM.seoScoreChart = document.getElementById('seo-score-chart');
        DOM.seoIssuesList = document.getElementById('seo-issues-list');
        DOM.seoPageSelector = document.getElementById('seo-page-selector');
        
        // Performance Monitoring
        DOM.performanceChart = document.getElementById('performance-chart');
        DOM.coreWebVitals = document.getElementById('core-web-vitals');
        
        // Security & Logs
        DOM.activityLogTable = document.getElementById('activity-log-table');
        DOM.securityIssuesTable = document.getElementById('security-issues-table');
        DOM.loginAttemptsChart = document.getElementById('login-attempts-chart');
        
        // Settings
        DOM.maintenanceToggle = document.getElementById('maintenance-mode-toggle');
        DOM.themeToggle = document.getElementById('theme-toggle');
        DOM.sessionTimeoutInput = document.getElementById('session-timeout');
        
        // Notifications & Feedback
        DOM.toastContainer = document.getElementById('toast-container');
    }
    
    /**
     * Daten für Analytics laden
     * In einer realen Implementierung würden die Daten vom Server geladen
     * @param {string} dataType - Art der Daten
     * @param {Object} params - Parameter für die Datenabfrage
     * @returns {Promise} - Promise mit den angeforderten Daten
     */
    function fetchAnalyticsData(dataType, params = {}) {
        return new Promise((resolve) => {
            // Simulierte Daten für Demo-Zwecke
            setTimeout(() => {
                switch(dataType) {
                    case 'visitors':
                        resolve({
                            labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
                            data: [65, 72, 86, 81, 56, 55, 40].map(v => Math.floor(v * (0.8 + Math.random() * 0.4)))
                        });
                        break;
                    case 'pageviews':
                        resolve({
                            labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
                            data: [120, 150, 180, 165, 140, 110, 95].map(v => Math.floor(v * (0.8 + Math.random() * 0.4)))
                        });
                        break;
                    case 'devices':
                        resolve({
                            labels: ['Desktop', 'Mobil', 'Tablet'],
                            data: [58, 35, 7].map(v => Math.floor(v * (0.9 + Math.random() * 0.2)))
                        });
                        break;
                    case 'browsers':
                        resolve({
                            labels: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Andere'],
                            data: [62, 15, 12, 8, 3].map(v => Math.floor(v * (0.9 + Math.random() * 0.2)))
                        });
                        break;
                    case 'seo':
                        resolve({
                            score: Math.floor(Math.random() * 30) + 70,
                            issues: [
                                { severity: 'high', message: 'Meta-Beschreibungen fehlen auf 3 Seiten' },
                                { severity: 'medium', message: 'Bilder ohne Alt-Text gefunden (4)' },
                                { severity: 'medium', message: 'H1-Tags fehlen auf 2 Seiten' },
                                { severity: 'low', message: 'URL-Struktur könnte verbessert werden' }
                            ]
                        });
                        break;
                    case 'performance':
                        resolve({
                            labels: ['LCP', 'FID', 'CLS', 'TTFB'],
                            data: [
                                Math.random() * 2 + 1.5, // LCP (Sekunden)
                                Math.random() * 100 + 50, // FID (ms)
                                Math.random() * 0.15 + 0.05, // CLS (score)
                                Math.random() * 300 + 200 // TTFB (ms)
                            ]
                        });
                        break;
                    case 'activity':
                        const activities = [
                            { time: '10:23', user: 'admin', action: 'Login erfolgreich', ip: '192.168.1.1' },
                            { time: '11:05', user: 'admin', action: 'Seite bearbeitet: Home', ip: '192.168.1.1' },
                            { time: '12:30', user: 'system', action: 'Automatisches Backup erstellt', ip: 'localhost' },
                            { time: '13:15', user: 'admin', action: 'Bild hochgeladen: gallerie/neu.jpg', ip: '192.168.1.1' },
                            { time: '14:22', user: 'admin', action: 'Logout', ip: '192.168.1.1' },
                            { time: '15:40', user: 'redakteur', action: 'Login erfolgreich', ip: '192.168.1.2' },
                            { time: '15:51', user: 'redakteur', action: 'Beitrag bearbeitet: Über mich', ip: '192.168.1.2' },
                            { time: '16:15', user: 'redakteur', action: 'Logout', ip: '192.168.1.2' }
                        ];
                        resolve(activities);
                        break;
                    case 'heatmap':
                        resolve({
                            maxValue: 100,
                            data: Array.from({length: 20}, () => ({
                                x: Math.floor(Math.random() * 100),
                                y: Math.floor(Math.random() * 100),
                                value: Math.floor(Math.random() * 100)
                            }))
                        });
                        break;
                    case 'security':
                        resolve({
                            loginAttempts: {
                                successful: Math.floor(Math.random() * 10) + 5,
                                failed: Math.floor(Math.random() * 15)
                            },
                            issues: [
                                { severity: 'medium', message: 'Veraltete Plugin-Version erkannt', status: 'offen' },
                                { severity: 'low', message: 'Empfohlene HTTPS-Header fehlen', status: 'offen' }
                            ]
                        });
                        break;
                    default:
                        resolve({ error: 'Unbekannter Datentyp' });
                }
            }, 500);
        });
    }
    
    /**
     * Chart erstellen
     * @param {HTMLElement} canvas - Canvas-Element
     * @param {string} type - Chart-Typ (line, bar, pie, doughnut)
     * @param {Object} data - Chartdaten
     * @param {Object} options - Chart-Optionen
     */
    function createChart(canvas, type, data, options = {}) {
        if (!canvas || !window.Chart) return null;
        
        // Standardoptionen
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: type === 'pie' || type === 'doughnut',
                    position: 'bottom'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        };
        
        // Chart erstellen
        return new Chart(canvas.getContext('2d'), {
            type: type,
            data: data,
            options: { ...defaultOptions, ...options }
        });
    }
    
    /**
     * Besucher-Chart initialisieren
     */
    function initVisitorsChart() {
        if (!DOM.visitorsChart) return;
        
        fetchAnalyticsData('visitors').then(result => {
            const data = {
                labels: result.labels,
                datasets: [{
                    label: 'Besucher',
                    data: result.data,
                    borderColor: config.chartColors.primary,
                    backgroundColor: hexToRGBA(config.chartColors.primary, 0.2),
                    tension: 0.3,
                    fill: true
                }]
            };
            
            createChart(DOM.visitorsChart, 'line', data, {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            });
        });
    }
    
    /**
     * Seitenaufrufe-Chart initialisieren
     */
    function initPageviewsChart() {
        if (!DOM.pageviewsChart) return;
        
        fetchAnalyticsData('pageviews').then(result => {
            const data = {
                labels: result.labels,
                datasets: [{
                    label: 'Seitenaufrufe',
                    data: result.data,
                    backgroundColor: config.chartColors.secondary,
                    borderRadius: 4
                }]
            };
            
            createChart(DOM.pageviewsChart, 'bar', data, {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            });
        });
    }
    
    /**
     * Geräte-Chart initialisieren
     */
    function initDevicesChart() {
        if (!DOM.devicesChart) return;
        
        fetchAnalyticsData('devices').then(result => {
            const data = {
                labels: result.labels,
                datasets: [{
                    data: result.data,
                    backgroundColor: [
                        config.chartColors.primary,
                        config.chartColors.success,
                        config.chartColors.warning
                    ],
                    borderWidth: 0
                }]
            };
            
            createChart(DOM.devicesChart, 'doughnut', data, {
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            });
        });
    }
    
    /**
     * SEO-Score-Chart initialisieren
     */
    function initSeoScoreChart() {
        if (!DOM.seoScoreChart) return;
        
        fetchAnalyticsData('seo').then(result => {
            const data = {
                labels: ['Score', 'Restlich'],
                datasets: [{
                    data: [result.score, 100 - result.score],
                    backgroundColor: [
                        getScoreColor(result.score),
                        hexToRGBA('#e0e0e0', 0.2)
                    ],
                    borderWidth: 0
                }]
            };
            
            createChart(DOM.seoScoreChart, 'doughnut', data, {
                cutout: '80%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: false
                    }
                }
            });
            
            // Score in der Mitte anzeigen
            if (DOM.seoScoreChart.parentNode) {
                const scoreDisplay = document.createElement('div');
                scoreDisplay.className = 'chart-center-score';
                scoreDisplay.innerHTML = `<span>${result.score}</span><small>/100</small>`;
                scoreDisplay.style.color = getScoreColor(result.score);
                DOM.seoScoreChart.parentNode.appendChild(scoreDisplay);
            }
            
            // SEO-Issues anzeigen
            if (DOM.seoIssuesList) {
                DOM.seoIssuesList.innerHTML = '';
                result.issues.forEach(issue => {
                    const li = document.createElement('li');
                    li.className = `seo-issue seo-issue-${issue.severity}`;
                    li.innerHTML = `
                        <span class="issue-indicator"></span>
                        <span class="issue-message">${issue.message}</span>
                    `;
                    DOM.seoIssuesList.appendChild(li);
                });
            }
        });
    }
    
    /**
     * Performance-Chart initialisieren
     */
    function initPerformanceChart() {
        if (!DOM.performanceChart) return;
        
        fetchAnalyticsData('performance').then(result => {
            // Performance-Metriken bewerten
            const lcpScore = result.data[0] <= 2.5 ? 'good' : (result.data[0] <= 4.0 ? 'needs-improvement' : 'poor');
            const fidScore = result.data[1] <= 100 ? 'good' : (result.data[1] <= 300 ? 'needs-improvement' : 'poor');
            const clsScore = result.data[2] <= 0.1 ? 'good' : (result.data[2] <= 0.25 ? 'needs-improvement' : 'poor');
            const ttfbScore = result.data[3] <= 300 ? 'good' : (result.data[3] <= 600 ? 'needs-improvement' : 'poor');
            
            // Core Web Vitals anzeigen
            if (DOM.coreWebVitals) {
                DOM.coreWebVitals.innerHTML = `
                    <div class="vitals-metric ${lcpScore}">
                        <div class="vitals-name">LCP</div>
                        <div class="vitals-value">${result.data[0].toFixed(2)} s</div>
                        <div class="vitals-label">Größtes Contentful Paint</div>
                    </div>
                    <div class="vitals-metric ${fidScore}">
                        <div class="vitals-name">FID</div>
                        <div class="vitals-value">${result.data[1].toFixed(0)} ms</div>
                        <div class="vitals-label">First Input Delay</div>
                    </div>
                    <div class="vitals-metric ${clsScore}">
                        <div class="vitals-name">CLS</div>
                        <div class="vitals-value">${result.data[2].toFixed(2)}</div>
                        <div class="vitals-label">Cumulative Layout Shift</div>
                    </div>
                    <div class="vitals-metric ${ttfbScore}">
                        <div class="vitals-name">TTFB</div>
                        <div class="vitals-value">${result.data[3].toFixed(0)} ms</div>
                        <div class="vitals-label">Time to First Byte</div>
                    </div>
                `;
            }
            
            // Performance-Übersicht-Chart
            const data = {
                labels: ['LCP (s)', 'FID (ms/100)', 'CLS (x100)', 'TTFB (ms/100)'],
                datasets: [{
                    label: 'Aktuell',
                    data: [
                        result.data[0],           // LCP in Sekunden
                        result.data[1] / 100,     // FID in ms/100 für bessere Skalierung
                        result.data[2] * 100,     // CLS * 100 für bessere Sichtbarkeit
                        result.data[3] / 100      // TTFB in ms/100 für bessere Skalierung
                    ],
                    backgroundColor: hexToRGBA(config.chartColors.primary, 0.7),
                    borderColor: config.chartColors.primary,
                    borderWidth: 1
                }, {
                    label: 'Gut',
                    data: [2.5, 1.0, 10, 3.0], // Schwellenwerte für gute Performance
                    backgroundColor: hexToRGBA(config.chartColors.success, 0.3),
                    borderColor: config.chartColors.success,
                    borderWidth: 1,
                    borderDash: [5, 5]
                }]
            };
            
            createChart(DOM.performanceChart, 'radar', data, {
                scales: {
                    r: {
                        beginAtZero: true,
                        ticks: {
                            display: false
                        }
                    }
                }
            });
        });
    }
    
    /**
     * Aktivitätsprotokoll initialisieren
     */
    function initActivityLog() {
        if (!DOM.activityLogTable) return;
        
        fetchAnalyticsData('activity').then(activities => {
            const tbody = DOM.activityLogTable.querySelector('tbody') || DOM.activityLogTable;
            tbody.innerHTML = '';
            
            activities.forEach(activity => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${activity.time}</td>
                    <td>${activity.user}</td>
                    <td>${activity.action}</td>
                    <td>${activity.ip}</td>
                `;
                tbody.appendChild(tr);
            });
        });
    }
    
    /**
     * Heatmap initialisieren
     */
    function initHeatmap() {
        if (!DOM.heatmapContainer) return;
        
        fetchAnalyticsData('heatmap').then(heatmapData => {
            if (window.h337) {
                // Heatmap.js Instanz erstellen
                const heatmap = h337.create({
                    container: DOM.heatmapContainer,
                    radius: 20,
                    maxOpacity: 0.6,
                    minOpacity: 0.1,
                    blur: 0.75
                });
                
                // Daten setzen
                heatmap.setData({
                    max: heatmapData.maxValue,
                    data: heatmapData.data
                });
            } else {
                DOM.heatmapContainer.innerHTML = '<div class="placeholder-message">Heatmap.js Bibliothek nicht geladen.</div>';
            }
        });
    }
    
    /**
     * Sicherheits-Dashboard initialisieren
     */
    function initSecurityDashboard() {
        if (!DOM.securityIssuesTable || !DOM.loginAttemptsChart) return;
        
        fetchAnalyticsData('security').then(securityData => {
            // Login-Versuche Chart
            const data = {
                labels: ['Erfolgreich', 'Fehlgeschlagen'],
                datasets: [{
                    data: [securityData.loginAttempts.successful, securityData.loginAttempts.failed],
                    backgroundColor: [
                        config.chartColors.success,
                        config.chartColors.danger
                    ],
                    borderWidth: 0
                }]
            };
            
            createChart(DOM.loginAttemptsChart, 'pie', data);
            
            // Sicherheitsprobleme anzeigen
            const tbody = DOM.securityIssuesTable.querySelector('tbody') || DOM.securityIssuesTable;
            tbody.innerHTML = '';
            
            securityData.issues.forEach(issue => {
                const tr = document.createElement('tr');
                tr.className = `security-issue-${issue.severity}`;
                tr.innerHTML = `
                    <td><span class="severity-indicator"></span>${issue.severity}</td>
                    <td>${issue.message}</td>
                    <td>${issue.status}</td>
                    <td>
                        <button class="btn-icon" data-action="fix-issue"><i class="ri-tools-line"></i></button>
                        <button class="btn-icon" data-action="ignore-issue"><i class="ri-close-line"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        });
    }
    
    /**
     * Bildschirmgrößen-Vorschau initialisieren
     */
    function initScreenSizePreview() {
        if (!DOM.screenSizePreview || !DOM.screenSizeSelector || !DOM.previewFrame) return;
        
        // Vorschauseite aus URL-Parameter laden oder Standardseite verwenden
        const urlParams = new URLSearchParams(window.location.search);
        const previewPage = urlParams.get('preview') || 'index.html';
        
        // iframe src setzen
        DOM.previewFrame.src = previewPage;
        
        // Event-Listener für Bildschirmgrößen-Auswahl
        DOM.screenSizeSelector.addEventListener('change', function() {
            const selectedSize = this.value;
            let width, height;
            
            // Bildschirmgrößen-Presets
            switch(selectedSize) {
                case 'mobile-small':
                    width = 320;
                    height = 568;
                    break;
                case 'mobile-medium':
                    width = 375;
                    height = 667;
                    break;
                case 'mobile-large':
                    width = 414;
                    height = 736;
                    break;
                case 'tablet':
                    width = 768;
                    height = 1024;
                    break;
                case 'laptop':
                    width = 1366;
                    height = 768;
                    break;
                case 'desktop':
                    width = 1920;
                    height = 1080;
                    break;
                default:
                    width = 1366;
                    height = 768;
            }
            
            // Vorschau-Container Größe anpassen
            DOM.previewFrame.style.width = width + 'px';
            DOM.previewFrame.style.height = height + 'px';
            
            // Info anzeigen
            const sizeInfo = DOM.screenSizePreview.querySelector('.preview-size-info') || document.createElement('div');
            sizeInfo.className = 'preview-size-info';
            sizeInfo.textContent = `${width} × ${height}px`;
            
            if (!sizeInfo.parentNode) {
                DOM.screenSizePreview.appendChild(sizeInfo);
            }
        });
        
        // Initial auslösen
        DOM.screenSizeSelector.dispatchEvent(new Event('change'));
    }
    
    /**
     * Berichterstellung initialisieren
     */
    function initReports() {
        if (!DOM.exportBtn || !DOM.reportTypeSelector) return;
        
        // Event-Listener für Export-Button
        DOM.exportBtn.addEventListener('click', function() {
            const reportType = DOM.reportTypeSelector.value;
            const dateRange = DOM.dateRangePicker ? DOM.dateRangePicker.value : 'last-30-days';
            
            showToast('info', 'Bericht wird erstellt', 'Der Bericht wird generiert und zum Download vorbereitet.');
            
            // In einer realen Implementierung würde hier eine API-Anfrage stattfinden
            setTimeout(() => {
                generateReport(reportType, dateRange);
            }, 1500);
        });
    }
    
    /**
     * Berichterstellung
     * @param {string} reportType - Berichtstyp
     * @param {string} dateRange - Datumsbereich
     */
    function generateReport(reportType, dateRange) {
        // Beispieldaten für den Bericht
        const reportData = {
            title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)}-Bericht`,
            date: new Date().toLocaleDateString('de-DE'),
            dateRange: dateRange,
            data: {}
        };
        
        switch(reportType) {
            case 'analytics':
                reportData.data = {
                    visitors: {
                        total: 1250,
                        unique: 854,
                        returning: 396,
                        bounce: 38.5
                    },
                    pageviews: {
                        total: 3670,
                        avgTimeOnPage: '2:15',
                        topPages: [
                            { page: 'index.html', views: 1240 },
                            { page: 'about.html', views: 895 },
                            { page: 'gallerie.html', views: 620 },
                            { page: 'informatik.html', views: 480 },
                            { page: 'fotografie_equipment.html', views: 435 }
                        ]
                    }
                };
                break;
            case 'seo':
                reportData.data = {
                    score: 78,
                    issues: [
                        { severity: 'high', message: 'Meta-Beschreibungen fehlen auf 3 Seiten' },
                        { severity: 'medium', message: 'Bilder ohne Alt-Text gefunden (4)' },
                        { severity: 'medium', message: 'H1-Tags fehlen auf 2 Seiten' },
                        { severity: 'low', message: 'URL-Struktur könnte verbessert werden' }
                    ],
                    recommendations: [
                        'Fügen Sie Meta-Beschreibungen für alle Seiten hinzu',
                        'Stellen Sie sicher, dass alle Bilder Alt-Text haben',
                        'Fügen Sie H1-Tags für alle Seiten hinzu',
                        'Optimieren Sie die URL-Struktur für bessere Lesbarkeit'
                    ]
                };
                break;
            case 'performance':
                reportData.data = {
                    metrics: {
                        lcp: 2.3,
                        fid: 85,
                        cls: 0.08,
                        ttfb: 280
                    },
                    recommendations: [
                        'Optimieren Sie die Bildgrößen für schnelleres Laden',
                        'Implementieren Sie Lazy Loading für Bilder unter dem Fold',
                        'Minimieren Sie CSS und JavaScript',
                        'Verbessern Sie die Server-Response-Zeit'
                    ]
                };
                break;
            case 'security':
                reportData.data = {
                    score: 92,
                    issues: [
                        { severity: 'medium', message: 'Veraltete Plugin-Version erkannt', status: 'offen' },
                        { severity: 'low', message: 'Empfohlene HTTPS-Header fehlen', status: 'offen' }
                    ],
                    logins: {
                        successful: 24,
                        failed: 8
                    },
                    recommendations: [
                        'Aktualisieren Sie alle Plugins auf die neueste Version',
                        'Implementieren Sie die empfohlenen HTTPS-Header',
                        'Erwägen Sie die Implementierung von 2FA für Admin-Konten'
                    ]
                };
                break;
        }
        
        // Bericht als JSON generieren
        const jsonData = JSON.stringify(reportData, null, 2);
        
        // Bericht als Datei herunterladen
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportData.title.toLowerCase().replace(/\s+/g, '-')}-${dateRange}-${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('success', 'Bericht erstellt', `Der ${reportData.title} wurde erfolgreich erstellt und heruntergeladen.`);
    }
    
    /**
     * Wartungsmodus-Funktionalität
     */
    function initMaintenanceMode() {
        if (!DOM.maintenanceToggle) return;
        
        // Wartungsmodus-Toggle
        DOM.maintenanceToggle.addEventListener('change', function() {
            isMaintenanceMode = this.checked;
            toggleMaintenanceMode(isMaintenanceMode);
        });
    }
    
    /**
     * Wartungsmodus umschalten
     * @param {boolean} enable - Wartungsmodus aktivieren/deaktivieren
     */
    function toggleMaintenanceMode(enable) {
        // In einer realen Implementierung würde hier eine API-Anfrage stattfinden
        
        if (enable) {
            showToast('warn', 'Wartungsmodus aktiviert', 'Die Website ist jetzt im Wartungsmodus und für Besucher nicht erreichbar.');
            document.body.classList.add('maintenance-mode');
        } else {
            showToast('success', 'Wartungsmodus deaktiviert', 'Die Website ist jetzt wieder online und für Besucher erreichbar.');
            document.body.classList.remove('maintenance-mode');
        }
    }
    
    /**
     * Theme umschalten (Dark/Light Mode)
     */
    function initThemeToggle() {
        if (!DOM.themeToggle) return;
        
        // Aktuelles Theme setzen
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        DOM.themeToggle.checked = currentTheme === 'dark';
        
        // Theme-Toggle
        DOM.themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
    
    /**
     * Theme setzen
     * @param {string} theme - Theme ('dark' oder 'light')
     */
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('Konnte Theme-Einstellung nicht speichern:', e);
        }
        
        // Charts aktualisieren, falls vorhanden
        if (window.Chart && Chart.instances) {
            Object.values(Chart.instances).forEach(chart => {
                chart.update();
            });
        }
        
        showToast('info', 'Theme geändert', `Das Theme wurde auf ${theme === 'dark' ? 'Dunkel' : 'Hell'} umgestellt.`);
    }
    
    /**
     * Toast-Benachrichtigung anzeigen
     * @param {string} type - Toast-Typ (success, info, warn, error)
     * @param {string} title - Toast-Titel
     * @param {string} message - Toast-Nachricht
     */
    function showToast(type, title, message) {
        if (!DOM.toastContainer) {
            // Toast-Container erstellen, falls nicht vorhanden
            DOM.toastContainer = document.createElement('div');
            DOM.toastContainer.id = 'toast-container';
            DOM.toastContainer.className = 'toast-container';
            document.body.appendChild(DOM.toastContainer);
        }
        
        // Toast-Element erstellen
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Icon basierend auf Typ
        let icon;
        switch (type) {
            case 'success':
                icon = 'ri-check-line';
                break;
            case 'info':
                icon = 'ri-information-line';
                break;
            case 'warn':
                icon = 'ri-alert-line';
                break;
            case 'error':
                icon = 'ri-error-warning-line';
                break;
            default:
                icon = 'ri-notification-line';
        }
        
        // Toast-Inhalt setzen
        toast.innerHTML = `
            <div class="toast-icon"><i class="${icon}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Benachrichtigung schließen"><i class="ri-close-line"></i></button>
        `;
        
        // Toast zum Container hinzufügen
        DOM.toastContainer.appendChild(toast);
        
        // Animation starten
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Schließen-Button-Handler
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                toast.classList.remove('show');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            });
        }
        
        // Automatisch schließen nach Timeout
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, config.toastDuration);
    }
    
    /**
     * Auto-Logout nach Inaktivität
     */
    function setupAutoLogout() {
        const sessionTimeout = config.sessionTimeout;
        
        // Inaktivitäts-Timer setzen
        function resetInactivityTimer() {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                logoutUser('Automatisch abgemeldet aufgrund von Inaktivität');
            }, sessionTimeout);
        }
        
        // Benutzeraktionen überwachen
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetInactivityTimer, false);
        });
        
        // Initial starten
        resetInactivityTimer();
    }
    
    /**
     * Benutzer abmelden
     * @param {string} reason - Grund für die Abmeldung
     */
    function logoutUser(reason) {
        // Session-Token löschen
        try {
            sessionStorage.removeItem('adminAuthToken');
            localStorage.removeItem('adminAuthToken');
        } catch (e) {
            console.error('Fehler beim Löschen des Auth-Tokens:', e);
        }
        
        // Zur Login-Seite weiterleiten
        window.location.href = `login.html?reason=${encodeURIComponent(reason)}`;
    }
    
    /**
     * Navigation initialisieren
     */
    function initNavigation() {
        if (!DOM.navItems || !DOM.navToggle) return;
        
        // Navigation-Toggle (für mobile Ansicht)
        DOM.navToggle.addEventListener('click', function() {
            DOM.sidebar.classList.toggle('collapsed');
            DOM.contentArea.classList.toggle('expanded');
        });
        
        // Navigation-Items
        DOM.navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.classList.contains('has-submenu')) {
                    e.preventDefault();
                    this.classList.toggle('expanded');
                    const submenu = this.querySelector('.submenu');
                    if (submenu) {
                        submenu.classList.toggle('expanded');
                    }
                }
            });
        });
    }
    
    /**
     * Event-Tracking initialisieren
     */
    function initEventTracking() {
        // Klick-Events verfolgen
        document.addEventListener('click', function(e) {
            // Nur interessante Elemente verfolgen
            const target = e.target.closest('a, button, [data-track]');
            if (!target) return;
            
            // Event-Daten sammeln
            let eventData = {
                type: 'click',
                timestamp: new Date().toISOString(),
                element: target.tagName.toLowerCase(),
                url: window.location.href
            };
            
            // Zusätzliche Daten basierend auf Element-Typ
            if (target.tagName === 'A') {
                eventData.href = target.href;
                eventData.text = target.innerText.trim();
            } else if (target.tagName === 'BUTTON') {
                eventData.id = target.id || '';
                eventData.text = target.innerText.trim();
                eventData.action = target.getAttribute('data-action') || '';
            }
            
            // Explizite Tracking-Daten
            if (target.hasAttribute('data-track')) {
                try {
                    const trackData = JSON.parse(target.getAttribute('data-track'));
                    eventData = { ...eventData, ...trackData };
                } catch (e) {
                    console.warn('Ungültiges data-track Format:', e);
                }
            }
            
            // Event senden
            trackEvent(eventData);
        });
        
        // Seitenansicht verfolgen
        trackEvent({
            type: 'pageview',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            title: document.title
        });
    }
    
    /**
     * Event verfolgen
     * @param {Object} eventData - Event-Daten
     */
    function trackEvent(eventData) {
        // In einer realen Implementierung würde hier eine API-Anfrage stattfinden
        console.log('Event getrackt:', eventData);
        
        // Lokalen Event-Speicher aktualisieren
        try {
            const events = JSON.parse(localStorage.getItem('trackedEvents') || '[]');
            events.push(eventData);
            // Nur die letzten 100 Events speichern
            if (events.length > 100) {
                events.shift();
            }
            localStorage.setItem('trackedEvents', JSON.stringify(events));
        } catch (e) {
            console.warn('Konnte Event nicht speichern:', e);
        }
    }
    
    /**
     * Farbe basierend auf Score ermitteln
     * @param {number} score - Score (0-100)
     * @returns {string} - Farbwert
     */
    function getScoreColor(score) {
        if (score >= 90) return config.chartColors.success;
        if (score >= 70) return config.chartColors.info;
        if (score >= 50) return config.chartColors.warning;
        return config.chartColors.danger;
    }
    
    /**
     * HEX-Farbe in RGBA konvertieren
     * @param {string} hex - HEX-Farbwert
     * @param {number} alpha - Alpha-Wert (0-1)
     * @returns {string} - RGBA-Farbwert
     */
    function hexToRGBA(hex, alpha = 1) {
        if (!hex) return `rgba(0, 0, 0, ${alpha})`;
        
        // HEX zu RGB konvertieren
        let r, g, b;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else {
            r = parseInt(hex.slice(1, 3), 16);
            g = parseInt(hex.slice(3, 5), 16);
            b = parseInt(hex.slice(5, 7), 16);
        }
        
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    /**
     * Dashboard initialisieren
     */
    function init() {
        // DOM-Elemente cachen
        cacheDOMElements();
        
        // Prüfen, ob der Benutzer angemeldet ist (in einer realen Implementierung)
        const authToken = sessionStorage.getItem('adminAuthToken') || localStorage.getItem('adminAuthToken');
        if (!authToken && window.location.pathname.indexOf('login.html') === -1) {
            // Nicht angemeldet, zur Login-Seite weiterleiten
            window.location.href = 'login.html?reason=Bitte+melden+Sie+sich+an';
            return;
        }
        
        // Grundfunktionen initialisieren
        initNavigation();
        initThemeToggle();
        initMaintenanceMode();
        setupAutoLogout();
        initEventTracking();
        
        // Dashboard-Module initialisieren, falls vorhanden
        initVisitorsChart();
        initPageviewsChart();
        initDevicesChart();
        initSeoScoreChart();
        initPerformanceChart();
        initActivityLog();
        initHeatmap();
        initSecurityDashboard();
        initScreenSizePreview();
        initReports();
        
        // Refresh-Timer für Live-Daten (alle 30 Sekunden)
        setInterval(() => {
            initVisitorsChart();
            initPageviewsChart();
            initActivityLog();
        }, config.refreshInterval);
        
        console.log('Dashboard erfolgreich initialisiert');
    }
    
    // Öffentliche API
    return {
        init: init,
        showToast: showToast,
        setTheme: setTheme,
        toggleMaintenanceMode: toggleMaintenanceMode,
        logout: function(reason) {
            logoutUser(reason || 'Manuell abgemeldet');
        },
        refreshData: function() {
            initVisitorsChart();
            initPageviewsChart();
            initDevicesChart();
            initSeoScoreChart();
            initPerformanceChart();
            initActivityLog();
            initHeatmap();
            initSecurityDashboard();
        }
    };
})();

// Dashboard initialisieren, wenn das DOM geladen ist
document.addEventListener('DOMContentLoaded', function() {
    Dashboard.init();
});
