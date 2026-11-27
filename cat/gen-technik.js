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

  /* Riemen- und Rädergetriebe (gerade Riemen = gleiche Richtung, gekreuzte = Gegenrichtung, Zahnräder = Gegenrichtung),
     dazu Fangfragen mit blockierten Rad-Ringen (drei Zahnräder, die sich gegenseitig berühren, können sich nicht drehen). */
  C.register(A, 'riemen', 'Riemen & blockierte Getriebe', (L) => {
    const name = (d) => (d === 1 ? 'im Uhrzeigersinn' : 'gegen den Uhrzeigersinn');
    if (L >= 3 && chance(0.3)) {
      const k = pick([3, 5]); // ungerade Zahl von Zahnrädern im Ring → blockiert
      const R = 46, cx = 120, cy = 80;
      let svg = '';
      for (let i = 0; i < k; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / k; svg += gear(cx + R * Math.cos(a), cy + R * Math.sin(a), k === 3 ? 24 : 16, 8, 'ABCDE'[i], i === 0 ? 'cw' : null); }
      return C.mc({ stem: `Die ${k} Zahnräder greifen im Kreis ineinander. Rad A soll sich im Uhrzeigersinn drehen. Was passiert?`, html: `<div class="center"><svg viewBox="0 0 240 170" width="260" class="gears">${svg}</svg></div>`,
        correct: 'Die Räder blockieren – nichts dreht sich.', distractors: ['Alle drehen im Uhrzeigersinn.', 'Rad B dreht gegen den Uhrzeigersinn, die anderen im Uhrzeigersinn.', 'Alle drehen gegen den Uhrzeigersinn.'], fmt: (x) => x,
        explain: `Benachbarte Zahnräder müssten sich jeweils entgegengesetzt drehen. Bei einer ungeraden Anzahl (${k}) im geschlossenen Ring widerspricht sich das – das Getriebe blockiert.` });
    }
    const n = [2, 3, 3, 4, 5][L - 1];
    const links = []; for (let i = 0; i < n - 1; i++) links.push(pick(['gear', 'belt', 'cross']));
    if (L <= 2) links[0] = pick(['belt', 'cross']);
    let dir = pick([1, -1]); const d0 = dir;
    const r = 20, gap = 70; let svg = '', x = 30;
    const pos = []; for (let i = 0; i < n; i++) { pos.push(x); x += links[i] === 'gear' ? 2 * r + 12 : gap + 2 * r; }
    for (let i = 0; i < n - 1; i++) {
      const a = pos[i], b = pos[i + 1], y = 70;
      if (links[i] === 'belt') svg += `<line x1="${a}" y1="${y - r - 2}" x2="${b}" y2="${y - r - 2}" stroke="#555" stroke-width="2.5"/><line x1="${a}" y1="${y + r + 2}" x2="${b}" y2="${y + r + 2}" stroke="#555" stroke-width="2.5"/>`;
      if (links[i] === 'cross') svg += `<line x1="${a}" y1="${y - r - 2}" x2="${b}" y2="${y + r + 2}" stroke="#555" stroke-width="2.5"/><line x1="${a}" y1="${y + r + 2}" x2="${b}" y2="${y - r - 2}" stroke="#555" stroke-width="2.5"/>`;
      dir = links[i] === 'belt' ? dir : -dir;
    }
    for (let i = 0; i < n; i++) svg += links[i - 1] === 'gear' || links[i] === 'gear' ? gear(pos[i], 70, r, 8, 'ABCDE'[i], i === 0 ? (d0 === 1 ? 'cw' : 'ccw') : null)
      : `<circle cx="${pos[i]}" cy="70" r="${r}" style="fill:#fff" stroke="${INK}" stroke-width="2"/><circle cx="${pos[i]}" cy="70" r="4" fill="${INK}"/><text x="${pos[i]}" y="${70 + r + 18}" text-anchor="middle" font-size="14" font-weight="700" fill="${INK}">${'ABCDE'[i]}</text>` + (i === 0 ? `<text x="${pos[i]}" y="22" text-anchor="middle" font-size="13" fill="#3f7a4b">${d0 === 1 ? '↻' : '↺'} A</text>` : '');
    const W = x - 20;
    const desc = links.map((l) => (l === 'gear' ? 'Zahnrad' : l === 'belt' ? 'gerader Riemen' : 'gekreuzter Riemen')).join(', ');
    return C.mc({ stem: `Rad A dreht sich ${name(d0)}. In welche Richtung dreht sich Rad ${'ABCDE'[n - 1]}?`, html: `<div class="center"><svg viewBox="0 0 ${W} 120" width="${Math.min(340, W)}" class="gears">${svg}</svg></div>`,
      n: 2, correct: name(dir), distractors: [name(-dir)], fmt: (x) => x,
      explain: `Verbindungen: ${desc}. Gerader Riemen = gleiche Richtung, gekreuzter Riemen und Zahnrad = Richtungswechsel.` });
  }, { weight: 1.2 });

  /* Stromkreise mit Schaltern: Hauptschalter S0 in Reihe, zwei parallele Zweige mit S1+L1 und S2+L2. */
  C.register(A, 'schaltung', 'Stromkreis mit Schaltern', (L) => {
    const main = L >= 2;
    const sw = [main ? chance(0.75) : true, chance(0.5), chance(0.5)];
    const l1 = sw[0] && sw[1], l2 = sw[0] && sw[2];
    const W = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK}" stroke-width="2"/>`;
    const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="3" fill="${INK}"/>`;
    const SH = (x, y, c, t) => dot(x, y) + dot(x + 30, y) + (c ? W(x, y, x + 30, y) : W(x, y, x + 26, y - 14)) + `<text x="${x + 15}" y="${y + 17}" text-anchor="middle" font-size="12" fill="${INK}">${t}</text>`;
    const SV = (x, y, c, t) => dot(x, y) + dot(x, y + 30) + (c ? W(x, y, x, y + 30) : W(x, y, x + 14, y + 26)) + `<text x="${x - 8}" y="${y + 19}" text-anchor="end" font-size="12" fill="${INK}">${t}</text>`;
    const LAMP = (x, y, t) => `<circle cx="${x}" cy="${y}" r="11" style="fill:#fff" stroke="${INK}" stroke-width="2"/><path d="M${x - 7} ${y - 7}L${x + 7} ${y + 7}M${x + 7} ${y - 7}L${x - 7} ${y + 7}" stroke="${INK}" stroke-width="1.5"/><text x="${x + 16}" y="${y + 4}" font-size="12" fill="${INK}">${t}</text>`;
    let g = W(20, 40, 20, 86) + W(20, 102, 20, 150) + W(8, 86, 32, 86) + `<line x1="13" y1="102" x2="27" y2="102" stroke="${INK}" stroke-width="4"/>` + `<text x="34" y="98" font-size="11" fill="${INK}">+ −</text>`;
    g += W(20, 40, 60, 40) + (main ? SH(60, 40, sw[0], 'S0') : W(60, 40, 90, 40)) + W(90, 40, 270, 40) + W(20, 150, 270, 150);
    for (const [x, c, t] of [[170, sw[1], '1'], [270, sw[2], '2']]) g += W(x, 40, x, 60) + SV(x, 60, c, 'S' + t) + W(x, 90, x, 101) + LAMP(x, 112, 'L' + t) + W(x, 123, x, 150);
    const ans = l1 && l2 ? 'L1 und L2' : l1 ? 'nur L1' : l2 ? 'nur L2' : 'keine Lampe';
    const stt = (b) => (b ? 'geschlossen' : 'offen');
    return C.mc({ stem: 'Welche Lampen leuchten bei der gezeigten Schalterstellung? (Ein offener Schalter ist schräg gezeichnet.)', html: `<div class="center"><svg viewBox="0 0 320 170" width="320">${g}</svg></div>`,
      correct: ans, distractors: ['L1 und L2', 'nur L1', 'nur L2', 'keine Lampe'], fmt: (x) => x,
      explain: `Strom fließt nur durch geschlossene Schalter. ${main ? 'Hauptschalter S0 ist ' + stt(sw[0]) + '. ' : ''}S1 ist ${stt(sw[1])}, S2 ist ${stt(sw[2])}. Eine Lampe leuchtet nur, wenn ${main ? 'S0 und ' : ''}ihr eigener Schalter geschlossen sind.` });
  }, { weight: 1 });

  C.bank(A, 'physik', 'Physik-Grundwissen', [
    { q: 'Zwei oben offene Gefäße sind unten durch ein Rohr verbunden. Man gießt Wasser in eines. Wie stehen die Wasserspiegel danach?', a: ['in beiden gleich hoch', 'im breiteren Gefäß höher', 'im schmaleren Gefäß höher', 'im befüllten Gefäß höher'], l: 3, e: 'Verbundene (kommunizierende) Gefäße: Der Wasserspiegel stellt sich überall gleich hoch ein – unabhängig von der Form.' },
    { q: 'Zwei gleiche Federn werden hintereinander (in Reihe) gehängt. Wie verändert sich die Dehnung bei gleicher Last im Vergleich zu einer Feder?', a: ['doppelt so groß', 'halb so groß', 'gleich groß', 'viermal so groß'], l: 4, e: 'In Reihe trägt jede Feder die volle Last und dehnt sich gleich stark – zusammen also doppelt so viel.' },
    { q: 'Zwei gleiche Federn hängen nebeneinander (parallel) und tragen gemeinsam eine Last. Wie groß ist die Dehnung im Vergleich zu einer Feder?', a: ['halb so groß', 'doppelt so groß', 'gleich groß', 'ein Viertel'], l: 4, e: 'Parallel teilen sich die Federn die Last – jede dehnt sich nur halb so weit.' },
    { q: 'Aus zwei gleich hohen Kanistern läuft Wasser durch gleich große Löcher am Boden. Kanister A ist bis oben voll, B halb voll. Aus welchem läuft das Wasser anfangs schneller?', a: ['aus A', 'aus B', 'gleich schnell', 'das hängt von der Farbe ab'], l: 3, e: 'Je höher die Wassersäule, desto größer der Druck am Loch – also fließt bei A das Wasser schneller.' },
    { q: 'Ein Rad mit großem Durchmesser und ein Rad mit kleinem Durchmesser rollen gleich weit. Welches dreht sich öfter?', a: ['das kleine Rad', 'das große Rad', 'beide gleich oft', 'keines, sie rutschen'], l: 2, e: 'Der Umfang des kleinen Rades ist kürzer – es braucht für dieselbe Strecke mehr Umdrehungen.' },
    { q: 'Wo muss man eine Tür anfassen, um sie mit möglichst wenig Kraft zu öffnen?', a: ['möglichst weit weg von den Scharnieren', 'direkt an den Scharnieren', 'in der Mitte', 'das ist egal'], l: 1, e: 'Hebelgesetz: Je länger der Hebelarm, desto weniger Kraft ist nötig.' },
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
