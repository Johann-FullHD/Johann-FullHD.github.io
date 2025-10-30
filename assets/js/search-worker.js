// Web Worker für intensive Suchvorgänge
// Dieser Worker führt die Textsuche in einem separaten Thread aus,
// um die Hauptthread-Performance zu verbessern

// Empfange Nachricht vom Hauptthread
self.onmessage = function(e) {
  const data = e.data;
  
  if (data.action === 'search') {
    // Suche ausführen
    const results = performSearch(data.query, data.content);
    self.postMessage(results);
  } else if (data.action === 'exportMarkdown') {
    // Markdown exportieren (Platzhalter, tatsächliche Implementierung würde HTML parsen)
    self.postMessage({
      action: 'exportMarkdownComplete',
      markdown: 'Export wird vom Hauptthread verarbeitet',
      error: null
    });
  }
};

// Durchsucht den Content nach dem Query-String
function performSearch(query, contentItems) {
  query = query.toLowerCase().trim();
  
  if (query.length < 2) {
    return { totalMatches: 0, matches: [] };
  }
  
  const matches = [];
  let totalMatches = 0;
  
  // Optimierte Suche mit prioritärer Reihenfolge (Überschriften zuerst)
  const prioritizedContent = [...contentItems].sort((a, b) => {
    // Priorisiere Überschriften
    const headingA = a.type === 'h2' || a.type === 'h3' || a.type === 'h4';
    const headingB = b.type === 'h2' || b.type === 'h3' || b.type === 'h4';
    
    if (headingA && !headingB) return -1;
    if (!headingA && headingB) return 1;
    
    // Dann nach Relevanz (enthält das Element den Suchbegriff?)
    const containsA = a.text.toLowerCase().includes(query);
    const containsB = b.text.toLowerCase().includes(query);
    
    if (containsA && !containsB) return -1;
    if (!containsA && containsB) return 1;
    
    return 0;
  });
  
  // Fuzzy-Suche mit Levenshtein-Distanz für Tippfehlertoleranz
  for (const item of prioritizedContent) {
    const itemText = item.text.toLowerCase();
    let matchCount = 0;
    let lastIndex = 0;
    let index;
    
    // Genaue Übereinstimmungen suchen
    while ((index = itemText.indexOf(query, lastIndex)) !== -1) {
      matchCount++;
      
      // Context für das Highlighting extrahieren
      const contextStart = Math.max(0, index - 30);
      const contextEnd = Math.min(itemText.length, index + query.length + 30);
      
      const textBefore = itemText.substring(contextStart, index);
      const match = itemText.substring(index, index + query.length);
      const textAfter = itemText.substring(index + query.length, contextEnd);
      
      matches.push({
        elementId: item.id,
        sectionId: item.path,
        type: item.type,
        query: query,
        index: index,
        textBefore: textBefore,
        match: match,
        textAfter: textAfter
      });
      
      lastIndex = index + query.length;
    }
    
    // Fuzzy-Matches finden, falls keine exakten Übereinstimmungen
    if (matchCount === 0 && query.length >= 4) {
      const words = itemText.split(/\s+/);
      
      for (const word of words) {
        if (word.length >= 4 && levenshteinDistance(word, query) <= 2) {
          matchCount++;
          
          // Position des Worts im Text finden
          const wordIndex = itemText.indexOf(word);
          
          // Context für das Highlighting extrahieren
          const contextStart = Math.max(0, wordIndex - 30);
          const contextEnd = Math.min(itemText.length, wordIndex + word.length + 30);
          
          const textBefore = itemText.substring(contextStart, wordIndex);
          const match = itemText.substring(wordIndex, wordIndex + word.length);
          const textAfter = itemText.substring(wordIndex + word.length, contextEnd);
          
          matches.push({
            elementId: item.id,
            sectionId: item.path,
            type: item.type,
            query: word,  // Verwende das gefundene Wort statt des Queries für Highlighting
            index: wordIndex,
            textBefore: textBefore,
            match: match,
            textAfter: textAfter,
            fuzzy: true
          });
        }
      }
    }
    
    totalMatches += matchCount;
  }
  
  // Ergebnisse nach Position im Dokument sortieren
  matches.sort((a, b) => {
    // Erst nach Abschnitt sortieren
    if (a.sectionId !== b.sectionId) {
      return prioritizedContent.findIndex(item => item.path === a.sectionId) - 
             prioritizedContent.findIndex(item => item.path === b.sectionId);
    }
    // Dann nach Position im Text
    return a.index - b.index;
  });
  
  return {
    totalMatches,
    matches
  };
}

// Levenshtein-Distanz für Fuzzy-Matching
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  
  const matrix = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
  
  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }
  
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // Löschen
        matrix[i][j - 1] + 1,       // Einfügen
        matrix[i - 1][j - 1] + cost // Ersetzen
      );
    }
  }
  
  return matrix[a.length][b.length];
}
