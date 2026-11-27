/* Vorwissen für den Dienstantritt – nur belegte Fakten. Quelle je Karte in „s“.
   SG = Soldatengesetz (gesetze-im-internet.de/sg), BW = bundeswehr.de (Seiten zur Heimatschutz-/Grundausbildung,
   Ausrüstung, Biwak, Waffenausbildung, Gelöbnis, Division Schnelle Kräfte, Luftlandebrigade 1), Abruf 28.11.2026.
   „allg.“ = allgemeiner Standard (z. B. NATO-Buchstabieralphabet), nicht von einer Bundeswehr-Seite. */
window.CAT = window.CAT || {};
CAT.WISSEN = [
  /* ---------- Eid & Gelöbnis ---------- */
  { k: 'eid', q: 'Wie lautet das feierliche Gelöbnis (freiwillig Wehrdienstleistende)?', a: '„Ich gelobe, der Bundesrepublik Deutschland treu zu dienen und das Recht und die Freiheit des deutschen Volkes tapfer zu verteidigen.“', s: 'SG § 9 Abs. 2' },
  { k: 'eid', q: 'Wie lautet der Diensteid (Soldaten auf Zeit und Berufssoldaten)?', a: '„Ich schwöre, der Bundesrepublik Deutschland treu zu dienen und das Recht und die Freiheit des deutschen Volkes tapfer zu verteidigen, so wahr mir Gott helfe.“', s: 'SG § 9 Abs. 1' },
  { k: 'eid', q: 'Wer gelobt und wer schwört?', a: 'Freiwillig Wehrdienstleistende legen das Gelöbnis ab („Ich gelobe“), Soldaten auf Zeit und Berufssoldaten leisten den Eid („Ich schwöre“).', s: 'SG § 9; BW Gelöbnis' },
  { k: 'eid', q: 'Muss der Zusatz „so wahr mir Gott helfe“ gesprochen werden?', a: 'Nein, der Eid kann auch ohne diese Worte geleistet werden.', s: 'SG § 9 Abs. 1' },
  { k: 'eid', q: 'Wie wird das Gelöbnis bei der Feier abgelegt?', a: 'Eine Abordnung legt die linke Hand an die Truppenfahne; der Führer spricht die Formel abschnittsweise vor, die Rekruten sprechen nach. Danach folgt die Nationalhymne.', s: 'BW Gelöbnis' },
  { k: 'eid', q: 'Wann findet das feierliche Gelöbnis statt?', a: 'Gegen Ende der Heimatschutzausbildung (früher Grundausbildung).', s: 'BW Heimatschutzausbildung' },
  { k: 'eid', q: 'Was gilt in der Formation beim Gelöbnis?', a: 'In Formation wird nicht gesprochen. Angehörige gratulieren erst nach der förmlichen Entlassung.', s: 'BW Gelöbnis' },

  /* ---------- Soldatengesetz ---------- */
  { k: 'sg', q: 'Was ist die Grundpflicht des Soldaten (§ 7 SG)?', a: 'Der Bundesrepublik Deutschland treu zu dienen und das Recht und die Freiheit des deutschen Volkes tapfer zu verteidigen.', s: 'SG § 7' },
  { k: 'sg', q: 'Wie muss ein Soldat Befehle ausführen (§ 11 SG)?', a: 'Nach besten Kräften vollständig, gewissenhaft und unverzüglich.', s: 'SG § 11 Abs. 1' },
  { k: 'sg', q: 'Wann darf ein Befehl NICHT befolgt werden?', a: 'Wenn dadurch eine Straftat begangen würde.', s: 'SG § 11 Abs. 2' },
  { k: 'sg', q: 'Wann liegt kein Ungehorsam vor, obwohl ein Befehl nicht befolgt wird?', a: 'Wenn der Befehl die Menschenwürde verletzt oder nicht zu dienstlichen Zwecken erteilt wurde.', s: 'SG § 11 Abs. 1' },
  { k: 'sg', q: 'Worauf beruht laut § 12 SG der Zusammenhalt der Bundeswehr?', a: 'Wesentlich auf Kameradschaft.', s: 'SG § 12' },
  { k: 'sg', q: 'Wozu verpflichtet die Kameradschaft (§ 12 SG)?', a: 'Die Würde, die Ehre und die Rechte des Kameraden zu achten und ihm in Not und Gefahr beizustehen.', s: 'SG § 12' },
  { k: 'sg', q: 'Welche Pflichten hat ein Vorgesetzter (§ 10 SG)?', a: 'Beispiel geben, Dienstaufsicht, Verantwortung für die Disziplin, Fürsorge für die Untergebenen, Befehle nur zu dienstlichen Zwecken – und er trägt die Verantwortung für seine Befehle.', s: 'SG § 10' },

  /* ---------- Grundausbildung / Heimatschutzausbildung ---------- */
  { k: 'ga', q: 'Wie heißt die Grundausbildung seit 2026?', a: 'Heimatschutzausbildung (früher Grund- oder Basisausbildung).', s: 'BW Heimatschutzausbildung' },
  { k: 'ga', q: 'Wie lange dauert die Heimatschutzausbildung?', a: 'In der Regel drei Monate (12 Wochen), rund 500 Ausbildungsstunden.', s: 'BW Heimatschutzausbildung, Biwak' },
  { k: 'ga', q: 'Wie lange ist die Basisausbildung beim Heer?', a: 'Sechs Monate: 12 Wochen Heimatschutzausbildung plus 12 Wochen Landstreitkräfte-Ausbildung.', s: 'BW Heimatschutzausbildung' },
  { k: 'ga', q: 'In welcher Reihenfolge läuft der Anfang der Ausbildung ab?', a: 'Einkleidung (meist erste Woche) → Formaldienst (militärische Umgangsformen) → rechtliche Grundlagen → Gefechtsdienst und Waffenausbildung.', s: 'BW Heimatschutzausbildung, Ausrüstung' },
  { k: 'ga', q: 'Welche Lernfelder gehören zur Heimatschutzausbildung?', a: 'U. a. Gefechtsdienst, Schießausbildung, Drohnen- und ABC-Abwehr, Sanitätsausbildung, Sport, militärische Sicherheit und Wachdienst, Cyber-Awareness.', s: 'BW Heimatschutzausbildung' },
  { k: 'ga', q: 'Was erwartet dich im Biwak?', a: 'Drei anstrengende Tage ohne feste Unterkunft, u. a. ein Marsch von 6 km mit rund 15 kg Gepäck, Orientierung mit Karte und Kompass, Schlafen unter freiem Himmel.', s: 'BW Biwak' },
  { k: 'ga', q: 'Welche Erste-Hilfe-Ausbildung bekommen Rekruten?', a: 'Einsatzersthelfer A.', s: 'BW Heimatschutzausbildung' },
  { k: 'ga', q: 'Wie heißt das Zimmer beim Heer und wie bei der Marine?', a: 'Heer: Stube. Marine: Kammer.', s: 'BW Heimatschutzausbildung' },
  { k: 'ga', q: 'Wie viele Ausrüstungsartikel empfängt man bei der Einkleidung ungefähr?', a: 'Über 100 Artikel.', s: 'BW Heimatschutzausbildung' },
  { k: 'ga', q: 'Wie nennen Soldaten die Schwimmbekleidung?', a: '„Blauer Blitz“.', s: 'BW Ausrüstung' },
  { k: 'ga', q: 'Wie viele Paar Kampfstiefel bekommt man?', a: 'Zwei Paar (leicht und schwer).', s: 'BW Ausrüstung' },
  { k: 'ga', q: 'Was ist das „Zwiebelschalenprinzip“ bei der Bekleidung?', a: 'Mehrere Schichten übereinander (Unterwäsche, Kälte- und Nässeschutz, Kampfjacke), die je nach Wetter an- oder ausgezogen werden.', s: 'BW Ausrüstung' },
  { k: 'ga', q: 'Was müssen Rekruten nach der Ausbildung können (Formaldienst)?', a: 'Die Dienstgrade kennen, im Gleichschritt marschieren und militärisch grüßen.', s: 'BW Fragen & Antworten' },
  { k: 'ga', q: 'Wann grüßt man im Dienst?', a: 'Nur bei der ersten Begegnung des Tages – und erst nach bestandener Grußabnahme.', s: 'BW Grundausbildung (Formaldienst)' },
  { k: 'ga', q: 'Wie ist eine Meldung an einen Vorgesetzten aufgebaut?', a: 'Anrede mit Dienstgrad des Vorgesetzten, eigener Dienstgrad und Name, dann das Anliegen – z. B. „Herr Hauptfeldwebel, Schütze Meier meldet …“. Die genaue Form wird im Formaldienst geübt.', s: 'BW Grundausbildung (Formaldienst)' },
  { k: 'ga', q: 'Wie redet man Vorgesetzte an?', a: 'Mit „Herr“ bzw. „Frau“ und dem Dienstgrad, z. B. „Frau Oberleutnant“.', s: 'allg. (Formaldienst)' },
  { k: 'ga', q: 'Mit welchem Dienstgrad beginnen alle Rekruten?', a: 'Mit dem niedrigsten: Schütze (Heer), Flieger (Luftwaffe) oder Matrose (Marine).', s: 'BW / Dienstgrad-Infografik' },

  /* ---------- Waffen ---------- */
  { k: 'waffe', q: 'Mit welchem Gewehr lernen alle Rekruten umzugehen?', a: 'Mit dem Sturmgewehr G36 oder G95.', s: 'BW Waffenausbildung' },
  { k: 'waffe', q: 'Welche Pistole wird in der Ausbildung genutzt?', a: 'Die Pistole P8.', s: 'BW Waffenausbildung' },
  { k: 'waffe', q: 'Welches Kaliber hat das G36?', a: '5,56 × 45 mm.', s: 'BW Waffenausbildung' },
  { k: 'waffe', q: 'Wie viele Patronen fasst das Magazin des G36?', a: '30 Patronen.', s: 'BW Waffenausbildung' },
  { k: 'waffe', q: 'Wie schwer ist das G36A1?', a: '4,1 kg.', s: 'BW Waffenausbildung' },
  { k: 'waffe', q: 'In welcher Reihenfolge läuft die Waffenausbildung ab?', a: 'Simulator → Grundlagen (Ballistik, Funktion) → Zerlegen und Zusammensetzen → Trockenübungen (Laden, Entladen, Störungen) → zum Schluss der scharfe Schuss.', s: 'BW Waffenausbildung' },
  { k: 'waffe', q: 'Wie läuft ein Schießtag ab?', a: 'Antreten → Waffencheck → Einweisung → Feuerbereitschaft → „Feuer!“ → Erfolgskontrolle → Sichern.', s: 'BW Waffenausbildung' },

  /* ---------- Bundeswehr allgemein ---------- */
  { k: 'bw', q: 'Welche Teilstreitkräfte hat die Bundeswehr?', a: 'Vier: Heer, Luftwaffe, Marine und Cyber- und Informationsraum – dazu der Unterstützungsbereich.', s: 'BW Organisation / BMVg' },
  { k: 'bw', q: 'Was wurde Anfang 2025 im Unterstützungsbereich zusammengeführt?', a: 'Die Streitkräftebasis und der Zentrale Sanitätsdienst.', s: 'BMVg Strukturreform' },
  { k: 'bw', q: 'Wer muss bewaffneten Auslandseinsätzen zustimmen?', a: 'Der Deutsche Bundestag (Parlamentsarmee).', s: 'BW / GG' },
  { k: 'bw', q: 'Wer hat in Friedenszeiten die Befehls- und Kommandogewalt?', a: 'Der Bundesminister bzw. die Bundesministerin der Verteidigung (Art. 65a GG); im Verteidigungsfall der Bundeskanzler (Art. 115b GG).', s: 'Grundgesetz' },
  { k: 'bw', q: 'Was bedeutet „Innere Führung“?', a: 'Das Leitbild der Bundeswehr vom „Staatsbürger in Uniform“ – Soldaten behalten ihre Grundrechte und handeln aus Überzeugung.', s: 'BW' },
  { k: 'bw', q: 'Wann wurde die Bundeswehr gegründet?', a: '1955.', s: 'BW Geschichte' },
  { k: 'bw', q: 'Was ist der/die Wehrbeauftragte?', a: 'Ein Hilfsorgan des Bundestages, das die Grundrechte der Soldaten schützt; jeder Soldat darf sich direkt an ihn bzw. sie wenden.', s: 'GG Art. 45b' },
  { k: 'bw', q: 'Was bedeutet „Unteroffizier mit Portepee“?', a: 'Die Feldwebel-Dienstgrade (Feldwebel bis Oberstabsfeldwebel bzw. Bootsmann bis Oberstabsbootsmann, dazu Fähnrich und Oberfähnrich).', s: 'Dienstgrad-Infografik' },
  { k: 'bw', q: 'Woran erkennt man Unteroffizier-, Feldwebel- und Offizieranwärter (Heer/Luftwaffe)?', a: 'UA: zusätzlicher waagerechter Balken. FA: altgoldfarbene Kordel. OA: silberfarbene Kordel.', s: 'Dienstgrad-Infografik' },
  { k: 'bw', q: 'Woran erkennt man Maat-, Bootsmann- und Offizieranwärter (Marine)?', a: 'MA: ein waagerechter Balken. BA: zwei waagerechte Balken. OA: ein Seestern.', s: 'Dienstgrad-Infografik' },

  /* ---------- Fallschirmjäger ---------- */
  { k: 'fj', q: 'Zu welcher Division gehören die Fallschirmjäger?', a: 'Zur Division Schnelle Kräfte (DSK).', s: 'BW DSK' },
  { k: 'fj', q: 'Wo sitzt der Stab der Division Schnelle Kräfte?', a: 'In Stadtallendorf (Hessen).', s: 'BW DSK' },
  { k: 'fj', q: 'Wie lautet das Motto der Division Schnelle Kräfte?', a: '„Einsatzbereit – jederzeit – weltweit“.', s: 'BW DSK' },
  { k: 'fj', q: 'In welcher Brigade sind alle Fallschirmjäger der Bundeswehr zusammengefasst?', a: 'In der Luftlandebrigade 1 – der einzigen Luftlandebrigade des Heeres.', s: 'BW Luftlandebrigade 1' },
  { k: 'fj', q: 'Wo hat die Luftlandebrigade 1 ihren Stab?', a: 'In Saarlouis (Saarland), Graf-Werder-Kaserne.', s: 'BW Luftlandebrigade 1' },
  { k: 'fj', q: 'Welche Fallschirmjägerregimenter gibt es?', a: 'Fallschirmjägerregiment 26 und Fallschirmjägerregiment 31.', s: 'BW Luftlandebrigade 1' },
  { k: 'fj', q: 'Wo ist das Fallschirmjägerregiment 26 stationiert?', a: 'In Zweibrücken (Rheinland-Pfalz) und Merzig (Saarland).', s: 'BW FschJgRgt 26' },
  { k: 'fj', q: 'Wo ist das Fallschirmjägerregiment 31 stationiert?', a: 'In Seedorf (Niedersachsen).', s: 'BW FschJgRgt 31' },
  { k: 'fj', q: 'Nach welchen Grundsätzen kämpfen Fallschirmjäger?', a: 'Nach den Grundsätzen der Infanterie; sie stellen den Kern der Spezialisierten Kräfte.', s: 'BW Luftlandebrigade 1' },
  { k: 'fj', q: 'Welche weiteren Verbände gehören zur Division Schnelle Kräfte?', a: 'U. a. das Kommando Spezialkräfte (Calw), die Gebirgsjägerbrigade 23 (Bad Reichenhall), das Kommando Hubschrauber (Bückeburg) und die niederländische 11. Luchtmobiele Brigade.', s: 'BW DSK' },
];

/* NATO-Buchstabieralphabet (ICAO-Standard, wird in der Ausbildung verlangt) */
CAT.NATO = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-Ray', 'Yankee', 'Zulu'];

CAT.WISSEN_KAT = {
  dg: 'Dienstgrade', nato: 'NATO-Buchstabieralphabet', eid: 'Eid & Gelöbnis', sg: 'Soldatengesetz – Pflichten', ga: 'Heimatschutzausbildung & Formaldienst',
  waffe: 'Waffen', bw: 'Bundeswehr allgemein', fj: 'Fallschirmjäger & Division Schnelle Kräfte',
};
