/* Sprache (Deutsch) + Englisch */
(function (C) {
  const { pick, shuffle } = C.R;
  const A = 'sprache';

  /* ---------- Rechtschreibung: richtiges Wort + generierte Fehlschreibungen ---------- */
  const WORDS = {
    1: ['Fahrrad', 'Kaserne', 'Schlüssel', 'Bäckerei', 'Wohnung', 'Fenster', 'Gewicht', 'Erlebnis', 'Zeitung', 'Wiese', 'Kleidung', 'Geschwindigkeit', 'Spaziergang', 'Mannschaft', 'wahrscheinlich'],
    2: ['Beziehung', 'Maschine', 'Gebäude', 'Bewerbung', 'Krankenhaus', 'Abenteuer', 'Lebensmittel', 'Erfahrung', 'gefährlich', 'Verantwortung', 'Bedienung', 'Fortschritt', 'Unterschied', 'Medizin', 'Dienstag'],
    3: ['Reparatur', 'Standard', 'Atmosphäre', 'Terrasse', 'Kommission', 'Interesse', 'Satellit', 'Diskussion', 'endgültig', 'Entgelt', 'Gelände', 'Strategie', 'Tradition', 'Verwandtschaft', 'Akkumulator', 'Disziplin', 'Infanterie', 'Kompanie', 'Garnison', 'Munition', 'Manöver', 'Explosion', 'Katastrophe', 'Kalkulation', 'Pyramide'],
    4: ['Rhythmus', 'Rezension', 'Kapazität', 'Mentalität', 'Hierarchie', 'Libyen', 'Lizenz', 'Karussell', 'Hygiene', 'Maschinerie', 'Reflexion', 'Paralyse', 'Konkurrenz', 'Assistent', 'Kolonne', 'Artillerie', 'Bataillon', 'Kommandeur', 'Kapitulation', 'Korrespondenz', 'Labyrinth', 'Symmetrie', 'Psychiatrie', 'Dilemma', 'Diskrepanz'],
    5: ['Rhythmus', 'Apparat', 'Sympathie', 'Konglomerat', 'Inkognito', 'Amateur', 'Accessoire', 'Bredouille', 'Chauffeur', 'Brillant', 'Ressource', 'Dilettant', 'Renommee', 'Kavallerie', 'Akkreditierung', 'Rezeption', 'Physiotherapie', 'Szenario', 'Extremismus', 'Kontroverse', 'Pseudonym', 'Synonym', 'Hydrant', 'Quarantäne', 'Reminiszenz'],
  };
  const RULES = [
    [/ie/, 'i'], [/([^e])i([^e])/, '$1ie$2'], [/([bdfglmnprt])\1/, '$1'], [/([aeiouäöü])([lmnprt])([aeiouäöü])/, '$1$2$2$3'],
    [/ah|eh|oh|uh|äh/, (m) => m[0]], [/ä/, 'e'], [/e(?=[^i])/, 'ä'], [/ss/, 'ß'], [/ß/, 'ss'], [/dt/, 'tt'], [/t$/, 'd'], [/d$/, 't'],
    [/v/, 'f'], [/f/, 'v'], [/tz/, 'z'], [/z/, 'tz'], [/ck/, 'k'], [/k/, 'ck'], [/äu/, 'eu'], [/eu/, 'äu'], [/th/, 't'], [/rh/, 'r'],
    [/y/, 'ü'], [/ph/, 'f'], [/ei/, 'ai'], [/g(?=$|[^aeiouäöü])/, 'k'], [/b(?=[^aeiouäöüy])/, 'p'], [/a([bdfglmnrst][aeiou])/, 'ah$1'], [/o([bdfglmnrst][aeiou])/, 'oh$1'], [/ung$/, 'unk'], [/s(?=[pt])/, 'sch'], [/([^c])h/, '$1'], [/k/, 'g'], [/y/, 'i'], [/([aeiou])s([aeiou])/, '$1ss$2'], [/([^aeiou])i([^aeoun])/, '$1y$2'], [/ung$/, 'ong'], [/ü/, 'ue'], [/ent/, 'end'], [/end/, 'ent'], [/x/, 'chs'], [/c(?=[^hk])/, 'k'], [/ie$/, 'i'], [/e$/, ''],
  ];
  function misspell(w) {
    const out = new Set();
    const cap = w[0] !== w[0].toLowerCase();
    const low = w.toLowerCase();
    for (const [re, rep] of shuffle(RULES)) {
      let m = low.replace(re, rep);
      if (cap) m = m[0].toUpperCase() + m.slice(1);
      if (m !== w && m.length > 2) out.add(m);
      if (out.size >= 6) break;
    }
    return [...out];
  }
  C.register(A, 'rechtschreibung', 'Rechtschreibung', (L) => {
    const w = pick(WORDS[L]);
    const wrong = shuffle(misspell(w));
    if (wrong.length < 3) return null;
    return C.mc({ stem: 'Welche Schreibweise ist richtig?', correct: w, distractors: wrong, fmt: (x) => x, explain: `Richtig ist: ${w}.` });
  }, { weight: 1.5 });

  /* ---------- Lückensätze (Grammatik) ---------- */
  C.bank(A, 'luecke', 'Lückensätze', [
    { q: 'Ich hoffe, ___ du morgen pünktlich bist.', a: ['dass', 'das', 'was', 'daß'], l: 1, e: '„dass“ leitet einen Nebensatz ein (Konjunktion). Test: Lässt sich „dies/welches“ einsetzen? Nein → dass.' },
    { q: 'Das Auto, ___ dort parkt, gehört meinem Bruder.', a: ['das', 'dass', 'was', 'welche'], l: 1, e: 'Relativpronomen → „das“ (ersetzbar durch „welches“).' },
    { q: '___ ihr schon lange hier?', a: ['Seid', 'Seit', 'Seidt', 'Seiht'], l: 1, e: '„seid“ ist eine Form von „sein“ (ihr seid). „seit“ bezieht sich auf Zeit.' },
    { q: '___ zwei Jahren wohne ich in Köln.', a: ['Seit', 'Seid', 'Seither', 'Zeit'], l: 1, e: '„seit“ = zeitlich.' },
    { q: 'Er gab ___ Kameraden die Hand.', a: ['dem', 'den', 'des', 'der'], l: 2, e: 'Wem gab er die Hand? → Dativ: dem Kameraden.' },
    { q: 'Wir sprechen ___ Problem morgen an.', a: ['das', 'dem', 'des', 'der'], l: 2, e: 'Wen oder was? → Akkusativ: das Problem.' },
    { q: 'Der Bericht, ___ er gestern schrieb, ist fertig.', a: ['den', 'der', 'dem', 'denn'], l: 2, e: 'Er schrieb wen/was? → Akkusativ: den.' },
    { q: 'Er hat das Ziel ___ erreicht.', a: ['wieder', 'wider', 'widder', 'wiedder'], l: 2, e: '„wieder“ = erneut; „wider“ = gegen.' },
    { q: 'Das ist ___ jede Vernunft.', a: ['wider', 'wieder', 'weider', 'wiederum'], l: 3, e: '„wider“ bedeutet „gegen“.' },
    { q: '___ des schlechten Wetters fand die Übung statt.', a: ['Trotz', 'Wegen', 'Durch', 'Ohne'], l: 2, e: 'Gegensatz: Die Übung fand trotz des Wetters statt (Genitiv).' },
    { q: 'Wegen ___ Staus kamen wir zu spät.', a: ['des', 'dem', 'den', 'der'], l: 3, e: '„wegen“ verlangt in der Standardsprache den Genitiv: wegen des Staus.' },
    { q: 'Innerhalb ___ Woche muss der Antrag vorliegen.', a: ['einer', 'einem', 'eine', 'einen'], l: 3, e: '„innerhalb“ + Genitiv: innerhalb einer Woche.' },
    { q: 'Wenn ich Zeit ___, würde ich mitkommen.', a: ['hätte', 'habe', 'hatte', 'hätten'], l: 3, e: 'Irrealer Bedingungssatz → Konjunktiv II: hätte.' },
    { q: 'Er sagte, er ___ krank.', a: ['sei', 'ist', 'wäre gewesen', 'seie'], l: 4, e: 'Indirekte Rede → Konjunktiv I: er sei.' },
    { q: 'Die Ergebnisse ___ Untersuchung liegen vor.', a: ['der', 'die', 'den', 'dem'], l: 3, e: 'Wessen Ergebnisse? → Genitiv: der Untersuchung.' },
    { q: 'Sie ist größer ___ ihr Bruder.', a: ['als', 'wie', 'als wie', 'denn'], l: 2, e: 'Nach dem Komparativ steht „als“.' },
    { q: 'Sie ist genauso groß ___ ihr Bruder.', a: ['wie', 'als', 'als wie', 'so'], l: 2, e: 'Bei Gleichheit (so … wie) steht „wie“.' },
    { q: 'Der Soldat, ___ Ausrüstung fehlte, meldete sich.', a: ['dessen', 'deren', 'dem', 'der seine'], l: 4, e: 'Relativpronomen im Genitiv, bezogen auf „der Soldat“ (maskulin) → dessen.' },
    { q: 'Die Soldatin, ___ Ausrüstung fehlte, meldete sich.', a: ['deren', 'dessen', 'derer', 'die ihre'], l: 4, e: 'Genitiv, bezogen auf „die Soldatin“ (feminin) → deren.' },
    { q: 'Gestern ___ wir lange gewartet.', a: ['haben', 'sind', 'hatten gehabt', 'waren'], l: 1, e: '„warten“ bildet das Perfekt mit „haben“.' },
    { q: 'Der Zug ist pünktlich ___.', a: ['angekommen', 'angekommt', 'angekamen', 'ankommen'], l: 1, e: 'Partizip II von „ankommen“: angekommen.' },
    { q: 'Er ___ das Fenster, weil es zog.', a: ['schloss', 'schließte', 'schlosste', 'schliss'], l: 3, e: 'Präteritum von „schließen“: schloss.' },
    { q: 'Gestern ___ die Sonne den ganzen Tag.', a: ['schien', 'scheinte', 'schein', 'schiene'], l: 3, e: 'Präteritum von „scheinen“: schien.' },
    { q: 'Ich bin mir ___ Sache sicher.', a: ['der', 'die', 'den', 'dem'], l: 5, e: '„sich einer Sache sicher sein“ → Genitiv: der Sache.' },
    { q: 'Er wurde ___ Diebstahls angeklagt.', a: ['des', 'wegen dem', 'den', 'dem'], l: 5, e: '„jemanden einer Sache anklagen“ → Genitiv: des Diebstahls.' },
    { q: 'Das Ergebnis war ___ als erwartet.', a: ['besser', 'gut', 'am besten', 'guter'], l: 1, e: 'Vergleich mit „als“ → Komparativ: besser.' },
  ]);

  /* ---------- Kommasetzung ---------- */
  C.bank(A, 'komma', 'Kommasetzung', [
    { q: 'Welcher Satz ist richtig?', a: ['Die Frau, die dort steht, ist meine Tante.', 'Die Frau die dort steht, ist meine Tante.', 'Die Frau, die dort steht ist meine Tante.', 'Die Frau die dort steht ist meine Tante.'], l: 1, e: 'Ein eingeschobener Relativsatz wird vorne und hinten durch Komma abgetrennt.' },
    { q: 'Welcher Satz ist richtig?', a: ['Ich komme mit, wenn ich Zeit habe.', 'Ich komme mit wenn ich Zeit habe.', 'Ich komme, mit wenn ich Zeit habe.', 'Ich komme mit wenn, ich Zeit habe.'], l: 1, e: 'Vor einem Nebensatz mit „wenn“ steht ein Komma.' },
    { q: 'Welcher Satz ist richtig?', a: ['Er kam, sah und siegte.', 'Er kam, sah, und siegte.', 'Er kam sah und siegte.', 'Er, kam, sah und siegte.'], l: 2, e: 'Aufzählung: Komma zwischen den Gliedern, aber nicht vor „und“.' },
    { q: 'Welcher Satz ist richtig?', a: ['Anstatt zu lernen, spielte er Fußball.', 'Anstatt, zu lernen spielte er Fußball.', 'Anstatt zu lernen spielte, er Fußball.', 'Anstatt zu, lernen spielte er Fußball.'], l: 3, e: 'Infinitivgruppen mit „anstatt zu“, „um zu“, „ohne zu“ werden immer mit Komma abgetrennt.' },
    { q: 'Welcher Satz ist richtig?', a: ['Ich weiß nicht, ob er kommt.', 'Ich weiß, nicht ob er kommt.', 'Ich weiß nicht ob, er kommt.', 'Ich, weiß nicht ob er kommt.'], l: 1, e: 'Vor dem Nebensatz mit „ob“ steht ein Komma.' },
    { q: 'Welcher Satz ist richtig?', a: ['Herr Müller, unser Ausbilder, ist heute krank.', 'Herr Müller unser Ausbilder, ist heute krank.', 'Herr Müller, unser Ausbilder ist heute krank.', 'Herr Müller unser Ausbilder ist, heute krank.'], l: 3, e: 'Eine nachgestellte Erklärung (Apposition) wird beidseitig mit Komma abgetrennt.' },
    { q: 'Welcher Satz ist richtig?', a: ['Je mehr du übst, desto besser wirst du.', 'Je mehr du übst desto besser wirst du.', 'Je mehr, du übst desto besser wirst du.', 'Je mehr du, übst, desto besser wirst du.'], l: 2, e: 'Bei „je … desto“ steht ein Komma vor „desto“.' },
    { q: 'Welcher Satz ist richtig?', a: ['Es regnete, aber wir marschierten weiter.', 'Es regnete aber, wir marschierten weiter.', 'Es regnete aber wir marschierten weiter.', 'Es, regnete aber wir marschierten weiter.'], l: 2, e: 'Vor entgegensetzenden Konjunktionen (aber, sondern, doch) steht ein Komma.' },
    { q: 'Welcher Satz ist richtig?', a: ['Nachdem er gegessen hatte, ging er schlafen.', 'Nachdem er gegessen, hatte ging er schlafen.', 'Nachdem, er gegessen hatte ging er schlafen.', 'Nachdem er gegessen hatte ging er schlafen.'], l: 2, e: 'Der vorangestellte Nebensatz endet mit dem Verb – danach steht das Komma.' },
    { q: 'Welcher Satz ist richtig?', a: ['Ja, ich habe den Befehl verstanden.', 'Ja ich habe, den Befehl verstanden.', 'Ja ich habe den Befehl verstanden.', 'Ja ich, habe den Befehl verstanden.'], l: 4, e: 'Bekräftigungen wie „ja“, „nein“, „doch“ am Satzanfang werden durch Komma abgetrennt.' },
    { q: 'Welcher Satz ist richtig?', a: ['Das Training, das gestern ausfiel, wird am Freitag nachgeholt.', 'Das Training, das gestern ausfiel wird am Freitag nachgeholt.', 'Das Training das gestern ausfiel, wird am Freitag nachgeholt.', 'Das Training, das gestern, ausfiel wird am Freitag nachgeholt.'], l: 4, e: 'Eingeschobener Relativsatz → Komma davor und danach.' },
    { q: 'Welcher Satz ist richtig?', a: ['Er sagte, dass er müde sei, und ging nach Hause.', 'Er sagte, dass er müde sei und ging nach Hause.', 'Er sagte dass er müde sei, und ging nach Hause.', 'Er sagte, dass, er müde sei und ging nach Hause.'], l: 5, e: 'Der eingeschobene dass-Satz muss auch hinten geschlossen werden – auch vor „und“.' },
  ]);

  /* ---------- Wortbedeutung ---------- */
  C.bank(A, 'bedeutung', 'Wortbedeutung', [
    { q: 'Was bedeutet „pragmatisch“?', a: ['sachbezogen, praktisch handelnd', 'übertrieben genau', 'zögerlich', 'theoretisch'], l: 2 },
    { q: 'Was bedeutet „ambivalent“?', a: ['zwiespältig', 'eindeutig', 'ehrgeizig', 'gleichgültig'], l: 3 },
    { q: 'Was bedeutet „redundant“?', a: ['überflüssig, doppelt vorhanden', 'wichtig', 'fehlerhaft', 'wiederholbar'], l: 4 },
    { q: 'Was bedeutet „Prävention“?', a: ['Vorbeugung', 'Behandlung', 'Vorstellung', 'Bestrafung'], l: 2 },
    { q: 'Was bedeutet „Konsens“?', a: ['Übereinstimmung', 'Streit', 'Mehrheit', 'Beschluss eines Einzelnen'], l: 3 },
    { q: 'Was bedeutet „marode“?', a: ['heruntergekommen, verfallen', 'modern', 'feucht', 'wertvoll'], l: 3 },
    { q: 'Was bedeutet „explizit“?', a: ['ausdrücklich', 'angedeutet', 'heimlich', 'zufällig'], l: 3 },
    { q: 'Was bedeutet „Defizit“?', a: ['Mangel, Fehlbetrag', 'Überschuss', 'Gewinn', 'Ausgleich'], l: 2 },
    { q: 'Was bedeutet „Kontingent“?', a: ['zugeteilte Menge', 'Erdteil', 'Vertrag', 'Zufall'], l: 4 },
    { q: 'Was bedeutet „loyal“?', a: ['treu, zuverlässig', 'gesetzlich', 'königlich', 'misstrauisch'], l: 1 },
    { q: 'Was bedeutet „Disziplin“?', a: ['Selbstbeherrschung, Ordnung', 'Strafe', 'Unterricht', 'Fleiß'], l: 1 },
    { q: 'Was bedeutet „Indiz“?', a: ['Hinweis, Anzeichen', 'Beweis', 'Täter', 'Urteil'], l: 3 },
    { q: 'Was bedeutet „Ressource“?', a: ['Hilfsmittel, Vorrat', 'Fehler', 'Erholung', 'Rückschritt'], l: 2 },
    { q: 'Was bedeutet „subtil“?', a: ['fein, unterschwellig', 'grob', 'unter dem Tisch', 'zusätzlich'], l: 4 },
    { q: 'Was bedeutet „Präzedenzfall“?', a: ['Musterfall für spätere Entscheidungen', 'Notfall', 'Unfall mit Verletzten', 'Rechtsbruch'], l: 5 },
    { q: 'Was bedeutet „lapidar“?', a: ['knapp, kurz und bündig', 'steinhart', 'langweilig', 'nachlässig'], l: 5 },
    { q: 'Was bedeutet „obsolet“?', a: ['veraltet, überholt', 'zwingend', 'verdächtig', 'übrig'], l: 5 },
    { q: 'Was bedeutet „Kooperation“?', a: ['Zusammenarbeit', 'Firma', 'Konkurrenz', 'Vertrag'], l: 1 },
    { q: 'Was bedeutet „vage“?', a: ['unbestimmt, ungenau', 'wagemutig', 'genau', 'schwer'], l: 2 },
    { q: 'Gegenteil von „temporär“?', a: ['dauerhaft', 'vorübergehend', 'zeitlich', 'schnell'], l: 3 },
    { q: 'Gegenteil von „optimistisch“?', a: ['pessimistisch', 'realistisch', 'traurig', 'skeptisch sein'], l: 1 },
    { q: 'Gegenteil von „konkret“?', a: ['abstrakt', 'genau', 'fest', 'beton'], l: 2 },
  ]);

  /* ---------- Englisch ---------- */
  C.bank('englisch', 'grammatik', 'Grammatik', [
    { q: 'She ___ to the office yesterday.', a: ['went', 'go', 'goes', 'has gone'], l: 1, e: '„yesterday“ → simple past: went.' },
    { q: 'I ___ here since 2020.', a: ['have lived', 'live', 'lived', 'am living'], l: 2, e: '„since“ + Zeitpunkt → present perfect.' },
    { q: 'If I ___ more time, I would travel more.', a: ['had', 'have', 'would have', 'having'], l: 3, e: 'Second conditional: if + past simple.' },
    { q: 'He is ___ than his brother.', a: ['taller', 'more tall', 'tallest', 'tall'], l: 1, e: 'Comparative of short adjectives: -er.' },
    { q: 'The report ___ by the officer tomorrow.', a: ['will be written', 'will write', 'is writing', 'writes'], l: 3, e: 'Passive future: will be + past participle.' },
    { q: 'By the time we arrived, the bus ___.', a: ['had left', 'left', 'has left', 'was leaving'], l: 4, e: 'Earlier past action → past perfect.' },
    { q: 'There isn’t ___ water left.', a: ['much', 'many', 'a few', 'few'], l: 2, e: 'Uncountable noun → much.' },
    { q: 'You ___ smoke here. It is forbidden.', a: ['mustn’t', 'don’t have to', 'needn’t', 'may'], l: 3, e: 'Verbot → mustn’t. (don’t have to = nicht müssen)' },
    { q: 'I look forward to ___ from you.', a: ['hearing', 'hear', 'heard', 'be hearing'], l: 4, e: '„look forward to“ + -ing.' },
    { q: 'Neither the soldiers nor the officer ___ aware of the change.', a: ['was', 'were', 'are', 'have been'], l: 5, e: 'Bei neither … nor richtet sich das Verb nach dem näheren Subjekt (officer → was).' },
    { q: 'Hardly ___ the alarm sounded when everyone left.', a: ['had', 'has', 'did', 'was'], l: 5, e: 'Inversion nach „Hardly“: Hardly had …' },
    { q: 'He asked me where I ___.', a: ['lived', 'do live', 'did live', 'live I'], l: 4, e: 'Indirekte Frage: keine Inversion, Rückverschiebung → lived.' },
  ]);
  C.bank('englisch', 'vokabeln', 'Vokabeln', [
    { q: 'What is the German word for „reliable“?', a: ['zuverlässig', 'verantwortlich', 'erleichtert', 'religiös'], l: 2 },
    { q: 'What is the German word for „to deploy“?', a: ['einsetzen, verlegen', 'entfalten', 'zerstören', 'ablehnen'], l: 3 },
    { q: 'What does „mandatory“ mean?', a: ['verpflichtend', 'freiwillig', 'männlich', 'vorläufig'], l: 3 },
    { q: 'What does „to postpone“ mean?', a: ['verschieben', 'versenden', 'vorziehen', 'absagen'], l: 3 },
    { q: 'What does „eventually“ mean?', a: ['schließlich', 'eventuell', 'ständig', 'sofort'], l: 4, e: 'Falscher Freund: eventually = schließlich, nicht „eventuell“.' },
    { q: 'What does „sensible“ mean?', a: ['vernünftig', 'sensibel', 'empfindlich', 'sinnlos'], l: 4, e: 'Falscher Freund: sensible = vernünftig; sensibel = sensitive.' },
    { q: 'What is the English word for „Ausrüstung“?', a: ['equipment', 'armament', 'outfit store', 'gear box'], l: 2 },
    { q: 'What is the English word for „Gehorsam“?', a: ['obedience', 'obligation', 'audience', 'loyalty'], l: 4 },
    { q: 'What does „to surrender“ mean?', a: ['sich ergeben', 'umzingeln', 'überwachen', 'verteidigen'], l: 4 },
    { q: 'What is the English word for „Wetter“?', a: ['weather', 'whether', 'water', 'wether'], l: 1 },
    { q: 'What does „to become“ mean?', a: ['werden', 'bekommen', 'kommen', 'benehmen'], l: 2, e: 'Falscher Freund: become = werden; bekommen = get/receive.' },
    { q: 'What does „ubiquitous“ mean?', a: ['allgegenwärtig', 'einzigartig', 'mehrdeutig', 'unbekannt'], l: 5 },
  ]);
})(window.CAT);
