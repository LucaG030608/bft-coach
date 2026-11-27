/* Testkonfiguration – Stand der Recherche 28.11.2026 (11 Recherche-Agenten, siehe cat/AUSWERTUNG.md).
   Belegt: zwei verschiedene CATs (Köln für Offiziere, Karrierecenter für alle anderen),
   Zeit pro Aufgabe (bis ca. 3 Min.) in den adaptiven Teilen, Zeit pro Abschnitt in Technik/Rechtschreibung,
   Uhr meist nicht sichtbar. Genaue Aufgabenzahlen veröffentlicht die Bundeswehr nicht → Werte hier sind Schätzungen. */
window.CAT = window.CAT || {};
CAT.AREAS = {
  analogie: { name: 'Wortanalogien', time: 180, intro: 'Wort A verhält sich zu Wort B wie Wort C zu …? Finde dieselbe Beziehung (Teil–Ganzes, Gegenteil, Funktion, Ursache–Folge …). 5 Antwortmöglichkeiten.' },
  matrizen: { name: 'Matrizen', time: 180, intro: '3×3-Muster, das neunte Feld fehlt. Lies Zeilen und Spalten: Linien werden überlagert, abgezogen, gedreht oder verteilt. Wähle aus 8 Teilstücken. Gilt als schwerster Teil.' },
  mathe: { name: 'Mathematik', time: 180, intro: 'Rechnen ohne Taschenrechner: Grundrechenarten (auch mit Nachkommastellen), Brüche, Prozent, Dreisatz, Wurzeln, Flächen, Volumen, Textaufgaben. Stift und Papier sind erlaubt.' },
  sprache: { name: 'Rechtschreibung & Sprache', time: 30, intro: 'Welches Wort ist richtig geschrieben? Vier Schreibweisen, eine ist korrekt. Viele Wörter, wenig Zeit – zügig arbeiten.' },
  technik: { name: 'Technisches Verständnis', time: 30, intro: 'Zeichnungen und Fragen zu Zahnrädern, Riemen, Hebeln, Rollen, Stromkreisen und Physik. Wie im echten Test: Zeit für den ganzen Teil, Aufgaben werden schwerer, falsche Antworten geben Abzug (–⅓). Überspringen ist erlaubt.' },
  englisch: { name: 'Englisch', time: 60, intro: 'Lückensätze und Wortschatz. Wähle die richtige Antwort.' },
  konz: { name: 'Konzentration & Symbolrechnen', time: 60, intro: 'Symbole stehen für Zahlen – rechne damit unter Zeitdruck. Nicht nervös werden: Man soll nicht alles schaffen.' },
  reaktion: { name: 'Reaktion', time: 3, intro: 'Ein roter Pfeil zeigt durch seine POSITION die Reihe (oben/Mitte/unten), ein blauer Pfeil durch seine RICHTUNG die Spalte (← links, ↑ Mitte, → rechts). Tippe das passende Feld. Alle 3 Sekunden kommt ein neues Signal. (Nachempfunden – die genaue Regel wird im Test vorher erklärt.)' },
  /* Zusatzbereiche: im echten CAT kaum oder gar nicht belegt → nur Training, nicht in der Simulation */
  logik: { name: 'Zahlenreihen & Logik', time: 90, extra: true, intro: 'Zahlenreihen, Figurenreihen, Schlussfolgerungen.' },
  raum: { name: 'Räumliches Denken', time: 60, extra: true, intro: 'Würfelnetze, Würfel zählen, Figuren drehen.' },
  wissen: { name: 'Allgemeinwissen', time: 30, extra: true, intro: 'Politik, Geschichte, Geografie, Bundeswehr – eher fürs Interview als für den CAT.' },
};

/* Abschnitt: area, n (max. Aufgaben), type (optional Aufgabentyp), mode 'item' (Zeit je Aufgabe) | 'section' (Zeit für den Teil),
   time (Sekunden je Aufgabe bzw. je Teil), adaptive (Standard true), penalty (Ratekorrektur −⅓, Überspringen erlaubt) */
CAT.LAUFBAHNEN = {
  offizier: {
    name: 'Offiziere (Assessmentcenter Köln)', short: 'Köln', target: 65,
    sections: [
      { area: 'analogie', n: 10, mode: 'item', time: 180 },
      { area: 'matrizen', n: 10, mode: 'item', time: 180 },
      { area: 'mathe', n: 10, mode: 'item', time: 180 },
    ],
  },
  feldwebel: {
    name: 'Feldwebel / Unteroffiziere (Karrierecenter)', short: 'Karrierecenter', target: 52,
    sections: [
      { area: 'analogie', n: 10, mode: 'item', time: 180 },
      { area: 'sprache', type: 'rechtschreibung', n: 30, mode: 'section', time: 600 },
      { area: 'mathe', n: 10, mode: 'item', time: 180 },
      { area: 'matrizen', n: 10, mode: 'item', time: 180 },
      { area: 'technik', n: 20, mode: 'section', time: 600, adaptive: false, penalty: true },
      { area: 'englisch', n: 10, mode: 'item', time: 60 },
      { area: 'reaktion', n: 30, mode: 'block' },
      { area: 'konz', type: 'symbolrechnen', n: 10, mode: 'item', time: 60 },
      { area: 'konz', type: 'spalte', n: 40, mode: 'section', time: 180 },
    ],
  },
  mannschaft: {
    name: 'Mannschaften / FWD (Karrierecenter)', short: 'Karrierecenter', target: 40,
    sections: [
      { area: 'analogie', n: 8, mode: 'item', time: 180 },
      { area: 'sprache', type: 'rechtschreibung', n: 20, mode: 'section', time: 400 },
      { area: 'mathe', n: 8, mode: 'item', time: 180 },
      { area: 'matrizen', n: 8, mode: 'item', time: 180 },
      { area: 'technik', n: 15, mode: 'section', time: 450, adaptive: false, penalty: true },
      { area: 'reaktion', n: 24, mode: 'block' },
      { area: 'konz', type: 'symbolrechnen', n: 8, mode: 'item', time: 60 },
      { area: 'konz', type: 'spalte', n: 40, mode: 'section', time: 180 },
    ],
  },
};

/* Einstufungstest: Aufgaben pro Bereich */
CAT.PLACEMENT_PER_AREA = 4;
