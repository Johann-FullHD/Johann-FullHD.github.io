/**
 * Admin Dashboard Funktionalität
 * 
 * Dieses Skript stellt die Funktionalität für das Admin-Dashboard bereit.
 * Es kann aus admin.html ausgelagert werden, um die Struktur zu verbessern.
 */

(function(){
    // DOM Selektoren
    const $ = sel => document.querySelector(sel);
    const $$ = sel => Array.from(document.querySelectorAll(sel));
    
    // UI Elemente
    const logList = $('#log-list');
    const themeStatus = $('#theme-status');
    const ua = $('#ua');
    const vp = $('#vp');
    const onl = $('#onl');
    const statPages = $('#stat-pages');
    const statImages = $('#stat-images');
    const statJs = $('#stat-js');
    const statCss = $('#stat-css');
    const mediaTbody = $('#media-tbody');
    const uploadPreview = $('#upload-preview');
    const uploadProgress = $('#upload-progress');
    const uploadFilename = $('#upload-filename');
    const dropZone = $('#drop-zone');
    const toastContainer = $('#toast-container');
    const searchInput = $('#search-input');
    const mainContent = $('#main-content');
    const sidebarToggle = $('#sidebar-toggle');
    const sidebar = $('#sidebar');
    const chartCtx = $('#system-chart');
    
    /**
     * System Informationen aktualisieren
     */
    function updateSystemInfo(){
        if(ua) ua.textContent = navigator.userAgent.split(') ')[0] + ')';
        if(vp) vp.textContent = window.innerWidth + 'x' + window.innerHeight;
        if(onl) onl.textContent = navigator.onLine ? 'Ja' : 'Nein';
    }

    /**
     * Aktuelles Theme anzeigen
     */
    function updateThemeStatus(){
        if (!themeStatus) return;
        themeStatus.textContent = document.documentElement.getAttribute('data-theme') || 'light';
    }

    /**
     * Log-Eintrag hinzufügen
     * @param {string} type - Log-Typ (info, warn, error, success)
     * @param {string} msg - Log-Nachricht
     */
    function addLog(type, msg){
        if (!logList) return;
        
        const li = document.createElement('li');
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = type.toUpperCase();
        
        // Badge Styling nach Typ
        if (type.toLowerCase() === 'error' || type.toLowerCase() === 'danger') {
            badge.classList.add('badge-danger');
        } else if (type.toLowerCase() === 'warn' || type.toLowerCase() === 'warning') {
            badge.classList.add('badge-warn');
        } else if (type.toLowerCase() === 'success') {
            badge.classList.add('badge-success');
        } else if (type.toLowerCase() === 'info') {
            badge.classList.add('badge-info');
        }
        
        li.appendChild(badge);
        li.append(' ' + msg);
        logList.prepend(li);
        
        // Max. 50 Einträge behalten
        while(logList.children.length > 50) logList.lastElementChild.remove();
    }

    /**
     * Logs löschen
     */
    function clearLogs(){
        if (!logList) return;
        logList.innerHTML = '';
        addLog('info','Logs geleert.');
        showToast('success', 'Logs geleert', 'Alle Log-Einträge wurden erfolgreich gelöscht.');
    }

    /**
     * Statistiken aktualisieren
     */
    function refreshStats(){
        // Grobe Heuristik Dateianzahl via vorhandene Links / imgs
        const pages = $$('a[href$=".html"]').length || document.querySelectorAll('link[rel=canonical]').length || '--';
        if (statPages) statPages.textContent = pages;
        if (statImages) statImages.textContent = document.querySelectorAll('img').length;
        if (statJs) statJs.textContent = document.querySelectorAll('script[src]')?.length || 0;
        if (statCss) statCss.textContent = document.querySelectorAll('link[rel="stylesheet"]').length;
        
        addLog('info','Statistiken aktualisiert.');
        showToast('info', 'Statistiken aktualisiert', 'Die Seiten-Statistiken wurden aktualisiert.');
        
        // Update Mini-Charts
        animateCharts();
    }

    /**
     * Konfiguration exportieren
     */
    function exportConfig(){
        const data = { 
            theme: document.documentElement.getAttribute('data-theme'), 
            time: new Date().toISOString(),
            viewportSize: window.innerWidth + 'x' + window.innerHeight,
            userAgent: navigator.userAgent,
            online: navigator.onLine,
            storageQuota: navigator.storage && navigator.storage.estimate ? 
                'Verfügbar' : 'Nicht verfügbar'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; 
        a.download = 'admin-config-export-' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a); 
        a.click(); 
        a.remove();
        URL.revokeObjectURL(url);
        
        addLog('info','Konfiguration exportiert.');
        showToast('success', 'Export erfolgreich', 'Die Konfiguration wurde erfolgreich exportiert.');
    }

    /**
     * Simulierten Fehler erzeugen
     */
    function simulateError(){
        try { 
            throw new Error('Dies ist ein simuliertes Problem.'); 
        } catch(e){ 
            addLog('error', e.message); 
            showToast('error', 'Fehler aufgetreten', e.message);
        }
    }

    /**
     * Cache-Leeren Hinweis
     */
    function clientCacheHint(){
        addLog('warn','Client Cache lässt sich hier nicht leeren – bitte DevTools nutzen.');
        alert('Hinweis: Das tatsächliche Leeren des Browser-Caches muss über die Browser-Einstellungen erfolgen.');
    }

    /**
     * Medien laden
     */
    function loadMedia(){
        if (!mediaTbody) return;
        
        // Demo: nimmt vorhandene img Elemente
        const imgs = Array.from(document.querySelectorAll('img[src]')).slice(0,25);
        if(!imgs.length){ 
            mediaTbody.innerHTML = '<tr><td colspan="4">Keine IMG Elemente gefunden.</td></tr>'; 
            return; 
        }
        
        mediaTbody.innerHTML = '';
        imgs.forEach(img => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${img.getAttribute('alt')||'-'}</td>
                <td>BILD</td>
                <td class="inline-code">${img.getAttribute('src')}</td>
                <td>
                    <div class="action-icons">
                        <i class="ri-eye-line" data-tooltip="Ansehen" data-action="view-media"></i>
                        <i class="ri-edit-line" data-tooltip="Bearbeiten" data-action="edit-media"></i>
                        <i class="ri-delete-bin-line text-danger" data-tooltip="Löschen" data-action="delete-media"></i>
                    </div>
                </td>
            `;
            mediaTbody.appendChild(tr);
        });
        
        addLog('info', 'Medienliste aktualisiert ('+imgs.length+').');
        showToast('info', 'Medien geladen', `${imgs.length} Medien-Elemente wurden geladen.`);
    }

    /**
     * Theme umschalten
     */
    function toggleTheme(){
        const html = document.documentElement;
        const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', next);
        try { 
            localStorage.setItem('theme', next); 
        } catch(e){}
        
        updateThemeStatus();
        addLog('info','Theme gewechselt zu '+next+'.');
        showToast('success', 'Theme geändert', `Das Theme wurde auf ${next} umgestellt.`);
    }

    /**
     * Upload Simulation
     */
    function simulateUpload() {
        if (!uploadPreview || !uploadProgress) return;
        
        uploadPreview.style.display = 'flex';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 1;
            if (progress >= 100) {
                clearInterval(interval);
                progress = 100;
                addLog('success', 'Datei erfolgreich hochgeladen: ' + (uploadFilename ? uploadFilename.textContent : 'Datei'));
                showToast('success', 'Upload abgeschlossen', `Die Datei ${uploadFilename ? uploadFilename.textContent : 'Datei'} wurde erfolgreich hochgeladen.`);
                setTimeout(() => {
                    uploadPreview.style.display = 'none';
                    uploadProgress.style.width = '0%';
                }, 1500);
            }
            uploadProgress.style.width = progress + '%';
        }, 200);
    }

    /**
     * Upload abbrechen
     */
    function cancelUpload() {
        if (!uploadPreview || !uploadProgress) return;
        
        uploadPreview.style.display = 'none';
        uploadProgress.style.width = '0%';
        addLog('warn', 'Upload abgebrochen: ' + (uploadFilename ? uploadFilename.textContent : 'Datei'));
        showToast('warn', 'Upload abgebrochen', 'Der Datei-Upload wurde abgebrochen.');
    }

    /**
     * Toast-Benachrichtigung anzeigen
     * @param {string} type - Toast-Typ (success, info, warn, error)
     * @param {string} title - Toast-Titel
     * @param {string} message - Toast-Nachricht
     * @param {number} duration - Anzeigedauer in ms
     */
    function showToast(type, title, message, duration = 5000) {
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const iconMap = {
            success: 'ri-check-line',
            info: 'ri-information-line',
            warn: 'ri-alert-line',
            error: 'ri-error-warning-line'
        };
        
        toast.innerHTML = `
            <div class="toast-icon"><i class="${iconMap[type] || 'ri-notification-line'}"></i></div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Benachrichtigung schließen"><i class="ri-close-line"></i></button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Close button Logik
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.add('hide');
            setTimeout(() => { toast.remove(); }, 300);
        });
        
        // Auto-entfernen nach duration
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('hide');
                setTimeout(() => { 
                    if (toast.parentNode) toast.remove(); 
                }, 300);
            }
        }, duration);
    }

    /**
     * Ripple-Effekt für Buttons
     * @param {Event} event - Click-Event
     */
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        ripple.classList.add('ripple');
        
        // Existierende Ripples entfernen
        const existingRipple = button.querySelector('.ripple');
        if (existingRipple) {
            existingRipple.remove();
        }
        
        button.appendChild(ripple);
        
        // Ripple nach Animation entfernen
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Sidebar umschalten (für mobile Ansicht)
     */
    function toggleSidebar() {
        if (!sidebar) return;
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
    }

    /**
     * Suchfunktion
     * @param {Event} event - Input-Event
     */
    function handleSearch(event) {
        if (!searchInput || !mainContent) return;
        
        const query = searchInput.value.toLowerCase();
        if (query.length < 2) return;
        
        // Demo: Highlighten von Elementen die den Suchbegriff enthalten
        const searchableElements = mainContent.querySelectorAll('h1, h2, h3, p, th, td, button');
        
        let matchCount = 0;
        searchableElements.forEach(el => {
            const text = el.textContent.toLowerCase();
            if (text.includes(query)) {
                el.classList.add('search-highlight');
                matchCount++;
            } else {
                el.classList.remove('search-highlight');
            }
        });
        
        if (matchCount > 0) {
            showToast('info', 'Suchergebnisse', `${matchCount} Übereinstimmungen für "${query}" gefunden.`);
        }
    }

    /**
     * Events binden
     */
    function bindActions(){
        // Button click actions
        document.addEventListener('click', e => {
            const btn = e.target.closest('[data-action]');
            if(!btn) return;
            
            // Add ripple effect
            if (btn.tagName === 'BUTTON') {
                createRipple(e);
            }
            
            const act = btn.getAttribute('data-action');
            switch(act){
                case 'refresh-stats': refreshStats(); break;
                case 'export-config': exportConfig(); break;
                case 'clear-cache': clientCacheHint(); break;
                case 'simulate-error': simulateError(); break;
                case 'add-log': addLog('info','Manueller Log-Eintrag.'); break;
                case 'clear-logs': clearLogs(); break;
                case 'toggle-theme': toggleTheme(); break;
                case 'toggle-sidebar': toggleSidebar(); break;
                case 'load-media': loadMedia(); break;
                case 'search': handleSearch(); break;
                case 'new-content': 
                    showToast('info', 'Aktion noch nicht implementiert', 'Diese Funktion wird in einer zukünftigen Version hinzugefügt.');
                    break;
                case 'upload-media':
                    if (uploadFilename) uploadFilename.textContent = 'beispiel-bild.jpg';
                    simulateUpload();
                    break;
                case 'cancel-upload': cancelUpload(); break;
                case 'drop-zone':
                    if (uploadFilename) uploadFilename.textContent = 'hochgeladene-datei.png';
                    simulateUpload();
                    break;
                case 'view-media':
                case 'edit-media':
                case 'delete-media':
                case 'edit-user':
                case 'reset-pwd':
                case 'delete-user':
                case 'add-user':
                    showToast('info', 'Aktion noch nicht implementiert', 'Diese Funktion wird in einer zukünftigen Version hinzugefügt.');
                    break;
            }
        });
        
        // Dropzone events
        if (dropZone) {
            ['dragover', 'dragenter'].forEach(eventName => {
                dropZone.addEventListener(eventName, e => {
                    e.preventDefault();
                    dropZone.classList.add('drag-active');
                }, false);
            });
            
            ['dragleave', 'dragend', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, e => {
                    e.preventDefault();
                    dropZone.classList.remove('drag-active');
                    
                    if (eventName === 'drop') {
                        const files = e.dataTransfer.files;
                        if (files.length) {
                            if (uploadFilename) uploadFilename.textContent = files[0].name;
                            simulateUpload();
                        }
                    }
                }, false);
            });
        }
        
        // Suchfeld
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
            searchInput.addEventListener('keydown', e => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    mainContent.querySelectorAll('.search-highlight').forEach(el => {
                        el.classList.remove('search-highlight');
                    });
                }
            });
        }
        
        // Live event listeners
        window.addEventListener('online', ()=>{ 
            addLog('info','Verbindung wieder online.'); 
            updateSystemInfo(); 
            showToast('success', 'Verbindung hergestellt', 'Die Internetverbindung wurde wiederhergestellt.');
        });
        
        window.addEventListener('offline', ()=>{ 
            addLog('warn','Verbindung offline.'); 
            updateSystemInfo(); 
            showToast('warn', 'Verbindung verloren', 'Die Internetverbindung wurde unterbrochen.');
        });
        
        window.addEventListener('resize', ()=>{ 
            if (vp) vp.textContent = window.innerWidth + 'x' + window.innerHeight; 
        });
    }

    /**
     * Diagramme animieren
     */
    function animateCharts() {
        const bars = document.querySelectorAll('.mini-chart-bar');
        bars.forEach(bar => {
            const randomHeight = Math.floor(Math.random() * 85) + 15 + '%';
            bar.style.height = randomHeight;
        });
        
        // CPU Last Graph
        if (chartCtx && window.Chart) {
            // Nur zur Demo: Chart.js verwenden wenn verfügbar
            try {
                const ctx = chartCtx.getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: Array(24).fill('').map((_, i) => `${i}:00`),
                        datasets: [{
                            label: 'CPU Auslastung',
                            data: Array(24).fill(0).map(() => Math.floor(Math.random() * 80) + 20),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 2,
                            fill: false
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100
                            }
                        }
                    }
                });
            } catch (e) {
                console.log('Chart.js nicht verfügbar');
            }
        }
        
        setTimeout(animateCharts, 2000);
    }

    /**
     * Admin Dashboard initialisieren
     */
    function initAdmin() {
        updateSystemInfo();
        updateThemeStatus();
        refreshStats();
        bindActions();
        animateCharts();
        addLog('info','Admin Dashboard initialisiert.');
        
        // Begrüßungs-Toast
        setTimeout(() => {
            showToast('success', 'Willkommen', 'Erfolgreich im Admin Dashboard angemeldet!');
        }, 1000);
    }

    // INIT Admin Dashboard
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAdmin);
    } else {
        initAdmin();
    }
})();
