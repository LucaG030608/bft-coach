/* Räumliches Vorstellungsvermögen: Würfelnetze, Würfel zählen, Drehen vs. Spiegeln */
(function (C) {
  const { int, pick, shuffle, chance } = C.R;
  const A = 'raum';
  const INK = 'currentColor';

  /* ---------- Würfelnetze ---------- */
  const NET_BASES = [];
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) NET_BASES.push([[a, 0], [0, 1], [1, 1], [2, 1], [3, 1], [b, 2]]);
  for (const x of [1, 2, 3]) NET_BASES.push([[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [x, 2]]);
  NET_BASES.push([[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]]);
  NET_BASES.push([[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]]);

  const neg = (v) => v.map((x) => -x);
  const vk = (v) => v.join(',');
  // Faltet ein Netz: liefert je Zelle die Flächennormale
  function fold(cells) {
    const idx = new Map(cells.map((c, i) => [c.join(','), i]));
    const st = new Array(cells.length);
    st[0] = { n: [0, 0, -1], R: [1, 0, 0], D: [0, 1, 0] };
    const q = [0];
    while (q.length) {
      const i = q.shift(), [x, y] = cells[i], s = st[i];
      const moves = [[1, 0, () => ({ n: s.R, R: neg(s.n), D: s.D })], [-1, 0, () => ({ n: neg(s.R), R: s.n, D: s.D })],
        [0, 1, () => ({ n: s.D, D: neg(s.n), R: s.R })], [0, -1, () => ({ n: neg(s.D), D: s.n, R: s.R })]];
      for (const [dx, dy, f] of moves) {
        const j = idx.get(`${x + dx},${y + dy}`);
        if (j !== undefined && !st[j]) { st[j] = f(); q.push(j); }
      }
    }
    const normals = st.map((s) => s && s.n);
    if (normals.some((n) => !n) || new Set(normals.map(vk)).size !== 6) return null;
    return normals;
  }
  function transformNet(cells) {
    let c = cells.map(([x, y]) => [x, y]);
    const r = int(0, 3);
    for (let k = 0; k < r; k++) c = c.map(([x, y]) => [-y, x]);
    if (chance(0.5)) c = c.map(([x, y]) => [-x, y]);
    const mx = Math.min(...c.map((p) => p[0])), my = Math.min(...c.map((p) => p[1]));
    return C.R.shuffle(c.map(([x, y]) => [x - mx, y - my]));
  }
  // 90°-symmetrische Symbole (Drehung auf der Fläche spielt keine Rolle)
  const SYM = [
    '<circle cx=".5" cy=".5" r=".28" fill="' + INK + '"/>',
    '<circle cx=".5" cy=".5" r=".28" fill="none" stroke="' + INK + '" stroke-width=".09"/>',
    '<path d="M.5 .2V.8M.2 .5H.8" stroke="' + INK + '" stroke-width=".11" fill="none"/>',
    '<rect x=".27" y=".27" width=".46" height=".46" fill="' + INK + '"/>',
    '<g><circle cx=".5" cy=".5" r=".3" fill="none" stroke="' + INK + '" stroke-width=".07"/><circle cx=".5" cy=".5" r=".1" fill="' + INK + '"/></g>',
    '<g fill="' + INK + '"><circle cx=".3" cy=".3" r=".09"/><circle cx=".7" cy=".3" r=".09"/><circle cx=".3" cy=".7" r=".09"/><circle cx=".7" cy=".7" r=".09"/></g>',
  ];
  const symBox = (s, size = 44) => `<svg viewBox="0 0 1 1" width="${size}" height="${size}" class="cell"><rect x=".02" y=".02" width=".96" height=".96" style="fill:var(--cell-bg,#fff)" stroke="${INK}" stroke-width=".03"/>${SYM[s]}</svg>`;
  function netSvg(cells, syms, unit = 40) {
    const w = (Math.max(...cells.map((c) => c[0])) + 1) * unit, h = (Math.max(...cells.map((c) => c[1])) + 1) * unit;
    let s = `<svg viewBox="-2 -2 ${w + 4} ${h + 4}" width="${w + 4}" height="${h + 4}" class="net">`;
    cells.forEach(([x, y], i) => {
      s += `<g transform="translate(${x * unit} ${y * unit}) scale(${unit})"><rect x="0" y="0" width="1" height="1" style="fill:var(--cell-bg,#fff)" stroke="${INK}" stroke-width=".04"/>${SYM[syms[i]]}</g>`;
    });
    return s + '</svg>';
  }
  const FACES = { top: [14, 32, 36, -18, 36, 18], left: [14, 32, 36, 18, 0, 40], right: [50, 50, 36, -18, 0, 40] };
  function cubeSvg(t, l, r, size = 78) {
    const face = (f, sym, shade) => {
      const [ox, oy, ax, ay, bx, by] = FACES[f];
      return `<g transform="matrix(${ax} ${ay} ${bx} ${by} ${ox} ${oy})"><path d="M0 0H1V1H0Z" style="fill:${shade}" stroke="${INK}" stroke-width="1.6" vector-effect="non-scaling-stroke"/><g transform="translate(.12 .12) scale(.76)">${SYM[sym]}</g></g>`;
    };
    return `<svg viewBox="8 8 84 88" width="${size}" height="${size}" class="cube">${face('top', t, 'var(--cube-top,#fff)')}${face('left', l, 'var(--cube-l,#e9ebe7)')}${face('right', r, 'var(--cube-r,#d5d9d2)')}</svg>`;
  }
  const det = (a, b, c) => a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  function makeNet() {
    for (let t = 0; t < 30; t++) {
      const cells = transformNet(pick(NET_BASES));
      const normals = fold(cells);
      if (normals) return { cells, normals, syms: shuffle([0, 1, 2, 3, 4, 5]) };
    }
    return null;
  }

  C.register(A, 'gegenueber', 'Würfelnetz: gegenüberliegende Fläche', (L) => {
    const net = makeNet(); if (!net) return null;
    const i = int(0, 5);
    const j = net.normals.findIndex((n) => vk(n) === vk(neg(net.normals[i])));
    const adj = [0, 1, 2, 3, 4, 5].filter((k) => k !== i && k !== j);
    const opts = shuffle([j, ...shuffle(adj).slice(0, 3)]);
    return {
      stem: 'Die Faltvorlage wird zu einem Würfel gefaltet. Welches Symbol liegt dem markierten Symbol gegenüber?',
      html: `<div class="center">${netSvg(net.cells, net.syms)}</div><div class="center small" style="margin-top:6px">Markiert: ${symBox(net.syms[i], 34)}</div>`,
      kind: 'mc', options: opts.map((k) => 'f' + k), optionHtml: opts.map((k) => symBox(net.syms[k], 46)), answer: opts.indexOf(j),
      explain: 'Gegenüber liegen Flächen, die im Netz in einer Reihe mit genau einer Fläche dazwischen liegen (oder bei verschobenen Netzen entsprechend über Eck). Benachbarte Flächen können nie gegenüber liegen.',
    };
  }, { maxLevel: 3, weight: 1 });

  C.register(A, 'faltwuerfel', 'Würfelnetz: welcher Würfel passt?', (L) => {
    const net = makeNet(); if (!net) return null;
    const N = net.normals, f = (v) => N.findIndex((n) => vk(n) === vk(v));
    const triples = [];
    for (let a = 0; a < 6; a++) for (let b = 0; b < 6; b++) for (let c = 0; c < 6; c++) {
      if (a === b || b === c || a === c) continue;
      triples.push([a, b, c]);
    }
    const valid = triples.filter(([a, b, c]) => dot(N[a], N[b]) === 0 && dot(N[b], N[c]) === 0 && dot(N[a], N[c]) === 0 && det(N[a], N[b], N[c]) === 1);
    const mirror = triples.filter(([a, b, c]) => dot(N[a], N[b]) === 0 && dot(N[b], N[c]) === 0 && dot(N[a], N[c]) === 0 && det(N[a], N[b], N[c]) === -1);
    const opp = triples.filter(([a, b, c]) => dot(N[a], N[b]) !== 0 || dot(N[b], N[c]) !== 0 || dot(N[a], N[c]) !== 0);
    const ans = pick(valid);
    let pool = L <= 3 ? opp : L === 4 ? shuffle([...shuffle(opp).slice(0, 2), ...shuffle(mirror).slice(0, 2)]) : mirror;
    const seen = new Set([ans.join()]), dis = [];
    for (const t of shuffle(pool)) { if (dis.length < 3 && !seen.has(t.join())) { seen.add(t.join()); dis.push(t); } }
    const opts = shuffle([ans, ...dis]);
    void f;
    return {
      stem: 'Welcher Würfel kann aus der Faltvorlage gefaltet werden?',
      html: `<div class="center">${netSvg(net.cells, net.syms, 36)}</div>`,
      kind: 'mc', options: opts.map((t) => t.join('-')), optionHtml: opts.map(([a, b, c]) => cubeSvg(net.syms[a], net.syms[b], net.syms[c])), answer: opts.indexOf(ans),
      explain: L <= 3 ? 'Bei den falschen Würfeln sind zwei Flächen gleichzeitig sichtbar, die im Netz gegenüber liegen – das ist unmöglich.' : 'Prüfe die Reihenfolge der drei Symbole um die Ecke herum: Bei den falschen Würfeln ist sie gespiegelt (oder es sind gegenüberliegende Flächen sichtbar).',
    };
  }, { minLevel: 3, weight: 1.2 });

  /* ---------- Würfel zählen (Stapel, isometrisch) ---------- */
  C.register(A, 'wuerfelzaehlen', 'Würfel zählen', (L) => {
    const [nx, ny, hmax] = [[2, 2, 2], [3, 2, 3], [3, 3, 3], [3, 3, 4], [4, 3, 4]][L - 1];
    const H = [];
    for (let x = 0; x < nx; x++) { H[x] = []; for (let y = 0; y < ny; y++) {
      const lim = Math.min(x ? H[x - 1][y] : hmax, y ? H[x][y - 1] : hmax);
      H[x][y] = x + y === 0 ? hmax : int(Math.max(0, lim - 2), lim);
    } }
    const total = H.flat().reduce((s, v) => s + v, 0);
    if (total < 4) return null;
    const cubes = [];
    for (let x = 0; x < nx; x++) for (let y = 0; y < ny; y++) for (let z = 0; z < H[x][y]; z++) cubes.push([x, y, z]);
    cubes.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]) || a[2] - b[2]);
    const s = 22, cx = 0.866 * s, P = (x, y, z) => [(x - y) * cx, (x + y) * s / 2 - z * s];
    let body = '';
    for (const [x, y, z] of cubes) {
      const p = (a, b, c) => P(x + a, y + b, z + c).map((v) => v.toFixed(1)).join(',');
      body += `<polygon points="${p(0, 0, 1)} ${p(1, 0, 1)} ${p(1, 1, 1)} ${p(0, 1, 1)}" style="fill:var(--cube-top,#fff)" stroke="${INK}" stroke-width="1.2"/>`;
      body += `<polygon points="${p(0, 1, 0)} ${p(1, 1, 0)} ${p(1, 1, 1)} ${p(0, 1, 1)}" style="fill:var(--cube-l,#e3e6e0)" stroke="${INK}" stroke-width="1.2"/>`;
      body += `<polygon points="${p(1, 0, 0)} ${p(1, 1, 0)} ${p(1, 1, 1)} ${p(1, 0, 1)}" style="fill:var(--cube-r,#c9cec5)" stroke="${INK}" stroke-width="1.2"/>`;
    }
    const minX = P(0, ny, 0)[0] - 4, maxX = P(nx, 0, 0)[0] + 4, minY = P(0, 0, hmax)[1] - 4, maxY = P(nx, ny, 0)[1] + 4;
    const html = `<div class="center"><svg viewBox="${minX} ${minY} ${maxX - minX} ${maxY - minY}" width="${Math.min(300, (maxX - minX) * 1.6)}" class="stack">${body}</svg></div>`;
    const visible = H.flat().filter((h) => h > 0).length + (nx - 1) + (ny - 1);
    return C.mc({ stem: 'Aus wie vielen Würfeln besteht der Stapel? (Alle Würfel liegen lückenlos aufeinander, auch verdeckte zählen.)', html,
      correct: total, distractors: [total - 1, total + 1, total - 2, visible, total + 2], positive: true, fmt: (v) => String(v),
      explain: `Zähle Säule für Säule von oben: Höhen ${H.map((r) => r.join('/')).join(' | ')} → zusammen ${total} Würfel.` });
  }, { weight: 1 });

  /* ---------- Figuren drehen vs. spiegeln ---------- */
  const norm = (cells) => {
    const mx = Math.min(...cells.map((c) => c[0])), my = Math.min(...cells.map((c) => c[1]));
    return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  };
  const key = (cells) => norm(cells).map((c) => c.join(',')).join(';');
  const rot = (cells, k) => { let c = cells; for (let i = 0; i < k; i++) c = c.map(([x, y]) => [-y, x]); return norm(c); };
  const mir = (cells) => norm(cells.map(([x, y]) => [-x, y]));
  function poly(n) {
    const cells = [[0, 0]]; const has = (x, y) => cells.some((c) => c[0] === x && c[1] === y);
    while (cells.length < n) {
      const [x, y] = pick(cells), [dx, dy] = pick([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      if (!has(x + dx, y + dy)) cells.push([x + dx, y + dy]);
    }
    return norm(cells);
  }
  function polySvg(cells, size = 74) {
    const w = Math.max(...cells.map((c) => c[0])) + 1, h = Math.max(...cells.map((c) => c[1])) + 1, m = Math.max(w, h, 3);
    const u = (size - 8) / m, ox = (size - w * u) / 2, oy = (size - h * u) / 2;
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" class="cell"><rect x="1" y="1" width="${size - 2}" height="${size - 2}" style="fill:var(--cell-bg,#fff)" stroke="#bbb"/>${cells.map(([x, y]) => `<rect x="${ox + x * u}" y="${oy + y * u}" width="${u}" height="${u}" fill="${INK}" stroke="#fff" stroke-width="1"/>`).join('')}</svg>`;
  }
  C.register(A, 'drehen', 'Figuren drehen (nicht spiegeln)', (L) => {
    const n = [4, 5, 6, 7, 8][L - 1];
    for (let t = 0; t < 60; t++) {
      const p = poly(n);
      const rots = [0, 1, 2, 3].map((k) => key(rot(p, k)));
      const mk = [0, 1, 2, 3].map((k) => key(rot(mir(p), k)));
      if (new Set(rots).size < 4 || mk.some((m) => rots.includes(m))) continue; // chiral & ohne Drehsymmetrie
      const r = int(1, 3);
      const ans = rot(p, r);
      const dis = shuffle([0, 1, 2, 3]).slice(0, 3).map((k) => rot(mir(p), k));
      const opts = shuffle([ans, ...dis]);
      return {
        stem: 'Welche Figur ist die gedrehte Vorlage? Die anderen sind gespiegelt.',
        html: `<div class="center"><div class="small muted">Vorlage</div>${polySvg(p, 90)}</div>`,
        kind: 'mc', options: opts.map(key), optionHtml: opts.map((c) => polySvg(c)), answer: opts.indexOf(ans),
        explain: `Die richtige Figur ist um ${r * 90}° gedreht. Tipp: Merke dir eine markante Ecke und prüfe, ob die Reihenfolge der Teile im Uhrzeigersinn gleich bleibt – bei Spiegelung kehrt sie sich um.`,
      };
    }
    return null;
  }, { weight: 1 });
})(window.CAT);
