/* CAT-Trainer: adaptive Engine, Lernplan und Oberfläche (eingebettet in BFT-Coach) */
(function (C) {
  'use strict';
  const AREAS = C.AREAS, LB = C.LAUFBAHNEN;
  let B = null; // Brücke zur BFT-App (window.BFT)
  const $ = (id) => document.getElementById(id);

  /* =================== Zustand =================== */
  function st() {
    const S = B.S;
    if (!S.cat) S.cat = {};
    const c = S.cat;
    c.laufbahn = c.laufbahn || 'feldwebel';
    c.theta = c.theta || {}; c.n = c.n || {};
    c.hist = c.hist || []; c.days = c.days || {}; c.mist = c.mist || [];
    if (c.hideClock === undefined) c.hideClock = true;
    return c;
  }
  const save = () => B.save();
  function testDate() {
    const c = st();
    if (c.testDate) return B.parseD(c.testDate);
    if (B.S.kc && B.S.kc.date) return B.parseD(B.S.kc.date);
    return B.parseD(B.S.dienst || '2027-04-01');
  }
  const areasFor = (lb) => [...new Set(LB[lb].sections.map((s) => s.area))];
  const trainAreas = (lb) => areasFor(lb).filter((a) => a !== 'reaktion');
  /* Standard-Abschnitt für Einstufung/Kontrolle/Training eines Bereichs */
  const SECDEF = { sprache: { type: 'rechtschreibung' }, konz: { type: 'symbolrechnen' }, reaktion: { mode: 'block' } };
  function defSection(a, n) { return Object.assign({ area: a, n, mode: 'item', time: AREAS[a].time }, SECDEF[a] || {}, a === 'reaktion' ? { n: Math.max(12, n * 3) } : {}); }

  /* =================== Adaptive Engine (IRT, 3PL vereinfacht) =================== */
  const sig = (x) => 1 / (1 + Math.exp(-x));
  const Phi = (x) => sig(1.702 * x);
  function pCorrect(theta, item) {
    const b = item.level - 3;
    const c = item.kind === 'mc' && item.options ? 1 / item.options.length : 0;
    return c + (1 - c) * sig(1.3 * (theta - b));
  }
  function eap(resps, prior) {
    let num = 0, den = 0;
    for (let t = -4; t <= 4.001; t += 0.1) {
      let w = Math.exp(-0.5 * (t - prior) ** 2);
      for (const r of resps) { const p = pCorrect(t, r.item); w *= r.ok ? p : 1 - p; }
      num += t * w; den += w;
    }
    return den ? num / den : prior;
  }
  const score = (theta) => Math.round(Phi(theta) * 100);
  const levelFor = (theta, jitter = 0.6) => Math.max(1, Math.min(5, Math.round(theta + 3 + (Math.random() - 0.5) * jitter)));
  function eloUpdate(area, item, ok) {
    const c = st();
    const th = c.theta[area] || 0, n = c.n[area] || 0;
    const K = Math.max(0.12, 0.9 / Math.sqrt(1 + n));
    c.theta[area] = Math.max(-3.5, Math.min(3.5, th + K * ((ok ? 1 : 0) - pCorrect(th, item))));
    c.n[area] = n + 1;
  }

  /* =================== Lernplan =================== */
  const PHASES = [
    { key: 'grund', name: 'Grundlagen', from: 9999, to: 74, tip: 'Lücken schließen. Neue Aufgabentypen kennenlernen, Schwächen zuerst. Alle 2 Wochen Kontrolltest.' },
    { key: 'aufbau', name: 'Aufbau', from: 73, to: 32, tip: 'Gemischt üben mit Zeitlimit. Samstags volle Simulation, alle 2 Wochen Kontrolltest.' },
    { key: 'pruef', name: 'Prüfungsmodus', from: 31, to: 4, tip: 'Testroutine: Mo, Mi, Sa Simulation unter echten Bedingungen (nie auf harten BFT-Tagen).' },
    { key: 'taper', name: 'Erholung', from: 3, to: 0, tip: 'Nur leicht wiederholen, früh schlafen. Kein Neues mehr.' },
  ];
  function daysLeft(d) { return Math.round((testDate() - d) / 864e5); }
  function phaseOf(d) {
    const dl = daysLeft(d);
    if (dl < 0) return { key: 'done', name: 'Test vorbei', tip: '' };
    return PHASES.find((p) => dl <= p.from && dl >= p.to) || PHASES[0];
  }
  function weakest(k) {
    const c = st();
    return trainAreas(c.laufbahn).slice().sort((a, b) => (c.theta[a] || 0) - (c.theta[b] || 0)).slice(0, k);
  }
  /* Abstimmung mit dem BFT-Plan: harte Einheiten = weniger CAT, keine Simulation */
  function bftLoad(d) {
    let u = [];
    try { u = B.dayUnits ? B.dayUnits(d) : []; } catch (e) { u = []; }
    const k = u.map((x) => x.kind);
    if (k.includes('test') || k.includes('kc')) return 'test';
    if (k.includes('interval') || k.includes('march')) return 'hard';
    return 'normal';
  }
  const LOADTXT = { test: 'BFT-Test heute', hard: 'harte BFT-Einheit heute' };
  function simBase(d) {
    const ph = phaseOf(d).key, dow = d.getDay();
    return (ph === 'aufbau' && dow === 6) || (ph === 'pruef' && (dow === 1 || dow === 3 || dow === 6));
  }
  function simShiftTarget(b) {
    for (let k = 1; k <= 3; k++) {
      const x = B.addDays(b, k);
      if (simBase(x)) return null; // nächste reguläre Simulation kommt ohnehin
      const nx = B.addDays(x, 1);
      if (simBase(nx) && bftLoad(nx) === 'normal') continue; // keine zwei Simulationen direkt hintereinander
      if (x.getDay() !== 0 && bftLoad(x) === 'normal' && ['aufbau', 'pruef'].includes(phaseOf(x).key)) return x;
    }
    return null;
  }
  function isSimDay(d) {
    if (simBase(d) && bftLoad(d) === 'normal') return true;
    for (let k = 1; k <= 3; k++) {
      const b = B.addDays(d, -k);
      if (simBase(b) && bftLoad(b) !== 'normal') { const t = simShiftTarget(b); if (t && +t === +d) return true; }
    }
    return false;
  }
  function lastCheckDate() { const c = st(); return [c.placed, c.lastCheck].filter(Boolean).sort().pop(); }
  function checkDue(d) {
    const c = st(), ph = phaseOf(d).key, lc = lastCheckDate();
    if (!c.placed || !['grund', 'aufbau'].includes(ph) || d.getDay() === 0) return false;
    if (c.lastCheck === B.iso(d)) return true;
    if ((d - B.parseD(lc)) / 864e5 < 14) return false;
    return bftLoad(d) === 'normal' && !isSimDay(d);
  }
  function dueMistakes(d) { const t = B.iso(d); return st().mist.filter((m) => m.due <= t); }
  function todayTask(d) {
    const c = st(), ph = phaseOf(d), dow = d.getDay();
    if (ph.key === 'done') return null;
    if (!c.placed) return { kind: 'placement', t: 'Einstufungstest', m: 'Einmalig · ca. 30 Min. · misst deinen Stand in jedem Bereich' };
    if (dow === 0 && ph.key !== 'taper') return { kind: 'rest', t: 'CAT-Pause', m: 'Sonntag: Erholung. Verteiltes Lernen braucht Pausen.' };
    if (ph.key === 'taper') return { kind: 'train', n: 10, easy: true, t: 'Lockere Wiederholung', m: '10 Aufgaben, leicht · Kopf frei bekommen' };
    const load = bftLoad(d);
    if (load === 'test') return { kind: 'train', n: 10, easy: true, t: 'Kurze Wiederholung', m: LOADTXT.test + ' · nur 10 lockere Aufgaben' };
    if (isSimDay(d)) return { kind: 'sim', t: 'Prüfungssimulation', m: LB[c.laufbahn].name + ' · ca. ' + simMinutes() + ' Min.' + (simBase(d) ? '' : ' · verschoben wegen BFT') };
    if (checkDue(d)) return { kind: 'check', t: 'Kontrolltest', m: 'Alle 2 Wochen · ca. ' + Math.round(areasFor(c.laufbahn).length * 3 * 50 / 60) + ' Min. · misst deinen Fortschritt' };
    let n = ph.key === 'grund' ? 25 : ph.key === 'aufbau' ? 30 : 20;
    if (load === 'hard') n = Math.round(n * 0.6);
    const w = weakest(2).map((a) => AREAS[a].name.split(' ')[0]).join(' & ');
    const dm = dueMistakes(d).length;
    return { kind: 'train', n, t: 'Tagestraining', m: n + ' Aufgaben gemischt · Fokus ' + w + (dm ? ' · ' + dm + ' Wiederholungen' : '') + (load === 'hard' ? ' · kürzer: ' + LOADTXT.hard : '') };
  }
  function simMinutes(lb) {
    const c = st();
    return Math.round(LB[lb || c.laufbahn].sections.reduce((s, x) => s + (x.mode === 'section' ? x.time : x.mode === 'block' ? x.n * 3 : x.n * x.time * 0.45), 0) / 60);
  }
  function taskDone(d) {
    const day = st().days[B.iso(d)];
    const t = todayTask(d);
    if (!t || t.kind === 'rest') return false;
    if (!day) return false;
    if (t.kind === 'placement') return !!st().placed;
    if (t.kind === 'sim') return !!day.sim;
    if (t.kind === 'check') return st().lastCheck === B.iso(d);
    return (day.n || 0) >= t.n;
  }
  function streak() {
    let s = 0, d = B.today0();
    if (!st().days[B.iso(d)]) d = B.addDays(d, -1);
    for (let i = 0; i < 400; i++) {
      if (st().days[B.iso(d)]) s++; else if (d.getDay() !== 0) break;
      d = B.addDays(d, -1);
    }
    return s;
  }

  /* =================== Session =================== */
  let SES = null, TIMER = null, RX = null;
  function startSession(kind, opt = {}) {
    const c = st();
    let secs = [];
    if (kind === 'placement') {
      secs = areasFor(c.laufbahn).map((a) => defSection(a, C.PLACEMENT_PER_AREA));
      SES = { kind, title: 'Einstufungstest', feedback: false, test: true, secs, prior: () => 0 };
    } else if (kind === 'check') {
      secs = areasFor(c.laufbahn).map((a) => defSection(a, 3));
      SES = { kind, title: 'Kontrolltest', feedback: false, test: true, secs, prior: (a) => c.theta[a] || 0, before: Object.fromEntries(areasFor(c.laufbahn).map((a) => [a, score(c.theta[a] || 0)])) };
    } else if (kind === 'sim') {
      secs = LB[c.laufbahn].sections.map((x) => Object.assign({}, x));
      SES = { kind, title: 'Simulation · ' + LB[c.laufbahn].short, feedback: false, test: true, secs, prior: (a) => (c.theta[a] || 0) * 0.5 };
    } else if (kind === 'area') {
      const sec = defSection(opt.area, opt.n || 15);
      if (opt.area === 'reaktion') sec.n = 20;
      if (opt.area === 'technik' || opt.area === 'sprache' || opt.area === 'konz') delete sec.type; // im Training alle Aufgabentypen
      secs = [sec];
      SES = { kind, title: 'Training · ' + AREAS[opt.area].name, feedback: true, secs };
    } else if (kind === 'mist') {
      const due = dueMistakes(B.today0());
      if (!due.length) { B.toast('Keine fälligen Wiederholungen.'); return; }
      secs = [{ area: 'mist', n: Math.min(due.length, 20), mode: 'item' }];
      SES = { kind, title: 'Fehler wiederholen', feedback: true, secs, mistQ: due.slice() };
    } else {
      secs = [{ area: 'mix', n: opt.n || 25, mode: 'item' }];
      SES = { kind: 'train', title: opt.easy ? 'Lockere Wiederholung' : 'Tagestraining', feedback: true, secs, easy: !!opt.easy,
        mistQ: dueMistakes(B.today0()).slice(0, Math.round((opt.n || 25) * 0.3)) };
    }
    SES.timed = SES.test || c.timed !== false;
    SES.hideClock = SES.test && c.hideClock !== false;
    Object.assign(SES, { secIdx: 0, inSec: 0, resp: [], started: Date.now(), lastType: null, intro: SES.test });
    $('sessModal').classList.remove('hidden');
    B.wake(true);
    if (SES.intro) drawIntro(); else beginSection();
  }
  const curSec = () => SES.secs[SES.secIdx];
  function beginSection() {
    const sec = curSec();
    SES.inSec = 0; SES.secStart = Date.now();
    if (sec.mode === 'block') return runReaction(sec);
    nextItem();
  }
  function pickMixArea() {
    const c = st();
    const r = Math.random(), w = weakest(2), all = trainAreas(c.laufbahn);
    if (r < 0.4) return w[0];
    if (r < 0.6) return w[1] || w[0];
    return all[Math.floor(Math.random() * all.length)];
  }
  function nextItem() {
    const sec = curSec();
    let item = null, area = sec.area, mist = null;
    if (SES.mistQ && SES.mistQ.length && (sec.area === 'mist' || (sec.area === 'mix' && Math.random() < 0.35))) {
      mist = SES.mistQ.shift(); item = JSON.parse(JSON.stringify(mist.item)); area = item.area;
    }
    if (!item) {
      if (area === 'mix') area = pickMixArea();
      let level;
      if (sec.adaptive === false) level = Math.min(5, 1 + Math.floor(SES.inSec / sec.n * 5)); // klassisch: steigende Schwierigkeit
      else {
        let theta;
        if (SES.test) theta = eap(SES.resp.filter((r) => r.area === area), SES.prior(area));
        else theta = st().theta[area] || 0;
        if (SES.easy) theta -= 1;
        level = levelFor(theta, SES.kind === 'sim' ? 0.3 : 0.8);
      }
      // Interleaving: nicht zweimal derselbe Aufgabentyp hintereinander
      for (let t = 0; t < 4; t++) {
        item = C.generate(area, level, sec.type);
        if (!item || sec.type || item.type !== SES.lastType) break;
      }
    }
    SES.cur = item; SES.curMist = mist; SES.sel = item.kind === 'mark' ? [] : null; SES.answered = false;
    SES.lastType = item.type;
    SES.t0 = Date.now();
    SES.limit = sec.mode === 'section' ? null : (sec.area === 'mix' || sec.area === 'mist' ? AREAS[item.area].time : (sec.time || AREAS[item.area].time));
    drawItem();
    clearInterval(TIMER);
    if (SES.timed) TIMER = setInterval(tick, 250);
  }
  function timeLeft() {
    const sec = curSec();
    if (sec.mode === 'section') return sec.time - (Date.now() - SES.secStart) / 1000;
    return SES.limit - (Date.now() - SES.t0) / 1000;
  }
  function tick() {
    if (!SES || RX) return;
    const sec = curSec();
    if (SES.answered && sec.mode !== 'section') return;
    const left = timeLeft(), total = sec.mode === 'section' ? sec.time : SES.limit;
    const bar = $('cTbar'), txt = $('cTtxt');
    if (bar) { bar.style.width = Math.max(0, left / total * 100) + '%'; bar.parentNode.classList.toggle('over', left < 10); }
    if (txt) txt.textContent = B.mmss(Math.max(0, left));
    if (left <= 0) {
      clearInterval(TIMER);
      if (sec.mode === 'section') { if (!SES.answered) record(true, false); nextSection(); }
      else submit(true);
    }
  }
  function sectionLabel() {
    const sec = curSec();
    if (SES.secs.length > 1) return 'Teil ' + (SES.secIdx + 1) + '/' + SES.secs.length + ' · ' + AREAS[sec.area].name;
    return SES.title;
  }
  function head(sub) {
    return '<div class="shead"><button class="pill" id="cQuit">Beenden</button><div class="sc"><div class="st">' + B.esc(SES.title) + '</div><div class="muted small">' + sub + '</div></div><span style="width:74px"></span></div>';
  }
  function bindQuit() {
    $('cQuit').onclick = () => B.confirmDlg('Abbrechen?', SES.test ? 'Der Test wird nicht gewertet. Bereits beantwortete Aufgaben fließen trotzdem in deinen Stand ein.' : 'Dein Fortschritt bis hierhin wird gespeichert.', 'Beenden', () => { endSession(true); }, true);
  }
  function secTimeText(sec) {
    if (sec.mode === 'block') return '3 s je Signal';
    if (sec.mode === 'section') return B.mmss(sec.time) + ' Min. für den Teil';
    return (sec.time >= 120 ? 'bis ' + Math.round(sec.time / 60) + ' Min.' : sec.time + ' s') + ' je Aufgabe';
  }
  function drawIntro() {
    const sec = curSec(), a = AREAS[sec.area];
    let h = head(sectionLabel());
    h += '<div class="cat-intro"><div class="muted small">Teil ' + (SES.secIdx + 1) + ' von ' + SES.secs.length + '</div><h2>' + B.esc(a.name) + '</h2><p>' + B.esc(a.intro) + '</p>';
    h += '<div class="card pad"><div class="grid2">' + B.stat(sec.mode === 'block' ? 'Signale' : sec.mode === 'section' ? 'Aufgaben (max.)' : 'Aufgaben', sec.n) + B.stat('Zeit', secTimeText(sec)) + '</div>';
    h += '<ul class="tips small"><li>Kein Zurückblättern – jede Antwort ist endgültig.</li>';
    if (sec.mode === 'section') h += '<li>Die Zeit gilt für den ganzen Teil. Läuft sie ab, endet der Teil – man muss nicht alles schaffen.</li>';
    else if (sec.mode !== 'block') h += '<li>Läuft die Zeit ab, geht es weiter und die Aufgabe zählt als falsch.</li>';
    if (SES.hideClock && sec.mode !== 'block') h += '<li>Die Uhr ist verborgen – wie im echten CAT. Zeit selbst einteilen.</li>';
    if (sec.penalty) h += '<li><b>Ratekorrektur:</b> Jede falsche Antwort zieht ⅓ Punkt ab. Bei völliger Unsicherheit lieber „Überspringen“.</li>';
    else if (sec.adaptive !== false && sec.mode !== 'block') h += '<li>Die Schwierigkeit passt sich deinen Antworten an.</li>';
    if (['mathe', 'konz'].includes(sec.area)) h += '<li>Kein Taschenrechner – Stift und Papier sind erlaubt.</li>';
    h += '</ul></div><div class="btnrow"><button class="btn" id="cGo">Teil starten</button></div></div>';
    $('sessSheet').innerHTML = h; bindQuit();
    $('cGo').onclick = () => beginSection();
  }
  const LETTERS = 'ABCDEFGH';
  function drawItem() {
    const it = SES.cur, sec = curSec();
    let h = head(sectionLabel() + ' · Aufgabe ' + (SES.inSec + 1) + (sec.mode === 'section' ? '' : '/' + sec.n));
    if (SES.timed && !SES.hideClock) h += '<div class="cat-timer"><div class="bar"><div id="cTbar" style="width:100%"></div></div><span id="cTtxt">' + B.mmss(Math.max(0, timeLeft())) + '</span></div>';
    else if (SES.timed) h += '<div class="muted small" style="margin:0 0 8px">Zeit läuft · Uhr verborgen</div>';
    h += '<div class="cat-q"><div class="cat-tag">' + B.esc((AREAS[it.area] || {}).name || '') + (SES.curMist ? ' · Wiederholung' : '') + '</div>';
    h += '<div class="cat-stem">' + B.esc(it.stem) + '</div>' + (it.html ? '<div class="cat-fig">' + it.html + '</div>' : '');
    if (it.kind === 'mc') {
      const g = !!it.optionHtml;
      h += '<div class="cat-opts' + (g ? (it.options.length > 4 ? ' g g8' : ' g') : '') + '">' + it.options.map((o, i) => '<button class="cat-opt" data-i="' + i + '"><span class="L">' + LETTERS[i] + '</span><span class="O">' + (g ? it.optionHtml[i] : B.esc(o)) + '</span></button>').join('') + '</div>';
    } else if (it.kind === 'input') {
      h += '<div class="inline" style="margin-top:12px"><input id="cIn" inputmode="numeric" autocomplete="off" placeholder="Deine Antwort"></div>';
    } else if (it.kind === 'mark') {
      h += '<div class="cat-mark">' + it.cells.map((ch, i) => '<button data-m="' + i + '">' + B.esc(ch) + '</button>').join('') + '</div>';
    }
    h += '<div id="cFb"></div><div class="btnrow" style="margin-bottom:30px">' + (sec.penalty && !SES.feedback ? '<button class="btn2" id="cSkip">Überspringen</button>' : '') + '<button class="btn" id="cNext" ' + (it.kind === 'mc' ? 'disabled' : '') + '>' + (SES.feedback ? 'Antwort prüfen' : 'Weiter') + '</button></div></div>';
    $('sessSheet').innerHTML = h; bindQuit();
    $('sessSheet').scrollTop = 0;
    document.querySelectorAll('.cat-opt').forEach((b) => { b.onclick = () => { if (SES.answered) return; SES.sel = +b.dataset.i; document.querySelectorAll('.cat-opt').forEach((x) => x.classList.toggle('on', x === b)); $('cNext').disabled = false; }; });
    document.querySelectorAll('.cat-mark button').forEach((b) => { b.onclick = () => { if (SES.answered) return; const i = +b.dataset.m; const k = SES.sel.indexOf(i); if (k >= 0) SES.sel.splice(k, 1); else SES.sel.push(i); b.classList.toggle('on'); }; });
    const inp = $('cIn'); if (inp) { inp.oninput = () => { SES.sel = inp.value.trim(); }; inp.onkeydown = (e) => { if (e.key === 'Enter') submit(false); }; setTimeout(() => inp.focus(), 50); }
    $('cNext').onclick = () => { if (SES.answered) advance(); else submit(false); };
    const sk = $('cSkip'); if (sk) sk.onclick = () => { if (!SES.answered) submit(false, true); };
  }
  function isCorrect(it, sel) {
    if (sel === null || sel === undefined || sel === '') return false;
    if (it.kind === 'mc') return sel === it.answer;
    if (it.kind === 'input') return Number(String(sel).replace(',', '.')) === it.answer;
    if (it.kind === 'mark') return sel.length === it.answer.length && it.answer.every((i) => sel.includes(i));
    return false;
  }
  function correctText(it) {
    if (it.kind === 'mc') return LETTERS[it.answer] + (it.optionHtml ? '' : ' – ' + it.options[it.answer]);
    if (it.kind === 'input') return String(it.answer);
    return '';
  }
  /* Antwort speichern (Stand, Fehlerkartei, Tageszähler) */
  function record(timeout, skipped) {
    const it = SES.cur, ok = !skipped && isCorrect(it, SES.sel);
    SES.answered = true;
    const secs = (Date.now() - SES.t0) / 1000;
    SES.resp.push({ area: it.area, type: it.type, sec_i: SES.secIdx, item: { level: it.level, kind: it.kind, options: it.options }, ok, sec: secs, timeout, skipped: !!skipped, wrong: !ok && !skipped && !timeout });
    eloUpdate(it.area, it, ok);
    const c = st();
    if (SES.curMist) {
      const m = c.mist.find((x) => x.id === SES.curMist.id);
      if (m) { if (ok) { m.box++; if (m.box >= 5) c.mist = c.mist.filter((x) => x !== m); else m.due = B.iso(B.addDays(B.today0(), [1, 3, 7, 14, 28][m.box])); } else { m.box = 0; m.due = B.iso(B.addDays(B.today0(), 1)); } }
    } else if (!ok && SES.kind !== 'placement') {
      c.mist.push({ id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), item: it, box: 0, due: B.iso(B.addDays(B.today0(), 1)) });
      if (c.mist.length > 150) c.mist.splice(0, c.mist.length - 150);
    }
    const day = c.days[B.iso(B.today0())] = c.days[B.iso(B.today0())] || { n: 0, ok: 0 };
    day.n++; if (ok) day.ok++;
    save();
    return { ok, secs };
  }
  function submit(timeout, skipped) {
    if (SES.answered) return;
    if (curSec().mode !== 'section') clearInterval(TIMER);
    const it = SES.cur;
    const { ok, secs } = record(timeout, skipped);
    if (!SES.feedback) { advance(); return; }
    clearInterval(TIMER);
    if (it.kind === 'mc') document.querySelectorAll('.cat-opt').forEach((b) => { const i = +b.dataset.i; if (i === it.answer) b.classList.add('ok'); else if (i === SES.sel) b.classList.add('bad'); });
    if (it.kind === 'mark') document.querySelectorAll('.cat-mark button').forEach((b) => { const i = +b.dataset.m; if (it.answer.includes(i)) b.classList.add('ok'); else if (SES.sel.includes(i)) b.classList.add('bad'); });
    const tm = timeout ? 'Zeit abgelaufen. ' : '';
    $('cFb').innerHTML = '<div class="fb ' + (ok ? 'ok' : 'bad') + '"><b>' + (ok ? 'Richtig' : tm + 'Falsch') + '</b>' + (!ok && correctText(it) ? ' · Lösung: ' + B.esc(correctText(it)) : '') + ' <span class="muted small">(' + Math.round(secs) + ' s)</span><div style="margin-top:6px;font-weight:400">' + B.esc(it.explain || '') + '</div></div>';
    $('cNext').textContent = 'Weiter'; $('cNext').disabled = false;
  }
  function advance() {
    SES.inSec++;
    if (SES.inSec >= curSec().n) return nextSection();
    nextItem();
  }
  function nextSection() {
    clearInterval(TIMER);
    SES.secIdx++; SES.inSec = 0;
    if (SES.secIdx >= SES.secs.length) return finish();
    if (SES.intro) return drawIntro();
    beginSection();
  }

  /* ---------- Reaktionstest ---------- */
  const ARROW = { 0: '←', 1: '↑', 2: '→' };
  function runReaction(sec) {
    const item = C.gens.reaktion[0].gen(3, sec.n);
    const per = item.per * 1000;
    let h = head(sectionLabel());
    h += '<div class="cat-q"><div class="cat-tag">Reaktion</div><div class="cat-stem small">Roter Pfeil: <b>Position</b> → Reihe (oben / Mitte / unten). Blauer Pfeil: <b>Richtung</b> → Spalte (← links, ↑ Mitte, → rechts).</div>';
    h += '<div class="rx-stim" id="rxStim"><div class="muted">Bereit? ' + sec.n + ' Signale, je ' + item.per.toFixed(1).replace('.', ',') + ' s.</div></div>';
    h += '<div class="rx-grid">' + [0, 1, 2].map((r) => [0, 1, 2].map((c) => '<button data-r="' + r + '" data-c="' + c + '"></button>').join('')).join('') + '</div>';
    h += '<div class="btnrow"><button class="btn" id="rxGo">Start</button></div><div class="muted small center" id="rxCnt"></div></div>';
    $('sessSheet').innerHTML = h; bindQuit();
    const res = [];
    const stim = $('rxStim');
    function show(i) {
      if (!SES || !RX) return;
      if (i >= item.stimuli.length) return doneRx();
      const s = item.stimuli[i];
      RX.i = i; RX.t0 = Date.now(); RX.hit = null;
      const y = [16, 58, 100][s.row];
      stim.innerHTML = `<svg viewBox="0 0 220 120" width="220" height="120"><text x="40" y="${y + 12}" font-size="34" fill="#c0392b" text-anchor="middle">➜</text><text x="140" y="74" font-size="52" fill="#2563eb" text-anchor="middle">${ARROW[s.col]}</text></svg>`;
      $('rxCnt').textContent = (i + 1) + ' / ' + item.stimuli.length;
      RX.to = setTimeout(() => { res.push({ ok: !!(RX.hit && RX.hit.ok), rt: RX.hit ? RX.hit.rt : null }); show(i + 1); }, per);
    }
    function doneRx() {
      clearTimeout(RX && RX.to); RX = null;
      const c = st();
      res.forEach((r) => {
        SES.resp.push({ area: 'reaktion', type: 'pfeile', sec_i: SES.secIdx, item: { level: 3, kind: 'speed' }, ok: r.ok, sec: r.rt || item.per, timeout: r.rt === null });
        eloUpdate('reaktion', { level: 3, kind: 'speed' }, r.ok);
      });
      const day = c.days[B.iso(B.today0())] = c.days[B.iso(B.today0())] || { n: 0, ok: 0 };
      day.n += 1; save();
      if (!SES.feedback) return nextSection();
      const okN = res.filter((r) => r.ok).length, rts = res.filter((r) => r.ok).map((r) => r.rt);
      const avg = rts.length ? Math.round(rts.reduce((a, b) => a + b, 0) / rts.length) : null;
      stim.innerHTML = '<div><b>' + okN + ' von ' + res.length + ' richtig</b>' + (avg ? ' · Ø ' + avg + ' ms' : '') + '</div>';
      $('rxGo').textContent = 'Weiter'; $('rxGo').style.display = ''; $('rxGo').onclick = () => nextSection();
    }
    document.querySelectorAll('.rx-grid button').forEach((b) => {
      b.onclick = () => {
        if (!RX || RX.hit) return;
        const s = item.stimuli[RX.i];
        RX.hit = { ok: +b.dataset.r === s.row && +b.dataset.c === s.col, rt: Date.now() - RX.t0 };
        b.classList.add(RX.hit.ok ? 'ok' : 'bad'); setTimeout(() => b.classList.remove('ok', 'bad'), 250);
      };
    });
    $('rxGo').onclick = () => { $('rxGo').style.display = 'none'; RX = {}; show(0); };
  }

  /* ---------- Persönlichkeitsteil (ohne Wertung) ---------- */
  const PERS = [
    'Ich übernehme gern Verantwortung in einer Gruppe.', 'Wenn es stressig wird, verliere ich schnell den Überblick.', 'Ich halte mich an Regeln, auch wenn niemand hinsieht.',
    'Ich arbeite lieber allein als im Team.', 'Kritik nehme ich mir lange zu Herzen.', 'Ich bringe Aufgaben zu Ende, auch wenn sie mir keinen Spaß machen.',
    'Ich habe schon einmal etwas mitgenommen, das mir nicht gehörte.', 'Unter Druck treffe ich ruhig Entscheidungen.', 'In einer Gruppe halte ich mich lieber im Hintergrund.',
    'Ich komme gut mit wenig Schlaf aus.', 'Ich ärgere mich leicht über andere.', 'Ich habe noch nie gelogen.',
    'Feste Tagesabläufe geben mir Halt.', 'Ich trinke regelmäßig Alkohol, um zu entspannen.', 'Ich arbeite gern mit Menschen zusammen, die anders sind als ich.',
    'Es fällt mir schwer, Befehle zu befolgen, die ich nicht verstehe.', 'Ich bleibe auch bei Rückschlägen dran.', 'Ich bin gern der Mittelpunkt in einer Gruppe.',
    'Bei Stress verliere ich selten den Überblick.', 'Regeln sind für mich eher Empfehlungen.', 'Ich arbeite gern im Team.',
    'Ich lasse Aufgaben oft liegen, wenn sie langweilig werden.', 'Ich kann gut mit Kritik umgehen.', 'Ich bin immer pünktlich.',
  ];
  const PERS_PAIRS = [[1, 18], [2, 19], [3, 20], [5, 21], [4, 22]]; // jeweils gegensätzlich formuliert → konsistent, wenn verschieden beantwortet
  function startPers() {
    SES = { kind: 'pers', title: 'Persönlichkeitsteil', i: 0, ans: [] };
    $('sessModal').classList.remove('hidden');
    const draw = () => {
      if (SES.i >= PERS.length) return persDone();
      let h = head('Aussage ' + (SES.i + 1) + '/' + PERS.length);
      h += '<div class="cat-q"><div class="cat-tag">Kein richtig oder falsch · ehrlich und spontan antworten</div><div class="cat-stem" style="margin:24px 0">' + B.esc(PERS[SES.i]) + '</div>';
      h += '<div class="btnrow"><button class="btn2" data-a="1">trifft zu</button><button class="btn2" data-a="0">trifft nicht zu</button></div></div>';
      $('sessSheet').innerHTML = h; bindQuit();
      document.querySelectorAll('[data-a]').forEach((b) => { b.onclick = () => { SES.ans[SES.i] = +b.dataset.a; SES.i++; draw(); }; });
    };
    draw();
  }
  function persDone() {
    const inc = PERS_PAIRS.filter(([a, b]) => SES.ans[a] === SES.ans[b]);
    const c = st(); c.hist.push({ date: B.iso(B.today0()), kind: 'pers', ok: PERS_PAIRS.length - inc.length, n: PERS_PAIRS.length, overall: null }); save();
    let h = '<div class="shead"><span style="width:74px"></span><div class="sc"><div class="st">Persönlichkeitsteil</div><div class="muted small">Rückblick</div></div><span style="width:74px"></span></div>';
    h += '<div class="card pad"><p>Im echten CAT wird dieser Teil <b>nicht mit Punkten bewertet</b>. Die Antworten werden im Gespräch mit Psychologin bzw. Prüfoffizier aufgegriffen. Es gibt verneinte und umformulierte Wiederholungen.</p>';
    h += '<div class="fb ' + (inc.length ? 'warn' : 'ok') + '">' + (inc.length ? inc.length + ' widersprüchliche Antwortpaare – im Gespräch könntest du darauf angesprochen werden:' : 'Deine Antworten sind in sich stimmig.') + '</div>';
    inc.forEach(([a, b]) => { h += '<div class="muted small" style="margin-top:8px">„' + B.esc(PERS[a]) + '“ und „' + B.esc(PERS[b]) + '“ – beide „' + (SES.ans[a] ? 'trifft zu' : 'trifft nicht zu') + '“.</div>'; });
    h += '<ul class="tips small" style="margin-top:12px"><li>Ehrlich antworten – nicht „taktisch“. Extreme Aussagen („noch nie gelogen“) wirken unglaubwürdig.</li><li>Genau lesen, auf Verneinungen achten.</li></ul></div>';
    h += '<div class="btnrow" style="margin-bottom:30px"><button class="btn" id="cDone">Fertig</button></div>';
    $('sessSheet').innerHTML = h; $('cDone').onclick = () => { SES = null; B.closeSess(); };
  }

  function endSession(aborted) {
    clearInterval(TIMER); if (RX) { clearTimeout(RX.to); RX = null; }
    if (aborted && SES && SES.resp && SES.resp.length && !SES.test) { finish(); return; }
    SES = null; B.closeSess();
  }
  function finish() {
    clearInterval(TIMER);
    const c = st(), resp = SES.resp, today = B.iso(B.today0());
    const areas = [...new Set(resp.map((r) => r.area))];
    const res = {};
    areas.forEach((a) => {
      const rs = resp.filter((r) => r.area === a);
      const th = eap(rs, SES.kind === 'placement' ? 0 : (SES.prior ? SES.prior(a) : (c.theta[a] || 0)));
      res[a] = { score: score(th), ok: rs.filter((r) => r.ok).length, n: rs.length, theta: th, slow: rs.filter((r) => r.timeout && a !== 'reaktion').length };
      if (SES.kind === 'placement') { c.theta[a] = th; c.n[a] = Math.max(c.n[a] || 0, 6); }
      if (SES.kind === 'check') { c.theta[a] = 0.5 * (c.theta[a] || 0) + 0.5 * th; res[a].score = score(c.theta[a]); res[a].delta = res[a].score - (SES.before[a] || 0); }
    });
    // Ratekorrektur-Teile
    const pen = [];
    SES.secs.forEach((s, i) => {
      if (!s.penalty) return;
      const rs = resp.filter((r) => r.sec_i === i);
      const r = rs.filter((x) => x.ok).length, w = rs.filter((x) => x.wrong).length, sk = rs.filter((x) => x.skipped).length;
      pen.push({ name: AREAS[s.area].name, r, w, sk, n: rs.length, pts: Math.round((r - w / 3) * 10) / 10 });
    });
    const ok = resp.filter((r) => r.ok).length;
    const isTest = !!SES.test;
    const overall = isTest && areas.length ? Math.round(areas.reduce((s, a) => s + res[a].score, 0) / areas.length) : null;
    c.hist.push({ date: today, kind: SES.kind, ok, n: resp.length, overall, areas: Object.fromEntries(areas.map((a) => [a, res[a].score])), min: Math.round((Date.now() - SES.started) / 60000) });
    if (SES.kind === 'placement') c.placed = today;
    if (SES.kind === 'check') c.lastCheck = today;
    if (SES.kind === 'sim') { c.days[today] = c.days[today] || { n: 0, ok: 0 }; c.days[today].sim = 1; }
    save();
    const target = LB[c.laufbahn].target;
    let h = '<div class="shead"><span style="width:74px"></span><div class="sc"><div class="st">' + B.esc(SES.title) + '</div><div class="muted small">Auswertung</div></div><span style="width:74px"></span></div>';
    h += '<div class="summary" style="padding-top:8px"><div class="sumic">' + B.IC.check + '</div><div class="st">' + ok + ' von ' + resp.length + ' richtig</div>';
    if (overall !== null) h += '<div class="big" style="margin-top:6px">' + overall + '<span class="muted" style="font-size:16px"> / 100</span></div><div class="muted small">Orientierungsziel ' + LB[c.laufbahn].name + ': ' + target + '</div>';
    h += '</div><div class="card pad" style="margin-top:14px">';
    areas.forEach((a) => {
      const r = res[a];
      h += '<div class="goal"><div class="top2"><span>' + B.esc(AREAS[a].name) + '</span><b>' + (isTest ? r.score : r.ok + '/' + r.n) + (r.delta !== undefined ? ' <span class="muted small">(' + (r.delta >= 0 ? '+' : '') + r.delta + ')</span>' : '') + '</b></div>' + (isTest ? levelBar(r.score, target) : '') + '<div class="muted small">' + r.ok + ' von ' + r.n + ' richtig' + (r.slow ? ' · ' + r.slow + '× Zeit abgelaufen' : '') + '</div></div>';
    });
    h += '</div>';
    const fb = [];
    pen.forEach((p) => fb.push({ c: 'info', t: p.name + ' mit Ratekorrektur: ' + String(p.pts).replace('.', ',') + ' Punkte (' + p.r + ' richtig, ' + p.w + ' falsch, ' + p.sk + ' übersprungen).' }));
    if (isTest) {
      const weak = areas.filter((a) => res[a].score < target).sort((x, y) => res[x].score - res[y].score);
      if (weak.length) fb.push({ c: 'warn', t: 'Unter dem Orientierungsziel: ' + weak.map((a) => AREAS[a].name).join(', ') + '. Das Tagestraining setzt dort den Schwerpunkt.' });
      else fb.push({ c: 'ok', t: 'Alle Bereiche über dem Orientierungsziel. Weiter so – Routine und Tempo halten.' });
      const slow = resp.filter((r) => r.timeout && r.area !== 'reaktion').length;
      if (slow >= 3) fb.push({ c: 'warn', t: slow + '× ist die Zeit abgelaufen. Bei schweren Aufgaben früher begründet raten und weitergehen.' });
    }
    fb.push({ c: 'info', t: 'Falsch beantwortete Aufgaben kommen nach 1, 3, 7, 14 und 28 Tagen als Wiederholung zurück.' });
    h += fb.map((o) => '<div class="fb ' + o.c + '">' + B.esc(o.t) + '</div>').join('');
    h += '<div class="btnrow" style="margin-bottom:30px"><button class="btn" id="cDone">Fertig</button></div>';
    $('sessSheet').innerHTML = h;
    $('cDone').onclick = () => { SES = null; B.closeSess(); };
  }
  function levelBar(sc, target) {
    return '<div class="cat-lvl"><div class="bar' + (sc < target ? ' over' : '') + '"><div style="width:' + sc + '%"></div></div><i style="left:' + target + '%"></i></div>';
  }

  /* =================== Ansichten =================== */
  const ICON = {
    brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2A3.2 3.2 0 0 0 7.5 18 2.5 2.5 0 0 0 12 19V5.5A2.5 2.5 0 0 0 9 4.5z"/><path d="M15 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2 3.2 3.2 0 0 1-3.5 5.3A2.5 2.5 0 0 1 12 19"/></svg>',
    exam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
    redo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4h4"/></svg>',
  };
  function taskRow(d, id) {
    const t = todayTask(d);
    if (!t) return '';
    const dn = taskDone(d);
    const ic = t.kind === 'rest' ? B.IC.rest : t.kind === 'sim' || t.kind === 'placement' || t.kind === 'check' ? ICON.exam : ICON.brain;
    return '<div class="row' + (t.kind === 'rest' ? '' : ' tap') + '" id="' + id + '"><div class="ic">' + ic + '</div><div class="tx"><div class="t">' + B.esc(t.t) + '</div><div class="m">' + B.esc(t.m) + '</div></div><div class="end">' + (dn ? '<span class="done-dot">' + B.IC.check + '</span>' : t.kind === 'rest' ? '' : B.IC.chev) + '</div></div>';
  }
  function startTask(d) {
    const t = todayTask(d); if (!t || t.kind === 'rest') return;
    if (t.kind === 'placement') startSession('placement');
    else if (t.kind === 'check') startSession('check');
    else if (t.kind === 'sim') startSession('sim');
    else startSession('train', { n: t.n, easy: t.easy });
  }
  // Karte für den Heute-Tab
  function heuteCard() {
    const t = B.today0();
    if (!todayTask(t)) return '';
    return '<div class="sec">CAT-Training <button class="link" data-gocat>Alles ansehen</button></div><div class="card">' + taskRow(t, 'catTodayH') + '</div>';
  }
  function bindHeute(el) {
    const r = $('catTodayH'); if (r) r.onclick = () => startTask(B.today0());
    el.querySelectorAll('[data-gocat]').forEach((b) => { b.onclick = () => { location.hash = 'cat'; }; });
  }
  function render() {
    const el = $('v-cat'), c = st(), t = B.today0(), ph = phaseOf(t), dl = daysLeft(t), T = testDate();
    let h = B.topbar('CAT', 'Test am ' + B.fmtD(T) + (dl >= 0 ? ' · noch ' + dl + ' Tage' : '') + ' · ' + ph.name);
    h += '<div class="phase">' + PHASES.map((p) => '<div style="flex:' + (p.key === 'grund' ? 4 : p.key === 'aufbau' ? 3 : p.key === 'pruef' ? 2 : 0.6) + '" class="' + (p.key === ph.key ? 'cur' : '') + '"></div>').join('') + '</div>';
    if (ph.tip) h += '<div class="muted small" style="margin:2px 2px 0">' + B.esc(ph.tip) + '</div>';
    h += '<div class="sec">Heute' + (streak() > 1 ? ' <span class="tag g">' + streak() + ' Tage in Folge</span>' : '') + '</div><div class="card">' + (taskRow(t, 'catToday') || '<div class="row"><div class="tx">Kein Testtermin in der Zukunft. Datum unten anpassen.</div></div>') + '</div>';
    // Stand
    const target = LB[c.laufbahn].target, areas = areasFor(c.laufbahn);
    h += '<div class="sec">Dein Stand <span class="muted small">Ziel ' + target + ' (Orientierung)</span></div><div class="card pad">';
    if (!c.placed) h += '<div class="muted small" style="margin-bottom:6px">Noch geschätzt – mach zuerst den Einstufungstest.</div>';
    areas.forEach((a) => { const s = score(c.theta[a] || 0); h += '<div class="goal"><div class="top2"><span>' + B.esc(AREAS[a].name) + '</span><b>' + (c.placed ? s : '–') + '</b></div>' + levelBar(c.placed ? s : 0, target) + '</div>'; });
    if (c.placed) { const ov = Math.round(areas.reduce((s, a) => s + score(c.theta[a] || 0), 0) / areas.length); h += '<div class="inline" style="justify-content:space-between;margin-top:10px"><span class="muted">Gesamt (geschätzt)</span><span class="big">' + ov + '</span></div>'; }
    h += '</div>';
    // Üben
    const dm = dueMistakes(t).length;
    h += '<div class="sec">Üben</div><div class="card">';
    const simDesc = c.laufbahn === 'offizier' ? 'Analogien, Matrizen, Mathe · je bis 3 Min. pro Aufgabe' : LB[c.laufbahn].sections.length + ' Teile wie im Karrierecenter';
    h += '<div class="row tap" id="cSim"><div class="ic">' + ICON.exam + '</div><div class="tx"><div class="t">Prüfungssimulation · ' + B.esc(LB[c.laufbahn].short) + '</div><div class="m">' + simDesc + ' · adaptiv, kein Zurück · ca. ' + simMinutes() + ' Min.</div></div><div class="end">' + B.IC.chev + '</div></div>';
    h += '<div class="row tap" id="cPlace"><div class="ic">' + B.IC.target + '</div><div class="tx"><div class="t">' + (c.placed ? 'Einstufungstest wiederholen' : 'Einstufungstest') + '</div><div class="m">' + (c.placed ? 'Zuletzt am ' + B.fmtD(B.parseD(c.placed)) : 'Misst deinen Stand in allen Bereichen') + '</div></div><div class="end">' + B.IC.chev + '</div></div>';
    h += '<div class="row tap" id="cMist"><div class="ic">' + ICON.redo + '</div><div class="tx"><div class="t">Fehler wiederholen</div><div class="m">' + (dm ? dm + ' fällig' : 'Nichts fällig') + ' · ' + c.mist.length + ' im Speicher</div></div><div class="end">' + B.IC.chev + '</div></div>';
    h += '<div class="row tap" id="cPers"><div class="ic">' + ICON.brain + '</div><div class="tx"><div class="t">Persönlichkeitsteil kennenlernen</div><div class="m">24 Aussagen „trifft zu / nicht zu“ · ohne Wertung</div></div><div class="end">' + B.IC.chev + '</div></div>';
    h += '</div>';
    const row = (a) => '<div class="row tap" data-area="' + a + '"><div class="ic">' + ICON.brain + '</div><div class="tx"><div class="t">' + B.esc(AREAS[a].name) + '</div><div class="m">' + B.esc((C.gens[a] || []).map((g) => g.label).join(', ')) + '</div></div><div class="end">' + B.IC.chev + '</div></div>';
    h += '<div class="sec">Bereich gezielt trainieren</div><div class="card">' + areas.map(row).join('') + '</div>';
    const extra = Object.keys(AREAS).filter((a) => !areas.includes(a));
    h += '<div class="sec">Zusatz <span class="muted small">im echten CAT kaum belegt</span></div><div class="card">' + extra.map(row).join('') + '</div>';
    // Verlauf
    const hist = c.hist.slice(-8).reverse();
    if (hist.length) {
      h += '<div class="sec">Verlauf</div><div class="card">';
      const nm = { pers: 'Persönlichkeitsteil', check: 'Kontrolltest', placement: 'Einstufungstest', sim: 'Simulation', train: 'Training', area: 'Bereichstraining', mist: 'Wiederholung' };
      hist.forEach((x) => { h += '<div class="row"><div class="tx"><div class="t">' + nm[x.kind] + '</div><div class="m">' + B.fmtD(B.parseD(x.date)) + ' · ' + x.ok + '/' + x.n + ' richtig' + (x.min ? ' · ' + x.min + ' Min.' : '') + '</div></div><div class="end">' + (x.overall != null ? '<b>' + x.overall + '</b>' : '') + '</div></div>'; });
      h += '</div>';
    }
    // Einstellungen
    h += '<div class="sec">Einstellungen CAT</div><div class="card pad"><label>Laufbahn</label><select id="cLb">' + Object.keys(LB).map((k) => '<option value="' + k + '"' + (k === c.laufbahn ? ' selected' : '') + '>' + B.esc(LB[k].name) + '</option>').join('') + '</select>';
    h += '<label>Datum CAT-Test</label><input type="date" id="cDate" value="' + B.iso(T) + '">';
    h += '<div class="toggle"><span>Zeitlimit im Training</span><input type="checkbox" id="cTimed" ' + (c.timed !== false ? 'checked' : '') + '></div>';
    h += '<div class="toggle"><span>Uhr in Tests verbergen (wie im echten CAT)</span><input type="checkbox" id="cHide" ' + (c.hideClock !== false ? 'checked' : '') + '></div></div>';
    h += '<div class="sec">Wie der Plan funktioniert</div><div class="card pad">' + scienceHtml() + '</div>';
    el.innerHTML = h; B.bindTop(el);
    const tr = $('catToday'); if (tr) tr.onclick = () => startTask(t);
    $('cSim').onclick = () => startSession('sim');
    $('cPlace').onclick = () => startSession('placement');
    $('cMist').onclick = () => startSession('mist');
    el.querySelectorAll('[data-area]').forEach((r) => { r.onclick = () => startSession('area', { area: r.dataset.area, n: 15 }); });
    $('cLb').onchange = (e) => { c.laufbahn = e.target.value; save(); render(); };
    $('cDate').onchange = (e) => { if (e.target.value) { c.testDate = e.target.value; save(); render(); } };
    $('cTimed').onchange = (e) => { c.timed = e.target.checked; save(); };
    $('cHide').onchange = (e) => { c.hideClock = e.target.checked; save(); };
    $('cPers').onclick = () => startPers();
  }
  function scienceHtml() {
    const d = (t, b) => '<details style="border-bottom:1px solid var(--line)"><summary>' + t + '</summary><div class="muted" style="padding-bottom:12px">' + b + '</div></details>';
    return d('Lernmethoden mit Wirkung', '<ul class="tips"><li><b>Üben mit Aufgaben</b> statt Wiederlesen – eine der zwei wirksamsten Lerntechniken (Dunlosky et al. 2013).</li><li><b>Verteilt lernen:</b> täglich kurz statt selten lang; Fehler kommen nach 1, 3, 7, 14, 28 Tagen wieder (Cepeda et al. 2008).</li><li><b>Mischen</b> statt Blöcke: deutlich bessere Testergebnisse, obwohl es sich schwerer anfühlt (Rohrer & Taylor).</li><li><b>Übungseffekt</b> bei Eignungstests ist real, aber moderat – er kommt vor allem aus Vertrautheit mit Aufgabentypen und Testsituation (Hausknecht et al. 2007).</li><li><b>Schlaf</b> über Wochen zählt mehr als die Nacht vor dem Test.</li><li><b>Kontrolltest alle 2 Wochen</b> (Grundlagen- und Aufbauphase): 3 Aufgaben je Bereich, zeigt deinen Fortschritt und passt die Schwerpunkte an.</li></ul>') +
      d('Abstimmung mit dem BFT-Plan', '<ul class="tips"><li>An Tagen mit Intervallen oder Marsch: rund 40 % weniger CAT-Aufgaben.</li><li>Am BFT-Testtag: nur 10 lockere Aufgaben.</li><li>Simulationen und Kontrolltests liegen nie auf harten Trainingstagen. Fällt eine Simulation darauf, rutscht sie auf den nächsten ruhigeren Tag.</li></ul>') +
      d('Phasen bis zum Test', '<ul class="tips">' + PHASES.map((p) => '<li><b>' + p.name + '</b>' + (p.key === 'grund' ? ' (bis ' + p.to + ' Tage vorher)' : ' (' + p.from + '–' + p.to + ' Tage vorher)') + ': ' + p.tip + '</li>').join('') + '</ul>') +
      d('Wie realistisch ist der Test?', '<ul class="tips"><li>Die echten Aufgaben sind nicht öffentlich. Grundlage hier: offizielle Bundeswehr-Angaben, eine von der Bundeswehr genehmigte Dissertation (2012) mit Beschreibungen der CAT-Subtests, über 20 Erfahrungsberichte (Forum, Videos) und 8 Übungsanbieter (Stand 28.11.2026).</li><li><b>Köln (Offiziere):</b> ca. 30 Aufgaben – Wortanalogien, Matrizen, Mathe – je bis ca. 3 Min.</li><li><b>Karrierecenter:</b> lange Testbatterie mit Rechtschreibung, Technik (Zeit für den ganzen Teil, Ratekorrektur), Reaktion, Symbolrechnen u. a.</li><li>Uhr im echten Test meist nicht sichtbar; Matrizen mit 8, Analogien mit 5 Antworten.</li><li>Genaue Aufgabenzahlen, Zeiten und Grenzwerte veröffentlicht die Bundeswehr nicht – diese Werte sind begründete Schätzungen. Die Reaktionsaufgabe ist nachempfunden.</li><li>Würfel, Figurenreihen, Zahlenreihen und Allgemeinwissen sind im echten CAT kaum belegt und deshalb nur als Zusatz enthalten.</li></ul>');
  }

  /* =================== Einbindung =================== */
  C.ui = {
    init(bridge) { B = bridge; st(); },
    render, heuteCard, bindHeute, taskFor: (d) => todayTask(d),
  };
})(window.CAT);
