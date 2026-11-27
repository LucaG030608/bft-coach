/* Kern: Zufall, Item-Bau, Registry, Konfiguration */
window.CAT = window.CAT || {};
(function (C) {
  const R = {
    int: (a, b) => Math.floor(Math.random() * (b - a + 1)) + a,
    pick: (a) => a[Math.floor(Math.random() * a.length)],
    shuffle: (a) => {
      a = a.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    chance: (p) => Math.random() < p,
  };
  C.R = R;

  C.fmt = (n) => {
    if (typeof n !== 'number') return String(n);
    const r = Math.round(n * 100) / 100;
    return r.toLocaleString('de-DE', { maximumFractionDigits: 2 });
  };

  /* Multiple-Choice-Item bauen: correct + Distraktoren -> 4 gemischte Optionen */
  C.mc = function (o) {
    const fmt = o.fmt || C.fmt;
    const n = o.n || 4;
    const opts = [o.correct];
    const seen = new Set([fmt(o.correct)]);
    for (const d of o.distractors || []) {
      if (opts.length >= n) break;
      if (d === undefined || d === null || (typeof d === 'number' && !isFinite(d))) continue;
      const k = fmt(d);
      if (!seen.has(k)) { seen.add(k); opts.push(d); }
    }
    let k = 1;
    while (opts.length < n && typeof o.correct === 'number' && k < 50) {
      const step = o.step || Math.max(1, Math.round(Math.abs(o.correct) * 0.1));
      const d = o.correct + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * step;
      k++;
      if (o.positive && d <= 0) continue;
      const key = fmt(d);
      if (!seen.has(key)) { seen.add(key); opts.push(d); }
    }
    const shuffled = o.keepOrder ? opts : R.shuffle(opts);
    return {
      area: o.area, type: o.type, level: o.level,
      stem: o.stem, html: o.html || '', kind: 'mc',
      options: shuffled.map(fmt),
      optionHtml: o.optionHtml ? shuffled.map(o.optionHtml) : null,
      answer: shuffled.findIndex((x) => fmt(x) === fmt(o.correct)),
      explain: o.explain || '',
    };
  };

  /* Registry der Generatoren je Bereich */
  C.gens = {};
  C.register = (area, type, label, gen, opts = {}) => {
    (C.gens[area] = C.gens[area] || []).push({ type, label, gen, minLevel: opts.minLevel || 1, maxLevel: opts.maxLevel || 5, weight: opts.weight || 1 });
  };

  C.generate = function (area, level, type) {
    let list = (C.gens[area] || []).filter((g) => level >= g.minLevel && level <= g.maxLevel);
    if (type) list = list.filter((g) => g.type === type);
    if (!list.length) list = C.gens[area].filter((g) => !type || g.type === type);
    const total = list.reduce((s, g) => s + g.weight, 0);
    let r = Math.random() * total, g = list[0];
    for (const x of list) { r -= x.weight; if (r <= 0) { g = x; break; } }
    const order = [g, ...C.R.shuffle(list.filter((x) => x !== g))];
    for (const gg of order) {
      for (let tries = 0; tries < 8; tries++) {
        try {
          const item = gg.gen(level);
          if (item) { item.area = area; item.type = item.type || gg.type; item.level = level; return item; }
        } catch (e) { console.error('Generator-Fehler', area, gg.type, e); }
      }
    }
    return null;
  };

  /* Bank-Items (Text-Pool) als Generator registrieren */
  C.bank = function (area, type, label, items, explainPrefix) {
    C.register(area, type, label, (level) => {
      let pool = items.filter((q) => (q.l || 3) === level);
      if (pool.length < 3) pool = items.filter((q) => Math.abs((q.l || 3) - level) <= 1);
      if (!pool.length) pool = items;
      const q = R.pick(pool);
      return C.mc({
        stem: q.q, html: q.html || '', correct: q.a[0], distractors: q.a.slice(1), fmt: (x) => String(x),
        explain: q.e || (explainPrefix ? explainPrefix + ' ' + q.a[0] : 'Richtig: ' + q.a[0]),
      });
    });
  };
})(window.CAT);
