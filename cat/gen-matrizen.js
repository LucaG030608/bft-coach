/* Matrizen vom Raven-Typ (laut Bundeswehr-Literatur: Subtest „MAZ“, adaptiv, 8 Antwort-Teilstücke,
   waagerecht und senkrecht lesbar). Regeln: Überlagern (∪), Gleiches streichen (XOR), Abziehen (\), Gemeinsames (∩),
   ab Stufe 5 zusätzlich eine Punkt-Regel. Jede Aufgabe wird auf Eindeutigkeit geprüft. */
(function (C) {
  const { int, pick, shuffle, chance } = C.R;
  const INK = '#141714';
  const SEG = [
    'M12 12H68', 'M12 68H68', 'M12 12V68', 'M68 12V68', 'M12 12L68 68', 'M68 12L12 68', 'M40 12V68', 'M12 40H68',
  ];
  const NEL = 9; // 0–7 Linien, 8 = Kreis in der Mitte
  const bits = (m) => [...Array(NEL).keys()].filter((i) => m & (1 << i));
  const OPS = {
    or: { f: (a, b) => a | b, t: 'Feld 1 und Feld 2 werden überlagert (alle Linien zusammen)' },
    xor: { f: (a, b) => a ^ b, t: 'Linien, die in Feld 1 und Feld 2 gleich sind, fallen weg; der Rest bleibt' },
    sub: { f: (a, b) => a & ~b, t: 'Von Feld 1 werden die Linien aus Feld 2 abgezogen' },
    and: { f: (a, b) => a & b, t: 'Nur die Linien, die in Feld 1 UND Feld 2 vorkommen, bleiben' },
  };
  function randSet(lo, hi, allowCircle) {
    const pool = shuffle([...Array(allowCircle ? NEL : 8).keys()]);
    let m = 0; pool.slice(0, int(lo, hi)).forEach((i) => { m |= 1 << i; });
    return m;
  }
  function cellSvg(cell, size = 80) {
    let s = `<svg viewBox="0 0 80 80" width="${size}" height="${size}" class="cell"><rect x="1" y="1" width="78" height="78" style="fill:#fff" stroke="#bbb"/>`;
    if (!cell) return s + '<text x="40" y="51" text-anchor="middle" font-size="30" fill="#555">?</text></svg>';
    bits(cell.m).forEach((i) => {
      if (i === 8) s += `<circle cx="40" cy="40" r="11" fill="none" stroke="${INK}" stroke-width="3"/>`;
      else s += `<path d="${SEG[i]}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round" fill="none"/>`;
    });
    for (let k = 0; k < (cell.d || 0); k++) s += `<circle cx="${18 + k * 10}" cy="58" r="3.6" fill="${INK}"/>`;
    return s + '</svg>';
  }
  const key = (c) => c.m + '|' + (c.d || 0);

  C.register('matrizen', 'linien', 'Linien-Matrizen (Raven-Typ)', (L) => {
    const cfg = [
      { ops: ['or'], lo: 1, hi: 2, circ: false, dir: ['row'] },
      { ops: ['xor', 'sub', 'or'], lo: 2, hi: 3, circ: false, dir: ['row'] },
      { ops: ['xor', 'sub', 'and', 'or'], lo: 2, hi: 3, circ: true, dir: ['row', 'col'] },
      { ops: ['xor', 'sub', 'and'], lo: 3, hi: 4, circ: true, dir: ['row', 'col'] },
      { ops: ['xor', 'sub', 'and'], lo: 3, hi: 4, circ: true, dir: ['row', 'col'], dots: true },
    ][L - 1];
    for (let tries = 0; tries < 200; tries++) {
      const op = pick(cfg.ops), dir = pick(cfg.dir);
      // g[r][c] – bei dir='col' wird das Raster transponiert erzeugt
      const g = [[], [], []];
      for (let r = 0; r < 3; r++) {
        const a = randSet(cfg.lo, cfg.hi, cfg.circ), b = randSet(cfg.lo, cfg.hi, cfg.circ);
        const c = OPS[op].f(a, b);
        g[r] = [a, b, c];
      }
      let M = dir === 'row' ? g : [0, 1, 2].map((r) => [0, 1, 2].map((c) => g[c][r]));
      const cells = M.map((row, r) => row.map((m, c) => ({ m, d: cfg.dots ? ((r + c) % 3) + 1 : 0 })));
      // Qualität: keine leeren Felder, Ergebnis unterscheidet sich von beiden Ausgangsfeldern
      if (cells.flat().some((c) => !c.m)) continue;
      if (g.some(([a, b, c]) => c === a || c === b)) continue;
      const ans = cells[2][2];
      // Eindeutigkeit: jede andere Regel/Leserichtung, die zu den zwei vollständigen Beispielen passt, muss dasselbe ergeben
      let ambiguous = false;
      for (const d2 of ['row', 'col']) for (const o2 of Object.keys(OPS)) {
        const get = (i, j) => (d2 === 'row' ? cells[i][j] : cells[j][i]);
        const fits = [0, 1].every((i) => OPS[o2].f(get(i, 0).m, get(i, 1).m) === get(i, 2).m);
        if (fits && OPS[o2].f(get(2, 0).m, get(2, 1).m) !== ans.m) ambiguous = true;
        const fitsRev = [0, 1].every((i) => OPS[o2].f(get(i, 1).m, get(i, 0).m) === get(i, 2).m);
        if (fitsRev && OPS[o2].f(get(2, 1).m, get(2, 0).m) !== ans.m) ambiguous = true;
      }
      if (ambiguous) continue;
      // 7 Ablenker: andere Regeln, Ausgangsfelder, einzelne Linien zu viel/zu wenig, falsche Punktzahl
      const A3 = dir === 'row' ? cells[2][0] : cells[0][2], B3 = dir === 'row' ? cells[2][1] : cells[1][2];
      const cand = [];
      Object.keys(OPS).forEach((o) => cand.push({ m: OPS[o].f(A3.m, B3.m), d: ans.d }));
      cand.push({ m: OPS.sub.f(B3.m, A3.m), d: ans.d }, { m: A3.m, d: ans.d }, { m: B3.m, d: ans.d });
      for (let k = 0; k < 30; k++) {
        let m = ans.m ^ (1 << int(0, cfg.circ ? 8 : 7));
        if (chance(0.4)) m ^= 1 << int(0, 7);
        cand.push({ m, d: ans.d });
        if (cfg.dots && chance(0.3)) cand.push({ m: ans.m, d: (ans.d % 3) + 1 });
      }
      const seen = new Set([key(ans)]), dis = [];
      for (const c of cand) { if (dis.length < 7 && c.m && !seen.has(key(c))) { seen.add(key(c)); dis.push(c); } }
      if (dis.length < 7) continue;
      const opts = shuffle([ans, ...dis]);
      const html = `<div class="matrix">${cells.flat().map((c, i) => cellSvg(i === 8 ? null : c)).join('')}</div>`;
      return {
        stem: 'Welches Teilstück ergänzt das Muster?', html, kind: 'mc',
        options: opts.map(key), optionHtml: opts.map((c) => cellSvg(c, 62)), answer: opts.indexOf(ans),
        explain: `Regel ${dir === 'row' ? 'zeilenweise (links → rechts)' : 'spaltenweise (oben → unten)'}: ${OPS[op].t}.` + (cfg.dots ? ' Zusätzlich: Jede Punktzahl (1, 2, 3) kommt in jeder Zeile und Spalte genau einmal vor.' : ''),
      };
    }
    return null;
  }, { weight: 2 });
})(window.CAT);
