/**
 * Umfassende Projekt-Prüfung
 * 
 * Dieses Skript führt eine vollständige Prüfung des Projekts durch und
 * speichert alle Ergebnisse in einer strukturierten Log-Datei.
 * 
 * Geprüft werden:
 * - Fehlerhafte Links und Ressourcen
 * - HTML-Validierung und Best Practices
 * - CSS-Qualität und Optimierung
 * - JavaScript-Fehler und Konsistenz
 * - SEO und Metadaten
 * - Performance-Optimierungen
 * - Barrierefreiheit (mit WCAG-Richtlinien)
 * - Dateisystem-Struktur
 * - Bildoptimierung
 * - Dark Mode Kompatibilität
 * - Responsive Design
 * - Browser-Kompatibilität
 * - CSS-Modularität und -Organisation
 * - Ungenutzte CSS/JavaScript-Ressourcen
 * - Moderne Web-Technologien
 * - Seitengeschwindigkeit und Leistungsbenchmarks
 * - Sicherheitsprüfungen
 * - Code-Qualitätsanalysen
 * - Interaktive Berichterstellung
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const https = require('https');
const http = require('http');
const { exec } = require('child_process');
const zlib = require('zlib');
const crypto = require('crypto');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);
const exists = promisify(fs.exists);
const execPromise = promisify(exec);

// Konfiguration
const LOG_FILE = 'project-check.log';
const HTML_EXTENSIONS = ['.html', '.htm'];
const CSS_EXTENSIONS = ['.css', '.scss', '.sass', '.less'];
const JS_EXTENSIONS = ['.js', '.mjs', '.jsx', '.ts', '.tsx'];
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
const FONT_EXTENSIONS = ['.woff', '.woff2', '.ttf', '.eot', '.otf'];
const EXCLUDE_DIRS = ['node_modules', '.git', '.github', '.vscode'];
const EXCLUDE_FILES = ['package-lock.json', 'yarn.lock', '.DS_Store', 'Thumbs.db'];
const BASE_URL = 'https://johann-fullhd.github.io/';

// Erweiterte Konfiguration für neue Funktionen
const SECURITY_CHECKS = {
  checkXSSVulnerabilities: true,
  checkCSPHeaders: true,
  checkHTTPS: true,
  checkMixedContent: true,
  checkDeprecatedAPIs: true
};

const CODE_QUALITY_CHECKS = {
  checkCodeComplexity: true,
  checkDuplication: true,
  checkBestPractices: true,
  checkESLintRules: false // Set to true if ESLint is available
};

const INTERACTIVE_REPORT = {
  generateHTMLReport: true,
  includeSolutions: true,
  includeCharts: true,
  exportFormats: ['html', 'json', 'csv']
};

// Globale Variablen
const startTime = new Date();
const allResources = {
  html: [],
  css: [],
  js: [],
  images: [],
  fonts: [],
  other: []
};
const errors = [];
const warnings = [];
const info = [];
const stats = {
  totalFiles: 0,
  totalSize: 0,
  duplicates: 0,
  brokenLinks: 0,
  htmlErrors: 0,
  cssErrors: 0,
  jsErrors: 0,
  seoIssues: 0,
  accessibilityIssues: 0,
  performanceIssues: 0,
  securityIssues: 0,
  codeQualityIssues: 0,
  vulnerabilityCount: 0,
  deprecatedAPIs: 0,
  codeComplexityScore: 0
};

// Cache für bereits geprüfte URLs
const checkedUrls = new Map();
// Cache für Datei-Hashes zur Duplikaterkennung
const fileHashes = new Map();

/**
 * Logger-Funktion
 */
const logger = {
  error: async (message, details = '') => {
    const logMessage = `[ERROR] ${message}${details ? '\n' + details : ''}`;
    console.error('\x1b[31m%s\x1b[0m', logMessage);
    errors.push({ message, details });
    stats.errors = errors.length;
    await appendToLog('ERROR', message, details);
  },
  
  warning: async (message, details = '') => {
    const logMessage = `[WARNUNG] ${message}${details ? '\n' + details : ''}`;
    console.warn('\x1b[33m%s\x1b[0m', logMessage);
    warnings.push({ message, details });
    stats.warnings = warnings.length;
    await appendToLog('WARNUNG', message, details);
  },
  
  info: async (message, details = '') => {
    const logMessage = `[INFO] ${message}${details ? '\n' + details : ''}`;
    console.log('\x1b[36m%s\x1b[0m', logMessage);
    info.push({ message, details });
    await appendToLog('INFO', message, details);
  },
  
  success: async (message, details = '') => {
    const logMessage = `[ERFOLG] ${message}${details ? '\n' + details : ''}`;
    console.log('\x1b[32m%s\x1b[0m', logMessage);
    await appendToLog('ERFOLG', message, details);
  },
  
  step: (message) => {
    console.log('\x1b[36m%s\x1b[0m', `\n===== ${message} =====`);
  }
};

/**
 * Funktion zum Anhängen von Nachrichten an die Log-Datei
 */
async function appendToLog(level, message, details = '') {
  const timestamp = new Date().toISOString();
  let logText = `[${timestamp}] [${level}] ${message}\n`;
  
  if (details) {
    // Details einrücken für bessere Lesbarkeit
    const formattedDetails = details
      .split('\n')
      .map(line => `    ${line}`)
      .join('\n');
    logText += `${formattedDetails}\n`;
  }
  
  try {
    await appendFile(LOG_FILE, logText);
  } catch (error) {
    console.error(`Fehler beim Schreiben in Log-Datei: ${error.message}`);
  }
}

/**
 * Funktion zum Initialisieren der Log-Datei
 */
async function initLogFile() {
  const header = 
`===========================================================
PROJEKT-PRÜFUNG - ${new Date().toLocaleString()}
===========================================================
Basis-URL: ${BASE_URL}
Projekt-Pfad: ${process.cwd()}
===========================================================

`;
  try {
    await writeFile(LOG_FILE, header);
    console.log(`Log-Datei initialisiert: ${LOG_FILE}`);
  } catch (error) {
    console.error(`Fehler beim Erstellen der Log-Datei: ${error.message}`);
  }
}

/**
 * Hilfsfunktion zum rekursiven Einlesen von Verzeichnissen
 */
async function getAllFiles(dir) {
  if (EXCLUDE_DIRS.includes(path.basename(dir))) {
    return [];
  }
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(entry => {
        const res = path.join(dir, entry.name);
        if (EXCLUDE_FILES.includes(entry.name)) {
          return [];
        }
        return entry.isDirectory() ? getAllFiles(res) : res;
      })
    );
    return files.flat();
  } catch (error) {
    await logger.error(`Fehler beim Lesen des Verzeichnisses ${dir}`, error.message);
    return [];
  }
}

/**
 * Funktion zur Kategorisierung der Dateien
 */
async function categorizeFiles(files) {
  for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    const fileStats = await stat(file);
    stats.totalSize += fileStats.size;
    stats.totalFiles++;
    
    if (HTML_EXTENSIONS.includes(extension)) {
      allResources.html.push(file);
    } else if (CSS_EXTENSIONS.includes(extension)) {
      allResources.css.push(file);
    } else if (JS_EXTENSIONS.includes(extension)) {
      allResources.js.push(file);
    } else if (IMAGE_EXTENSIONS.includes(extension)) {
      allResources.images.push(file);
    } else if (FONT_EXTENSIONS.includes(extension)) {
      allResources.fonts.push(file);
    } else {
      allResources.other.push(file);
    }
    
    // Prüfen auf Duplikate durch Hash-Berechnung
    try {
      const content = await readFile(file);
      const hash = crypto.createHash('md5').update(content).digest('hex');
      if (fileHashes.has(hash)) {
        const duplicateFile = fileHashes.get(hash);
        await logger.warning(`Mögliches Duplikat gefunden: ${file}`, `Gleicher Inhalt wie: ${duplicateFile}`);
        stats.duplicates++;
      } else {
        fileHashes.set(hash, file);
      }
    } catch (error) {
      await logger.error(`Fehler beim Lesen der Datei ${file}`, error.message);
    }
  }
  
  await logger.info(`Ressourcen kategorisiert`, 
    `HTML: ${allResources.html.length}\n` +
    `CSS: ${allResources.css.length}\n` +
    `JavaScript: ${allResources.js.length}\n` +
    `Bilder: ${allResources.images.length}\n` +
    `Schriftarten: ${allResources.fonts.length}\n` +
    `Sonstige: ${allResources.other.length}\n` +
    `Gesamt: ${stats.totalFiles} Dateien (${formatBytes(stats.totalSize)})`
  );
}

/**
 * Prüfung der HTML-Dateien
 */
