/* Mathematik-Generatoren (Level 1 = leicht … 5 = schwer) */
(function (C) {
  const { int, pick } = C.R;
  const A = 'mathe';

  // Kopfrechnen / Punkt vor Strich
  C.register(A, 'kopfrechnen', 'Kopfrechnen', (L) => {
    let expr, val, wrong;
    if (L === 1) { const a = int(24, 78), b = int(13, 49), c = int(6, 29); expr = `${a} + ${b} − ${c}`; val = a + b - c; wrong = [val + 10, val - 10, val + 2]; }
    else if (L === 2) { const a = int(3, 9), b = int(12, 28), c = int(11, 49); expr = `${a} · ${b} + ${c}`; val = a * b + c; wrong = [a * (b + c), val + a, val - 10]; }
    else if (L === 3) { const b = int(3, 9), c = int(4, 12), a = b * c + int(5, 40), d = int(6, 30); expr = `${a} − ${b} · ${c} + ${d}`; val = a - b * c + d; wrong = [(a - b) * c + d, a - b * c - d, val + b]; }
    else if (L === 4) { const b = int(3, 9), c = int(4, 15), a = b * int(6, 16), d = int(2, 7); expr = `(${a} : ${b} + ${c}) · ${d}`; val = (a / b + c) * d; wrong = [a / b + c * d, (a / b + c) * d + d, val - d * 2]; }
    else { const a = int(13, 29), b = int(12, 24), c = int(3, 9), d = c * int(12, 40); expr = `${a} · ${b} − ${d} : ${c}`; val = a * b - d / c; wrong = [(a * b - d) / c, val + 10, a * b + d / c]; }
    return C.mc({ stem: `Berechne ohne Taschenrechner: ${expr} = ?`, correct: val, distractors: wrong,
      explain: `Punkt- vor Strichrechnung (Klammern zuerst). Ergebnis: ${C.fmt(val)}.` });
  }, { weight: 1.2 });

  // Dreisatz (proportional / antiproportional)
  C.register(A, 'dreisatz', 'Dreisatz', (L) => {
    if (L <= 2 || C.R.chance(0.5)) {
      const things = [['Liter Benzin', 'Euro'], ['kg Äpfel', 'Euro'], ['Meter Kabel', 'Euro'], ['Packungen Batterien', 'Euro']];
      const [t, u] = pick(things);
      const unit = L <= 2 ? int(2, 9) * 0.5 : int(11, 39) / 10;
      const n1 = int(2, 6), n2 = n1 + int(1, 7);
      const p1 = Math.round(unit * n1 * 100) / 100, p2 = Math.round(unit * n2 * 100) / 100;
      return C.mc({ stem: `${n1} ${t} kosten ${C.fmt(p1)} ${u}. Wie viel kosten ${n2} ${t}?`, correct: p2,
        distractors: [p1 + (n2 - n1), p2 + unit, p2 - unit, p1 * n2], fmt: (x) => C.fmt(x) + ' €', positive: true,
        explain: `Erst auf 1 rechnen: ${C.fmt(p1)} : ${n1} = ${C.fmt(unit)} €. Dann · ${n2} = ${C.fmt(p2)} €.` });
    }
    // antiproportional
    const t = int(4, 12), w1 = pick([2, 3, 4, 5, 6]);
    const total = w1 * t;
    const divs = [];
    for (let k = 2; k <= 24; k++) if (total % k === 0 && k !== w1) divs.push(k);
    if (!divs.length) return null;
    const w2 = pick(divs);
    const res = total / w2;
    const job = pick([['Arbeiter', 'Tage', 'eine Halle zu streichen'], ['Soldaten', 'Stunden', 'einen Graben auszuheben'], ['Pumpen', 'Stunden', 'ein Becken zu leeren']]);
    return C.mc({ stem: `${w1} ${job[0]} brauchen ${t} ${job[1]}, um ${job[2]}. Wie lange brauchen ${w2} ${job[0]} bei gleichem Tempo?`,
      correct: res, distractors: [t * w2 / w1, t + (w1 - w2), res + 1, res - 1], fmt: (x) => C.fmt(x) + ' ' + job[1], positive: true,
      explain: `Antiproportional: mehr ${job[0]} → weniger Zeit. Gesamtaufwand ${w1} · ${t} = ${total}; ${total} : ${w2} = ${C.fmt(res)}.` });
  }, { weight: 1.2 });

  // Prozentrechnung
  C.register(A, 'prozent', 'Prozentrechnung', (L) => {
    if (L === 1) { const p = pick([10, 25, 50, 20]), g = int(4, 30) * 20; const w = g * p / 100;
      return C.mc({ stem: `Wie viel sind ${p} % von ${g}?`, correct: w, distractors: [w * 2, w / 2, g - w], explain: `${g} · ${p} / 100 = ${C.fmt(w)}.` }); }
    if (L === 2) { const p = pick([5, 15, 30, 35, 40, 60, 75]), g = int(3, 40) * 20; const w = g * p / 100;
      return C.mc({ stem: `Wie viel sind ${p} % von ${g}?`, correct: w, distractors: [w + g * 0.05, w - g * 0.05, g * (100 - p) / 100], explain: `1 % = ${C.fmt(g / 100)}; · ${p} = ${C.fmt(w)}.` }); }
    if (L === 3) { const p = pick([4, 8, 12, 15, 20, 25, 40]), w = p * int(2, 15); const g = w * 100 / p;
      return C.mc({ stem: `${w} sind ${p} % einer Zahl. Wie lautet die Zahl (Grundwert)?`, correct: g, distractors: [w * p / 100 * 10, g / 2, g + w], positive: true,
        explain: `Grundwert = Prozentwert · 100 / Prozentsatz = ${w} · 100 / ${p} = ${C.fmt(g)}.` }); }
    if (L === 4) { const p = pick([10, 20, 25, 30, 40]), g = int(4, 30) * 10; const neu = g * (100 - p) / 100;
      return C.mc({ stem: `Nach einem Rabatt von ${p} % kostet eine Jacke ${C.fmt(neu)} €. Wie hoch war der ursprüngliche Preis?`, correct: g,
        distractors: [neu * (100 + p) / 100, neu + p, g + 10], fmt: (x) => C.fmt(x) + ' €', positive: true,
        explain: `${C.fmt(neu)} € entsprechen ${100 - p} %. 100 % = ${C.fmt(neu)} : ${(100 - p) / 100} = ${C.fmt(g)} €. (Nicht einfach ${p} % aufschlagen!)` }); }
    const p = pick([10, 20, 25, 50]), g = int(2, 20) * 100;
    const end = g * (1 + p / 100) * (1 - p / 100);
    return C.mc({ stem: `Ein Preis von ${g} € wird erst um ${p} % erhöht und danach um ${p} % gesenkt. Wie hoch ist der Endpreis?`, correct: end,
      distractors: [g, g * (1 - p / 100), g * (1 + p / 100) - g * p / 100 + 1], fmt: (x) => C.fmt(x) + ' €',
      explain: `${g} · ${1 + p / 100} = ${C.fmt(g * (1 + p / 100))}; davon − ${p} %: · ${1 - p / 100} = ${C.fmt(end)} €. Der Endpreis ist niedriger als der Ausgangspreis.` });
  }, { weight: 1.2 });

  // Brüche
  C.register(A, 'bruch', 'Bruchrechnung', (L) => {
    if (L <= 3) {
      const d1 = pick([2, 3, 4, 5, 6, 8]), n1 = int(1, d1 - 1), x1 = d1 * int(3, 12);
      const d2 = pick([2, 3, 4, 5]), n2 = int(1, d2 - 1), x2 = d2 * int(2, 10);
      const v = x1 * n1 / d1 - x2 * n2 / d2;
      return C.mc({ stem: `Berechne: ${n1}/${d1} von ${x1} minus ${n2}/${d2} von ${x2}`, correct: v,
        distractors: [x1 * n1 / d1 + x2 * n2 / d2, x1 / d1 - x2 / d2, v + n1], explain: `${n1}/${d1} von ${x1} = ${C.fmt(x1 * n1 / d1)}; ${n2}/${d2} von ${x2} = ${C.fmt(x2 * n2 / d2)}; Differenz ${C.fmt(v)}.` });
    }
    // Brüche addieren -> Ergebnis als gekürzter Bruch
    const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
    const d1 = pick([3, 4, 5, 6, 8]), d2 = pick([2, 3, 4, 6, 9, 10].filter((x) => x !== d1));
    const n1 = int(1, d1 - 1), n2 = int(1, d2 - 1);
    const op = L === 5 ? pick(['+', '−', '·']) : pick(['+', '−']);
    let num, den;
    if (op === '+') { num = n1 * d2 + n2 * d1; den = d1 * d2; }
    else if (op === '−') { num = n1 * d2 - n2 * d1; den = d1 * d2; }
    else { num = n1 * n2; den = d1 * d2; }
    const g = gcd(num, den); num /= g; den /= g;
    const f = (a, b) => (b === 1 ? String(a) : `${a}/${b}`);
    const correct = f(num, den);
    const wrong = [f(n1 + n2, d1 + d2), f(Math.abs(num) + 1, den), f(num, den + 1), f(n1 * d2 + n2 * d1, d1 + d2)];
    return C.mc({ stem: `Berechne und kürze: ${n1}/${d1} ${op} ${n2}/${d2} = ?`, correct, distractors: wrong, fmt: (x) => String(x),
      explain: op === '·' ? `Zähler mal Zähler, Nenner mal Nenner, dann kürzen: ${correct}.` : `Auf gemeinsamen Nenner ${d1 * d2} bringen, dann rechnen und kürzen: ${correct}.` });
  });

  // Einheiten
  C.register(A, 'einheiten', 'Einheiten umrechnen', (L) => {
    const tasks = [
      () => { const v = int(2, 9) * 0.5; return [`${C.fmt(v)} Stunden = ? Minuten`, v * 60, [v * 100, v * 30, v * 60 + 30], 'min', '1 h = 60 min']; },
      () => { const v = int(3, 95) / 10; return [`${C.fmt(v)} km = ? m`, v * 1000, [v * 100, v * 10000, v * 1000 + 100], 'm', '1 km = 1000 m']; },
      () => { const v = int(2, 30) * 125; return [`${v} g = ? kg`, v / 1000, [v / 100, v / 10, v / 10000], 'kg', '1 kg = 1000 g']; },
      () => { const v = int(2, 9) * 0.25; return [`${C.fmt(v)} Liter = ? Milliliter`, v * 1000, [v * 100, v * 10, v * 10000], 'ml', '1 l = 1000 ml']; },
      () => { const v = int(2, 6) * 0.5; return [`${C.fmt(v)} Stunden = ? Sekunden`, v * 3600, [v * 360, v * 60, v * 36000], 's', '1 h = 3600 s']; },
      () => { const v = int(2, 9); return [`${v} m² = ? cm²`, v * 10000, [v * 100, v * 1000, v * 100000], 'cm²', '1 m² = 100 cm · 100 cm = 10 000 cm²']; },
      () => { const v = pick([18, 36, 54, 72, 90, 108]); return [`${v} km/h = ? m/s`, v / 3.6, [v / 6, v * 3.6, v / 3], 'm/s', 'km/h : 3,6 = m/s']; },
      () => { const v = int(2, 9); return [`${v} m³ = ? Liter`, v * 1000, [v * 100, v * 10, v * 10000], 'l', '1 m³ = 1000 l']; },
    ];
    const idx = L <= 2 ? int(0, 3) : L === 3 ? int(0, 5) : int(4, 7);
    const [q, c, d, u, rule] = tasks[idx]();
    return C.mc({ stem: `Rechne um: ${q}`, correct: c, distractors: d, fmt: (x) => C.fmt(x) + ' ' + u, explain: `${rule}. Ergebnis: ${C.fmt(c)} ${u}.` });
  });

  // Textaufgaben: Geschwindigkeit / Zeit / Strecke
  C.register(A, 'text', 'Textaufgaben', (L) => {
    const kind = L <= 2 ? 0 : pick([0, 1, 2]);
    if (kind === 0) {
      const v = pick([40, 60, 80, 90, 100, 120]), tMin = pick([30, 45, 90, 120, 150]);
      const s = v * tMin / 60;
      return C.mc({ stem: `Ein Fahrzeug fährt ${tMin} Minuten lang mit durchschnittlich ${v} km/h. Welche Strecke legt es zurück?`, correct: s,
        distractors: [v * tMin / 100, s + v / 2, s - v / 4], fmt: (x) => C.fmt(x) + ' km', positive: true, explain: `Strecke = v · t = ${v} km/h · ${C.fmt(tMin / 60)} h = ${C.fmt(s)} km.` });
    }
    if (kind === 1) {
      const v = pick([60, 72, 80, 90, 120]), tH = pick([1.5, 2.5, 0.75, 1.25]);
      const s = v * tH;
      return C.mc({ stem: `Ein Zug legt ${C.fmt(s)} km in ${C.fmt(tH)} Stunden zurück. Wie hoch ist seine Durchschnittsgeschwindigkeit?`, correct: v,
        distractors: [s / Math.floor(tH + 1), v + 10, v - 12], fmt: (x) => C.fmt(x) + ' km/h', positive: true, explain: `v = s : t = ${C.fmt(s)} : ${C.fmt(tH)} = ${v} km/h.` });
    }
    // Treffen zweier Fahrzeuge
    const v1 = pick([40, 50, 60, 70]), v2 = pick([50, 60, 80, 90]), t = pick([1.5, 2, 2.5, 3]);
    const s = (v1 + v2) * t;
    return C.mc({ stem: `Zwei Fahrzeuge starten gleichzeitig an zwei ${C.fmt(s)} km entfernten Orten und fahren aufeinander zu (${v1} km/h und ${v2} km/h). Nach wie vielen Stunden treffen sie sich?`, correct: t,
      distractors: [s / Math.abs(v2 - v1 || 10), t + 0.5, t - 0.5], fmt: (x) => C.fmt(x) + ' h', positive: true,
      explain: `Sie nähern sich mit ${v1} + ${v2} = ${v1 + v2} km/h. ${C.fmt(s)} : ${v1 + v2} = ${C.fmt(t)} h.` });
  }, { minLevel: 1 });

  // Geometrie
  C.register(A, 'geometrie', 'Geometrie', (L) => {
    const k = L <= 2 ? pick([0, 1]) : L === 3 ? pick([1, 2]) : pick([2, 3]);
    if (k === 0) { const a = int(3, 15), b = int(3, 15);
      return C.mc({ stem: `Ein Rechteck ist ${a} m lang und ${b} m breit. Wie groß ist sein Umfang?`, correct: 2 * (a + b), distractors: [a * b, a + b, 2 * a * b], fmt: (x) => C.fmt(x) + ' m', explain: `U = 2 · (a + b) = ${2 * (a + b)} m.` }); }
    if (k === 1) { const a = int(4, 16), b = int(3, 12);
      return C.mc({ stem: `Ein Rechteck ist ${a} m lang und ${b} m breit. Wie groß ist seine Fläche?`, correct: a * b, distractors: [2 * (a + b), a * b / 2, a * b + a], fmt: (x) => C.fmt(x) + ' m²', explain: `A = a · b = ${a * b} m².` }); }
    if (k === 2) { const g = int(3, 12) * 2, h = int(3, 14);
      return C.mc({ stem: `Ein Dreieck hat die Grundseite ${g} cm und die Höhe ${h} cm. Wie groß ist die Fläche?`, correct: g * h / 2, distractors: [g * h, g + h, g * h / 4], fmt: (x) => C.fmt(x) + ' cm²', explain: `A = g · h / 2 = ${g * h / 2} cm².` }); }
    const a = int(2, 9), b = int(2, 9), c = int(2, 6);
    if (C.R.chance(0.5)) return C.mc({ stem: `Ein Quader ist ${a} m lang, ${b} m breit und ${c} m hoch. Wie viele Liter Wasser passen hinein?`, correct: a * b * c * 1000,
      distractors: [a * b * c * 100, a * b * c, (a * b + b * c + a * c) * 2000], fmt: (x) => C.fmt(x) + ' l', explain: `V = ${a} · ${b} · ${c} = ${a * b * c} m³ = ${a * b * c * 1000} l.` });
    const p = pick([10, 20, 25, 50]); const A0 = a * b * 4;
    const A1 = (a * 2) * (b * 2) * (1 + p / 100) ** 2;
    return C.mc({ stem: `Ein Rechteck ist ${a * 2} m × ${b * 2} m groß. Beide Seiten werden um ${p} % verlängert. Wie groß ist die neue Fläche?`, correct: A1,
      distractors: [A0 * (1 + p / 100), A0 * (1 + 2 * p / 100) + 1, A0 + p], fmt: (x) => C.fmt(x) + ' m²', explain: `(${a * 2} · ${1 + p / 100}) · (${b * 2} · ${1 + p / 100}) = ${C.fmt(A1)} m². Die Fläche wächst um mehr als ${p} %.` });
  });

  // Rechenzeichen einsetzen
  C.register(A, 'zeichen', 'Rechenzeichen einsetzen', (L) => {
    const ops = ['+', '−', '·', ':'];
    const ev = (a, o1, b, o2, c) => {
      const f = (x, o, y) => (o === '+' ? x + y : o === '−' ? x - y : o === '·' ? x * y : x / y);
      const hi = (o) => o === '·' || o === ':';
      if (hi(o2) && !hi(o1)) return f(a, o1, f(b, o2, c));
      return f(f(a, o1, b), o2, c);
    };
    for (let t = 0; t < 100; t++) {
      const a = int(2, L >= 4 ? 24 : 12), b = int(2, 9), c = int(2, 9);
      const o1 = pick(ops), o2 = pick(ops);
      const r = ev(a, o1, b, o2, c);
      if (!Number.isInteger(r) || r < 0) continue;
      const combos = [];
      for (const x of ops) for (const y of ops) { const v = ev(a, x, b, y, c); if (v === r) combos.push(x + y); }
      if (combos.length !== 1) continue;
      const wrong = C.R.shuffle(ops.flatMap((x) => ops.map((y) => x + y)).filter((s) => s !== o1 + o2));
      return C.mc({ stem: `Welche Rechenzeichen gehören in die Lücken?  ${a} ☐ ${b} ☐ ${c} = ${r}`, correct: o1 + o2, distractors: wrong,
        fmt: (s) => `${s[0]}  und  ${s[1]}`, explain: `${a} ${o1} ${b} ${o2} ${c} = ${r} (Punkt vor Strich beachten).` });
    }
    return null;
  }, { minLevel: 2 });
})(window.CAT);
