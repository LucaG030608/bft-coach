/* Tab „Wissen“: Vorwissen für den Dienstantritt – Dienstgrade mit Originalabzeichen, Lernkarten, Abfragen, Liste fürs Heft.
   Wiederholung nach Leitner (1, 3, 7, 14, 28 Tage) wie im CAT-Trainer. */
(function (C) {
  'use strict';
  let B = null;
  const $ = (id) => document.getElementById(id);
  const { pick, shuffle } = C.R;
  const TSK = { heer: 'Heer', luftwaffe: 'Luftwaffe', marine: 'Marine' };
  const img = (d, cls) => `<img src="cat/img/dg/${d.id}.jpg" alt="" class="${cls || 'dgimg'}">`;

  function st() {
    const S = B.S; if (!S.vw) S.vw = {};
    const v = S.vw; v.tsk = v.tsk || 'heer'; v.box = v.box || {};
    return v;
  }
  const save = () => B.save();
  const ranks = (tsk) => C.DIENSTGRADE.filter((d) => d.tsk === tsk && d.level > 0);
  /* Alle Lernkarten (Fakten + NATO + Dienstgrade der gewählten Teilstreitkraft) mit stabiler ID */
  function cards() {
    const v = st(), out = [];
    C.WISSEN.forEach((w, i) => out.push({ id: 'w' + i, k: w.k, q: w.q, a: w.a, s: w.s }));
    C.NATO.forEach((n) => out.push({ id: 'n' + n[0], k: 'nato', sub: 'buch', q: 'Buchstabe ' + n[0] + ' im NATO-Alphabet?', a: n, s: 'Y-Magazin „Lifehacks“ / ICAO-Standard' }));
    (C.NATO_ZAHLEN || []).forEach(([z, w]) => out.push({ id: 'nz' + z, k: 'nato', sub: 'zahl', q: 'Wie spricht man die Zahl ' + z + ' im Sprechfunk?', a: w, s: 'Y-Magazin „Lifehacks“' }));
    (C.MERK || []).forEach((m) => {
      out.push({ id: 'm' + m.w, k: 'merk', sub: 'full', q: 'Wofür steht „' + m.w + '“ (' + m.t + ')?', a: m.l.map(([b, t]) => b + ' – ' + t).join(', '), s: 'Y-Magazin „Lifehacks“' });
      m.l.forEach(([b, t], i) => out.push({ id: 'm' + m.w + i, k: 'merk', sub: m.w, q: m.w + ' (' + m.t + '): Wofür steht das ' + (i + 1) + '. „' + b + '“?', a: t, s: 'Y-Magazin „Lifehacks“' }));
    });
    ranks(v.tsk).forEach((d) => out.push({ id: 'd' + d.id, k: 'dg', q: 'Welcher Dienstgrad ist das?', html: img(d, 'dgimg big'), a: d.name, s: 'Dienstgrad-Infografik © Bundeswehr', dg: d }));
    return out;
  }
  const today = () => B.iso(B.today0());
  function due(list) { const v = st(), t = today(); return list.filter((c) => !v.box[c.id] || v.box[c.id].due <= t); }
  function known(list) { const v = st(); return list.filter((c) => v.box[c.id] && v.box[c.id].b >= 3).length; }
  function grade(id, ok) {
    const v = st(), b = v.box[id] || { b: 0, due: today() };
    if (ok) { b.b = Math.min(5, b.b + 1); b.due = B.iso(B.addDays(B.today0(), [1, 1, 3, 7, 14, 28][b.b])); }
    else { b.b = 0; b.due = today(); }
    v.box[id] = b; save();
  }

  /* ---------- Fragen erzeugen ---------- */
  function mcFromCard(c, pool) {
    let cand = pool.filter((x) => x.k === c.k && x.a !== c.a && (!c.sub || x.sub === c.sub));
    if (cand.length < 3) cand = pool.filter((x) => x.k === c.k && x.a !== c.a);
    const others = [...new Set(shuffle(cand).map((x) => x.a))].slice(0, 3);
    const opts = shuffle([c.a, ...others]);
    return { id: c.id, stem: c.q, html: c.html || '', opts, ans: opts.indexOf(c.a), explain: c.a, s: c.s };
  }
  function dgQuestion(mode, tsk) {
    const R = ranks(tsk);
    const d = pick(R);
    if (mode === 'bild') { // Abzeichen → Name
      const o = shuffle([d, ...shuffle(R.filter((x) => x.name !== d.name)).slice(0, 3)]);
      return { id: 'd' + d.id, stem: 'Welcher Dienstgrad ist das?', html: img(d, 'dgimg big'), opts: o.map((x) => x.name), ans: o.indexOf(d), explain: d.name + ' · ' + d.gruppe, s: 'Dienstgrad-Infografik © Bundeswehr' };
    }
    if (mode === 'name') { // Name → Abzeichen
      const o = shuffle([d, ...shuffle(R.filter((x) => x.name !== d.name && x.pos[0] === d.pos[0])).slice(0, 3)]);
      return { id: 'd' + d.id, stem: 'Welches Abzeichen gehört zu: ' + d.name + '?', opts: o.map((x) => x.name), optHtml: o.map((x) => img(x)), ans: o.indexOf(d), explain: d.name + ' · ' + d.gruppe, s: 'Dienstgrad-Infografik © Bundeswehr' };
    }
    if (mode === 'gruppe') {
      const groups = [...new Set(R.map((x) => x.gruppe))];
      const o = shuffle([d.gruppe, ...shuffle(groups.filter((g) => g !== d.gruppe)).slice(0, 3)]);
      return { id: 'd' + d.id, stem: 'Zu welcher Dienstgradgruppe gehört: ' + d.name + '?', html: img(d, 'dgimg'), opts: o, ans: o.indexOf(d.gruppe), explain: d.name + ' gehört zu: ' + d.gruppe, s: 'Dienstgrad-Infografik © Bundeswehr' };
    }
    if (mode === 'hoeher') {
      for (let t = 0; t < 50; t++) {
        const [a, b] = shuffle(R).slice(0, 2);
        if (a.level === b.level) continue;
        const hi = a.level > b.level ? a : b;
        const o = shuffle([a, b]);
        return { id: 'd' + hi.id, stem: 'Welcher Dienstgrad ist höher?', opts: o.map((x) => x.name), optHtml: o.map((x) => img(x) + '<div class="small">' + B.esc(x.name) + '</div>'), ans: o.indexOf(hi), explain: hi.name + ' ist höher (' + hi.gruppe + ').', s: 'Dienstgrad-Infografik © Bundeswehr' };
      }
    }
    if (mode === 'marine') { // Heer/Luftwaffe ↔ Marine (gleiche Position in der Infografik = gleichwertig)
      const H = ranks('heer').filter((x) => !x.gruppe.startsWith('Sanit')), M = ranks('marine');
      const h = pick(H), m = M.find((x) => x.pos === h.pos);
      const toMarine = Math.random() < 0.5;
      const [src, dst, pool] = toMarine ? [h, m, M.filter((x) => !x.gruppe.startsWith('Sanit'))] : [m, h, H];
      const o = shuffle([dst, ...shuffle(pool.filter((x) => x.name !== dst.name && Math.abs(x.level - dst.level) <= 4)).slice(0, 3)]);
      return { id: 'eq' + h.pos, stem: 'Welcher ' + (toMarine ? 'Marine' : 'Heeres') + '-Dienstgrad entspricht „' + src.name + '“?', html: img(src, 'dgimg'), opts: o.map((x) => x.name), ans: o.indexOf(dst), explain: h.name + ' (Heer) = ' + m.name + ' (Marine).', s: 'Dienstgrad-Infografik © Bundeswehr' };
    }
    return null;
  }

  /* ---------- Quiz-Ablauf ---------- */
  let Q = null;
  function startQuiz(title, gen, n) {
    Q = { title, gen, n, i: 0, ok: 0, wrong: [] };
    $('sessModal').classList.remove('hidden');
    nextQ();
  }
  function head(sub) { return '<div class="shead"><button class="pill" id="vQuit">Beenden</button><div class="sc"><div class="st">' + B.esc(Q.title) + '</div><div class="muted small">' + sub + '</div></div><span style="width:74px"></span></div>'; }
  function nextQ() {
    if (Q.i >= Q.n) return doneQuiz();
    let q = null; for (let t = 0; t < 10 && !q; t++) q = Q.gen(Q.i);
    if (!q) return doneQuiz();
    Q.cur = q; Q.answered = false;
    const g = !!q.optHtml;
    let h = head('Frage ' + (Q.i + 1) + '/' + Q.n);
    h += '<div class="cat-q"><div class="cat-stem">' + B.esc(q.stem) + '</div>' + (q.html ? '<div class="center" style="margin:8px 0 14px">' + q.html + '</div>' : '');
    h += '<div class="cat-opts' + (g ? ' g' : '') + '">' + q.opts.map((o, i) => '<button class="cat-opt" data-i="' + i + '"><span class="L">' + 'ABCD'[i] + '</span><span class="O">' + (g ? q.optHtml[i] : B.esc(o)) + '</span></button>').join('') + '</div>';
    h += '<div id="vFb"></div><div class="btnrow" style="margin-bottom:30px"><button class="btn" id="vNext" style="display:none">Weiter</button></div></div>';
    $('sessSheet').innerHTML = h; $('sessSheet').scrollTop = 0;
    $('vQuit').onclick = () => { Q = null; B.closeSess(); };
    document.querySelectorAll('.cat-opt').forEach((b) => { b.onclick = () => answer(+b.dataset.i); });
    $('vNext').onclick = () => { Q.i++; nextQ(); };
  }
  function answer(i) {
    if (Q.answered) return; Q.answered = true;
    const q = Q.cur, ok = i === q.ans;
    if (ok) Q.ok++; else Q.wrong.push(q);
    grade(q.id, ok);
    document.querySelectorAll('.cat-opt').forEach((b) => { const k = +b.dataset.i; if (k === q.ans) b.classList.add('ok'); else if (k === i) b.classList.add('bad'); });
    $('vFb').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'bad') + '"><b>' + (ok ? 'Richtig' : 'Falsch') + '</b><div style="margin-top:4px;font-weight:400">' + B.esc(q.explain) + '</div><div class="muted small" style="margin-top:4px">Quelle: ' + B.esc(q.s) + '</div></div>';
    $('vNext').style.display = '';
  }
  function doneQuiz() {
    let h = '<div class="shead"><span style="width:74px"></span><div class="sc"><div class="st">' + B.esc(Q.title) + '</div><div class="muted small">Ergebnis</div></div><span style="width:74px"></span></div>';
    h += '<div class="summary" style="padding-top:8px"><div class="sumic">' + B.IC.check + '</div><div class="st">' + Q.ok + ' von ' + Q.i + ' richtig</div></div>';
    if (Q.wrong.length) h += '<div class="sec">Nochmal ansehen</div><div class="card pad">' + Q.wrong.map((q) => '<div class="goal">' + (q.html ? '<div style="float:right;margin-left:8px">' + q.html.replace('dgimg big', 'dgimg') + '</div>' : '') + '<div class="small muted">' + B.esc(q.stem) + '</div><b>' + B.esc(q.explain) + '</b><div style="clear:both"></div></div>').join('') + '</div>';
    h += '<div class="btnrow" style="margin-bottom:30px"><button class="btn" id="vDone">Fertig</button></div>';
    $('sessSheet').innerHTML = h; $('vDone').onclick = () => { Q = null; B.closeSess(); };
  }

  /* ---------- Lernkarten (aufdecken, selbst bewerten) ---------- */
  function startCards(list, title) {
    const v = st();
    const order = shuffle(list).sort((a, b) => ((v.box[a.id] || { b: -1 }).b - (v.box[b.id] || { b: -1 }).b));
    let i = 0, show = false;
    $('sessModal').classList.remove('hidden');
    const draw = () => {
      if (i >= order.length) { B.closeSess(); B.toast('Alle Karten durch!'); return; }
      const c = order[i];
      let h = '<div class="shead"><button class="pill" id="vQuit">Beenden</button><div class="sc"><div class="st">' + B.esc(title) + '</div><div class="muted small">Karte ' + (i + 1) + '/' + order.length + '</div></div><span style="width:74px"></span></div>';
      h += '<div class="card pad flash"><div class="muted small">' + B.esc(C.WISSEN_KAT[c.k]) + '</div><div class="cat-stem">' + B.esc(c.q) + '</div>' + (c.html ? '<div class="center">' + c.html + '</div>' : '');
      if (show) h += '<div class="fb ok" style="font-size:16px">' + B.esc(c.a) + '</div><div class="muted small" style="margin-top:6px">Quelle: ' + B.esc(c.s) + '</div>';
      h += '</div>';
      h += show ? '<div class="btnrow"><button class="btn2" id="vNo">Nicht gewusst</button><button class="btn" id="vYes">Gewusst</button></div>' : '<div class="btnrow"><button class="btn" id="vShow">Antwort zeigen</button></div>';
      $('sessSheet').innerHTML = h;
      $('vQuit').onclick = () => B.closeSess();
      if (show) { $('vNo').onclick = () => { grade(c.id, false); i++; show = false; draw(); }; $('vYes').onclick = () => { grade(c.id, true); i++; show = false; draw(); }; }
      else $('vShow').onclick = () => { show = true; draw(); };
    };
    draw();
  }

  /* ---------- Liste fürs Heft ---------- */
  function showList(kind) {
    const v = st();
    let h = '<div class="shead"><button class="pill" id="vQuit">Zurück</button><div class="sc"><div class="st">' + (kind === 'dg' ? 'Dienstgrade ' + TSK[v.tsk] : 'Alles zum Abschreiben') + '</div><div class="muted small">für dein Heft</div></div><span style="width:74px"></span></div>';
    if (kind === 'dg') {
      const R = C.DIENSTGRADE.filter((d) => d.tsk === v.tsk);
      [...new Set(R.map((d) => d.gruppe))].forEach((g) => {
        h += '<div class="sec">' + B.esc(g) + '</div><div class="dggrid">' + R.filter((d) => d.gruppe === g).map((d) => '<div class="dgcell">' + img(d) + '<div>' + B.esc(d.name) + '</div>' + (d.info ? '<div class="muted small">' + B.esc(d.info.split(':')[1] || '') + '</div>' : '') + '</div>').join('') + '</div>';
      });
      h += '<div class="muted small" style="margin:14px 4px 30px">Abzeichen: Infografik „Dienstgrade“ © Bundeswehr. Gleichwertige Dienstgrade stehen in allen drei Teilstreitkräften an derselben Stelle.</div>';
    } else {
      Object.keys(C.WISSEN_KAT).filter((k) => k !== 'dg').forEach((k) => {
        h += '<div class="sec">' + B.esc(C.WISSEN_KAT[k]) + '</div><div class="card pad">';
        if (k === 'nato') h += '<div class="nato">' + C.NATO.map((n) => '<span><b>' + n[0] + '</b> ' + n + '</span>').join('') + '</div><div class="nato" style="margin-top:12px">' + (C.NATO_ZAHLEN || []).map(([z, w]) => '<span><b>' + z + '</b> ' + w + '</span>').join('') + '</div>';
        else if (k === 'merk') h += (C.MERK || []).map((m) => '<div class="goal"><b>' + B.esc(m.w) + '</b> <span class="muted small">' + B.esc(m.t) + '</span><div>' + m.l.map(([b, t]) => '<b>' + B.esc(b) + '</b> ' + B.esc(t)).join(' · ') + '</div></div>').join('');
        else C.WISSEN.filter((w) => w.k === k).forEach((w) => { h += '<div class="goal"><b>' + B.esc(w.q) + '</b><div>' + B.esc(w.a) + '</div><div class="muted small">' + B.esc(w.s) + '</div></div>'; });
        h += '</div>';
      });
      h += '<div style="height:30px"></div>';
    }
    $('sessSheet').innerHTML = h; $('sessModal').classList.remove('hidden'); $('sessSheet').scrollTop = 0;
    $('vQuit').onclick = () => B.closeSess();
  }

  /* ---------- Tab ---------- */
  const ICB = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>';
  function row(id, t, m, ic) { return '<div class="row tap" id="' + id + '"><div class="ic">' + (ic || ICB) + '</div><div class="tx"><div class="t">' + t + '</div><div class="m">' + m + '</div></div><div class="end">' + B.IC.chev + '</div></div>'; }
  function render() {
    const el = $('v-wissen'), v = st(), all = cards(), d = due(all);
    let h = B.topbar('Wissen', 'Vor dem Dienstantritt auswendig lernen');
    h += '<div class="card pad"><div class="inline" style="justify-content:space-between"><div><div class="muted small">Sicher gelernt</div><div class="big">' + known(all) + '<span class="muted" style="font-size:15px"> / ' + all.length + '</span></div></div><button class="btn mini" id="vDue">' + (d.length ? d.length + ' fällig – lernen' : 'Alles wiederholt') + '</button></div><div class="bar"><div style="width:' + Math.round(known(all) / all.length * 100) + '%"></div></div><div class="muted small">Karten kommen nach 1, 3, 7, 14 und 28 Tagen wieder. Tipp: zusätzlich ins Heft schreiben – Abschreiben festigt das Gedächtnis.</div></div>';
    h += '<div class="sec">Dienstgrade</div><div class="seg3">' + Object.keys(TSK).map((k) => '<button class="pill' + (k === v.tsk ? ' acc' : '') + '" data-tsk="' + k + '">' + TSK[k] + '</button>').join('') + '</div><div class="card">';
    h += row('vDgList', 'Alle Dienstgrade ansehen', 'Originalabzeichen mit Bezeichnung – zum Abschreiben');
    h += row('vDgCards', 'Lernkarten', ranks(v.tsk).length + ' Abzeichen · aufdecken und selbst bewerten');
    h += row('vQBild', 'Abfrage: Abzeichen → Name', '15 Fragen');
    h += row('vQName', 'Abfrage: Name → Abzeichen', '15 Fragen');
    h += row('vQGruppe', 'Abfrage: Dienstgradgruppe', 'Mannschaften, Unteroffiziere, Offiziere …');
    h += row('vQHoeher', 'Abfrage: Welcher ist höher?', 'Rangfolge sicher beherrschen');
    h += row('vQMarine', 'Abfrage: Heer ↔ Marine', 'Gleichwertige Dienstgrade');
    h += '</div>';
    h += '<div class="sec">Wissensgebiete</div><div class="card">';
    Object.keys(C.WISSEN_KAT).filter((k) => k !== 'dg').forEach((k) => {
      const list = all.filter((c) => c.k === k);
      h += '<div class="row"><div class="ic">' + ICB + '</div><div class="tx"><div class="t">' + B.esc(C.WISSEN_KAT[k]) + '</div><div class="m">' + known(list) + '/' + list.length + ' sicher</div></div><div class="end"><button class="ghost" data-cards="' + k + '">Karten</button><button class="ghost" data-quiz="' + k + '">Abfrage</button></div></div>';
    });
    h += '</div><div class="card">' + row('vAllList', 'Alles als Liste zum Abschreiben', 'Alle Fakten mit Quelle') + '</div>';
    h += '<div class="muted small" style="margin:6px 4px 20px">Quellen: Soldatengesetz (gesetze-im-internet.de), bundeswehr.de (Heimatschutzausbildung, Ausrüstung, Biwak, Waffenausbildung, Gelöbnis, Division Schnelle Kräfte, Luftlandebrigade 1), Infografik „Dienstgrade“ © Bundeswehr. Stand: 28.11.2026.</div>';
    el.innerHTML = h; B.bindTop(el);
    el.querySelectorAll('[data-tsk]').forEach((b) => { b.onclick = () => { v.tsk = b.dataset.tsk; save(); render(); }; });
    const T = v.tsk, tn = TSK[T];
    $('vDue').onclick = () => { if (d.length) startCards(d.slice(0, 30), 'Fällige Karten'); };
    $('vDgList').onclick = () => showList('dg');
    $('vDgCards').onclick = () => startCards(all.filter((c) => c.k === 'dg'), 'Dienstgrade ' + tn);
    $('vQBild').onclick = () => startQuiz('Abzeichen → Name (' + tn + ')', () => dgQuestion('bild', T), 15);
    $('vQName').onclick = () => startQuiz('Name → Abzeichen (' + tn + ')', () => dgQuestion('name', T), 15);
    $('vQGruppe').onclick = () => startQuiz('Dienstgradgruppe (' + tn + ')', () => dgQuestion('gruppe', T), 15);
    $('vQHoeher').onclick = () => startQuiz('Welcher ist höher? (' + tn + ')', () => dgQuestion('hoeher', T), 15);
    $('vQMarine').onclick = () => startQuiz('Heer ↔ Marine', () => dgQuestion('marine'), 15);
    $('vAllList').onclick = () => showList('all');
    el.querySelectorAll('[data-cards]').forEach((b) => { b.onclick = () => startCards(all.filter((c) => c.k === b.dataset.cards), C.WISSEN_KAT[b.dataset.cards]); });
    el.querySelectorAll('[data-quiz]').forEach((b) => {
      b.onclick = () => {
        const list = all.filter((c) => c.k === b.dataset.quiz);
        const order = shuffle(list);
        startQuiz(C.WISSEN_KAT[b.dataset.quiz], (i) => mcFromCard(order[i % order.length], all), Math.min(15, list.length));
      };
    });
  }

  C.vw = { init(bridge) { B = bridge; st(); }, render };
})(window.CAT);
