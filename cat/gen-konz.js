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

  C.register(A, 'symbole', 'Symbole zuordnen', (L) => {
    const S = shuffle(['▲', '■', '●', '◆', '★', '✚']);
    const k = [3, 4, 4, 5, 6][L - 1];
    const vals = S.slice(0, k).map(() => int(1, L >= 4 ? 12 : 9));
    const legend = S.slice(0, k).map((s, i) => `<span class="leg">${s} = ${vals[i]}</span>`).join('');
    const n = [3, 4, 5, 6, 7][L - 1];
    const seq = []; for (let i = 0; i < n; i++) seq.push(int(0, k - 1));
    const sum = seq.reduce((t, i) => t + vals[i], 0);
    return C.mc({ stem: 'Ersetze die Symbole durch ihre Werte und addiere.', html: `<div class="legend">${legend}</div><div class="series">${seq.map((i) => S[i]).join(' + ')} = ?</div>`,
      correct: sum, distractors: [sum + vals[0], sum - 1, sum + 2, sum - vals[seq[0]] + vals[(seq[0] + 1) % k]], fmt: (v) => String(v), positive: true,
      explain: `${seq.map((i) => vals[i]).join(' + ')} = ${sum}.` });
  });
})(window.CAT);
