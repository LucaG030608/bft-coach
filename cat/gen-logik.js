/* Logik-Generatoren: Zahlenreihen, Matrizen, Figurenreihen, Schlussfolgerungen */
(function (C) {
  const { int, pick, shuffle, chance } = C.R;
  const A = 'logik';

  /* ---------- Zahlenreihen ---------- */
  const series = {
    1: [
      () => { const a = int(2, 30), d = pick([2, 3, 4, 5, 6, 7, 8, 9, -3, -4, -6]); const s = [a + (d < 0 ? 60 : 0)]; for (let i = 1; i < 7; i++) s.push(s[i - 1] + d); return [s, `Immer ${d > 0 ? '+' : '−'}${Math.abs(d)}.`]; },
      () => { const a = int(1, 5), f = pick([2, 3]); const s = [a]; for (let i = 1; i < 7; i++) s.push(s[i - 1] * f); return [s, `Immer ·${f}.`]; },
    ],
    2: [
      () => { const a = int(10, 40), p = int(3, 9), m = int(1, p - 1); const s = [a]; for (let i = 1; i < 7; i++) s.push(s[i - 1] + (i % 2 ? p : -m)); return [s, `Abwechselnd +${p} und −${m}.`]; },
      () => { const a = int(1, 20), d = int(1, 4); const s = [a]; for (let i = 1; i < 7; i++) s.push(s[i - 1] + d + i - 1); return [s, `Die Abstände wachsen um 1: +${d}, +${d + 1}, +${d + 2} …`]; },
      () => { const s = [pick([3, 5, 7, 9, 11]) * 64]; for (let i = 1; i < 7; i++) s.push(s[i - 1] / 2); return [s, 'Immer :2.']; },
    ],
    3: [
      () => { const a = int(1, 15), d = int(1, 5), k = pick([2, 3]); const s = [a]; let dd = d; for (let i = 1; i < 7; i++) { s.push(s[i - 1] + dd); dd += k; } return [s, `Die Abstände wachsen jeweils um ${k} (+${d}, +${d + k}, +${d + 2 * k} …).`]; },
      () => { const a = int(1, 6), f = pick([2, 3]), b = int(1, 6); const s = [a]; for (let i = 1; i < 7; i++) s.push(i % 2 ? s[i - 1] * f : s[i - 1] + b); return [s, `Abwechselnd ·${f} und +${b}.`]; },
      () => { const c = int(-3, 5), o = int(1, 4); const s = []; for (let i = 0; i < 7; i++) s.push((i + o) ** 2 + c); return [s, `Quadratzahlen ${c ? (c > 0 ? '+' + c : '−' + -c) : ''} (${o}², ${o + 1}², ${o + 2}² …).`]; },
    ],
    4: [
      () => { const a = int(1, 20), b = int(30, 60), d1 = int(2, 6), d2 = -int(2, 5); const s = []; for (let i = 0; i < 7; i++) s.push(i % 2 === 0 ? a + d1 * (i / 2) : b + d2 * ((i - 1) / 2)); return [s, `Zwei verschachtelte Reihen: jede 1., 3., 5. … Zahl +${d1}; jede 2., 4., 6. … Zahl −${-d2}.`]; },
      () => { const a = int(1, 10), d = int(1, 3); const s = [a]; let dd = d; for (let i = 1; i < 7; i++) { s.push(s[i - 1] + dd); dd *= 2; } return [s, `Die Abstände verdoppeln sich (+${d}, +${2 * d}, +${4 * d} …).`]; },
      () => { const a = int(1, 5), b = int(1, 6); const s = [a, b]; for (let i = 2; i < 7; i++) s.push(s[i - 1] + s[i - 2]); return [s, 'Jede Zahl ist die Summe der beiden vorherigen.']; },
      () => { const a = int(1, 5), p = pick([1, -1]); const s = [a + 2]; for (let i = 1; i < 7; i++) s.push(s[i - 1] * 2 + p); return [s, `Immer ·2 und dann ${p > 0 ? '+1' : '−1'}.`]; },
    ],
    5: [
      () => { const a = int(2, 9); const s = [a]; for (let i = 1; i < 7; i++) s.push(i % 2 ? s[i - 1] * 2 : s[i - 1] - i); return [s, 'Abwechselnd ·2 und dann −1, −3, −5 … (der Abzug wächst um 2).']; },
      () => { const a = int(1, 20); const s = [a]; for (let i = 1; i < 7; i++) s.push(s[i - 1] + i * i); return [s, 'Die Abstände sind Quadratzahlen: +1, +4, +9, +16 …']; },
      () => { const a = int(2, 6); const s = [a]; for (let i = 1; i < 7; i++) s.push(s[i - 1] * 2 - i); return [s, 'Immer ·2 und dann −1, −2, −3 …']; },
      () => { const a = int(2, 8), b = int(1, 3); const s = []; for (let i = 0; i < 7; i++) s.push(i % 2 === 0 ? a * 2 ** (i / 2) : b * 3 ** ((i - 1) / 2) + 10); return [s, 'Zwei verschachtelte Reihen: Positionen 1, 3, 5 … ·2; Positionen 2, 4, 6 … ·3 (bezogen auf den Teil ohne +10).']; },
      () => { const a = int(1, 9); const s = [a]; let d = 1; for (let i = 1; i < 7; i++) { s.push(s[i - 1] + d); d = i % 2 ? d * 2 : d + 2; } return [s, 'Die Abstände wechseln: ·2, dann +2 (1, 2, 4, 8, 10, 20 …).']; },
    ],
  };

  C.register(A, 'zahlenreihe', 'Zahlenreihen', (L) => {
    const [s, rule] = pick(series[L])();
    if (s.some((x) => !Number.isInteger(x) || Math.abs(x) > 5000)) return null;
    const shown = s.slice(0, 6), ans = s[6];
    const last = s[5], dLast = s[5] - s[4];
    const stem = 'Welche Zahl setzt die Reihe logisch fort?';
    const html = `<div class="series">${shown.join('&ensp;&ensp;')}&ensp;&ensp;<b>?</b></div>`;
    if (L >= 2 && chance(0.3)) {
      return { stem: stem + ' (Zahl eintippen)', html, kind: 'input', answer: ans, explain: `${rule} Lösung: ${ans}.` };
    }
    return C.mc({ stem, html, correct: ans, distractors: [last + dLast, ans + 1, ans - 2, last + (s[4] - s[3]), ans + dLast], fmt: (x) => String(x),
      explain: `${rule} Lösung: ${ans}.` });
  }, { weight: 2 });

  /* ---------- Matrizen (3x3, SVG) ---------- */
  const SHAPES = ['circle', 'square', 'triangle', 'diamond'];
  const FILLS = ['#fff', '#9aa0a6', '#222'];
  function shapeSvg(shape, x, y, r, fill, rot = 0) {
    const st = `fill="${fill}" stroke="#222" stroke-width="1.6"`;
    const t = rot ? ` transform="rotate(${rot} ${x} ${y})"` : '';
    if (shape === 'circle') return `<circle cx="${x}" cy="${y}" r="${r}" ${st}/>`;
    if (shape === 'square') return `<rect x="${x - r * 0.9}" y="${y - r * 0.9}" width="${r * 1.8}" height="${r * 1.8}" ${st}${t}/>`;
    if (shape === 'triangle') return `<polygon points="${x},${y - r} ${x + r},${y + r * 0.8} ${x - r},${y + r * 0.8}" ${st}${t}/>`;
    if (shape === 'diamond') return `<polygon points="${x},${y - r} ${x + r},${y} ${x},${y + r} ${x - r},${y}" ${st}${t}/>`;
    if (shape === 'arrow') return `<g${t}><line x1="${x}" y1="${y + r}" x2="${x}" y2="${y - r}" stroke="#222" stroke-width="3"/><polygon points="${x},${y - r - 4} ${x + 7},${y - r + 8} ${x - 7},${y - r + 8}" fill="#222"/></g>`;
    return '';
  }
  function cellSvg(c, size = 80) {
    const n = c.count, r = n === 1 ? 16 : n === 2 ? 12 : 10;
    const pos = { 1: [[0.5, 0.5]], 2: [[0.3, 0.5], [0.7, 0.5]], 3: [[0.5, 0.28], [0.28, 0.7], [0.72, 0.7]], 4: [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]] }[n];
    return pos.map(([px, py]) => shapeSvg(c.shape, px * size, py * size, r, c.fill, c.rot || 0)).join('');
  }
  const cellKey = (c) => `${c.shape}|${c.count}|${c.fill}|${c.rot || 0}`;
  function cellBox(c, size = 80, extra = '') { return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="cell" ${extra}><rect x="1" y="1" width="${size - 2}" height="${size - 2}" fill="#fff" stroke="#bbb"/>${c ? cellSvg(c, size) : `<text x="${size / 2}" y="${size / 2 + 10}" text-anchor="middle" font-size="30" fill="#555">?</text>`}</svg>`; }

  C.register('matrizen', 'formen', 'Formen-Matrizen', (L) => {
    const shp = shuffle(SHAPES).slice(0, 3), fl = shuffle(FILLS);
    const latin = () => { const p = shuffle([0, 1, 2]); const sh = pick([1, 2]); return (r, c) => p[(r * sh + c) % 3]; };
    const grid = [];
    let rules = [];
    const cntBase = int(1, 2);
    const fShape = L >= 3 ? latin() : (r) => r;
    const fFill = L >= 4 ? latin() : L >= 2 ? (r) => r : () => 0;
    const fCount = L >= 5 ? latin() : (r, c) => c;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      grid.push({ shape: shp[fShape(r, c)], fill: fl[fFill(r, c)], count: cntBase + fCount(r, c) });
    }
    rules.push(L >= 3 ? 'Jede Form kommt in jeder Zeile und Spalte genau einmal vor' : 'Jede Zeile hat ihre eigene Form');
    if (L >= 4) rules.push('jede Füllung kommt in jeder Zeile und Spalte genau einmal vor'); else if (L >= 2) rules.push('die Füllung ist pro Zeile gleich');
    rules.push(L >= 5 ? 'jede Anzahl kommt in jeder Zeile und Spalte genau einmal vor' : 'die Anzahl steigt von links nach rechts um 1');
    const ans = grid[8];
    // Distraktoren: ein Merkmal verändert
    const alt = [];
    const vary = [
      (c) => ({ ...c, shape: pick(SHAPES.filter((s) => s !== c.shape)) }),
      (c) => ({ ...c, count: c.count === 1 ? 2 : c.count === 4 ? 3 : c.count + pick([-1, 1]) }),
      (c) => ({ ...c, fill: pick(FILLS.filter((f) => f !== c.fill)) }),
    ];
    const seen = new Set([cellKey(ans)]);
    let guard = 0;
    while (alt.length < 7 && guard++ < 200) {
      let d = pick(vary)(ans);
      if ((L >= 4 && chance(0.4)) || guard > 15) d = pick(vary)(d);
      if (!seen.has(cellKey(d))) { seen.add(cellKey(d)); alt.push(d); }
    }
    const opts = shuffle([ans, ...alt]);
    const html = `<div class="matrix">${grid.map((c, i) => cellBox(i === 8 ? null : c)).join('')}</div>`;
    return {
      stem: 'Welche Figur gehört an die Stelle des Fragezeichens?', html, kind: 'mc',
      options: opts.map(cellKey), optionHtml: opts.map((c) => cellBox(c, 70)),
      answer: opts.indexOf(ans), explain: 'Regeln: ' + rules.join('; ') + '.',
    };
  }, { weight: 1 });

  /* ---------- Figurenreihen (Pfeil dreht, Punkte zählen) ---------- */
  C.register(A, 'figurenreihe', 'Figurenreihen', (L) => {
    const step = L <= 2 ? pick([90, -90]) : pick([45, -45, 135, 90]);
    const start = pick([0, 45, 90, 180, 270]);
    const dotStep = L >= 3 ? pick([1, -1]) : 0;
    const dot0 = dotStep < 0 ? 6 : 1;
    const accel = L >= 5; // Drehschritt wächst
    const frames = [];
    let rot = start, dots = dot0, st = step;
    for (let i = 0; i < 6; i++) {
      frames.push({ rot: ((rot % 360) + 360) % 360, dots: L >= 3 ? dots : 0 });
      rot += st; dots += dotStep; if (accel) st += step;
    }
    const box = (f, size = 76) => {
      let s = `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="cell"><rect x="1" y="1" width="${size - 2}" height="${size - 2}" fill="#fff" stroke="#bbb"/>`;
      s += shapeSvg('arrow', size / 2, size / 2, 20, '#222', f.rot);
      for (let k = 0; k < f.dots; k++) s += `<circle cx="${8 + (k % 6) * 12}" cy="${size - 8}" r="3.5" fill="#222"/>`;
      return s + '</svg>';
    };
    const ans = frames[5];
    const key = (f) => `${f.rot}|${f.dots}`;
    const cand = [
      { rot: (ans.rot + 90) % 360, dots: ans.dots }, { rot: (ans.rot + 180) % 360, dots: ans.dots },
      { rot: (ans.rot + 45) % 360, dots: ans.dots }, { rot: (ans.rot + 270) % 360, dots: ans.dots },
    ];
    if (L >= 3) cand.unshift({ rot: ans.rot, dots: ans.dots + 1 }, { rot: (ans.rot + 90) % 360, dots: ans.dots - dotStep });
    const seen = new Set([key(ans)]), alt = [];
    for (const c of cand) { if (alt.length < 3 && c.dots >= 0 && !seen.has(key(c))) { seen.add(key(c)); alt.push(c); } }
    const opts = shuffle([ans, ...alt]);
    const html = `<div class="row">${frames.slice(0, 5).map((f) => box(f)).join('')}${box({ rot: 0, dots: 0 }).replace(/<g[\s\S]*<\/g>/, '<text x="38" y="48" text-anchor="middle" font-size="30" fill="#555">?</text>')}</div>`;
    let ex = `Der Pfeil dreht sich ${accel ? 'mit wachsendem Schritt' : `pro Bild um ${Math.abs(step)}° ${step > 0 ? 'im' : 'gegen den'} Uhrzeigersinn`}`;
    if (L >= 3) ex += `; die Punkte ${dotStep > 0 ? 'nehmen um 1 zu' : 'nehmen um 1 ab'}`;
    return { stem: 'Welche Figur setzt die Reihe fort?', html, kind: 'mc', options: opts.map(key), optionHtml: opts.map((f) => box(f, 66)), answer: opts.indexOf(ans), explain: ex + '.' };
  });

  /* ---------- Schlussfolgerungen (ja/nein) ---------- */
  const NOUNS = ['Brame', 'Keloten', 'Wiren', 'Faspen', 'Muloks', 'Tirsen', 'Gonden', 'Plaxe', 'Rumpen', 'Zoter'];
  C.register(A, 'schluss', 'Schlussfolgerungen', (L) => {
    const [X, Y, Z] = shuffle(NOUNS).slice(0, 3);
    const forms = [
      [true, `Alle ${X} sind ${Y}. Alle ${Y} sind ${Z}.`, `Alle ${X} sind ${Z}.`, 'Gültig: Wenn alle X in Y und alle Y in Z liegen, liegen alle X in Z.'],
      [true, `Keine ${Y} sind ${Z}. Alle ${X} sind ${Y}.`, `Keine ${X} sind ${Z}.`, 'Gültig: Alle X liegen in Y, und Y hat keine Überschneidung mit Z.'],
      [true, `Alle ${Y} sind ${Z}. Einige ${X} sind ${Y}.`, `Einige ${X} sind ${Z}.`, 'Gültig: Die X, die Y sind, sind auch Z.'],
      [false, `Alle ${X} sind ${Y}. Einige ${Y} sind ${Z}.`, `Einige ${X} sind ${Z}.`, 'Nicht zwingend: Die Y, die Z sind, müssen keine X sein.'],
      [false, `Alle ${X} sind ${Y}. Alle ${X} sind ${Z}.`, `Alle ${Y} sind ${Z}.`, 'Nicht zwingend: Es kann Y geben, die keine X und keine Z sind.'],
      [false, `Keine ${X} sind ${Y}. Keine ${Y} sind ${Z}.`, `Keine ${X} sind ${Z}.`, 'Nicht zwingend: Über das Verhältnis von X und Z sagen die Aussagen nichts.'],
      [false, `Alle ${X} sind ${Y}.`, `Alle ${Y} sind ${X}.`, 'Nicht zwingend: Die Umkehrung gilt nicht automatisch.'],
      [true, `Einige ${X} sind ${Y}.`, `Einige ${Y} sind ${X}.`, 'Gültig: „Einige“-Aussagen lassen sich umkehren.'],
      [false, `Einige ${X} sind ${Y}. Einige ${Y} sind ${Z}.`, `Einige ${X} sind ${Z}.`, 'Nicht zwingend: Es können verschiedene Y gemeint sein.'],
    ];
    const pool = L <= 2 ? [0, 1, 6, 7] : L === 3 ? [0, 1, 2, 3, 6, 7] : [0, 1, 2, 3, 4, 5, 8];
    const [ok, prem, concl, ex] = forms[pick(pool)];
    return C.mc({ stem: 'Folgt die Schlussfolgerung zwingend aus den Aussagen? (Nur die Logik zählt, nicht ob es die Begriffe wirklich gibt.)',
      html: `<div class="box"><p>${prem}</p><p><b>Schluss:</b> ${concl}</p></div>`, correct: ok ? 'Ja' : 'Nein', distractors: [ok ? 'Nein' : 'Ja'], n: 2, keepOrder: false,
      fmt: (x) => x, explain: ex });
  }, { weight: 0.8 });
})(window.CAT);
