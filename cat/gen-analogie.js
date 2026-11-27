/* Wortanalogien (Kernteil des CAT, in allen Erfahrungsberichten genannt).
   Format wie in der Bundeswehr-Literatur beschrieben: A : B = C : ?, 5 Antwortmöglichkeiten.
   Aufbau: Beziehungstabellen. Jede Zeile = [C, D (richtig), Falle 1, Falle 2] – Fallen passen thematisch zu C,
   haben aber NICHT dieselbe Beziehung. Dazu kommen D-Wörter anderer Zeilen derselben Beziehung als Ablenker. */
(function (C) {
  const { pick, shuffle } = C.R;
  const REL = [
    { l: 1, name: 'Tier und seine Behausung', rows: [
      ['Vogel', 'Nest', 'Ei', 'Feder'], ['Biene', 'Bienenstock', 'Honig', 'Blüte'], ['Hund', 'Hundehütte', 'Knochen', 'Leine'],
      ['Fuchs', 'Bau', 'Wald', 'Schwanz'], ['Pferd', 'Stall', 'Sattel', 'Heu'], ['Bär', 'Höhle', 'Winterschlaf', 'Honig']] },
    { l: 1, name: 'Beruf und Arbeitsort', rows: [
      ['Arzt', 'Krankenhaus', 'Patient', 'Spritze'], ['Lehrer', 'Schule', 'Schüler', 'Tafel'], ['Bäcker', 'Backstube', 'Brot', 'Mehl'],
      ['Koch', 'Küche', 'Rezept', 'Topf'], ['Richter', 'Gericht', 'Urteil', 'Robe'], ['Soldat', 'Kaserne', 'Uniform', 'Gewehr']] },
    { l: 1, name: 'Gegenteil', rows: [
      ['heiß', 'kalt', 'warm', 'Sommer'], ['laut', 'leise', 'Lärm', 'schrill'], ['hell', 'dunkel', 'Licht', 'Lampe'], ['schnell', 'langsam', 'Auto', 'rennen'],
      ['früh', 'spät', 'Morgen', 'pünktlich'], ['voll', 'leer', 'Glas', 'halb'], ['tapfer', 'feige', 'mutig', 'Held'], ['Ebbe', 'Flut', 'Meer', 'Strand']] },
    { l: 2, name: 'Jungtier', rows: [
      ['Hund', 'Welpe', 'Knochen', 'bellen'], ['Katze', 'Kätzchen', 'miauen', 'Maus'], ['Pferd', 'Fohlen', 'Stall', 'reiten'], ['Kuh', 'Kalb', 'Milch', 'Weide'],
      ['Schaf', 'Lamm', 'Wolle', 'Hirte'], ['Huhn', 'Küken', 'Ei', 'Hahn'], ['Frosch', 'Kaulquappe', 'Teich', 'quaken']] },
    { l: 2, name: 'Teil und Ganzes', rows: [
      ['Finger', 'Hand', 'Nagel', 'Fuß'], ['Speiche', 'Rad', 'Draht', 'Nabe'], ['Seite', 'Buch', 'Papier', 'lesen'], ['Taste', 'Tastatur', 'drücken', 'Finger'],
      ['Ziegel', 'Mauer', 'Mörtel', 'rot'], ['Zahn', 'Gebiss', 'Zahnarzt', 'Bürste'], ['Halm', 'Wiese', 'grün', 'mähen']] },
    { l: 2, name: 'Unterbegriff und Oberbegriff', rows: [
      ['Tulpe', 'Blume', 'Zwiebel', 'Frühling'], ['Eiche', 'Baum', 'Holz', 'Eichel'], ['Forelle', 'Fisch', 'Bach', 'Angel'], ['Hammer', 'Werkzeug', 'Nagel', 'Stiel'],
      ['Adler', 'Vogel', 'Horst', 'Feder'], ['Gitarre', 'Instrument', 'Saite', 'Musik'], ['Mars', 'Planet', 'rot', 'Sonne'], ['Gold', 'Metall', 'Schmuck', 'gelb']] },
    { l: 2, name: 'Land und Hauptstadt', rows: [
      ['Frankreich', 'Paris', 'Lyon', 'Eiffelturm'], ['Italien', 'Rom', 'Mailand', 'Pizza'], ['Spanien', 'Madrid', 'Barcelona', 'Stierkampf'], ['Polen', 'Warschau', 'Krakau', 'Weichsel'],
      ['Österreich', 'Wien', 'Salzburg', 'Alpen'], ['Schweiz', 'Bern', 'Zürich', 'Genf'], ['Kanada', 'Ottawa', 'Toronto', 'Ahorn'], ['Australien', 'Canberra', 'Sydney', 'Känguru'],
      ['Türkei', 'Ankara', 'Istanbul', 'Bosporus'], ['Norwegen', 'Oslo', 'Bergen', 'Fjord']] },
    { l: 3, name: 'Messgerät und gemessene Größe', rows: [
      ['Thermometer', 'Temperatur', 'Fieber', 'Glas'], ['Barometer', 'Luftdruck', 'Wetter', 'Wand'], ['Waage', 'Gewicht', 'Küche', 'Teller'],
      ['Tacho', 'Geschwindigkeit', 'Auto', 'Nadel'], ['Uhr', 'Zeit', 'Zeiger', 'Wecker'], ['Kompass', 'Himmelsrichtung', 'Nadel', 'Karte']] },
    { l: 3, name: 'Ursache und Folge', rows: [
      ['Kälte', 'frieren', 'Winter', 'Schnee'], ['Hunger', 'essen', 'Magen', 'Brot'], ['Müdigkeit', 'schlafen', 'Bett', 'Nacht'],
      ['Durst', 'trinken', 'Wasser', 'Wüste'], ['Schreck', 'zusammenzucken', 'Gespenst', 'laut']] },
    { l: 3, name: 'Gegenstand und seine Funktion', rows: [
      ['Schlüssel', 'öffnen', 'Schloss', 'Bund'], ['Messer', 'schneiden', 'Gabel', 'Klinge'], ['Stift', 'schreiben', 'Papier', 'Mine'], ['Brille', 'sehen', 'Glas', 'Auge'],
      ['Besen', 'fegen', 'Staub', 'Stiel'], ['Leiter', 'steigen', 'Sprosse', 'Dach'], ['Ofen', 'heizen', 'Holz', 'Kamin']] },
    { l: 4, name: 'Steigerung (schwächer → stärker)', rows: [
      ['warm', 'heiß', 'kalt', 'Ofen'], ['Wind', 'Sturm', 'Wolke', 'Segel'], ['Hügel', 'Berg', 'Tal', 'Wiese'], ['Bach', 'Strom', 'Fisch', 'Brücke'],
      ['lächeln', 'lachen', 'Mund', 'froh'], ['Ärger', 'Wut', 'rot', 'Streit']] },
    { l: 4, name: 'Rohstoff und Erzeugnis', rows: [
      ['Wolle', 'Pullover', 'Schaf', 'stricken'], ['Mehl', 'Brot', 'Bäcker', 'Weizen'], ['Ton', 'Vase', 'Töpfer', 'Erde'], ['Trauben', 'Wein', 'Rebe', 'Fass'],
      ['Kakao', 'Schokolade', 'Bohne', 'süß'], ['Erz', 'Eisen', 'Bergwerk', 'Rost'], ['Leder', 'Gürtel', 'Kuh', 'Gerber']] },
    { l: 5, name: 'Nächsthöherer Dienstgrad', rows: [
      ['Leutnant', 'Oberleutnant', 'Offizier', 'Kompanie'], ['Feldwebel', 'Oberfeldwebel', 'Unteroffizier', 'Zug'], ['Gefreiter', 'Obergefreiter', 'Mannschaft', 'Dienst'],
      ['Hauptmann', 'Major', 'Kompaniechef', 'Oberst'], ['Major', 'Oberstleutnant', 'Stab', 'Bataillon']] },
    { l: 4, name: 'Nächstes Glied einer Reihenfolge', rows: [
      ['Montag', 'Dienstag', 'Woche', 'Arbeit'], ['Januar', 'Februar', 'Winter', 'Monat'], ['Frühling', 'Sommer', 'Blüte', 'warm'], ['Morgen', 'Mittag', 'Frühstück', 'Sonnenaufgang']] },
    { l: 5, name: 'Symbol und Bedeutung', rows: [
      ['Taube', 'Frieden', 'Vogel', 'weiß'], ['Herz', 'Liebe', 'Organ', 'rot'], ['Waage', 'Gerechtigkeit', 'Gewicht', 'Gericht'], ['Anker', 'Hoffnung', 'Schiff', 'Kette'],
      ['Lorbeer', 'Ruhm', 'Kranz', 'Gewürz'], ['Ölzweig', 'Frieden', 'Olive', 'Baum']] },
  ];

  C.register('analogie', 'analogie', 'Wortanalogien', (L) => {
    let pool = REL.filter((r) => r.l === L);
    if (!pool.length || Math.random() < 0.25) pool = REL.filter((r) => Math.abs(r.l - L) <= 1);
    const R = pick(pool);
    const [p, q] = shuffle(R.rows).slice(0, 2);
    // Dieselben D-Wörter (z. B. „Frieden“ zweimal) dürfen nicht kollidieren
    if (p[1] === q[1] || p[0] === q[0]) return null;
    const others = shuffle(R.rows.filter((r) => r !== p && r !== q && r[1] !== q[1]).map((r) => r[1]));
    const distractors = [q[2], q[3], ...others].filter((w) => w !== q[1] && w !== q[0]);
    return C.mc({
      stem: `${p[0]} : ${p[1]} = ${q[0]} : ?`, correct: q[1], distractors, n: 5, fmt: (x) => x,
      explain: `Beziehung: ${R.name}. ${p[0]} → ${p[1]}, also ${q[0]} → ${q[1]}. „${q[2]}“ und „${q[3]}“ passen nur thematisch, nicht in der Beziehung.`,
    });
  }, { weight: 1 });
})(window.CAT);
