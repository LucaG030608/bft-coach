/* Vorwissen, Teil 2 – Quellen: Y-Magazin „Lifehacks und Pro-Tipps für deinen Wehrdienst“ (bundeswehr.de),
   Zentralrichtlinie A2-2630/0-0-3 „Militärische Formen und Feiern der Bundeswehr“ (Stand 2016, via FragDenStaat),
   Packlisten der Karrierecenter (bundeswehr.de), bundeswehr.de-Artikel zu Fallschirmjägern. Abruf 28.11.2026. */
(function (C) {
  const Y = 'Y-Magazin „Lifehacks“ (bundeswehr.de)';
  const Z = 'Richtlinie A2-2630/0-0-3 (2016)';
  const add = [
    /* ---------- Gruß, Meldung, Anrede ---------- */
    { k: 'gruss', q: 'Wie steht man in der Grundstellung (Füße)?', a: 'Hacken aneinander, Fußspitzen etwa 60 Grad nach außen, Gewicht gleichmäßig auf beiden Füßen.', s: Y },
    { k: 'gruss', q: 'Wie hält man in der Grundstellung Arme, Hände und Kopf?', a: 'Arme hängen herab, etwa eine Handbreite zwischen Ellenbogen und Körper; Finger ausgestreckt und geschlossen, Handflächen an der Außenseite der Oberschenkel; Kopf aufrecht, Blick geradeaus, Mund geschlossen.', s: Y },
    { k: 'gruss', q: 'Wie wird der Handgruß ausgeführt?', a: 'Aus der Grundstellung die rechte Hand schwungvoll an die rechte Schläfe bzw. den Rand der Kopfbedeckung führen, Handteller leicht nach unten, Finger geschlossen.', s: Y },
    { k: 'gruss', q: 'Ab wann darf ein Rekrut militärisch grüßen?', a: 'Erst nach erfolgter Grußabnahme.', s: Y },
    { k: 'gruss', q: 'Wen grüßt man bei JEDER Begegnung – auch in Zivil?', a: 'Bundespräsident(in), Bundeskanzler(in) und Verteidigungsminister(in); laut Richtlinie auch Staatsoberhäupter und Regierungschefs anderer Staaten.', s: Y + '; ' + Z + ' Rn 610' },
    { k: 'gruss', q: 'Wen grüßt man nur bei der ersten Begegnung am Tag?', a: 'U. a. Generale und Admirale, unmittelbare Vorgesetzte, den Kompaniefeldwebel und alle Soldaten einer höheren Dienstgradgruppe in Uniform. Danach genügt ein verbaler Gruß oder Nicken.', s: Z + ' Rn 609; ' + Y },
    { k: 'gruss', q: 'Wann entfällt der Handgruß?', a: 'U. a. beim Tragen von Gepäck, in Speisesälen und Kantinen, in Gemeinschafts-, Sanitäts-, Wasch- und Toilettenräumen, beim Sport, bei Arbeiten an Fahrzeugen/Waffen und in geschlossenen Formationen (dort grüßt der Führer).', s: Y + '; ' + Z + ' Rn 612–620' },
    { k: 'gruss', q: 'Wann grüßt man unabhängig von Personen?', a: 'U. a. bei Nationalhymnen, Flaggenparaden, vor Truppenfahnen, bei Trauer- und Gedenkfeiern und bei Meldungen an Vorgesetzte.', s: Z + ' Rn 611' },
    { k: 'gruss', q: 'Was passiert, wenn der unmittelbare Vorgesetzte die Stube betritt?', a: 'Wer ihn zuerst bemerkt, ruft „Achtung!“; alle nehmen Grundstellung mit Front zum Vorgesetzten ein, der Rufende grüßt und meldet gegebenenfalls. Beim Umkleiden und beim Umgang mit Waffen entfällt das „Achtung!“.', s: Z + ' Rn 613' },
    { k: 'gruss', q: 'Wie lautet die Meldung bei der Stubenkontrolle?', a: '„Herr/Frau [Dienstgrad], [eigener Dienstgrad] [Name], melde Stube X mit Y Soldaten belegt, alle anwesend. Stube gereinigt, gelüftet und zur Abnahme bereit.“', s: Y },
    { k: 'gruss', q: 'Wie läuft eine persönliche Meldung ab?', a: 'Drei Schritte Abstand, Grundstellung, grüßen, melden. Nach der Entlassung erneut grüßen, Kehrtwendung, wegtreten. In geschlossenen Räumen vorher die Kopfbedeckung abnehmen.', s: Y },
    { k: 'gruss', q: 'Wer bekommt die Meldung, wenn mehrere Vorgesetzte anwesend sind?', a: 'Die dienstgradhöchste Person.', s: Y },
    { k: 'gruss', q: 'Wann trägt man die Kopfbedeckung?', a: 'Im Freien grundsätzlich immer (auch in der Kaserne); in geschlossenen Räumen wird sie abgenommen. Ausnahme: Flugbetriebsbereiche – dort ist meist befohlen, keine zu tragen (Triebwerke).', s: Y },
    { k: 'gruss', q: 'Werden Dienstgrade gegendert?', a: 'Nein – „Frau Hauptmann“, nicht „Hauptfrau“.', s: Y },
    { k: 'gruss', q: 'Wie werden Stabsoffiziere der Marine angesprochen?', a: '„Frau/Herr Kap’tän“ (umgangssprachlich auch „Kaleu“ für Kapitänleutnant).', s: Z + ' Rn 622' },
    { k: 'gruss', q: 'Wohin mit den Händen, wenn man wartet?', a: 'Nie in die Hosentaschen und nicht an Wände lehnen – hinter dem Rücken das Handgelenk der einen Hand mit der anderen umgreifen.', s: Y },

    /* ---------- Kommandos (Wortlaut aus der Richtlinie; die Formaldienstordnung selbst ist nicht öffentlich) ---------- */
    { k: 'kdo', q: 'Woraus besteht ein Kommando?', a: 'Aus Ankündigungskommando (wer ist gemeint) und Ausführungskommando (löst die Bewegung aus), z. B. „Ehrenzug – stillgestanden!“.', s: Z },
    { k: 'kdo', q: 'Was bedeutet „… – stillgestanden!“?', a: 'Grundstellung einnehmen.', s: Z },
    { k: 'kdo', q: 'Was bedeutet „… – rührt Euch!“?', a: 'Aus der Grundstellung in die lockerere Rührt-euch-Haltung gehen.', s: Z },
    { k: 'kdo', q: 'Was bedeutet „Augen – rechts!“ und wie wird es aufgehoben?', a: 'Blickwendung nach rechts (z. B. zur Meldung); aufgehoben mit „Augen gerade – aus!“.', s: Z },
    { k: 'kdo', q: 'Mit welchem Kommando beginnt der Gruß einer angetretenen Formation – womit endet er?', a: '„Achtung – präsen – tiert!“ – Ende mit „Hand – ab!“.', s: Z + ' Anl. 9.14' },
    { k: 'kdo', q: 'Wie lauten die Kommandos zum Marschieren und Anhalten?', a: '„Im Gleichschritt – marsch!“ und „Abteilung – halt!“.', s: Z + ' Anl. 9.1, 9.17' },
    { k: 'kdo', q: 'In welchen Abschnitten wird das Gelöbnis bei der Feier vor- und nachgesprochen?', a: '„Ich gelobe! – Der Bundesrepublik Deutschland – treu zu dienen – und das Recht – und die Freiheit des deutschen Volkes – tapfer zu verteidigen!“', s: Z + ' Anl. 9.1' },

    /* ---------- Waffen-Sicherheit & Schießtechnik ---------- */
    { k: 'waffe', q: 'Sicherheitsregel 1?', a: '„Betrachte jede Waffe immer als geladen!“', s: Y },
    { k: 'waffe', q: 'Sicherheitsregel 2?', a: '„Richte eine Waffe nie auf etwas, das du nicht treffen willst!“', s: Y },
    { k: 'waffe', q: 'Sicherheitsregel 3?', a: '„Dein Abzugsfinger berührt den Abzug erst, wenn die Visiereinrichtung auf das Ziel gerichtet ist!“', s: Y },
    { k: 'waffe', q: 'Sicherheitsregel 4?', a: '„Sei dir deines Zieles sicher!“', s: Y },
    { k: 'waffe', q: 'Die fünf Elemente der Schießtechnik – in der richtigen Reihenfolge?', a: '1 Greifen, 2 Anschlagen, 3 Zielen, 4 Atmen, 5 Abkrümmen.', s: Y },

    /* ---------- Truppengrößen ---------- */
    { k: 'truppe', q: 'Wie stark ist ein Trupp?', a: '4–5 Soldaten (mindestens 2). Zeichen: ein Punkt.', s: Y },
    { k: 'truppe', q: 'Wie stark ist eine Gruppe?', a: '10–12 Soldaten. Zeichen: zwei Punkte.', s: Y },
    { k: 'truppe', q: 'Wie stark ist ein Zug?', a: '12–40 Soldaten. Zeichen: drei Punkte.', s: Y },
    { k: 'truppe', q: 'Wie stark ist eine Kompanie (Batterie, Staffel, Inspektion)?', a: '80–300 Soldaten. Zeichen: I.', s: Y },
    { k: 'truppe', q: 'Wie stark ist ein Bataillon (Abteilung)?', a: '300–1.200 Soldaten. Zeichen: II.', s: Y },
    { k: 'truppe', q: 'Wie stark ist ein Regiment (Geschwader)?', a: '600–4.800 Soldaten. Zeichen: III.', s: Y },
    { k: 'truppe', q: 'Wie stark ist eine Brigade?', a: '1.500–5.000 Soldaten. Zeichen: X.', s: Y },
    { k: 'truppe', q: 'Wie stark ist eine Division?', a: '10.000–30.000 Soldaten. Zeichen: XX.', s: Y },
    { k: 'truppe', q: 'Wie stark ist ein Korps?', a: '40.000–80.000 Soldaten. Zeichen: XXX.', s: Y },

    /* ---------- Rechte & Pflichten (Erweiterung) ---------- */
    { k: 'sg', q: 'Was verlangt § 8 SG?', a: 'Die freiheitliche demokratische Grundordnung anzuerkennen und durch das gesamte Verhalten für ihre Erhaltung einzutreten.', s: Y },
    { k: 'sg', q: 'Was ist die Verschwiegenheitspflicht (§ 14 SG)?', a: 'Über dienstliche Angelegenheiten Stillschweigen bewahren, soweit sie nicht zur Veröffentlichung bestimmt sind.', s: Y },
    { k: 'sg', q: 'Was verlangt die Wohlverhaltenspflicht (§ 17 SG)?', a: 'Dienstliches und außerdienstliches Verhalten muss dem Ansehen der Bundeswehr sowie der Achtung und dem Vertrauen gerecht werden, die der Dienst erfordert.', s: Y },
    { k: 'sg', q: 'Welche staatsbürgerlichen Rechte hat ein Soldat (§ 6 SG)?', a: 'Grundsätzlich dieselben wie jeder Bürger – z. B. Meinungsfreiheit, politische Betätigung und Wahlrecht.', s: Y },
    { k: 'sg', q: 'Was regelt § 31 SG?', a: 'Die Fürsorgepflicht: Der Dienstherr sorgt für Soldat(in) und Familie, z. B. durch Heilfürsorge.', s: Y },
    { k: 'sg', q: 'Wo ist das Beschwerderecht geregelt?', a: 'In der Wehrbeschwerdeordnung (§ 1 WBO): Beschwerde bei unrichtiger Behandlung durch Vorgesetzte.', s: Y },
    { k: 'sg', q: 'Wen informiert man zuerst, wenn man außerhalb des Dienstes krank wird?', a: 'Sofort den Unteroffizier vom Dienst (UvD) oder die Kompanie anrufen.', s: Y },
    { k: 'sg', q: 'Welche Nummer hat der Bereitschaftsdienst des Sanitätsdienstes?', a: '0800 972 6378 – zivile Ärzte nur im absoluten Notfall, wenn kein Truppenarzt erreichbar ist.', s: Y },
    { k: 'sg', q: 'Was macht man mit einer zivilen Krankschreibung?', a: 'Sofort die Stammeinheit anrufen; sobald reisefähig, das Original bei der nächsten Sanitätseinrichtung vorlegen und den Krankenschein bei der Stammeinheit abgeben.', s: Y },
    { k: 'sg', q: 'An wen kann man sich bei Problemen wenden?', a: 'Disziplinarvorgesetzte (erste Ansprechperson), Vertrauensperson, Gleichstellungsbeauftragte, Militärseelsorge, Sozialdienst, Truppenarzt, Psychologischer Dienst, Wehrbeauftragte(r) – Letztere ohne Dienstweg.', s: Y },

    /* ---------- Praxis-Tipps ---------- */
    { k: 'praxis', q: 'Welche vier Bekleidungsschichten gibt es?', a: 'Basis-, Isolations-, Funktions- und Extremschicht.', s: Y },
    { k: 'praxis', q: 'Welches Material gehört NICHT in die Basisschicht – und warum?', a: 'Baumwolle: saugt sich voll, trocknet kaum und kühlt in der Ruhe aus. Besser Merino oder Synthetik.', s: Y },
    { k: 'praxis', q: 'Was ist das „Start-Cold-Prinzip“?', a: 'Beim Abmarsch darf man leicht frösteln – die Isolationsschicht kommt in den Rucksack und wird erst in Pausen angezogen.', s: Y },
    { k: 'praxis', q: 'Warum öffnet man bei Gore-Tex die Reißverschlüsse unter den Achseln?', a: 'Bei Anstrengung lässt Gore-Tex zu wenig Schweiß durch – die Unterarmbelüftung hilft.', s: Y },
    { k: 'praxis', q: 'Warum keinen Weichspüler für die Ausrüstung?', a: 'Die Tenside mindern Elastizität und Atmungsaktivität, der Schweißtransport wird schlechter.', s: Y },
    { k: 'praxis', q: 'Wie schläft man im Schlafsack warm?', a: 'Nicht in voller Uniform, sondern bis auf die lange Unterwäsche ausziehen; die Uniform für morgen einrollen und als Kopfkissen oder ans Fußende in den Schlafsack legen.', s: Y },
    { k: 'praxis', q: 'Wie beugt man Blasen vor?', a: 'Fußpuder, Pflaster/Tape vorab auf Fersen und Zehen, Antiblasensocken bzw. Nylonstrümpfe unter den Socken – und immer trockene Füße.', s: Y },
    { k: 'praxis', q: 'Wie packt man den Rucksack?', a: 'Schweres nah am Rücken in Schulterhöhe, Weiches nach unten, oft Benötigtes ganz nach oben; Kompressionsriemen straff; Wechselkleidung in Gefrierbeutel.', s: Y },
    { k: 'praxis', q: 'Wie faltet man T-Shirts spindgerecht?', a: 'Mit einer A4-Pappe als Schablone: auf den Rücken legen, Seiten und Ärmel einklappen, Schablone herausziehen, unten hochklappen – ergibt A4-Format.', s: Y },
    { k: 'praxis', q: 'Was bedeutet „Erst das Material, dann der Mensch“?', a: 'Nach Dienstende werden zuerst Ausrüstung und der nächste Tag vorbereitet – erst dann ist Feierabend.', s: Y },
    { k: 'praxis', q: 'Was sollte man immer zum Mitschreiben dabeihaben?', a: 'Einen kleinen Notizblock mit Bleistift, Radiergummi und Spitzer – Namen, Räume, Zeiten und Abkürzungen notieren.', s: Y },
    { k: 'praxis', q: 'Wie geht man mit lautem Tadel um?', a: 'Tadel gilt dem Fehler, nicht der Person; Ausbilder testen die Belastbarkeit – Ton „auf Durchzug“, Inhalt aber heraushören.', s: Y },
    { k: 'praxis', q: 'Nach wie vielen Tagen fällt vielen Neuen die Ausbildung leichter?', a: 'Nach etwa zehn Tagen.', s: Y },
    { k: 'praxis', q: 'Wie trainiert man vor dem Dienstantritt sinnvoll?', a: 'Grundfitness: Gehen mit Gepäck, lockeres Laufen, Kraftausdauer, Rumpfstabilität – auf Ausdauer, nicht auf Höchstleistung.', s: Y },
    { k: 'praxis', q: 'Wie viele Positionen hat die Spindvorlage im Y-Magazin – was gehört z. B. hinein?', a: 'Zehn, u. a. Gefechtshelm, Knieprotektoren, Rucksacksystem, Privatfach, Kampfjacke, Kälteschutzjacke, Schreibzeug, Sportsachen, „Blauer Blitz“ und Kampfstiefel.', s: Y },

    /* ---------- Packlisten ---------- */
    { k: 'pack', q: 'Was bringt man zum Assessment im Karrierecenter mit?', a: 'Personalausweis/Pass, Führerschein, Einladungsschreiben, fehlende Bewerbungsunterlagen, Unterlagen für die ärztliche Untersuchung, Kugelschreiber, Medikamente; gepflegte Zivilkleidung.', s: 'Packliste Assessment, KarrC Mainz (09.04.2026)' },
    { k: 'pack', q: 'Was braucht man für den sportlichen Teil der Eignungsfeststellung?', a: 'Sportanzug, saubere Hallenschuhe, Badeschuhe und Schreibzeug.', s: 'Bewerberbroschüre KarrC München' },
    { k: 'pack', q: 'Welche Dokumente gehören zum Start der Grundausbildung ins Gepäck?', a: 'Einberufungsbescheid und Personalausweis, dazu EC-Karte, Bargeld für die ersten 2–3 Wochen sowie Impf- und Allergiepass.', s: 'Packliste Grundausbildung (bundeswehr.de)' },
    { k: 'pack', q: 'Welche Kleidung bringt man zur Grundausbildung selbst mit?', a: 'Unterwäsche für 2–3 Wochen, weiße Sportsocken, private Sportschuhe und Badelatschen – die Einkleidung kann 1–2 Tage dauern.', s: 'Packliste Grundausbildung (bundeswehr.de)' },
    { k: 'pack', q: 'Was gehört sonst noch auf die Packliste zur Grundausbildung?', a: 'Hygieneartikel, Medikamente, Handwaschmittel, Smartphone mit Ladegerät und eine kleine Taschenlampe.', s: 'Packliste Grundausbildung (bundeswehr.de)' },

    /* ---------- Fallschirmjäger (Erweiterung) ---------- */
    { k: 'fj', q: 'Wo werden Fallschirmspringer der Bundeswehr ausgebildet?', a: 'An der Luftlande-/Lufttransportschule in Altenstadt (Teil der Infanterieschule).', s: 'BW Luftlande-/Lufttransportschule' },
    { k: 'fj', q: 'Welche Kommandos gibt der Absetzer vor dem Sprung?', a: '„Fifteen minutes“, „Three minutes“, „Stand-by“ und „Go!“.', s: 'BW „Mit dem Fallschirm zur Arbeit“ (2023)' },
    { k: 'fj', q: 'Aus welcher Höhe springen Fallschirmjäger beim automatischen Sprung ungefähr?', a: 'Aus rund 500 m über Grund bei etwa 250 km/h; der Schirm öffnet automatisch über die Aufziehleine.', s: 'BW „Mit dem Fallschirm zur Arbeit“ (2023)' },
    { k: 'fj', q: 'Was ist der Unterschied zwischen Lizenzsprung und Gefechtssprung?', a: 'Der Lizenzsprung dient dem Lizenzerhalt (einfachste Stufe); beim Gefechtssprung wird zusätzlich das taktische Verhalten nach der Landung geübt.', s: 'BW „Mit dem Fallschirm zur Arbeit“ (2023)' },
    { k: 'fj', q: 'Was ist für die Fallschirmjägertruppe unverzichtbar?', a: 'Springtauglichkeit und die Bereitschaft, aus Flugzeugen zu springen – dazu körperliche und mentale Fitness.', s: 'BW „Traumberuf Fallschirmjägeroffizier“ (2023)' },
    { k: 'fj', q: 'Wie lange dauert der Fallschirmspringerlehrgang (Angabe aus der Offizierausbildung)?', a: 'Sechs Wochen.', s: 'BW „Traumberuf Fallschirmjägeroffizier“ (2023)' },

    /* ---------- Bundeswehr allgemein (Erweiterung) ---------- */
    { k: 'bw', q: 'Woran unterscheiden sich die Dienstgradabzeichen von Heer und Luftwaffe?', a: 'Nur an den Schwingen am unteren Rand der Luftwaffen-Abzeichen.', s: Y },
    { k: 'bw', q: 'Woran erkennt man Angehörige des Cyber- und Informationsraums?', a: 'Am marineblauen Barett mit Barettabzeichen – eigene Dienstgradabzeichen gibt es nicht.', s: Y },
    { k: 'bw', q: 'Was zeigt die Litze auf der Schulterklappe im Heer?', a: 'Die Truppengattung (z. B. Infanterie, Panzertruppe, Artillerietruppe).', s: Y },
    { k: 'bw', q: 'Wofür steht UvD?', a: 'Unteroffizier vom Dienst.', s: Y },
  ];
  C.WISSEN.push(...add);

  /* Merkwörter (Y-Magazin, S. 16–17) */
  C.MERK = [
    { w: 'EREZA', t: 'Feuerkommando', l: [['E', 'Einheit'], ['R', 'Richtung'], ['E', 'Entfernung'], ['Z', 'Ziel'], ['A', 'Ausführung']] },
    { w: 'FAST', t: 'Tätigkeiten in jeder Stellung', l: [['F', 'Feuerbereitschaft'], ['A', 'Auflockerung'], ['S', 'Schanzen'], ['T', 'Tarnung']] },
    { w: 'ASCHUFTA', t: 'Stellungswahl', l: [['A', 'Auftrag'], ['SCH', 'Schussfeld'], ['U', 'Untergrund'], ['F', 'Feuerunterstützung/Feuerregelung'], ['T', 'Tarnung/Deckung'], ['A', 'An- und Abmarschwege']] },
    { w: 'EMMA', t: 'Verhalten beim Auffinden von Kampfmitteln/Minensperren', l: [['E', 'Erkennen'], ['M', 'Melden'], ['M', 'Markieren'], ['A', 'Ausweichen']] },
    { w: 'FNAKI', t: 'Gefechtsbefehl', l: [['F', 'Feind'], ['N', 'Nachbarn'], ['A', 'Absicht'], ['K', 'Kampfaufträge'], ['I', 'Ich befinde mich …']] },
    { w: 'REHLZ', t: 'Zielansprache', l: [['R', 'Richtung'], ['E', 'Entfernung'], ['H', 'Hilfsziel'], ['L', 'Lage zum Ziel'], ['Z', 'Ziel']] },
    { w: 'TOZZ', t: 'Nicht offen über Funk mitteilen', l: [['T', 'Truppenangaben'], ['O', 'Ortsangaben'], ['Z', 'Zahlenangaben'], ['Z', 'Zeitangaben']] },
    { w: 'VENÜ', t: 'Methode der militärischen Ausbildung', l: [['V', 'Vormachen'], ['E', 'Erklären'], ['N', 'Nachmachen'], ['Ü', 'Üben']] },
    { w: 'ALÜHREF', t: 'Absprache zur Überwachung (Streife, Spähtrupp, Alarmposten)', l: [['A', 'Auftrag'], ['L', 'Letzte Feindmeldung (Lage)'], ['Ü', 'Überwachungsmöglichkeiten'], ['H', 'Hin- und Rückweg'], ['R', 'Rückkehrzeit'], ['E', 'Erkennungszeichen (Tag/Nacht)'], ['F', 'Funkverbindung, Parole, Decknamen']] },
    { w: 'LANGEMARK', t: 'Anhalt zum Ablösegespräch', l: [['L', 'Lage'], ['A', 'Auftrag'], ['N', 'Nachbarn'], ['G', 'Grenzen'], ['E', 'Eröffnungslinie des Feuers'], ['M', 'Meldung'], ['A', 'Alarmierung und Ablösung'], ['R', 'Rückwärtiger Raum/Platz des Führers'], ['K', 'Kennwort/Parole']] },
  ];
  /* Zahlen im Sprechfunk (Y-Magazin) */
  C.NATO_ZAHLEN = [['0', 'Nadazero'], ['1', 'Unaone'], ['2', 'Bissotwo'], ['3', 'Terrathree'], ['4', 'Kartefour'], ['5', 'Pantafive'], ['6', 'Soxisix'], ['7', 'Setteseven'], ['8', 'Oktoeight'], ['9', 'Novenine']];

  C.WISSEN_KAT = {
    dg: 'Dienstgrade', gruss: 'Gruß, Meldung & Anrede', kdo: 'Kommandos', nato: 'NATO-Alphabet & Zahlen', merk: 'Merkwörter (EREZA, FAST …)',
    eid: 'Eid & Gelöbnis', sg: 'Rechte & Pflichten', ga: 'Heimatschutzausbildung', waffe: 'Waffen & Schießtechnik', truppe: 'Truppengrößen',
    praxis: 'Praxis-Tipps (Kleidung, Spind, Rucksack)', pack: 'Packlisten', bw: 'Bundeswehr allgemein', fj: 'Fallschirmjäger & Division Schnelle Kräfte',
  };
})(window.CAT);
