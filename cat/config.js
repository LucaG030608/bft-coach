/* Testkonfiguration. Zeiten, Aufgabenzahlen und Zielwerte sind SCHÄTZWERTE –
   die Bundeswehr veröffentlicht sie nicht. Hier anpassen, wenn du Neues erfährst. */
window.CAT = window.CAT || {};
CAT.AREAS = {
  sprache:  { name: 'Sprache / Deutsch',        time: 40, intro: 'Rechtschreibung, Grammatik, Kommasetzung, Wortanalogien und Wortbedeutungen. Wähle jeweils die richtige Antwort.' },
  mathe:    { name: 'Mathematik',               time: 75, intro: 'Rechnen ohne Taschenrechner: Kopfrechnen, Dreisatz, Prozent, Brüche, Einheiten, Textaufgaben. Nutze Stift und Papier.' },
  logik:    { name: 'Logisches Denken',         time: 55, intro: 'Zahlenreihen, Matrizen, Figurenreihen und Schlussfolgerungen. Finde die Regel und wähle die passende Fortsetzung.' },
  raum:     { name: 'Räumliches Vorstellungsvermögen', time: 60, intro: 'Würfel-Faltvorlagen, Würfel zählen und Figuren drehen. Stelle dir die Objekte im Raum vor.' },
  technik:  { name: 'Technisches Verständnis',  time: 55, intro: 'Zahnräder, Hebel, Flaschenzüge, Stromkreise und physikalisches Grundwissen.' },
  wissen:   { name: 'Allgemeinwissen',          time: 30, intro: 'Politik, Geschichte, Geografie und Bundeswehr. Wähle die richtige Antwort.' },
  konz:     { name: 'Konzentration',            time: 30, intro: 'Zeichen zählen, markieren, vergleichen und Symbole zuordnen – unter Zeitdruck. Genau und schnell arbeiten.' },
  englisch: { name: 'Englisch',                 time: 35, intro: 'Grammatik und Wortschatz. Wähle die richtige Antwort.' },
};

/* Laufbahnen: Abschnitte (Reihenfolge) + Aufgaben je Abschnitt + Orientierungs-Ziel (0–100) */
CAT.LAUFBAHNEN = {
  mannschaft: {
    name: 'Mannschaften / Freiwilliger Wehrdienst',
    target: 40,
    sections: [['sprache', 8], ['mathe', 8], ['logik', 8], ['raum', 5], ['technik', 5], ['wissen', 5], ['konz', 5]],
  },
  feldwebel: {
    name: 'Unteroffiziere / Feldwebel',
    target: 52,
    sections: [['sprache', 10], ['mathe', 10], ['logik', 10], ['raum', 6], ['technik', 7], ['wissen', 6], ['konz', 6]],
  },
  offizier: {
    name: 'Offiziere',
    target: 65,
    sections: [['sprache', 12], ['mathe', 12], ['logik', 14], ['raum', 8], ['technik', 6], ['englisch', 8], ['wissen', 5], ['konz', 5]],
  },
};

/* Einstufungstest: Aufgaben pro Bereich */
CAT.PLACEMENT_PER_AREA = 5;
