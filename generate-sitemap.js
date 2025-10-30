/**
 * Dynamischer Sitemap-Generator
 * 
 * Dieses Skript generiert automatisch eine XML-Sitemap für die Website
 * basierend auf den HTML-Dateien im Verzeichnis.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

// Konfiguration
const BASE_URL = 'https://johann-fullhd.github.io/'; // Hier deine tatsächliche Domain eintragen
const EXCLUDE_FILES = ['404.html', 'offline.html', 'admin.html', 'login.html'];
const OUTPUT_FILE = 'sitemap.xml';

// Hilfsfunktion zum rekursiven Einlesen von Verzeichnissen
async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = path.resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.flat();
}

// Hilfsfunktion zur Überprüfung des Dateinamens
function isHTMLFile(file) {
  return file.endsWith('.html') && !EXCLUDE_FILES.includes(path.basename(file));
}

// Hilfsfunktion zur Bestimmung der Priorität
function getPriority(filePath) {
  const fileName = path.basename(filePath);
  
  if (fileName === 'index.html') return 1.0;
  if (fileName === 'gallerie.html' || fileName === 'about.html') return 0.9;
  if (fileName === 'informatik.html' || fileName === 'fotografie_equipment.html') return 0.8;
  if (fileName === 'terms-of-service.html' || fileName === 'privacy-policy.html') return 0.5;
  
  return 0.7;
}

// Hilfsfunktion zur Bestimmung der Änderungshäufigkeit
function getChangeFreq(filePath) {
  const fileName = path.basename(filePath);
  
  if (fileName === 'index.html' || fileName === 'gallerie.html') return 'weekly';
  if (fileName === 'about.html' || fileName === 'informatik.html') return 'monthly';
  if (fileName === 'terms-of-service.html' || fileName === 'privacy-policy.html') return 'yearly';
  
  return 'monthly';
}

// Hilfsfunktion zur Bestimmung des letzten Änderungsdatums
async function getLastMod(filePath) {
  const fileStats = await stat(filePath);
  return fileStats.mtime.toISOString().split('T')[0];
}

// Hilfsfunktion zum Normalisieren des URL-Pfads
function normalizeUrlPath(filePath, baseDir) {
  let relativePath = path.relative(baseDir, filePath);
  relativePath = relativePath.replace(/\\/g, '/');
  
  // index.html entfernen
  if (relativePath === 'index.html') {
    return '/';
  }
  
  // .html Erweiterung entfernen für saubere URLs (optional)
  // relativePath = relativePath.replace(/\.html$/, '');
  
  return '/' + relativePath;
}

// Hauptfunktion
async function generateSitemap() {
  try {
    const baseDir = process.cwd();
    console.log(`Scanning directory: ${baseDir}`);
    
    let allFiles = await getFiles(baseDir);
    const htmlFiles = allFiles.filter(isHTMLFile);
    
    console.log(`Found ${htmlFiles.length} HTML files to include in sitemap`);
    
    // XML-Header erstellen
    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Einträge für jede HTML-Datei hinzufügen
    for (const file of htmlFiles) {
      const urlPath = normalizeUrlPath(file, baseDir);
      const priority = getPriority(file);
      const changefreq = getChangeFreq(file);
      const lastmod = await getLastMod(file);
      
      sitemap += '  <url>\n';
      sitemap += `    <loc>${BASE_URL}${urlPath}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += `    <changefreq>${changefreq}</changefreq>\n`;
      sitemap += `    <priority>${priority}</priority>\n`;
      sitemap += '  </url>\n';
    }
    
    // XML abschließen
    sitemap += '</urlset>';
    
    // In Datei speichern
    await writeFile(OUTPUT_FILE, sitemap);
    console.log(`Sitemap erfolgreich erstellt: ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('Fehler beim Erstellen der Sitemap:', error);
  }
}

// Skript ausführen
generateSitemap();
