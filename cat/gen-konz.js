/* Konzentration: Zählen, Markieren, Vergleichen, Symbol-Zuordnung */
(function (C) {
  const { int, pick, shuffle, chance } = C.R;
  const A = 'konz';

  C.register(A, 'zaehlen', 'Zeichen zählen', (L) => {
    const sets = [['3', '7', '1', '4', '9'], ['b', 'd', 'p', 'q'], ['6', '9', '8', '0', '3'], ['m', 'n', 'u', 'w'], ['O', 'Q', 'C', 'G', 'D']];
    const set = sets[Math.min(L - 1, sets.length - 1)];
    const len = [20, 28, 36, 44, 52][L - 1];
    const target = pick(set);
    const arr = [];
    for (let i = 0; i < len; i++) arr.push(chance(0.25) ? target : pick(set));
    const cnt = arr.filter((c) => c === target).length;
    return C.mc({ stem: `Wie oft kommt das Zeichen „${target}“ vor?`, html: `<div class="mono">${arr.join(' ')}</div>`, correct: cnt, distractors: [cnt + 1, cnt - 1, cnt + 2, cnt - 2], fmt: (v) => String(v),
      explain: `Das Zeichen „${target}“ kommt ${cnt}-mal vor. Tipp: In Gruppen zu 5 zählen und mit dem Finger/Stift mitführen.` });
  }, { weight: 1.2 });

  C.register(A, 'markieren', 'Zeichen markieren', (L) => {
    const set = L <= 2 ? ['a', 'b', 'c', 'd', 'e'] : ['b', 'd', 'p', 'q'];
    const [x, y] = shuffle(set).slice(0, 2);
    const len = [18, 24, 30, 36, 42][L - 1];
    const arr = [];
    for (let i = 0; i < len; i++) arr.push(chance(0.3) ? x : pick(set));
    const hits = [];
    for (let i = 0; i < len - 1; i++) if (arr[i] === x && arr[i + 1] === y) hits.push(i);
    if (hits.length < 1) return null;
    return { stem: `Markiere jedes „${x}“, auf das direkt ein „${y}“ folgt. Dann „Weiter“.`, kind: 'mark', cells: arr, answer: hits,
      explain: `Richtig waren die Positionen ${hits.map((h) => h + 1).join(', ')} (${hits.length} Treffer).` };
  }, { weight: 1 });

  C.register(A, 'vergleichen', 'Zeichenfolgen vergleichen', (L) => {
    const chars = L <= 2 ? '0123456789' : 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
    const rows = [4, 5, 6, 6, 7][L - 1], len = [5, 6, 7, 8, 9][L - 1];
    const sim = { '0': 'O', O: '0', '1': '7', '7': '1', '8': 'B', B: '8', '5': 'S', S: '5', '6': 'G', G: '6', M: 'N', N: 'M', V: 'U', U: 'V' };
    let same = 0, html = '<table class="cmp">';
    for (let r = 0; r < rows; r++) {
      let a = ''; for (let i = 0; i < len; i++) a += chars[int(0, chars.length - 1)];
      let b = a;
      if (chance(0.55)) {
        const i = int(0, len - 1); const c = a[i];
        let rep = L >= 3 && sim[c] ? sim[c] : chars[int(0, chars.length - 1)];
        if (rep === c) rep = c === '0' ? '9' : '0';
        b = a.slice(0, i) + rep + a.slice(i + 1);
      }
      if (a === b) same++;
      html += `<tr><td class="mono">${a}</td><td class="mono">${b}</td></tr>`;
    }
    html += '</table>';
    return C.mc({ stem: 'Wie viele Zeilenpaare sind vollkommen identisch?', html, correct: same, distractors: [same + 1, same - 1, same + 2, same - 2].filter((v) => v >= 0 && v <= rows), fmt: (v) => String(v),
      explain: `${same} Paare sind identisch. Tipp: Zeichen für Zeichen von links nach rechts, besonders auf ähnliche Zeichen (0/O, 1/7, 8/B, 5/S) achten.` });
  });

  /* „Chinesische Zeichen“: Zahlen werden je Aufgabe anderen Schriftzeichen zugeordnet, dann wird gerechnet (60 s je Aufgabe). */
  const HAN = ['山', '水', '火', '木', '金', '土', '日', '月', '人', '口', '田', '中', '大', '小', '王', '手', '目', '石'];
  C.register(A, 'symbolrechnen', 'Symbolrechnen („chinesische Zeichen“)', (L) => {
    const k = [4, 5, 5, 6, 6][L - 1];
    const sy = shuffle(HAN).slice(0, k);
    const val = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k);
    const legend = sy.map((s, i) => `<span class="leg han">${s} = ${val[i]}</span>`).join('');
    const terms = [3, 3, 4, 4, 5][L - 1];
    const ops = L <= 2 ? ['+', '−'] : ['+', '−', '·'];
    const idx = []; for (let i = 0; i < terms; i++) idx.push(int(0, k - 1));
    const opl = []; for (let i = 1; i < terms; i++) opl.push(pick(ops));
    // Punkt vor Strich auswerten
    let vals = [val[idx[0]]], os = [];
    for (let i = 1; i < terms; i++) { if (opl[i - 1] === '·') vals[vals.length - 1] *= val[idx[i]]; else { os.push(opl[i - 1]); vals.push(val[idx[i]]); } }
    let res = vals[0]; os.forEach((o, i) => { res = o === '+' ? res + vals[i + 1] : res - vals[i + 1]; });
    const expr = idx.map((x, i) => (i ? ' ' + opl[i - 1] + ' ' : '') + sy[x]).join('');
    const plain = idx.map((x, i) => (i ? ' ' + opl[i - 1] + ' ' : '') + val[x]).join('');
    return C.mc({ stem: 'Setze für jedes Zeichen seine Zahl ein und rechne (Punkt vor Strich).', html: `<div class="legend">${legend}</div><div class="series han">${expr} = ?</div>`,
      correct: res, distractors: [res + 1, res - 1, res + val[idx[0]], res - 2, res + 2], fmt: (v) => String(v),
      explain: `${plain} = ${res}.` });
  }, { weight: 1.5 });

  /* Konzentration: Symbole stehen für Ziffern 0–9 (Schlüssel bleibt 20 Min. gleich), Spalte addieren – unter Zeitdruck, nicht alles schaffbar. */
  const SYMS = ['▲', '■', '●', '◆', '★', '✚', '♥', '♣', '♠', '☀'];
  let LEG = null;
  function legend() {
    if (!LEG || Date.now() - LEG.t > 20 * 60000) LEG = { t: Date.now(), map: shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) };
    return LEG.map; // LEG.map[i] = Ziffer von SYMS[i]
  }
  C.register(A, 'spalte', 'Symbol-Spalten addieren', (L) => {
    const map = legend();
    const n = [3, 3, 4, 4, 5][L - 1];
    const col = []; for (let i = 0; i < n; i++) col.push(int(0, 9));
    const sum = col.reduce((s, i) => s + map[i], 0);
    const leg = SYMS.map((s, i) => `<span class="leg">${s}=${map[i]}</span>`).join('');
    return C.mc({ stem: 'Addiere die Spalte (Schlüssel oben).', html: `<div class="legend small">${leg}</div><div class="colsum">${col.map((i) => SYMS[i]).join('<br>')}</div>`,
      correct: sum, distractors: [sum + 1, sum - 1, sum + 2, sum - 2, sum + 10], fmt: (v) => String(v), explain: `${col.map((i) => map[i]).join(' + ')} = ${sum}.` });
  }, { weight: 1 });

  /* Reaktionstest (nachempfunden): roter Pfeil – Position = Reihe; blauer Pfeil – Richtung = Spalte; 3 s je Signal. */
  C.register('reaktion', 'pfeile', 'Reaktionstest (Pfeile)', (L, n) => {
    const stimuli = []; for (let i = 0; i < (n || 20); i++) stimuli.push({ row: int(0, 2), col: int(0, 2) });
    return { stem: 'Rote Pfeil-POSITION = Reihe, blaue Pfeil-RICHTUNG = Spalte. Tippe das Feld.', kind: 'reaction', stimuli, per: Math.max(2, 3.4 - L * 0.2), explain: '' };
  });
})(window.CAT);