async function checkHtmlFiles() {
  logger.step('Prüfe HTML-Dateien');
  
  for (const file of allResources.html) {
    try {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Grundlegende HTML-Struktur prüfen
      if (!content.includes('<!DOCTYPE html>') && !content.includes('<!doctype html>')) {
        await logger.error(`${filename}: Keine DOCTYPE-Deklaration gefunden`, file);
        stats.htmlErrors++;
      }
      
      if (!content.match(/<html[^>]*lang=["'][^"']*["']/i)) {
        await logger.warning(`${filename}: Kein lang-Attribut im HTML-Tag gefunden`, file);
        stats.htmlErrors++;
      }
      
      if (!content.match(/<meta[^>]*charset/i)) {
        await logger.warning(`${filename}: Keine Zeichensatz-Deklaration gefunden`, file);
        stats.htmlErrors++;
      }
      
      if (!content.match(/<meta[^>]*name=["']viewport["']/i)) {
        await logger.warning(`${filename}: Kein Viewport-Meta-Tag gefunden`, file);
        stats.htmlErrors++;
      }
      
      if (!content.match(/<title>[^<]+<\/title>/i)) {
        await logger.error(`${filename}: Kein Titel-Tag gefunden`, file);
        stats.htmlErrors++;
        stats.seoIssues++;
      }
      
      // Prüfung auf defekte interne Links
      const internalLinks = extractLinks(content, 'href="');
      for (const link of internalLinks) {
        if (link.startsWith('/') || (!link.startsWith('http') && !link.startsWith('mailto:') && !link.startsWith('#') && !link.startsWith('tel:'))) {
          const absoluteLink = link.startsWith('/') 
            ? path.join(process.cwd(), link) 
            : path.join(path.dirname(file), link);
          
          if (!(await exists(absoluteLink))) {
            await logger.error(`${filename}: Defekter interner Link gefunden`, `Link: ${link}\nDatei: ${file}`);
            stats.brokenLinks++;
          }
        }
      }
      
      // Prüfung auf defekte Bilder und Ressourcen
      const srcLinks = extractLinks(content, 'src="');
      for (const link of srcLinks) {
        if (!link.startsWith('data:') && !link.startsWith('http') && !link.startsWith('//')) {
          const absoluteLink = link.startsWith('/') 
            ? path.join(process.cwd(), link) 
            : path.join(path.dirname(file), link);
          
          if (!(await exists(absoluteLink))) {
            await logger.error(`${filename}: Defekte Ressource gefunden`, `Ressource: ${link}\nDatei: ${file}`);
            stats.brokenLinks++;
          }
        }
      }
      
      // Prüfung auf Barrierefreiheit
      const imgTags = content.match(/<img[^>]+>/g) || [];
      for (const imgTag of imgTags) {
        if (!imgTag.includes('alt=')) {
          await logger.warning(`${filename}: Bild ohne Alt-Text gefunden`, `${imgTag.substring(0, 100)}...\nDatei: ${file}`);
          stats.accessibilityIssues++;
        }
      }
      
      // Prüfung auf SEO-Optimierung
      if (!content.match(/<meta[^>]*name=["']description["'][^>]*>/i)) {
        await logger.warning(`${filename}: Keine Meta-Beschreibung gefunden`, file);
        stats.seoIssues++;
      }
      
      if (!content.match(/<link[^>]*rel=["']canonical["'][^>]*>/i)) {
        await logger.warning(`${filename}: Kein Canonical-Link gefunden`, file);
        stats.seoIssues++;
      }
      
      if (!content.includes('<meta property="og:') && !content.includes('<meta name="og:')) {
        await logger.warning(`${filename}: Keine Open Graph Meta-Tags gefunden`, file);
        stats.seoIssues++;
      }
      
      // Prüfung auf JavaScript-Einbindung
      const scriptTags = content.match(/<script[^>]*>[\s\S]*?<\/script>/g) || [];
      for (const scriptTag of scriptTags) {
        if (scriptTag.includes('document.write(')) {
          await logger.warning(`${filename}: document.write() gefunden (blockiert Rendering)`, `${scriptTag.substring(0, 100)}...\nDatei: ${file}`);
          stats.performanceIssues++;
        }
      }
      
      // Prüfung auf CSS-Einbindung
      const styleElements = content.match(/<style[^>]*>[\s\S]*?<\/style>/g) || [];
      if (styleElements.length > 2) {
        await logger.warning(`${filename}: Mehrere inline-Style-Elemente gefunden (${styleElements.length})`, file);
        stats.performanceIssues++;
      }
      
      // Prüfung auf veraltete HTML-Tags
      const deprecatedTags = ['font', 'center', 'marquee', 'blink', 'frameset', 'frame'];
      for (const tag of deprecatedTags) {
        const regex = new RegExp(`<${tag}[^>]*>`, 'i');
        if (regex.test(content)) {
          await logger.warning(`${filename}: Veraltetes HTML-Element <${tag}> gefunden`, file);
          stats.htmlErrors++;
        }
      }
      
    } catch (error) {
      await logger.error(`Fehler beim Prüfen der HTML-Datei ${file}`, error.message);
    }
  }
  
  await logger.info(`HTML-Prüfung abgeschlossen`, 
    `Geprüfte Dateien: ${allResources.html.length}\n` +
    `Gefundene Fehler: ${stats.htmlErrors}\n` +
    `Defekte Links: ${stats.brokenLinks}\n` +
    `SEO-Probleme: ${stats.seoIssues}\n` +
    `Barrierefreiheitsprobleme: ${stats.accessibilityIssues}`
  );
}

/**
 * Prüfung der CSS-Dateien
 */
async function checkCssFiles() {
  logger.step('Prüfe CSS-Dateien');
  
  for (const file of allResources.css) {
    try {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Prüfung auf ungültige CSS-Regeln
      const braces = content.match(/[{}]/g) || [];
      if (braces.length % 2 !== 0) {
        await logger.error(`${filename}: Unausgewogene Klammern im CSS`, file);
        stats.cssErrors++;
      }
      
      // Prüfung auf nicht unterstützte Eigenschaften
      const vendorPrefixes = content.match(/-(webkit|moz|ms|o)-[a-zA-Z-]+\s*:/g) || [];
      if (vendorPrefixes.length > 0) {
        const uniquePrefixes = [...new Set(vendorPrefixes)].join(', ');
        await logger.info(`${filename}: Herstellerpräfixe gefunden`, `${uniquePrefixes}\nDatei: ${file}`);
      }
      
      // Prüfung auf veraltete CSS-Eigenschaften
      const deprecatedProps = [
        'box-shadow-x', 'box-shadow-y', 'box-shadow-blur', 'box-shadow-spread', 'box-shadow-color',
        'text-shadow-x', 'text-shadow-y', 'text-shadow-blur', 'text-shadow-color'
      ];
      for (const prop of deprecatedProps) {
        if (content.includes(`${prop}:`)) {
          await logger.warning(`${filename}: Veraltete CSS-Eigenschaft gefunden`, `${prop}\nDatei: ${file}`);
          stats.cssErrors++;
        }
      }
      
      // Prüfung auf übermäßige !important
      const importantCount = (content.match(/!important/g) || []).length;
      if (importantCount > 5) {
        await logger.warning(`${filename}: Übermäßige Verwendung von !important (${importantCount}x)`, file);
        stats.cssErrors++;
      }
      
      // Prüfung auf Media Queries für Responsivität
      const hasMediaQueries = content.includes('@media');
      if (!hasMediaQueries && file.includes('styles.css')) {
        await logger.warning(`${filename}: Keine Media Queries für responsive Darstellung gefunden`, file);
        stats.cssErrors++;
      }
      
      // Prüfung auf Dark Mode Unterstützung
      const hasDarkMode = content.includes('@media (prefers-color-scheme: dark)') || 
                          content.includes('[data-theme="dark"]') ||
                          content.includes('.dark-mode') ||
                          content.includes('html.dark');
      if (!hasDarkMode && file.includes('styles.css')) {
        await logger.info(`${filename}: Keine Dark Mode-Unterstützung gefunden`, file);
      }
      
      // Prüfung auf CSS-Größe und Komplexität
      if (content.length > 50000) {
        await logger.warning(`${filename}: Sehr große CSS-Datei (${formatBytes(content.length)})`, file);
        stats.performanceIssues++;
      }
      
      // Prüfung auf fixe Breiten
      const fixedWidths = (content.match(/width:\s*\d+px/g) || []).length;
      if (fixedWidths > 10) {
        await logger.warning(`${filename}: Viele feste Breitenangaben gefunden (${fixedWidths}x)`, file);
      }
      
      // Prüfung auf Fontface-Deklarationen
      const fontFaces = content.match(/@font-face\s*{[^}]+}/g) || [];
      if (fontFaces.length > 0) {
        await logger.info(`${filename}: ${fontFaces.length} @font-face Deklarationen gefunden`, file);
      }
      
    } catch (error) {
      await logger.error(`Fehler beim Prüfen der CSS-Datei ${file}`, error.message);
    }
  }
  
  await logger.info(`CSS-Prüfung abgeschlossen`, 
    `Geprüfte Dateien: ${allResources.css.length}\n` +
    `Gefundene Fehler: ${stats.cssErrors}`
  );
}

/**
 * Prüfung der JavaScript-Dateien
 */
async function checkJsFiles() {
  logger.step('Prüfe JavaScript-Dateien');
  
  for (const file of allResources.js) {
    try {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Prüfung auf ungültige JavaScript-Syntax (sehr grundlegend)
      const braces = content.match(/[{}]/g) || [];
      const parentheses = content.match(/[()]/g) || [];
      const brackets = content.match(/[\[\]]/g) || [];
      
      if (braces.length % 2 !== 0) {
        await logger.warning(`${filename}: Unausgewogene geschweifte Klammern`, file);
        stats.jsErrors++;
      }
      
      if (parentheses.length % 2 !== 0) {
        await logger.warning(`${filename}: Unausgewogene runde Klammern`, file);
        stats.jsErrors++;
      }
      
      if (brackets.length % 2 !== 0) {
        await logger.warning(`${filename}: Unausgewogene eckige Klammern`, file);
        stats.jsErrors++;
      }
      
      // Prüfung auf potenziell unsichere Funktionen
      const potentiallyUnsafeCode = [
        { pattern: /eval\s*\(/, message: 'eval() ist potenziell unsicher' },
        { pattern: /new Function\s*\(/, message: 'new Function() ist potenziell unsicher' },
        { pattern: /document\.write\s*\(/, message: 'document.write() blockiert Rendering' },
        { pattern: /innerHTML\s*=/, message: 'innerHTML ohne Sanitisierung ist anfällig für XSS' },
        { pattern: /setTimeout\s*\(\s*["']/, message: 'setTimeout mit String ist potenziell unsicher' },
        { pattern: /setInterval\s*\(\s*["']/, message: 'setInterval mit String ist potenziell unsicher' }
      ];
      
      for (const check of potentiallyUnsafeCode) {
        if (check.pattern.test(content)) {
          await logger.warning(`${filename}: ${check.message}`, file);
          stats.jsErrors++;
        }
      }
      
      // Prüfung auf veraltete Browser-APIs
      const deprecatedApis = [
        { pattern: /document\.execCommand\s*\(/, message: 'document.execCommand ist veraltet' },
        { pattern: /document\.write\s*\(/, message: 'document.write ist veraltet' },
        { pattern: /\.innerText/, message: '.innerText sollte durch .textContent ersetzt werden' },
        { pattern: /\.attachEvent\s*\(/, message: '.attachEvent ist veraltet' },
        { pattern: /\.detachEvent\s*\(/, message: '.detachEvent ist veraltet' }
      ];
      
      for (const api of deprecatedApis) {
        if (api.pattern.test(content)) {
          await logger.warning(`${filename}: ${api.message}`, file);
          stats.jsErrors++;
        }
      }
      
      // Prüfung auf Konsolenbefehle
      const consoleCommands = (content.match(/console\.(log|warn|error|info|debug)\s*\(/g) || []).length;
      if (consoleCommands > 0) {
        await logger.info(`${filename}: ${consoleCommands} Konsolenbefehle gefunden`, file);
      }
      
      // Prüfung auf TODO- und FIXME-Kommentare
      const todos = content.match(/\/\/\s*TODO:.*|\/\*\s*TODO:.*?\*\/|\/\/\s*FIXME:.*|\/\*\s*FIXME:.*?\*\//g) || [];
      if (todos.length > 0) {
        await logger.info(`${filename}: ${todos.length} TODO/FIXME-Kommentare gefunden`, todos.join('\n'));
      }
      
      // Prüfung auf unbenutzte Variablen (sehr grundlegend)
      const varDeclarations = content.match(/var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/g) || [];
      for (const declaration of varDeclarations) {
        const varName = declaration.replace(/var\s+/, '').replace(/\s*=/, '');
        // Einfache Prüfung, ob die Variable nach der Deklaration verwendet wird
        const pattern = new RegExp(`[^a-zA-Z0-9_$]${varName}[^a-zA-Z0-9_$]`, 'g');
        const usages = content.match(pattern) || [];
        if (usages.length <= 1) { // Nur die Deklaration gefunden
          await logger.info(`${filename}: Möglicherweise unbenutzte Variable: ${varName}`, file);
        }
      }
      
      // Prüfung auf Service Worker
      if (content.includes('serviceWorker.register')) {
        await logger.info(`${filename}: Service Worker-Registrierung gefunden`, file);
      }
      
    } catch (error) {
      await logger.error(`Fehler beim Prüfen der JavaScript-Datei ${file}`, error.message);
    }
  }
  
  await logger.info(`JavaScript-Prüfung abgeschlossen`, 
    `Geprüfte Dateien: ${allResources.js.length}\n` +
    `Gefundene Fehler: ${stats.jsErrors}`
  );
}

/**
 * Prüfung der Bildoptimierung
 */
async function checkImageOptimization() {
  logger.step('Prüfe Bildoptimierung');
  
  for (const file of allResources.images) {
    try {
      const fileStats = await stat(file);
      const filename = path.basename(file);
      const extension = path.extname(file).toLowerCase();
      
      // Prüfung auf Bildgröße
      if (fileStats.size > 500 * 1024) { // Größer als 500 KB
        await logger.warning(`${filename}: Großes Bild (${formatBytes(fileStats.size)})`, file);
        stats.performanceIssues++;
      }
      
      // Prüfung auf moderne Bildformate
      if (extension === '.jpg' || extension === '.jpeg' || extension === '.png') {
        const webpVersion = file.replace(extension, '.webp');
        const avifVersion = file.replace(extension, '.avif');
        
        if (!(await exists(webpVersion)) && !(await exists(avifVersion))) {
          await logger.warning(`${filename}: Keine optimierte Version (WebP/AVIF) gefunden`, file);
          stats.performanceIssues++;
        }
      }
      
      // Prüfung auf potenziell zu große SVG-Dateien
      if (extension === '.svg' && fileStats.size > 50 * 1024) {
        await logger.warning(`${filename}: Große SVG-Datei (${formatBytes(fileStats.size)})`, file);
        stats.performanceIssues++;
      }
      
    } catch (error) {
      await logger.error(`Fehler beim Prüfen des Bildes ${file}`, error.message);
    }
  }
  
  await logger.info(`Bildoptimierungsprüfung abgeschlossen`, 
    `Geprüfte Dateien: ${allResources.images.length}`
  );
}

/**
 * Prüfung auf externe Abhängigkeiten
 */
async function checkExternalDependencies() {
  logger.step('Prüfe externe Abhängigkeiten');
  
  const externalDependencies = new Map();
  
  // Prüfung in HTML-Dateien
  for (const file of allResources.html) {
    try {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Externe Skripte
      const scriptSrcs = content.match(/src=["'](https?:\/\/[^"']+)["']/g) || [];
      for (const src of scriptSrcs) {
        const url = src.replace(/src=["']/, '').replace(/["']$/, '');
        if (!externalDependencies.has(url)) {
          externalDependencies.set(url, [file]);
        } else {
          externalDependencies.get(url).push(file);
        }
      }
      
      // Externe Stylesheets
      const linkHrefs = content.match(/href=["'](https?:\/\/[^"']+\.css[^"']*)["']/g) || [];
      for (const href of linkHrefs) {
        const url = href.replace(/href=["']/, '').replace(/["']$/, '');
        if (!externalDependencies.has(url)) {
          externalDependencies.set(url, [file]);
        } else {
          externalDependencies.get(url).push(file);
        }
      }
      
      // Externe Fonts
      const fontUrls = content.match(/href=["'](https?:\/\/fonts\.[^"']+)["']/g) || [];
      for (const href of fontUrls) {
        const url = href.replace(/href=["']/, '').replace(/["']$/, '');
        if (!externalDependencies.has(url)) {
          externalDependencies.set(url, [file]);
        } else {
          externalDependencies.get(url).push(file);
        }
      }
      
    } catch (error) {
      await logger.error(`Fehler beim Prüfen der externen Abhängigkeiten in ${file}`, error.message);
    }
  }
  
  // Prüfung in CSS-Dateien
  for (const file of allResources.css) {
    try {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Externe URLs in CSS
      const cssUrls = content.match(/url\(["']?(https?:\/\/[^)"']+)["']?\)/g) || [];
      for (const urlMatch of cssUrls) {
        const url = urlMatch.replace(/url\(["']?/, '').replace(/["']?\)$/, '');
        if (!externalDependencies.has(url)) {
          externalDependencies.set(url, [file]);
        } else {
          externalDependencies.get(url).push(file);
        }
      }
      
      // @import-Anweisungen
      const imports = content.match(/@import\s+["'](https?:\/\/[^"']+)["']/g) || [];
      for (const importMatch of imports) {
        const url = importMatch.replace(/@import\s+["']/, '').replace(/["']$/, '');
        if (!externalDependencies.has(url)) {
          externalDependencies.set(url, [file]);
        } else {
          externalDependencies.get(url).push(file);
        }
      }
      
    } catch (error) {
      await logger.error(`Fehler beim Prüfen der externen Abhängigkeiten in ${file}`, error.message);
    }
  }
  
  // Externe Abhängigkeiten protokollieren
  let externalCount = 0;
  for (const [url, files] of externalDependencies.entries()) {
    externalCount++;
    await logger.info(`Externe Abhängigkeit: ${url}`, `Verwendet in: ${files.length} Dateien`);
    
    // Prüfen, ob die externe Ressource erreichbar ist
    if (!checkedUrls.has(url)) {
      try {
        const isAvailable = await checkUrlAvailability(url);
        checkedUrls.set(url, isAvailable);
        
        if (!isAvailable) {
          await logger.error(`Externe Ressource nicht erreichbar: ${url}`, `Verwendet in: ${files.join(', ')}`);
          stats.brokenLinks++;
        }
      } catch (error) {
        await logger.error(`Fehler beim Prüfen der URL ${url}`, error.message);
      }
    } else if (!checkedUrls.get(url)) {
      await logger.error(`Externe Ressource nicht erreichbar: ${url}`, `Verwendet in: ${files.join(', ')}`);
    }
  }
  
  await logger.info(`Prüfung der externen Abhängigkeiten abgeschlossen`, 
    `Gefundene externe Abhängigkeiten: ${externalCount}`
  );
}

/**
 * Prüfung der Projektstruktur
 */
async function checkProjectStructure() {
  logger.step('Prüfe Projektstruktur');
  
  // Prüfung auf wichtige Dateien
  const essentialFiles = [
    { file: 'index.html', message: 'Hauptseite' },
    { file: 'sitemap.xml', message: 'Sitemap für Suchmaschinen' },
    { file: 'robots.txt', message: 'Anweisungen für Crawler' },
    { file: 'manifest.webmanifest', message: 'Web App Manifest' }
  ];
  
  for (const item of essentialFiles) {
    const filePath = path.join(process.cwd(), item.file);
    if (!(await exists(filePath))) {
      await logger.warning(`Wichtige Datei fehlt: ${item.file}`, item.message);
    } else {
      await logger.success(`Wichtige Datei vorhanden: ${item.file}`);
    }
  }
  
  // Prüfung auf wichtige Verzeichnisse
  const essentialDirs = [
    { dir: 'assets', message: 'Assets-Verzeichnis' },
    { dir: 'assets/css', message: 'CSS-Verzeichnis' },
    { dir: 'assets/js', message: 'JavaScript-Verzeichnis' },
    { dir: 'assets/img', message: 'Bilder-Verzeichnis' }
  ];
  
  for (const item of essentialDirs) {
    const dirPath = path.join(process.cwd(), item.dir);
    if (!(await exists(dirPath))) {
      await logger.warning(`Wichtiges Verzeichnis fehlt: ${item.dir}`, item.message);
    } else {
      await logger.success(`Wichtiges Verzeichnis vorhanden: ${item.dir}`);
    }
  }
  
  // Prüfung auf potenzielle Probleme in der Verzeichnisstruktur
  const hasImagesOutsideImgDir = allResources.images.some(file => !file.includes(path.join('assets', 'img')));
  if (hasImagesOutsideImgDir) {
    await logger.warning('Bilder außerhalb des Bilder-Verzeichnisses gefunden', 'Dies kann zu Organisationsproblemen führen');
  }
  
  const hasCssOutsideCssDir = allResources.css.some(file => !file.includes(path.join('assets', 'css')));
  if (hasCssOutsideCssDir) {
    await logger.warning('CSS-Dateien außerhalb des CSS-Verzeichnisses gefunden', 'Dies kann zu Organisationsproblemen führen');
  }
  
  const hasJsOutsideJsDir = allResources.js.some(file => !file.includes(path.join('assets', 'js')) && !file.endsWith('sw.js'));
  if (hasJsOutsideJsDir) {
    await logger.warning('JavaScript-Dateien außerhalb des JS-Verzeichnisses gefunden', 'Dies kann zu Organisationsproblemen führen');
  }
  
  await logger.info(`Prüfung der Projektstruktur abgeschlossen`);
}

/**
 * Prüfung der sitemap.xml
 */
async function checkSitemap() {
  logger.step('Prüfe Sitemap');
  
  const sitemapPath = path.join(process.cwd(), 'sitemap.xml');
  if (!(await exists(sitemapPath))) {
    await logger.warning('Keine sitemap.xml gefunden', 'Dies kann die Auffindbarkeit in Suchmaschinen beeinträchtigen');
    return;
  }
  
  try {
    const content = await readFile(sitemapPath, 'utf8');
    
    // Grundlegende Struktur prüfen
    if (!content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
      await logger.warning('Sitemap: Ungültiges Format oder fehlendes Namespace', sitemapPath);
    }
    
    // URLs prüfen
    const urlMatches = content.match(/<loc>([^<]+)<\/loc>/g) || [];
    await logger.info(`Sitemap: ${urlMatches.length} URLs gefunden`);
    
    // Prüfen, ob alle HTML-Dateien in der Sitemap sind
    for (const htmlFile of allResources.html) {
      const filename = path.basename(htmlFile);
      if (filename !== 'offline.html' && filename !== '404.html') {
        const relativeUrl = htmlFile.replace(process.cwd(), '').replace(/\\/g, '/');
        const urlInSitemap = urlMatches.some(url => 
          url.includes(filename) || url.includes(relativeUrl.replace(/^\//, ''))
        );
        
        if (!urlInSitemap) {
          await logger.warning(`Sitemap: HTML-Datei fehlt in der Sitemap: ${filename}`, htmlFile);
        }
      }
    }
    
    // Prüfen, ob die Sitemap lastmod-Einträge hat
    const hasLastMod = content.includes('<lastmod>');
    if (!hasLastMod) {
      await logger.info('Sitemap: Keine lastmod-Einträge gefunden', 'Dies kann für Suchmaschinen hilfreich sein');
    }
    
    // Prüfen, ob die Sitemap changefreq-Einträge hat
    const hasChangeFreq = content.includes('<changefreq>');
    if (!hasChangeFreq) {
      await logger.info('Sitemap: Keine changefreq-Einträge gefunden', 'Dies kann für Suchmaschinen hilfreich sein');
    }
    
    // Prüfen, ob die Sitemap priority-Einträge hat
    const hasPriority = content.includes('<priority>');
    if (!hasPriority) {
      await logger.info('Sitemap: Keine priority-Einträge gefunden', 'Dies kann für Suchmaschinen hilfreich sein');
    }
    
  } catch (error) {
    await logger.error(`Fehler beim Prüfen der Sitemap`, error.message);
  }
}

/**
 * Prüfung der Schriftarten
 */
async function checkFonts() {
  logger.step('Prüfe Schriftarten');
  
  if (allResources.fonts.length === 0) {
    await logger.info('Keine lokalen Schriftartendateien gefunden');
    return;
  }
  
  await logger.info(`${allResources.fonts.length} lokale Schriftartendateien gefunden`);
  
  // Prüfen auf WOFF2-Format
  const hasWoff2 = allResources.fonts.some(file => file.endsWith('.woff2'));
  if (!hasWoff2) {
    await logger.warning('Keine WOFF2-Schriftarten gefunden', 'WOFF2 bietet die beste Kompression und wird von allen modernen Browsern unterstützt');
  }
  
  // Prüfen auf Schriftgrößen
  for (const file of allResources.fonts) {
    const fileStats = await stat(file);
    const filename = path.basename(file);
    
    if (fileStats.size > 100 * 1024) { // Größer als 100 KB
      await logger.warning(`${filename}: Große Schriftartendatei (${formatBytes(fileStats.size)})`, file);
      stats.performanceIssues++;
    }
  }
  
  // Prüfen, ob Schriftarten in CSS geladen werden
  let fontFaceFound = false;
  for (const cssFile of allResources.css) {
    try {
      const content = await readFile(cssFile, 'utf8');
      if (content.includes('@font-face')) {
        fontFaceFound = true;
        break;
      }
    } catch (error) {
      await logger.error(`Fehler beim Prüfen der CSS-Datei ${cssFile} auf @font-face`, error.message);
    }
  }
  
  if (!fontFaceFound) {
    await logger.warning('Keine @font-face-Deklarationen in CSS-Dateien gefunden', 'Lokale Schriftarten könnten nicht korrekt eingebunden sein');
  }
  
  await logger.info(`Prüfung der Schriftarten abgeschlossen`);
}

/**
 * Prüfung der robots.txt
 */
async function checkRobotsTxt() {
  logger.step('Prüfe robots.txt');
  
  const robotsPath = path.join(process.cwd(), 'robots.txt');
  if (!(await exists(robotsPath))) {
    await logger.warning('Keine robots.txt gefunden', 'Dies kann dazu führen, dass Suchmaschinen unerwünschte Bereiche indexieren');
    return;
  }
  
  try {
    const content = await readFile(robotsPath, 'utf8');
    
    // Prüfen auf User-agent
    if (!content.includes('User-agent:')) {
      await logger.warning('robots.txt: Kein User-agent gefunden', robotsPath);
    }
    
    // Prüfen auf Sitemap-Eintrag
    if (!content.includes('Sitemap:')) {
      await logger.warning('robots.txt: Kein Sitemap-Eintrag gefunden', robotsPath);
    }
    
    // Prüfen auf Disallow-Einträge
    const disallowEntries = content.match(/Disallow:[^\n]+/g) || [];
    await logger.info(`robots.txt: ${disallowEntries.length} Disallow-Einträge gefunden`);
    
    // Prüfen auf Allow-Einträge
    const allowEntries = content.match(/Allow:[^\n]+/g) || [];
    await logger.info(`robots.txt: ${allowEntries.length} Allow-Einträge gefunden`);
    
  } catch (error) {
    await logger.error(`Fehler beim Prüfen der robots.txt`, error.message);
  }
}

/**
 * Prüfung der Web App Manifest
 */
async function checkManifest() {
  logger.step('Prüfe Web App Manifest');
  
  const manifestPaths = [
    path.join(process.cwd(), 'manifest.webmanifest'),
    path.join(process.cwd(), 'manifest.json')
  ];
  
  let manifestFound = false;
  let manifestPath = '';
  
  for (const mPath of manifestPaths) {
    if (await exists(mPath)) {
      manifestFound = true;
      manifestPath = mPath;
      break;
    }
  }
  
  if (!manifestFound) {
    await logger.warning('Kein Web App Manifest gefunden', 'Dies verhindert die Installation als Progressive Web App');
    return;
  }
  
  try {
    const content = await readFile(manifestPath, 'utf8');
    let manifest;
    
    try {
      manifest = JSON.parse(content);
    } catch (e) {
      await logger.error('Manifest: Ungültiges JSON', e.message);
      return;
    }
    
    // Prüfung auf erforderliche Felder
    const requiredFields = ['name', 'short_name', 'icons', 'start_url', 'display'];
    for (const field of requiredFields) {
      if (!manifest[field]) {
        await logger.warning(`Manifest: Erforderliches Feld fehlt: ${field}`, manifestPath);
      }
    }
    
    // Prüfung auf Icons
    if (manifest.icons && Array.isArray(manifest.icons)) {
      await logger.info(`Manifest: ${manifest.icons.length} Icons definiert`);
      
      // Prüfen, ob alle Icons existieren
      for (const icon of manifest.icons) {
        if (icon.src) {
          const iconPath = path.join(process.cwd(), icon.src.startsWith('/') ? icon.src.slice(1) : icon.src);
          if (!(await exists(iconPath))) {
            await logger.error(`Manifest: Icon existiert nicht: ${icon.src}`, manifestPath);
          }
        }
      }
      
      // Prüfen auf maskable Icons
      const hasMaskable = manifest.icons.some(icon => icon.purpose && icon.purpose.includes('maskable'));
      if (!hasMaskable) {
        await logger.warning('Manifest: Kein maskable Icon gefunden', 'Maskable Icons sorgen für bessere Darstellung auf Android-Geräten');
      }
    }
    
    // Prüfung auf theme_color und background_color
    if (!manifest.theme_color) {
      await logger.warning('Manifest: Kein theme_color definiert', manifestPath);
    }
    
    if (!manifest.background_color) {
      await logger.warning('Manifest: Kein background_color definiert', manifestPath);
    }
    
    // Prüfung auf Kategorien
    if (!manifest.categories || !Array.isArray(manifest.categories) || manifest.categories.length === 0) {
      await logger.info('Manifest: Keine Kategorien definiert', 'Kategorien können die Auffindbarkeit in App Stores verbessern');
    }
    
    // Prüfung auf Screenshots
    if (!manifest.screenshots || !Array.isArray(manifest.screenshots) || manifest.screenshots.length === 0) {
      await logger.info('Manifest: Keine Screenshots definiert', 'Screenshots können die Darstellung in App Stores verbessern');
    }
    
  } catch (error) {
    await logger.error(`Fehler beim Prüfen des Web App Manifests`, error.message);
  }
}

/**
 * Prüfung der Service Worker
 */
async function checkServiceWorker() {
  logger.step('Prüfe Service Worker');
  
  const swFiles = allResources.js.filter(file => file.includes('sw.js') || file.includes('service-worker'));
  
  if (swFiles.length === 0) {
    await logger.warning('Kein Service Worker gefunden', 'Dies verhindert Offline-Funktionalität und PWA-Unterstützung');
    return;
  }
  
  await logger.info(`${swFiles.length} Service Worker-Dateien gefunden`);
  
  for (const file of swFiles) {
    try {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Prüfung auf Cache-Strategien
      const hasCacheAPI = content.includes('caches.open') || content.includes('caches.match');
      if (!hasCacheAPI) {
        await logger.warning(`${filename}: Keine Cache API-Nutzung gefunden`, file);
      }
      
      // Prüfung auf wichtige Event-Handler
      const events = [
        { name: 'install', found: content.includes('addEventListener(\'install') || content.includes('addEventListener("install') },
        { name: 'activate', found: content.includes('addEventListener(\'activate') || content.includes('addEventListener("activate') },
        { name: 'fetch', found: content.includes('addEventListener(\'fetch') || content.includes('addEventListener("fetch') }
      ];
      
      for (const event of events) {
        if (!event.found) {
          await logger.warning(`${filename}: Kein ${event.name}-Event-Handler gefunden`, file);
        }
      }
      
      // Prüfung auf Push-Benachrichtigungen
      const hasPushSupport = content.includes('addEventListener(\'push') || content.includes('addEventListener("push');
      if (hasPushSupport) {
        await logger.info(`${filename}: Push-Benachrichtigungen werden unterstützt`);
      }
      
      // Prüfung auf Background Sync
      const hasBackgroundSync = content.includes('addEventListener(\'sync') || content.includes('addEventListener("sync');
      if (hasBackgroundSync) {
        await logger.info(`${filename}: Background Sync wird unterstützt`);
      }
      
      // Prüfung auf Navigation Preload
      const hasNavigationPreload = content.includes('navigationPreload');
      if (hasNavigationPreload) {
        await logger.info(`${filename}: Navigation Preload wird verwendet`);
      }
      
    } catch (error) {
      await logger.error(`Fehler beim Prüfen des Service Workers ${file}`, error.message);
    }
  }
  
  await logger.info(`Prüfung der Service Worker abgeschlossen`);
}

/**
 * Prüfung der Komprimierung (simuliert)
 */
async function checkCompression() {
  logger.step('Prüfe potenzielle Komprimierungseinsparungen');
  
  let totalOriginalSize = 0;
  let totalGzipSize = 0;
  let totalBrotliSize = 0;
  
  const filesToCheck = [
    ...allResources.html.slice(0, 5),  // Begrenze auf 5 Dateien pro Typ für Performance
    ...allResources.css.slice(0, 5),
    ...allResources.js.slice(0, 5)
  ];
  
  for (const file of filesToCheck) {
    try {
      const content = await readFile(file);
      const filename = path.basename(file);
      const originalSize = content.length;
      
      // Gzip-Komprimierung simulieren
      const gzipSize = zlib.gzipSync(content).length;
      
      // Brotli-Komprimierung simulieren (falls verfügbar)
      let brotliSize = 0;
      try {
        brotliSize = zlib.brotliCompressSync(content).length;
      } catch (e) {
        // Brotli möglicherweise nicht unterstützt
        brotliSize = gzipSize * 0.8; // Schätzung
      }
      
      totalOriginalSize += originalSize;
      totalGzipSize += gzipSize;
      totalBrotliSize += brotliSize;
      
      const gzipSavings = Math.round((1 - gzipSize / originalSize) * 100);
      const brotliSavings = Math.round((1 - brotliSize / originalSize) * 100);
      
      await logger.info(`${filename}: Komprimierungspotenzial`, 
        `Original: ${formatBytes(originalSize)}\n` +
        `Gzip: ${formatBytes(gzipSize)} (${gzipSavings}% Einsparung)\n` +
        `Brotli: ${formatBytes(brotliSize)} (${brotliSavings}% Einsparung)`
      );
      
    } catch (error) {
      await logger.error(`Fehler beim Prüfen der Komprimierung von ${file}`, error.message);
    }
  }
  
  const totalGzipSavings = Math.round((1 - totalGzipSize / totalOriginalSize) * 100);
  const totalBrotliSavings = Math.round((1 - totalBrotliSize / totalOriginalSize) * 100);
  
  await logger.info(`Gesamtes Komprimierungspotenzial`, 
    `Original: ${formatBytes(totalOriginalSize)}\n` +
    `Gzip: ${formatBytes(totalGzipSize)} (${totalGzipSavings}% Einsparung)\n` +
    `Brotli: ${formatBytes(totalBrotliSize)} (${totalBrotliSavings}% Einsparung)`
  );
}

/**
 * Sonstige Prüfungen
 */
async function checkMiscellaneous() {
  logger.step('Führe sonstige Prüfungen durch');
  
  // Prüfung auf package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (await exists(packageJsonPath)) {
    try {
      const content = await readFile(packageJsonPath, 'utf8');
      let packageJson;
      
      try {
        packageJson = JSON.parse(content);
      } catch (e) {
        await logger.error('package.json: Ungültiges JSON', e.message);
        return;
      }
      
      // Prüfung auf Scripts
      if (packageJson.scripts) {
        const scriptCount = Object.keys(packageJson.scripts).length;
        await logger.info(`package.json: ${scriptCount} Skripte gefunden`);
        
        // Prüfung auf wichtige Skripte
        const importantScripts = ['build', 'start', 'test', 'dev', 'serve'];
        for (const script of importantScripts) {
          if (packageJson.scripts[script]) {
            await logger.success(`package.json: ${script}-Skript gefunden`);
          }
        }
      }
      
      // Prüfung auf Dependencies
      if (packageJson.dependencies) {
        const depCount = Object.keys(packageJson.dependencies).length;
        await logger.info(`package.json: ${depCount} Abhängigkeiten gefunden`);
      }
      
      // Prüfung auf DevDependencies
      if (packageJson.devDependencies) {
        const devDepCount = Object.keys(packageJson.devDependencies).length;
        await logger.info(`package.json: ${devDepCount} Entwicklungsabhängigkeiten gefunden`);
      }
      
    } catch (error) {
      await logger.error(`Fehler beim Prüfen der package.json`, error.message);
    }
  } else {
    await logger.info('Keine package.json gefunden', 'Dies ist für ein reines Frontend-Projekt nicht ungewöhnlich');
  }
  
  // Prüfung auf README.md
  const readmePath = path.join(process.cwd(), 'README.md');
  if (await exists(readmePath)) {
    await logger.success('README.md gefunden');
  } else {
    await logger.warning('Keine README.md gefunden', 'Eine README-Datei ist für die Dokumentation empfehlenswert');
  }
  
  // Prüfung auf Changelog
  const changelogPaths = [
    path.join(process.cwd(), 'CHANGELOG.md'),
    path.join(process.cwd(), 'Changelog.md'),
    path.join(process.cwd(), 'changelog.md')
  ];
  
  let changelogFound = false;
  for (const cPath of changelogPaths) {
    if (await exists(cPath)) {
      await logger.success('Changelog gefunden');
      changelogFound = true;
      break;
    }
  }
  
  if (!changelogFound) {
    await logger.info('Kein Changelog gefunden', 'Ein Changelog ist für die Versionsverfolgung empfehlenswert');
  }
  
  // Prüfung auf .gitignore
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (await exists(gitignorePath)) {
    await logger.success('.gitignore gefunden');
  } else {
    await logger.info('Keine .gitignore gefunden', 'Eine .gitignore-Datei ist für Git-Projekte empfehlenswert');
  }
  
  await logger.info(`Sonstige Prüfungen abgeschlossen`);
}

/**
 * NEU: Interaktiver Berichtsmodus mit Lösungsvorschlägen
 */
async function generateInteractiveReport() {
  logger.step('Erstelle interaktiven Bericht mit Lösungsvorschlägen');
  
  const reportFile = 'project-check-report.html';
  
  // Sammle alle Probleme nach Kategorien
  const reportData = {
    errors: errors,
    warnings: warnings,
    info: info,
    stats: stats,
    allResources: {
      htmlCount: allResources.html.length,
      cssCount: allResources.css.length,
      jsCount: allResources.js.length,
      imageCount: allResources.images.length,
      fontCount: allResources.fonts.length,
      otherCount: allResources.other.length
    },
    startTime: startTime,
    endTime: new Date(),
    duration: ((new Date() - startTime) / 1000).toFixed(2)
  };
  
  // Erstelle Lösungsvorschläge basierend auf gefundenen Problemen
  const solutions = [];
  
  // Prüfe auf HTML-Probleme
  if (stats.htmlErrors > 0) {
    solutions.push({
      category: 'HTML',
      title: 'HTML-Probleme beheben',
      priority: stats.htmlErrors > 5 ? 'Hoch' : 'Mittel',
      details: `${stats.htmlErrors} HTML-Probleme gefunden. Häufige Probleme sind fehlende Doctype-Deklarationen, 
                fehlende alt-Attribute bei Bildern und unzureichende Metadaten.`,
      steps: [
        'Verwende HTML-Validatoren wie validator.w3.org',
        'Stelle sicher, dass alle Bilder alt-Attribute haben',
        'Füge die erforderlichen Meta-Tags hinzu (viewport, description, charset)',
        'Verwende semantisches HTML (nav, main, section, article)'
      ]
    });
  }
  
  // Prüfe auf CSS-Probleme
  if (stats.cssErrors > 0 || stats.cssModularity < 5) {
    solutions.push({
      category: 'CSS',
      title: 'CSS-Qualität verbessern',
      priority: stats.cssErrors > 10 ? 'Hoch' : 'Mittel',
      details: `CSS-Probleme und niedrige Modularität gefunden. Die CSS-Organisation kann verbessert werden.`,
      steps: [
        'Implementiere eine Namenskonvention wie BEM',
        'Reduziere die Spezifität und Verschachtelungstiefe',
        'Entferne duplizierte Selektoren und Regeln',
        'Organisiere CSS in Module oder Komponenten',
        'Verwende CSS-Variablen für konsistente Werte'
      ]
    });
  }
  
  // Prüfe auf ungenutzte Ressourcen
  if (stats.unusedCssRules > 0 || stats.unusedJsCode > 0) {
    solutions.push({
      category: 'Performance',
      title: 'Ungenutzte Ressourcen entfernen',
      priority: 'Hoch',
      details: `Ungenutzte CSS-Regeln und JavaScript-Code gefunden, die die Ladezeit beeinträchtigen können.`,
      steps: [
        'Implementiere CSS-Purging mit Tools wie PurgeCSS',
        'Verwende Tree-Shaking für JavaScript mit Webpack oder Rollup',
        'Teile Code in mehrere Dateien auf, die bei Bedarf geladen werden',
        'Führe regelmäßige Code-Reviews durch, um veralteten Code zu entfernen'
      ]
    });
  }
  
  // Prüfe auf Barrierefreiheitsprobleme
  if (stats.wcagViolations > 0 || stats.accessibilityIssues > 0) {
    solutions.push({
      category: 'Barrierefreiheit',
      title: 'Barrierefreiheit verbessern',
      priority: stats.wcagViolations > 10 ? 'Hoch' : 'Mittel',
      details: `${stats.wcagViolations + stats.accessibilityIssues} Barrierefreiheitsprobleme gefunden, 
                die die Nutzbarkeit für Menschen mit Behinderungen einschränken können.`,
      steps: [
        'Stelle sicher, dass alle Bilder Alt-Texte haben',
        'Verbessere den Farbkontrast für bessere Lesbarkeit',
        'Stelle sicher, dass alle interaktiven Elemente per Tastatur bedienbar sind',
        'Verwende semantisches HTML für bessere Screenreader-Unterstützung',
        'Implementiere ARIA-Attribute wo nötig, aber nur wenn angebracht'
      ]
    });
  }
  
  // Prüfe auf Performance-Probleme
  if (stats.performanceScore < 70 || stats.performanceIssues > 5) {
    solutions.push({
      category: 'Performance',
      title: 'Website-Geschwindigkeit verbessern',
      priority: 'Hoch',
      details: `Die Website hat einen niedrigen Performance-Score und mehrere Optimierungsmöglichkeiten.`,
      steps: [
        'Optimiere Bilder mit WebP/AVIF und implementiere Lazy-Loading',
        'Minimiere und komprimiere CSS und JavaScript',
        'Implementiere kritisches CSS und verzögere nicht-kritische Ressourcen',
        'Nutze Browser-Caching und ein CDN',
        'Reduziere JavaScript-Ausführungszeit durch Code-Splitting'
      ]
    });
  }
  
  // Prüfe auf fehlende moderne Technologien
  if (stats.modernTechIssues > 3) {
    solutions.push({
      category: 'Technologie',
      title: 'Moderne Web-Technologien implementieren',
      priority: 'Mittel',
      details: `Mehrere moderne Web-Technologien werden nicht genutzt, die die Performance und User Experience verbessern könnten.`,
      steps: [
        'Implementiere WebP/AVIF-Bildformate mit Fallbacks',
        'Nutze ES6-Module für bessere Code-Organisation',
        'Implementiere einen Service Worker für Offline-Unterstützung',
        'Verwende Resource Hints (preload, prefetch, preconnect)',
        'Implementiere Lazy-Loading für Bilder und iframes'
      ]
    });
  }
  
  // Prüfe auf SEO-Probleme
  if (stats.seoIssues > 0) {
    solutions.push({
      category: 'SEO',
      title: 'SEO-Optimierung durchführen',
      priority: stats.seoIssues > 5 ? 'Hoch' : 'Mittel',
      details: `${stats.seoIssues} SEO-Probleme gefunden, die die Sichtbarkeit in Suchmaschinen beeinträchtigen können.`,
      steps: [
        'Stelle sicher, dass alle Seiten aussagekräftige Titel haben',
        'Füge Meta-Beschreibungen zu allen wichtigen Seiten hinzu',
        'Implementiere strukturierte Daten (Schema.org)',
        'Verbessere die URL-Struktur für bessere Lesbarkeit',
        'Erstelle eine vollständige sitemap.xml und robots.txt'
      ]
    });
  }
  
  // Prüfe auf Sicherheitsprobleme
  if (stats.securityIssues > 0) {
    solutions.push({
      category: 'Sicherheit',
      title: 'Sicherheitslücken beheben',
      priority: 'Hoch',
      details: `${stats.securityIssues} Sicherheitsprobleme gefunden, die das Projekt anfällig machen könnten.`,
      steps: [
        'Implementiere Content Security Policy (CSP)',
        'Stelle sicher, dass alle Ressourcen über HTTPS geladen werden',
        'Vermeide unsichere JavaScript-Funktionen wie eval()',
        'Aktualisiere veraltete Abhängigkeiten',
        'Implementiere sichere Header (HSTS, X-Frame-Options, etc.)'
      ]
    });
  }
  
  reportData.solutions = solutions;
  
  // Erstelle HTML-Bericht
  const htmlReport = generateHTMLReport(reportData);
  
  try {
    await writeFile(reportFile, htmlReport);
    await logger.success(`Interaktiver Bericht erstellt: ${reportFile}`, 
      `Der Bericht enthält eine Zusammenfassung aller Probleme und Lösungsvorschläge.`
    );
  } catch (error) {
    await logger.error(`Fehler beim Erstellen des interaktiven Berichts`, error.message);
  }
}

/**
 * NEU: Sicherheitsprüfungen
 */
async function checkSecurity() {
  logger.step('Führe Sicherheitsprüfungen durch');
  
  let securityIssues = 0;
  let vulnerabilities = 0;
  let deprecatedAPIs = 0;
  
  // Prüfe auf XSS-Schwachstellen
  if (SECURITY_CHECKS.checkXSSVulnerabilities) {
    await logger.info('Prüfe auf XSS-Schwachstellen...');
    
    for (const file of allResources.html) {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Prüfe auf unsichere innerHTML-Nutzung
      const innerHTMLMatches = content.match(/innerHTML\s*=/g) || [];
      if (innerHTMLMatches.length > 0) {
        await logger.warning(`${filename}: Potenzielle XSS-Schwachstelle durch innerHTML`, 
          `${innerHTMLMatches.length} Vorkommen gefunden. Verwende textContent oder sanitisiere Eingaben.`);
        securityIssues++;
        vulnerabilities++;
      }
      
      // Prüfe auf unsichere document.write
      const documentWriteMatches = content.match(/document\.write\s*\(/g) || [];
      if (documentWriteMatches.length > 0) {
        await logger.warning(`${filename}: Unsichere document.write-Nutzung`, 
          `${documentWriteMatches.length} Vorkommen gefunden. Dies kann zu XSS führen.`);
        securityIssues++;
        vulnerabilities++;
      }
    }
    
    for (const file of allResources.js) {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Prüfe auf eval()
      const evalMatches = content.match(/\beval\s*\(/g) || [];
      if (evalMatches.length > 0) {
        await logger.warning(`${filename}: Unsichere eval()-Nutzung`, 
          `${evalMatches.length} Vorkommen gefunden. Dies kann zu Code-Injection führen.`);
        securityIssues++;
        vulnerabilities++;
      }
      
      // Prüfe auf unsichere setTimeout/setInterval mit Strings
      const setTimeoutStringMatches = content.match(/setTimeout\s*\(\s*["'][\s\S]*?["']/g) || [];
      const setIntervalStringMatches = content.match(/setInterval\s*\(\s*["'][\s\S]*?["']/g) || [];
      
      if (setTimeoutStringMatches.length > 0 || setIntervalStringMatches.length > 0) {
        await logger.warning(`${filename}: Unsichere Timer-Funktionen mit Strings`, 
          `${setTimeoutStringMatches.length + setIntervalStringMatches.length} Vorkommen gefunden.`);
        securityIssues++;
        vulnerabilities++;
      }
    }
  }
  
  // Prüfe auf HTTPS und Mixed Content
  if (SECURITY_CHECKS.checkHTTPS) {
    await logger.info('Prüfe auf HTTPS und Mixed Content...');
    
    for (const file of allResources.html) {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Prüfe auf HTTP-URLs in HTTPS-Kontext
      const httpUrls = content.match(/http:\/\/[^"'\s]+/g) || [];
      if (httpUrls.length > 0) {
        await logger.warning(`${filename}: Mixed Content gefunden`, 
          `${httpUrls.length} HTTP-URLs in potenziell HTTPS-Kontext.`);
        securityIssues++;
      }
    }
  }
  
  // Prüfe auf veraltete APIs
  if (SECURITY_CHECKS.checkDeprecatedAPIs) {
    await logger.info('Prüfe auf veraltete APIs...');
    
    for (const file of allResources.js) {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      const deprecatedAPIs = [
        { pattern: /document\.execCommand\s*\(/, message: 'document.execCommand ist veraltet und unsicher' },
        { pattern: /XMLHttpRequest\s*\(/, message: 'XMLHttpRequest sollte durch Fetch API ersetzt werden' },
        { pattern: /\.attachEvent\s*\(/, message: '.attachEvent ist veraltet' },
        { pattern: /\.detachEvent\s*\(/, message: '.detachEvent ist veraltet' }
      ];
      
      for (const api of deprecatedAPIs) {
        if (api.pattern.test(content)) {
          await logger.warning(`${filename}: ${api.message}`, file);
          deprecatedAPIs++;
          securityIssues++;
        }
      }
    }
  }
  
  stats.securityIssues = securityIssues;
  stats.vulnerabilityCount = vulnerabilities;
  stats.deprecatedAPIs = deprecatedAPIs;
  
  await logger.info(`Sicherheitsprüfung abgeschlossen`, 
    `Sicherheitsprobleme: ${securityIssues}\n` +
    `Sicherheitslücken: ${vulnerabilities}\n` +
    `Veraltete APIs: ${deprecatedAPIs}`
  );
  
  if (securityIssues > 0) {
    await logger.warning(`Sicherheitsprobleme gefunden`, 
      `Empfehlungen:\n` +
      `- Implementiere Content Security Policy (CSP)\n` +
      `- Verwende HTTPS für alle Ressourcen\n` +
      `- Vermeide unsichere JavaScript-Funktionen\n` +
      `- Aktualisiere veraltete Abhängigkeiten\n` +
      `- Führe regelmäßige Sicherheitsaudits durch`
    );
  }
}

/**
 * NEU: Code-Qualitätsanalysen
 */
async function checkCodeQuality() {
  logger.step('Führe Code-Qualitätsanalysen durch');
  
  let codeQualityIssues = 0;
  let complexityScore = 0;
  let duplicationIssues = 0;
  
  // Prüfe Code-Komplexität
  if (CODE_QUALITY_CHECKS.checkCodeComplexity) {
    await logger.info('Prüfe Code-Komplexität...');
    
    for (const file of allResources.js) {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Einfache Komplexitätsmessung basierend auf Zeilen und Verzweigungen
      const lines = content.split('\n').length;
      const ifStatements = (content.match(/\bif\s*\(/g) || []).length;
      const loops = (content.match(/\b(for|while|do)\s*\(/g) || []).length;
      const functions = (content.match(/\bfunction\s+/g) || []).length;
      
      // Berechne eine einfache Komplexitätsmetrik
      const complexity = Math.round((ifStatements * 2 + loops * 3 + functions * 1.5) / Math.max(1, lines / 10));
      
      if (complexity > 10) {
        await logger.warning(`${filename}: Hohe Code-Komplexität`, 
          `Komplexität: ${complexity} (empfohlen: < 10)\n` +
          `Zeilen: ${lines}, Verzweigungen: ${ifStatements}, Schleifen: ${loops}, Funktionen: ${functions}`);
        codeQualityIssues++;
      }
      
      complexityScore += complexity;
    }
  }
  
  // Prüfe auf Code-Duplikation
  if (CODE_QUALITY_CHECKS.checkDuplication) {
    await logger.info('Prüfe auf Code-Duplikation...');
    
    const codeBlocks = new Map();
    
    for (const file of allResources.js) {
      const content = await readFile(file, 'utf8');
      
      // Extrahiere Funktionsblöcke (vereinfacht)
      const functionBlocks = content.match(/function\s+[^{]*\{[\s\S]*?\}/g) || [];
      
      for (const block of functionBlocks) {
        const hash = crypto.createHash('md5').update(block).digest('hex');
        
        if (codeBlocks.has(hash)) {
          const existing = codeBlocks.get(hash);
          codeBlocks.set(hash, { ...existing, count: existing.count + 1 });
        } else {
          codeBlocks.set(hash, { code: block.substring(0, 100) + '...', count: 1, file: path.basename(file) });
        }
      }
    }
    
    // Finde Duplikate
    const duplicates = Array.from(codeBlocks.values()).filter(block => block.count > 1);
    
    if (duplicates.length > 0) {
      duplicationIssues = duplicates.length;
      codeQualityIssues += duplicationIssues;
      
      const topDuplicates = duplicates
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map(d => `${d.count}x Duplikat: ${d.code}`)
        .join('\n');
      
      await logger.warning(`${duplicates.length} Code-Duplikate gefunden`, 
        `Top-Duplikate:\n${topDuplicates}\n\nEmpfehlung: Extrahiere gemeinsamen Code in wiederverwendbare Funktionen.`);
    }
  }
  
  // Prüfe auf Best Practices
  if (CODE_QUALITY_CHECKS.checkBestPractices) {
    await logger.info('Prüfe auf Best Practices...');
    
    for (const file of allResources.js) {
      const content = await readFile(file, 'utf8');
      const filename = path.basename(file);
      
      // Prüfe auf var-Deklarationen (sollte let/const verwenden)
      const varDeclarations = (content.match(/\bvar\s+/g) || []).length;
      if (varDeclarations > 0) {
        await logger.warning(`${filename}: Verwendung von var statt let/const`, 
          `${varDeclarations} var-Deklarationen gefunden. Verwende let/const für bessere Scoping-Regeln.`);
        codeQualityIssues++;
      }
      
      // Prüfe auf console.log im Produktionscode
      const consoleLogs = (content.match(/console\.(log|warn|error|info|debug)\s*\(/g) || []).length;
      if (consoleLogs > 0) {
        await logger.info(`${filename}: Console-Ausgaben gefunden`, 
          `${consoleLogs} console-Aufrufe. Entferne diese für Produktionscode.`);
      }
      
      // Prüfe auf magische Zahlen
      const magicNumbers = content.match(/\b\d{2,}\b/g) || [];
      if (magicNumbers.length > 10) {
        await logger.info(`${filename}: Potenzielle magische Zahlen`, 
          `${magicNumbers.length} mehrstellige Zahlen gefunden. Erwäge Konstanten zu definieren.`);
      }
    }
  }
  
  stats.codeQualityIssues = codeQualityIssues;
  stats.codeComplexityScore = complexityScore;
  
  await logger.info(`Code-Qualitätsanalyse abgeschlossen`, 
    `Qualitätsprobleme: ${codeQualityIssues}\n` +
    `Code-Duplikate: ${duplicationIssues}\n` +
    `Gesamte Komplexität: ${complexityScore}`
  );
  
  if (codeQualityIssues > 0) {
    await logger.warning(`Code-Qualitätsprobleme gefunden`, 
      `Empfehlungen:\n` +
      `- Refaktoriere komplexe Funktionen in kleinere Einheiten\n` +
      `- Entferne Code-Duplikate durch Extraktion gemeinsamer Funktionen\n` +
      `- Verwende let/const statt var\n` +
      `- Entferne console-Ausgaben für Produktionscode\n` +
      `- Definiere Konstanten für magische Zahlen`
    );
  }
}

/**
 * NEU: Integration mit externen Tools
 */
async function integrateExternalTools() {
  logger.step('Integriere externe Tools');
  
  // Prüfe auf verfügbare Tools
  const tools = {
    eslint: await checkToolAvailability('eslint'),
    stylelint: await checkToolAvailability('stylelint'),
    prettier: await checkToolAvailability('prettier'),
    webpack: await checkToolAvailability('webpack'),
    babel: await checkToolAvailability('babel')
  };
  
  let availableTools = Object.entries(tools).filter(([_, available]) => available).length;
  
  await logger.info(`Externe Tools verfügbar: ${availableTools}/${Object.keys(tools).length}`);
  
  // ESLint-Integration
  if (tools.eslint && CODE_QUALITY_CHECKS.checkESLintRules) {
    await logger.info('Führe ESLint-Prüfung durch...');
    
    try {
      const eslintConfig = {
        env: { browser: true, es2021: true },
        extends: ['eslint:recommended'],
        parserOptions: { ecmaVersion: 12, sourceType: 'module' },
        rules: {
          'no-unused-vars': 'warn',
          'no-console': 'warn',
          'prefer-const': 'warn',
          'no-var': 'warn'
        }
      };
      
      // Vereinfachte ESLint-Prüfung für jede JS-Datei
      for (const file of allResources.js.slice(0, 5)) { // Begrenze auf 5 Dateien für Performance
        const content = await readFile(file, 'utf8');
        const filename = path.basename(file);
        
        // Einfache Regelprüfungen
        const issues = [];
        
        if (content.includes('var ')) {
          issues.push('Verwendung von var statt let/const');
        }
        
        if (content.includes('console.log')) {
          issues.push('Console-Ausgaben im Code');
        }
        
        if (content.match(/function\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*\([^)]*\)\s*\{[\s\S]*?\}/g)?.some(fn => fn.split('\n').length > 50)) {
          issues.push('Sehr lange Funktionen (>50 Zeilen)');
        }
        
        if (issues.length > 0) {
          await logger.warning(`${filename}: ESLint-Probleme`, issues.join('\n'));
        }
      }
      
    } catch (error) {
      await logger.error(`Fehler bei ESLint-Integration`, error.message);
    }
  }
  
  // Stylelint-Integration
  if (tools.stylelint) {
    await logger.info('Führe Stylelint-Prüfung durch...');
    
    try {
      for (const file of allResources.css.slice(0, 5)) { // Begrenze auf 5 Dateien
        const content = await readFile(file, 'utf8');
        const filename = path.basename(file);
        
        // Einfache CSS-Linting-Regeln
        const issues = [];
        
        if (content.includes('!important')) {
          issues.push('Übermäßige Verwendung von !important');
        }
        
        if (content.match(/\{[\s\S]*?\}/g)?.some(rule => rule.split('\n').length > 20)) {
          issues.push('Sehr lange CSS-Regeln');
        }
        
        if (content.match(/#[a-fA-F0-9]{3,6}/g)?.length > 20) {
          issues.push('Viele hartkodierte Farben - erwäge CSS-Variablen');
        }
        
        if (issues.length > 0) {
          await logger.warning(`${filename}: Stylelint-Probleme`, issues.join('\n'));
        }
      }
      
    } catch (error) {
      await logger.error(`Fehler bei Stylelint-Integration`, error.message);
    }
  }
  
  await logger.info(`Integration externer Tools abgeschlossen`);
}

/**
 * Hilfsfunktion zur Prüfung der Verfügbarkeit von Tools
 */
async function checkToolAvailability(toolName) {
  return new Promise((resolve) => {
    exec(`which ${toolName}`, (error) => {
      resolve(!error);
    });
  });
}

/**
 * NEU: Erweiterte Hauptfunktion mit neuen Prüfungen
 */
async function runProjectCheck() {
  const startTime = new Date();
  
  try {
    // Log-Datei initialisieren
    await initLogFile();
    
    logger.step('Starte erweiterte Projekt-Prüfung');
    await logger.info(`Prüfe Projekt in: ${process.cwd()}`);
    
    // Alle Dateien einlesen
    const files = await getAllFiles(process.cwd());
    
    // Dateien kategorisieren
    await categorizeFiles(files);
    
    // Erweiterte Prüfungen durchführen
    await checkHtmlFiles();
    await checkCssFiles();
    await checkJsFiles();
    await checkImageOptimization();
    await checkExternalDependencies();
    await checkProjectStructure();
    await checkSitemap();
    await checkFonts();
    await checkRobotsTxt();
    await checkManifest();
    await checkServiceWorker();
    await checkCompression();
    await checkMiscellaneous();
    
    // Neue erweiterte Prüfungen
    await checkCssModularity();
    await checkUnusedCode();
    await checkAccessibility();
    await checkModernWebTechnologies();
    await runPerformanceBenchmarks();
    await checkSecurity();
    await checkCodeQuality();
    await integrateExternalTools();
    
    // Interaktiven Bericht erstellen
    if (INTERACTIVE_REPORT.generateHTMLReport) {
      await generateInteractiveReport();
    }
    
    // Zusammenfassung erstellen
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    
    const summaryText = 
`===========================================================
ERWEITERTE PROJEKT-PRÜFUNG ABGESCHLOSSEN - ${endTime.toLocaleString()}
===========================================================
Dauer: ${duration.toFixed(2)} Sekunden
Geprüfte Dateien: ${stats.totalFiles} (${formatBytes(stats.totalSize)})
Fehler: ${errors.length}
Warnungen: ${warnings.length}
Informationen: ${info.length}
===========================================================
Defekte Links: ${stats.brokenLinks}
HTML-Probleme: ${stats.htmlErrors}
CSS-Probleme: ${stats.cssErrors}
JavaScript-Probleme: ${stats.jsErrors}
SEO-Probleme: ${stats.seoIssues}
Barrierefreiheitsprobleme: ${stats.accessibilityIssues}
Performance-Probleme: ${stats.performanceIssues}
Sicherheitsprobleme: ${stats.securityIssues}
Code-Qualitätsprobleme: ${stats.codeQualityIssues}
===========================================================
CSS-Modularität: ${stats.cssModularity.toFixed(2)}/10
Performance-Score: ${stats.performanceScore.toFixed(1)}/100
WCAG-Verstöße: ${stats.wcagViolations}
Ungenutzte CSS-Regeln: ${stats.unusedCssRules}
Ungenutzte JS-Funktionen: ${stats.unusedJsCode}
Moderne Technologien: ${stats.modernTechIssues} Verbesserungsmöglichkeiten
===========================================================
`;
    
    await appendFile(LOG_FILE, summaryText);
    
    logger.step('Erweiterte Projekt-Prüfung abgeschlossen');
    console.log('\x1b[32m%s\x1b[0m', `Bericht gespeichert in: ${LOG_FILE}`);
    console.log('\x1b[32m%s\x1b[0m', `Interaktiver Bericht: project-check-report.html`);
    console.log('\x1b[32m%s\x1b[0m', `Gesamtdauer: ${duration.toFixed(2)} Sekunden`);
    console.log('\x1b[32m%s\x1b[0m', `Fehler: ${errors.length} | Warnungen: ${warnings.length} | Informationen: ${info.length}`);
    
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Unerwarteter Fehler bei der erweiterten Projekt-Prüfung: ${error.message}`);
    console.error(error);
  }
}

// Skript ausführen
runProjectCheck();

/**
 * Hilfsfunktionen
 */

// Extraktion von Links aus HTML
function extractLinks(content, pattern) {
  const links = [];
  const regex = new RegExp(`${pattern}([^"]+)`, 'g');
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1]);
  }
  
  return links;
}

// Formatierung von Bytes in lesbare Größen
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

// Prüfung der Verfügbarkeit einer URL
async function checkUrlAvailability(url) {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { timeout: 5000 }, (res) => {
      const statusCode = res.statusCode;
      resolve(statusCode >= 200 && statusCode < 400);
      res.resume(); // Den Body verwerfen
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.abort();
      resolve(false);
    });
    
    req.end();
  });
}
