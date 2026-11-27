/* Technisches Verständnis: Zahnräder, Hebel, Flaschenzug, Stromkreis, Physik-Wissen */
(function (C) {
  const { int, pick, shuffle, chance } = C.R;
  const A = 'technik';
  const INK = 'currentColor';

  function gear(cx, cy, r, teeth, label, arrow) {
    let d = '';
    const n = teeth * 2;
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2, rr = i % 2 ? r : r + 6;
      d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a0)).toFixed(1) + ' ' + (cy + rr * Math.sin(a0)).toFixed(1) + 'L' + (cx + rr * Math.cos(a1)).toFixed(1) + ' ' + (cy + rr * Math.sin(a1)).toFixed(1);
    }
    let s = `<path d="${d}Z" style="fill:var(--cell-bg,#fff)" stroke="${INK}" stroke-width="1.5"/><circle cx="${cx}" cy="${cy}" r="4" fill="${INK}"/><text x="${cx}" y="${cy + r * 0.55}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${label}</text>`;
    if (arrow) {
      const cw = arrow === 'cw', R = r + 14;
      const a0 = -2.2, a1 = -0.9;
      const [s0, s1] = cw ? [a0, a1] : [a1, a0];
      const end = [cx + R * Math.cos(s1), cy + R * Math.sin(s1)];
      s += `<path d="M${(cx + R * Math.cos(s0)).toFixed(1)} ${(cy + R * Math.sin(s0)).toFixed(1)}A${R} ${R} 0 0 ${cw ? 1 : 0} ${end[0].toFixed(1)} ${end[1].toFixed(1)}" fill="none" stroke="#3f7a4b" stroke-width="2.5"/>`;
      const tang = cw ? s1 + Math.PI / 2 : s1 - Math.PI / 2;
      const p1 = [end[0] - 8 * Math.cos(tang) + 5 * Math.cos(tang + Math.PI / 2), end[1] - 8 * Math.sin(tang) + 5 * Math.sin(tang + Math.PI / 2)];
      const p2 = [end[0] - 8 * Math.cos(tang) - 5 * Math.cos(tang + Math.PI / 2), end[1] - 8 * Math.sin(tang) - 5 * Math.sin(tang + Math.PI / 2)];
      s += `<polygon points="${end.map((v) => v.toFixed(1)).join(',')} ${p1.map((v) => v.toFixed(1)).join(',')} ${p2.map((v) => v.toFixed(1)).join(',')}" style="fill:var(--accent2,#3f7a4b)"/>`;
    }
    return s;
  }

  C.register(A, 'zahnrad', 'Zahnräder', (L) => {
    const n = [2, 3, 4, 5, 4][L - 1];
    const labels = 'ABCDEFG'.split('');
    const radii = [], teeth = [];
    for (let i = 0; i < n; i++) { const t = pick([8, 10, 12, 16, 20]); teeth.push(t); radii.push(t * 1.6 + 6); }
    let x = 10, svg = '', pos = [];
    for (let i = 0; i < n; i++) { x += radii[i] + (i ? 4 : 18); pos.push(x); x += radii[i] + 2; }
    const W = x + 20, Hh = Math.max(...radii) * 2 + 60;
    const dir = pick(['cw', 'ccw']);
    for (let i = 0; i < n; i++) svg += gear(pos[i], Hh / 2 + 8, radii[i], teeth[i], labels[i], i === 0 ? dir : null);
    const html = `<div class="center"><svg viewBox="0 0 ${W} ${Hh}" width="${Math.min(340, W)}" class="gears">${svg}</svg></div>`;
    const name = (d) => (d === 'cw' ? 'im Uhrzeigersinn' : 'gegen den Uhrzeigersinn');
    if (L <= 3 || chance(0.4)) {
      const last = (n - 1) % 2 === 0 ? dir : dir === 'cw' ? 'ccw' : 'cw';
      return C.mc({ stem: `Zahnrad A dreht sich ${name(dir)}. In welche Richtung dreht sich Zahnrad ${labels[n - 1]}?`, html, n: 2, correct: name(last), distractors: [name(last === 'cw' ? 'ccw' : 'cw')], fmt: (s) => s,
        explain: `Ineinandergreifende Zahnräder drehen jeweils entgegengesetzt. Bei ${n} Rädern in einer Reihe dreht Rad ${labels[n - 1]} ${n % 2 ? 'gleich wie' : 'entgegengesetzt zu'} A.` });
    }
    const rpm = pick([30, 60, 90, 120]);
    const out = rpm * teeth[0] / teeth[n - 1];
    const stem = `Zahnrad A (${teeth[0]} Zähne) dreht sich mit ${rpm} U/min. Wie schnell dreht sich Zahnrad ${labels[n - 1]} (${teeth[n - 1]} Zähne)?` + (n > 2 ? ' Die Räder dazwischen haben ' + teeth.slice(1, -1).join(', ') + ' Zähne.' : '');
    return C.mc({ stem, html, correct: out, distractors: [rpm * teeth[n - 1] / teeth[0], rpm, out * 2, out / 2], fmt: (v) => C.fmt(v) + ' U/min', positive: true,
      explain: `Nur erstes und letztes Rad zählen (Zwischenräder ändern nur die Richtung): ${rpm} · ${teeth[0]} / ${teeth[n - 1]} = ${C.fmt(out)} U/min.` });
  }, { weight: 1.3 });

  C.register(A, 'hebel', 'Hebel', (L) => {
    const a1 = int(1, 4) * (L >= 3 ? 0.5 : 1), F1 = int(2, 12) * 10, a2 = pick([1, 2, 3, 4, 5, 6].filter((v) => v !== a1));
    const F2 = F1 * a1 / a2;
    if (!Number.isInteger(F2 * 10)) return null;
    const html = `<div class="center"><svg viewBox="0 0 300 90" width="300"><polygon points="${150},70 ${140},88 ${160},88" fill="${INK}"/><line x1="20" y1="68" x2="280" y2="68" stroke="${INK}" stroke-width="5"/><rect x="${150 - a1 * 20 - 15}" y="40" width="30" height="26" style="fill:var(--cube-r,#c9cec5)" stroke="${INK}"/><text x="${150 - a1 * 20}" y="58" font-size="12" text-anchor="middle" fill="${INK}">${F1} N</text><line x1="${150 + a2 * 20}" y1="20" x2="${150 + a2 * 20}" y2="64" stroke="#3f7a4b" stroke-width="3"/><polygon points="${150 + a2 * 20},66 ${150 + a2 * 20 - 6},54 ${150 + a2 * 20 + 6},54" style="fill:var(--accent2,#3f7a4b)"/><text x="${150 + a2 * 20}" y="14" font-size="12" text-anchor="middle" fill="${INK}">F = ?</text><text x="136" y="84" font-size="11" text-anchor="end" fill="${INK}">← ${C.fmt(a1)} m</text><text x="164" y="84" font-size="11" text-anchor="start" fill="${INK}">${a2} m →</text></svg></div>`;
    return C.mc({ stem: `Eine Last von ${F1} N hängt ${C.fmt(a1)} m vom Drehpunkt entfernt. Welche Kraft muss auf der anderen Seite im Abstand von ${a2} m wirken, damit der Hebel im Gleichgewicht ist?`, html,
      correct: F2, distractors: [F1 * a2 / a1, F1, F1 - F2, F2 * 2], fmt: (v) => C.fmt(v) + ' N', positive: true,
      explain: `Hebelgesetz: Kraft · Kraftarm = Last · Lastarm → ${F1} · ${C.fmt(a1)} = F · ${a2} → F = ${C.fmt(F2)} N.` });
  }, { minLevel: 2 });

  C.register(A, 'flaschenzug', 'Flaschenzug', (L) => {
    const n = L <= 2 ? pick([1, 2]) : pick([2, 3, 4, 6]);
    const G = pick([200, 300, 400, 600, 1200]);
    const F = G / n;
    return C.mc({ stem: `Eine Last von ${G} N wird mit einem Flaschenzug gehoben, bei dem die Last an ${n} tragenden Seilabschnitten hängt. Welche Zugkraft ist nötig (Reibung und Rollengewicht vernachlässigt)?`,
      correct: F, distractors: [G, G * n, G / (n + 1), G / 2 === F ? G / 4 : G / 2], fmt: (v) => C.fmt(v) + ' N', positive: true,
      explain: `Die Kraft verteilt sich auf ${n} Seilabschnitte: ${G} : ${n} = ${C.fmt(F)} N. Dafür muss man ${n}-mal so viel Seil ziehen.` });
  });

  C.register(A, 'strom', 'Stromkreis & Ohm', (L) => {
    const k = L <= 2 ? pick([0, 1]) : L === 3 ? pick([1, 2, 3]) : pick([2, 3, 4]);
    if (k === 0) {
      const serial = chance(0.5);
      return C.mc({ stem: `Drei Lampen sind ${serial ? 'in Reihe' : 'parallel'} geschaltet. Eine Lampe wird herausgeschraubt. Was passiert mit den anderen beiden?`, n: 3,
        correct: serial ? 'Sie gehen aus.' : 'Sie leuchten weiter.', distractors: [serial ? 'Sie leuchten weiter.' : 'Sie gehen aus.', 'Sie leuchten heller.'], fmt: (s) => s,
        explain: serial ? 'In Reihe gibt es nur einen Stromweg – ist er unterbrochen, fließt kein Strom mehr.' : 'Parallel hat jede Lampe ihren eigenen Stromweg.' });
    }
    if (k === 1) { const R = pick([2, 4, 5, 6, 10]), I = pick([2, 3, 4, 5]); const U = R * I;
      return C.mc({ stem: `An einem Widerstand von ${R} Ω liegt eine Spannung von ${U} V. Wie groß ist die Stromstärke?`, correct: I, distractors: [U * R, R / U, I + 1], fmt: (v) => C.fmt(v) + ' A', positive: true, explain: `I = U / R = ${U} / ${R} = ${I} A (Ohmsches Gesetz).` }); }
    if (k === 2) { const U = pick([12, 24, 230]), I = pick([2, 5, 10]); const P = U * I;
      return C.mc({ stem: `Ein Gerät wird mit ${U} V betrieben und nimmt ${I} A auf. Welche Leistung hat es?`, correct: P, distractors: [U / I, U + I, P / 10], fmt: (v) => C.fmt(v) + ' W', positive: true, explain: `P = U · I = ${U} · ${I} = ${P} W.` }); }
    if (k === 3) { const r1 = pick([2, 3, 4, 6]), r2 = pick([4, 6, 8, 12]); const ser = chance(0.5); const R = ser ? r1 + r2 : (r1 * r2) / (r1 + r2);
      return C.mc({ stem: `Zwei Widerstände (${r1} Ω und ${r2} Ω) sind ${ser ? 'in Reihe' : 'parallel'} geschaltet. Wie groß ist der Gesamtwiderstand?`, correct: R, distractors: [ser ? (r1 * r2) / (r1 + r2) : r1 + r2, r1 * r2, Math.abs(r2 - r1)], fmt: (v) => C.fmt(v) + ' Ω', positive: true,
        explain: ser ? `Reihe: R = R1 + R2 = ${R} Ω.` : `Parallel: R = R1·R2 / (R1+R2) = ${C.fmt(R)} Ω (immer kleiner als der kleinste Einzelwiderstand).` }); }
    const P = pick([1000, 2000, 2500]), h = pick([2, 3, 4]), ct = pick([30, 40]);
    const cost = P / 1000 * h * ct / 100;
    return C.mc({ stem: `Ein Heizgerät mit ${P} W läuft ${h} Stunden. Strom kostet ${ct} Cent pro kWh. Wie hoch sind die Kosten?`, correct: cost, distractors: [cost * 10, cost / 10, P * h * ct / 100000 + 0.5], fmt: (v) => C.fmt(v) + ' €', positive: true,
      explain: `${P} W = ${P / 1000} kW · ${h} h = ${P / 1000 * h} kWh · ${ct} ct = ${C.fmt(cost)} €.` });
  });

  C.bank(A, 'physik', 'Physik-Grundwissen', [
    { q: 'Breitet sich Schall im Vakuum aus?', a: ['Nein, Schall braucht ein Medium.', 'Ja, sogar schneller als in Luft.', 'Ja, aber langsamer.', 'Nur hohe Töne.'], l: 1 },
    { q: 'Was passiert mit Wasser, wenn es gefriert?', a: ['Es dehnt sich aus.', 'Es zieht sich stark zusammen.', 'Sein Volumen bleibt gleich.', 'Es wird schwerer.'], l: 1 },
    { q: 'Welche Einheit hat die Kraft?', a: ['Newton', 'Joule', 'Watt', 'Pascal'], l: 1 },
    { q: 'Ein Rettungswagen mit Martinshorn fährt auf dich zu. Wie klingt der Ton?', a: ['höher als beim Wegfahren', 'tiefer als beim Wegfahren', 'immer gleich', 'lauter, aber gleich hoch'], l: 3, e: 'Doppler-Effekt: Bei Annäherung werden die Schallwellen gestaucht → höherer Ton.' },
    { q: 'Welche Energieumwandlung findet in einem Generator statt?', a: ['Bewegungsenergie → elektrische Energie', 'Elektrische Energie → Bewegungsenergie', 'Wärme → Licht', 'Chemische Energie → elektrische Energie'], l: 2 },
    { q: 'Welche Energieumwandlung findet in einem Elektromotor statt?', a: ['Elektrische Energie → Bewegungsenergie', 'Bewegungsenergie → elektrische Energie', 'Chemische Energie → Wärme', 'Licht → elektrische Energie'], l: 2 },
    { q: 'Warum schwimmt ein Stahlschiff?', a: ['Es verdrängt so viel Wasser, wie es wiegt.', 'Stahl ist leichter als Wasser.', 'Wegen der Oberflächenspannung.', 'Wegen des Motors.'], l: 2, e: 'Auftrieb (Archimedes): Die Auftriebskraft entspricht der Gewichtskraft des verdrängten Wassers.' },
    { q: 'Welcher Stoff leitet elektrischen Strom am besten?', a: ['Kupfer', 'Glas', 'Holz', 'Gummi'], l: 1 },
    { q: 'Wovon hängt der Druck in einer Flüssigkeit ab?', a: ['von der Tiefe', 'von der Breite des Gefäßes', 'von der Form des Gefäßes', 'von der Farbe'], l: 3 },
    { q: 'Zwei Kugeln (1 kg und 10 kg) fallen im Vakuum aus gleicher Höhe. Welche kommt zuerst unten an?', a: ['beide gleichzeitig', 'die 10-kg-Kugel', 'die 1-kg-Kugel', 'hängt vom Material ab'], l: 3 },
    { q: 'Welche Größe misst man in Pascal?', a: ['Druck', 'Leistung', 'Energie', 'Frequenz'], l: 2 },
    { q: 'Was beschreibt die Frequenz einer Welle?', a: ['Schwingungen pro Sekunde', 'die Höhe der Welle', 'die Geschwindigkeit', 'die Wellenlänge'], l: 2 },
    { q: 'Warum ist ein Fahrradrahmen oft aus Rohren statt aus Vollmaterial?', a: ['Rohre sind bei gleichem Gewicht steifer.', 'Rohre sind billiger zu lackieren.', 'Vollmaterial rostet schneller.', 'Rohre leiten Wärme besser.'], l: 4 },
    { q: 'Ein Körper bewegt sich gleichförmig geradeaus. Was gilt für die Summe der Kräfte?', a: ['Sie ist null.', 'Sie zeigt in Bewegungsrichtung.', 'Sie zeigt nach unten.', 'Sie wächst mit der Zeit.'], l: 4, e: 'Erstes newtonsches Gesetz (Trägheit).' },
    { q: 'Was passiert mit dem Siedepunkt von Wasser im Hochgebirge?', a: ['Er sinkt.', 'Er steigt.', 'Er bleibt bei 100 °C.', 'Wasser kocht dort nicht.'], l: 4, e: 'Geringerer Luftdruck → niedrigerer Siedepunkt.' },
    { q: 'Wodurch entsteht hauptsächlich die Reibung zwischen zwei Flächen?', a: ['Unebenheiten der Oberflächen und Anpresskraft', 'die Farbe der Flächen', 'die Temperatur allein', 'die Größe der Fläche allein'], l: 5 },
    { q: 'Ein Transformator hat primär 1000 Windungen und sekundär 100 Windungen. Primär liegen 230 V an. Welche Spannung liegt sekundär an?', a: ['23 V', '2300 V', '230 V', '10 V'], l: 5, e: 'U2 = U1 · N2/N1 = 230 · 100/1000 = 23 V.' },
  ]);
})(window.CAT);
