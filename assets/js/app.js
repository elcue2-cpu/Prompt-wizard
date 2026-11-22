/* =========================================================
   Prompt Wizard — 4단계 위자드 화면과 부팅
   STEP 01 직무 → STEP 02 세부 업무 → STEP 03 결과물 → STEP 04 세부 조건
   선택 상태만 들고, 문장 조립은 engine, 타이핑·복사는 editor가 맡는다.
   ========================================================= */
window.PW = window.PW || {};

(function (PW) {
  'use strict';

  var D = PW.data;
  var E = PW.engine;

  var state = {
    cat: D.liveCategoryId,
    job: null,
    task: null,
    out: null,
    answersByOut: {},
    answers: {},
    memo: '',
    guards: {},
    step: 1,
    lastTaskByJob: {},
    moreOpen: false,
    qOpen: false
  };
  D.guards.forEach(function (g) { if (g.on) state.guards[g.id] = true; });

  var renderedJob = '__init__';
  var renderedTask = '__init__';
  var renderedOut = '__init__';
  var renderedMore = null;
  var renderedCat = '__init__';
  var prevPct = -1;
  var rafPending = false;
  var qSig = '';
  var urlTimer = null;
  var renderCount = 0;

  function $(id) { return document.getElementById(id); }
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  var els = {
    catNav: $('catNav'),
    brandSub: $('brandSub'),
    stepRail: $('stepRail'),
    wstep1: $('wstep1'),
    wstep2: $('wstep2'),
    wstep3: $('wstep3'),
    wstep4: $('wstep4'),
    jobGrid: $('jobGrid'),
    taskChips: $('taskChips'),
    outGrid: $('outGrid'),
    detailAsks: $('detailAsks'),
    moreAsksBtn: $('moreAsksBtn'),
    step2Sub: $('step2Sub'),
    step3Sub: $('step3Sub'),
    step4Sub: $('step4Sub'),
    memo: $('memo'),
    memoLabel: $('memoLabel'),
    memoCount: $('memoCount'),
    memoHint: $('memoHint'),
    exampleBtn: $('exampleBtn'),
    guardrailList: $('guardrailList'),
    resetBtn: $('resetBtn'),
    liveStatus: $('liveStatus'),
    wizardCard: $('wizardCard'),
    catModal: $('catModal'),
    catModalCard: $('catModalCard'),
    catModalVeil: $('catModalVeil'),
    catModalClose: $('catModalClose'),
    catModalIcon: $('catModalIcon'),
    catModalTitle: $('catModalTitle'),
    catModalDesc: $('catModalDesc'),
    catModalList: $('catModalList'),
    catModalOk: $('catModalOk'),
    quickStart: $('quickStart'),
    qualityPanel: $('qualityPanel'),
    qualityToggle: $('qualityToggle'),
    qualityBody: $('qualityBody'),
    qualityScore: $('qualityScore'),
    qualityLabel: $('qualityLabel'),
    qualityList: $('qualityList'),
    shelfCard: $('shelfCard'),
    favAdd: $('favAdd'),
    favClear: $('favClear'),
    favEmpty: $('favEmpty'),
    favList: $('favList'),
    recentEmpty: $('recentEmpty'),
    recentList: $('recentList')
  };

  /* ---------------- 조회 도우미 ---------------- */

  function currentCat() { return E.byId(D.categories, state.cat); }
  function isLive() { return !!(currentCat() && currentCat().status === 'live'); }
  function currentJob() { return state.job ? E.byId(D.jobs, state.job) : null; }
  function currentTask() { return state.task ? E.byId(D.tasks, state.task) : null; }
  function currentOutput() { return state.out ? E.byId(D.outputs, state.out) : null; }

  function answersFor(outId) {
    if (!state.answersByOut[outId]) state.answersByOut[outId] = {};
    return state.answersByOut[outId];
  }

  function jobTasks(job) {
    if (!job) return [];
    var list = [];
    (job.taskIds || []).forEach(function (id) {
      var t = E.byId(D.tasks, id);
      if (t) list.push(t);
    });
    return list;
  }

  function orderedOutputs() {
    var t = currentTask();
    var rec = (t && t.recommends) || [];
    var head = [];
    rec.forEach(function (id) {
      var o = E.byId(D.outputs, id);
      if (o) head.push(o);
    });
    var rest = D.outputs.filter(function (o) { return rec.indexOf(o.id) < 0; })
      .sort(function (a, b) { return a.order - b.order; });
    return head.concat(rest);
  }

  function requiredAsks() {
    var o = currentOutput();
    if (!o) return [];
    return o.asks.filter(function (a) { return a.required; });
  }

  /* ---------------- 상단 카테고리 ---------------- */

  function buildCatNav() {
    els.catNav.innerHTML = '';
    D.categories.forEach(function (c) {
      var live = c.status === 'live';
      var btn = h('button', 'cat' + (live ? ' is-live' : ''));
      btn.type = 'button';
      btn.setAttribute('data-cat', c.id);
      btn.setAttribute('aria-pressed', 'false');
      if (!live) {
        /* 준비 중 탭은 화면을 바꾸지 않고 안내 모달만 연다 */
        btn.setAttribute('aria-haspopup', 'dialog');
        btn.setAttribute('title', c.name + ' — 준비 중인 카테고리예요');
      }
      btn.appendChild(h('span', 'cat-ic', c.icon));
      btn.appendChild(h('span', 'cat-name', c.name));
      if (!live) btn.appendChild(h('span', 'cat-soon', '준비 중'));
      els.catNav.appendChild(btn);
    });
  }

  function syncCatNav() {
    var nodes = els.catNav.querySelectorAll('[data-cat]');
    Array.prototype.forEach.call(nodes, function (n) {
      var on = n.getAttribute('data-cat') === state.cat;
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var c = currentCat();
    if (els.brandSub) {
      els.brandSub.textContent = c ? c.name + ' 실무 프롬프트' : '공공기관·공무원 실무 프롬프트';
    }
  }

  /* ---------------- 준비 중 카테고리 모달 ----------------
     state.cat·위자드 선택·에디터 내용은 건드리지 않는다(render를 부르지 않는다). */

  var modalReturn = null;

  function modalExampleLines(c) {
    var lines = [];
    (c.examples || []).forEach(function (ex) {
      if (lines.length < 3 && ex && ex.title) lines.push(ex);
    });
    if (!lines.length) {
      (c.plans || []).forEach(function (p) {
        if (lines.length < 3) lines.push({ title: p, desc: '' });
      });
    }
    return lines;
  }

  function openCatModal(c, fromNode) {
    if (!c || c.status === 'live' || !els.catModal) return;
    modalReturn = fromNode || null;
    if (els.catModalIcon) els.catModalIcon.textContent = c.icon || '🚧';
    els.catModalTitle.textContent = c.name;
    els.catModalDesc.textContent = c.description || c.tagline || '';
    els.catModalList.innerHTML = '';
    modalExampleLines(c).forEach(function (ex) {
      var li = h('li', 'modal-item');
      li.appendChild(h('b', 'mi-title', ex.title));
      if (ex.desc) li.appendChild(h('span', 'mi-desc', ex.desc));
      els.catModalList.appendChild(li);
    });
    els.catModal.hidden = false;
    els.catModal.classList.add('is-open');
    els.catModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (els.catModalOk && els.catModalOk.focus) els.catModalOk.focus();
    if (els.liveStatus) els.liveStatus.textContent = c.name + ' 카테고리는 준비 중입니다. 지금 화면은 그대로 둘게요.';
  }

  function closeCatModal() {
    if (!els.catModal || els.catModal.hidden) return;
    els.catModal.hidden = true;
    els.catModal.classList.remove('is-open');
    els.catModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    var back = modalReturn;
    modalReturn = null;
    if (back && back.focus) back.focus();
  }

  /* ---------------- 스텝 레일 ---------------- */

  var RAIL = [
    { n: 1, label: '직무', short: '직무' },
    { n: 2, label: '세부 업무', short: '업무' },
    { n: 3, label: '결과물', short: '결과물' },
    { n: 4, label: '세부 조건', short: '조건' }
  ];

  function buildRail() {
    els.stepRail.innerHTML = '';
    RAIL.forEach(function (s) {
      var btn = h('button', 'rail-step');
      btn.type = 'button';
      btn.setAttribute('data-step', String(s.n));
      btn.appendChild(h('span', 'rail-num', '0' + s.n));
      btn.appendChild(h('span', 'rail-label', s.label));
      btn.appendChild(h('span', 'rail-check', '✓'));
      els.stepRail.appendChild(btn);
    });
  }

  function stepDone(n) {
    if (n === 1) return !!state.job;
    if (n === 2) return !!state.task;
    if (n === 3) return !!state.out;
    var req = requiredAsks();
    if (!state.out) return false;
    var a = answersFor(state.out);
    var done = req.length > 0;
    req.forEach(function (q) { if (!a[q.key]) done = false; });
    return done;
  }

  function stepUnlocked(n) {
    if (n === 1) return true;
    if (n === 2) return !!state.job;
    if (n === 3) return !!state.task;
    return !!state.out;
  }

  function syncRail() {
    var nodes = els.stepRail.querySelectorAll('[data-step]');
    Array.prototype.forEach.call(nodes, function (n) {
      var num = Number(n.getAttribute('data-step'));
      var unlocked = stepUnlocked(num);
      n.classList.toggle('is-done', unlocked && stepDone(num));
      n.classList.toggle('is-current', num === state.step);
      n.classList.toggle('is-locked', !unlocked);
      if (num === state.step) n.setAttribute('aria-current', 'step');
      else n.removeAttribute('aria-current');
    });
  }

  /* ---------------- STEP 01 직무 ---------------- */

  function buildJobs() {
    els.jobGrid.innerHTML = '';
    D.jobs.forEach(function (j) {
      var btn = h('button', 'job-card');
      btn.type = 'button';
      btn.setAttribute('data-job', j.id);
      btn.setAttribute('aria-pressed', 'false');
      btn.appendChild(h('span', 'job-icon', j.icon));
      var tx = h('span', 'job-text');
      tx.appendChild(h('span', 'job-name', j.name));
      tx.appendChild(h('span', 'job-desc', j.desc));
      btn.appendChild(tx);
      btn.appendChild(h('span', 'job-check', '✓'));
      els.jobGrid.appendChild(btn);
    });
  }

  function syncJobs() {
    var nodes = els.jobGrid.querySelectorAll('[data-job]');
    Array.prototype.forEach.call(nodes, function (n) {
      var on = n.getAttribute('data-job') === state.job;
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------------- STEP 02 세부 업무 ---------------- */

  function buildTasks() {
    els.taskChips.innerHTML = '';
    var job = currentJob();
    jobTasks(job).forEach(function (t) {
      var b = h('button', 'chip');
      b.type = 'button';
      b.setAttribute('data-task', t.id);
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(h('span', 'chip-tick', '✓'));
      b.appendChild(h('span', null, t.label));
      els.taskChips.appendChild(b);
    });
    var jobName = job ? job.name : '';
    els.step2Sub.textContent = job
      ? jobName + ' 직무의 세부 업무 ' + jobTasks(job).length + '개 중 하나를 골라 주세요.'
      : 'STEP 01에서 직무를 먼저 골라 주세요.';
  }

  function syncTasks() {
    var nodes = els.taskChips.querySelectorAll('[data-task]');
    Array.prototype.forEach.call(nodes, function (n) {
      var on = n.getAttribute('data-task') === state.task;
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------------- STEP 03 결과물 ---------------- */

  function buildOutputs() {
    els.outGrid.innerHTML = '';
    var t = currentTask();
    var rec = (t && t.recommends) || [];
    orderedOutputs().forEach(function (o) {
      var rank = rec.indexOf(o.id);
      var btn = h('button', 'out-card' + (rank === 0 ? ' is-rec' : ''));
      btn.type = 'button';
      btn.setAttribute('data-out', o.id);
      btn.setAttribute('aria-pressed', 'false');
      btn.appendChild(h('span', 'out-icon', o.icon));
      var tx = h('span', 'out-text');
      tx.appendChild(h('span', 'out-name', o.name));
      tx.appendChild(h('span', 'out-desc', o.desc));
      tx.appendChild(h('span', 'out-ex', o.examples));
      btn.appendChild(tx);
      if (rank === 0) btn.appendChild(h('span', 'out-badge', '추천'));
      else if (rank === 1) btn.appendChild(h('span', 'out-badge is-sub', '많이 씀'));
      btn.appendChild(h('span', 'out-check', '✓'));
      els.outGrid.appendChild(btn);
    });
    els.step3Sub.textContent = t
      ? '「' + t.label + '」 업무에 맞는 결과물을 추천 순서로 보여 드립니다.'
      : '결과물을 고르면 필요한 세부 조건만 이어서 묻습니다.';
  }

  function syncOutputs() {
    var nodes = els.outGrid.querySelectorAll('[data-out]');
    Array.prototype.forEach.call(nodes, function (n) {
      var on = n.getAttribute('data-out') === state.out;
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------------- STEP 04 세부 조건 ---------------- */

  function askBlock(ask) {
    var wrap = h('div', 'q');
    wrap.setAttribute('data-ask-block', ask.key);

    var lab = h('div', 'q-label');
    lab.appendChild(h('span', 'q-label-tx', ask.label));
    if (ask.hint) lab.appendChild(h('span', 'q-hint', ask.hint));
    wrap.appendChild(lab);

    var chips = h('div', 'chips');
    var opts = D.options[ask.opt] || [];
    var a = answersFor(state.out);
    opts.forEach(function (o) {
      var b = h('button', 'chip');
      b.type = 'button';
      b.setAttribute('data-ask', ask.key);
      b.setAttribute('data-val', o.value);
      b.setAttribute('aria-pressed', a[ask.key] === o.value ? 'true' : 'false');
      if (a[ask.key] === o.value) b.classList.add('is-on');
      b.appendChild(h('span', 'chip-tick', '✓'));
      b.appendChild(h('span', null, o.label));
      chips.appendChild(b);
    });
    wrap.appendChild(chips);
    return wrap;
  }

  function buildAsks() {
    els.detailAsks.innerHTML = '';
    var o = currentOutput();
    if (!o) {
      els.moreAsksBtn.hidden = true;
      els.step4Sub.textContent = 'STEP 03에서 결과물을 먼저 골라 주세요.';
      return;
    }
    var required = o.asks.filter(function (a) { return a.required; });
    var advanced = o.asks.filter(function (a) { return !a.required; });

    required.forEach(function (a) { els.detailAsks.appendChild(askBlock(a)); });
    if (state.moreOpen) {
      advanced.forEach(function (a) { els.detailAsks.appendChild(askBlock(a)); });
    }

    if (advanced.length) {
      els.moreAsksBtn.hidden = false;
      els.moreAsksBtn.setAttribute('aria-expanded', state.moreOpen ? 'true' : 'false');
      els.moreAsksBtn.textContent = state.moreOpen
        ? '− 세부 조건 접기'
        : '+ 더 세부 조건 (' + advanced.length + '개)';
    } else {
      els.moreAsksBtn.hidden = true;
    }
    els.step4Sub.textContent = '「' + o.name + '」에 꼭 필요한 조건만 묻습니다. 선택 사항은 접어 두었습니다.';
  }

  function syncAsks() {
    var a = answersFor(state.out);
    var nodes = els.detailAsks.querySelectorAll('[data-ask]');
    Array.prototype.forEach.call(nodes, function (n) {
      var on = a[n.getAttribute('data-ask')] === n.getAttribute('data-val');
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------------- 가드레일 / 메모 ---------------- */

  function buildGuards() {
    els.guardrailList.innerHTML = '';
    D.guards.forEach(function (g) {
      var btn = h('button', 'gchip');
      btn.type = 'button';
      btn.setAttribute('data-guard', g.id);
      btn.setAttribute('aria-pressed', 'false');
      btn.appendChild(h('span', 'gbox', '✓'));
      btn.appendChild(h('span', null, g.label));
      els.guardrailList.appendChild(btn);
    });
  }

  function syncGuards() {
    var nodes = els.guardrailList.querySelectorAll('[data-guard]');
    Array.prototype.forEach.call(nodes, function (n) {
      var on = !!state.guards[n.getAttribute('data-guard')];
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function applyMemoField() {
    var o = currentOutput();
    if (o) {
      els.memo.setAttribute('placeholder', o.memo.placeholder);
      els.exampleBtn.hidden = false;
      els.memoHint.textContent = '구체적인 숫자·기한·이름이 들어갈수록 결과가 좋아집니다.';
    } else {
      els.memo.setAttribute('placeholder', '결과물을 고르면 여기에 어떤 내용을 적으면 되는지 예시로 알려드립니다.');
      els.exampleBtn.hidden = true;
      els.memoHint.textContent = 'STEP 03에서 결과물을 고르면 예시를 보여 드립니다.';
    }
  }

  function autoGrow() {
    var t = els.memo;
    t.style.height = 'auto';
    var next = Math.min(Math.max(t.scrollHeight, 104), 280);
    t.style.height = next + 'px';
  }

  /* ---------------- 진행률 ---------------- */

  function computeStats() {
    if (!isLive()) return { pct: 0, label: '시작 전' };
    var s = 0;
    if (state.job) s += 20;
    if (state.task) s += 20;
    if (state.out) {
      s += 25;
      var req = requiredAsks();
      if (req.length) {
        var a = answersFor(state.out);
        var answered = 0;
        req.forEach(function (q) { if (a[q.key]) answered++; });
        s += Math.round(20 * answered / req.length);
      }
      if (state.memo.trim().length > 0) s += 10;
      var g = 0;
      D.guards.forEach(function (x) { if (state.guards[x.id]) g++; });
      if (g > 0) s += 5;
    }
    if (s > 100) s = 100;
    var label = s >= 100 ? '완성 · 복사하기'
      : s >= 85 ? '마지막 한 칸'
      : s >= 55 ? '거의 다 됐어요'
      : s > 0 ? '조립 중'
      : '시작 전';
    return { pct: s, label: label };
  }

  function stateSig() {
    return state.cat + '|' + state.job + '|' + state.task + '|' + state.out + '|'
      + JSON.stringify(state.out ? answersFor(state.out) : {}) + '|' + state.memo + '|'
      + JSON.stringify(state.guards);
  }

  function currentTips() {
    var o = currentOutput();
    return o ? o.tips : D.genericTips;
  }

  /* ---------------- 빠른 시작 ---------------- */

  function buildQuickStart() {
    if (!els.quickStart) return;
    els.quickStart.innerHTML = '';
    (D.quickStart || []).forEach(function (q) {
      var b = h('button', 'qs-btn');
      b.type = 'button';
      b.setAttribute('data-quick', q.id);
      if (q.desc) b.setAttribute('title', q.desc);
      b.appendChild(h('span', 'qs-icon', q.icon));
      b.appendChild(h('span', 'qs-name', q.label));
      b.appendChild(h('span', 'qs-desc', q.desc || ''));
      els.quickStart.appendChild(b);
    });
  }

  function quickById(id) {
    var list = D.quickStart || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function applyQuick(id) {
    var q = quickById(id);
    if (!q) return false;
    if (PW.editor.isEditing()) PW.editor.setEditing(false);
    state.cat = q.cat || D.liveCategoryId;
    state.job = q.job;
    state.task = q.task;
    if (q.job && q.task) state.lastTaskByJob[q.job] = q.task;
    state.out = q.out;
    state.answersByOut[q.out] = {};
    state.answers = state.answersByOut[q.out];
    state.moreOpen = false;
    state.step = 4;
    applyOpt(q.opt ? String(q.opt).split('|') : []);
    renderedJob = '__preset__';
    renderedTask = '__preset__';
    renderedOut = '__preset__';
    render();
    recordRecent();
    var sec = $('wstep4');
    if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (els.liveStatus) els.liveStatus.textContent = q.label + ' 프리셋으로 시작했습니다. 필요한 값만 바꿔 보세요.';
    PW.editor.toast('「' + q.label + '」 프리셋으로 시작했어요. 빈 칸만 채우면 됩니다.');
    return true;
  }

  /* ---------------- URL 프리셋 ---------------- */

  function dec(s) {
    var t = String(s == null ? '' : s).replace(/\+/g, ' ');
    try { return decodeURIComponent(t); } catch (e) { return t; }
  }

  function enc(s) {
    try { return encodeURIComponent(String(s == null ? '' : s)); } catch (e) { return String(s); }
  }

  /* ?cat=&job=&task=&out=&opt=키:값|키:값 — 알 수 없는 값은 조용히 무시한다 */
  function parsePreset(search) {
    var s = String(search || '').replace(/^\?/, '');
    if (!s) return null;
    var preset = {};
    var has = false;
    s.split('&').forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf('=');
      var k = dec(i < 0 ? pair : pair.slice(0, i));
      var v = dec(i < 0 ? '' : pair.slice(i + 1));
      if (!v) return;
      if (k === 'opt') { preset.opt = v.split('|').filter(function (x) { return !!x; }); has = true; }
      else if (k === 'cat' || k === 'job' || k === 'task' || k === 'out') { preset[k] = v; has = true; }
    });
    return has ? preset : null;
  }

  function applyOpt(tokens) {
    var out = currentOutput();
    if (!out || !tokens || !tokens.length) return false;
    var a = answersFor(state.out);
    var any = false;
    out.asks.forEach(function (ask) {
      var opts = D.options[ask.opt] || [];
      for (var i = 0; i < tokens.length && !a[ask.key]; i++) {
        var tok = tokens[i];
        for (var j = 0; j < opts.length; j++) {
          if (opts[j].value === tok) { a[ask.key] = tok; any = true; break; }
          var prefix = ask.key + ':';
          if (tok.indexOf(prefix) === 0 && opts[j].value === tok.slice(prefix.length)) {
            a[ask.key] = opts[j].value; any = true; break;
          }
        }
      }
    });
    return any;
  }

  function applyPreset(p) {
    if (!p) return false;
    var applied = false;
    if (p.cat) {
      var c = E.byId(D.categories, p.cat);
      if (c && c.status === 'live') { state.cat = p.cat; applied = true; }
    }
    if (p.job) {
      var j = E.byId(D.jobs, p.job);
      if (j && (!p.cat || j.cat === state.cat)) { state.job = p.job; applied = true; }
    }
    if (p.task) {
      var t = E.byId(D.tasks, p.task);
      if (t && (!state.job || t.jobId === state.job)) {
        state.task = p.task;
        if (!state.job) state.job = t.jobId;
        state.lastTaskByJob[t.jobId] = p.task;
        applied = true;
      }
    }
    if (p.out) {
      var o = E.byId(D.outputs, p.out);
      if (o) {
        state.out = p.out;
        if (!state.answersByOut[p.out]) state.answersByOut[p.out] = {};
        state.answers = state.answersByOut[p.out];
        applied = true;
      }
    }
    if (state.out && p.opt && p.opt.length) applyOpt(p.opt);
    if (!isLive()) {
      state.job = null; state.task = null; state.out = null; state.answers = {};
      return applied;
    }
    state.step = state.out ? 4 : (state.task ? 3 : (state.job ? 2 : 1));
    renderedJob = '__preset__';
    renderedTask = '__preset__';
    renderedOut = '__preset__';
    return applied;
  }

  function applyUrlPreset() {
    var search = '';
    try { search = (typeof location !== 'undefined' && location.search) || ''; } catch (e) { search = ''; }
    var p = parsePreset(search);
    if (!p) return false;
    return applyPreset(p);
  }

  function stateQuery() {
    if (!state.cat) return '';
    var parts = [];
    if (state.cat) parts.push('cat=' + enc(state.cat));
    if (state.job) parts.push('job=' + enc(state.job));
    if (state.task) parts.push('task=' + enc(state.task));
    if (state.out) parts.push('out=' + enc(state.out));
    var a = state.out ? answersFor(state.out) : {};
    var vals = Object.keys(a).map(function (k) { return a[k]; }).filter(function (v) { return !!v; });
    if (vals.length) parts.push('opt=' + enc(vals.join('|')));
    return parts.length ? '?' + parts.join('&') : '';
  }

  function scheduleUrlSync() {
    if (!(PW.config && PW.config.urlSync)) return;
    if (!state.job) return;
    if (typeof window.matchMedia !== 'function') return;
    var desktop = false;
    try { desktop = window.matchMedia('(min-width:1025px)').matches; } catch (e) { desktop = false; }
    if (!desktop) return;
    if (urlTimer) window.clearTimeout(urlTimer);
    urlTimer = window.setTimeout(function () {
      urlTimer = null;
      try {
        if (typeof history === 'undefined' || !history.replaceState) return;
        history.replaceState(null, '', stateQuery() || location.pathname);
      } catch (e) { /* 주소를 못 바꾸는 환경은 무시 */ }
    }, 400);
  }

  /* ---------------- 품질 점검 ---------------- */

  function qualityContext() {
    var o = currentOutput();
    var req = o ? o.asks.filter(function (a) { return a.required; }) : [];
    var a = state.out ? answersFor(state.out) : {};
    var done = 0;
    req.forEach(function (q) { if (a[q.key]) done++; });
    return {
      job: currentJob(), out: o, answers: a, memo: state.memo, guards: state.guards,
      requiredKeys: req.map(function (q) { return q.key; }), requiredAnswered: done
    };
  }

  function renderQuality() {
    if (!els.qualityPanel) return;
    var show = isLive() && !!state.out;
    els.qualityPanel.hidden = !show;
    if (!show) {
      qSig = '';
      return;
    }
    var res = PW.quality.evaluate(qualityContext());
    var missing = res.missing.map(function (m) { return m.key; }).join(',');
    var sig = res.score + '|' + (state.qOpen ? 1 : 0) + '|' + missing;
    els.qualityPanel.classList.toggle('is-low', res.score < 60);
    els.qualityPanel.classList.toggle('is-open', !!state.qOpen);
    if (sig === qSig) return;
    qSig = sig;
    els.qualityScore.textContent = String(res.score);
    els.qualityLabel.textContent = res.label;
    els.qualityToggle.setAttribute('aria-expanded', state.qOpen ? 'true' : 'false');
    els.qualityBody.hidden = !state.qOpen;
    els.qualityList.innerHTML = '';
    res.items.forEach(function (it) {
      var li = h('li', 'quality-item' + (it.ok ? ' is-ok' : ''));
      li.setAttribute('data-q-item', it.key);
      li.appendChild(h('span', 'qi-name', it.label));
      li.appendChild(h('span', 'qi-score', it.score + '/' + it.max));
      li.appendChild(h('span', 'qi-advice', it.ok ? '충족' : it.advice));
      els.qualityList.appendChild(li);
    });
  }

  /* ---------------- 즐겨찾기 · 최근 ---------------- */

  function fullSelection() {
    return {
      cat: state.cat, job: state.job, task: state.task, out: state.out,
      answers: state.out ? answersFor(state.out) : {},
      memo: state.memo, guards: state.guards
    };
  }

  function labelOfSelect(sel) {
    var names = [];
    var o = sel && sel.out ? E.byId(D.outputs, sel.out) : null;
    var t = sel && sel.task ? E.byId(D.tasks, sel.task) : null;
    var j = sel && sel.job ? E.byId(D.jobs, sel.job) : null;
    if (j) names.push(j.name);
    if (t) names.push(t.label);
    if (o) names.push(o.short || o.name);
    return names.length ? names.join(' · ') : '프롬프트';
  }

  function fmtDate(ts) {
    if (!ts) return '';
    try {
      var d = new Date(ts);
      var mm = d.getMonth() + 1;
      var dd = d.getDate();
      return mm + '/' + dd;
    } catch (e) { return ''; }
  }

  function recordRecent() {
    if (!isLive() || !state.out) return;
    PW.store.pushRecent({
      cat: state.cat, job: state.job, task: state.task, out: state.out,
      answers: answersFor(state.out)
    });
    renderShelf();
  }

  function renderShelf() {
    if (!els.shelfCard) return;
    var can = PW.store.available();
    els.shelfCard.hidden = !can;
    if (!can) return;

    var favs = PW.store.favorites();
    els.favList.innerHTML = '';
    if (els.favEmpty) els.favEmpty.hidden = favs.length > 0;
    if (els.favClear) els.favClear.hidden = favs.length === 0;
    favs.forEach(function (f) {
      var li = h('li', 'shelf-item');
      var btn = h('button', 'shelf-load');
      btn.type = 'button';
      btn.setAttribute('data-fav', f.id);
      btn.appendChild(h('span', 'shelf-item-title', f.title));
      btn.appendChild(h('span', 'shelf-item-meta', (f.sel ? labelOfSelect(f.sel) : '') + (f.ts ? ' · ' + fmtDate(f.ts) : '')));
      li.appendChild(btn);
      var del = h('button', 'shelf-del');
      del.type = 'button';
      del.setAttribute('data-fav-del', f.id);
      del.setAttribute('aria-label', '이 즐겨찾기 삭제');
      del.textContent = '✕';
      li.appendChild(del);
      els.favList.appendChild(li);
    });

    var rec = PW.store.recent();
    els.recentList.innerHTML = '';
    if (els.recentEmpty) els.recentEmpty.hidden = rec.length > 0;
    rec.forEach(function (r) {
      var li = h('li', 'shelf-item');
      var btn = h('button', 'shelf-load');
      btn.type = 'button';
      btn.setAttribute('data-recent', r.sig || '');
      btn.appendChild(h('span', 'shelf-item-title', labelOfSelect(r)));
      btn.appendChild(h('span', 'shelf-item-meta', fmtDate(r.ts)));
      li.appendChild(btn);
      els.recentList.appendChild(li);
    });

    els.favAdd.disabled = !(isLive() && !!state.out);
  }

  function applySelection(sel) {
    if (!sel) return false;
    var selCat = sel.cat ? E.byId(D.categories, sel.cat) : null;
    if (selCat && selCat.status === 'live') state.cat = sel.cat;
    if (sel.job && E.byId(D.jobs, sel.job)) state.job = sel.job;
    if (sel.task && E.byId(D.tasks, sel.task)) { state.task = sel.task; state.lastTaskByJob[state.job] = sel.task; }
    if (sel.out && E.byId(D.outputs, sel.out)) {
      state.out = sel.out;
      state.answersByOut[sel.out] = sel.answers ? JSON.parse(JSON.stringify(sel.answers)) : {};
      state.answers = state.answersByOut[sel.out];
    }
    if (typeof sel.memo === 'string') {
      state.memo = sel.memo;
      if (els.memo) { els.memo.value = sel.memo; els.memoCount.textContent = sel.memo.length + '자'; autoGrow(); }
    }
    if (sel.guards) {
      state.guards = {};
      D.guards.forEach(function (g) { if (sel.guards[g.id]) state.guards[g.id] = true; });
    }
    state.step = state.out ? 4 : (state.task ? 3 : (state.job ? 2 : 1));
    renderedJob = '__restore__';
    renderedTask = '__restore__';
    renderedOut = '__restore__';
    return true;
  }

  function loadFavorite(id) {
    var f = PW.store.favoriteById(id);
    if (!f) return;
    if (PW.editor.isEditing()) PW.editor.setEditing(false);
    applySelection(f.sel);
    render();
    if (f.body) PW.editor.setEditing(true, f.body);
    PW.editor.toast('저장한 프롬프트를 불러왔어요.');
  }

  function loadRecent(sig) {
    var list = PW.store.recent();
    for (var i = 0; i < list.length; i++) {
      if (list[i].sig === sig) {
        if (PW.editor.isEditing()) PW.editor.setEditing(false);
        applySelection(list[i]);
        render();
        PW.editor.toast('최근 선택으로 돌아갔어요.');
        return;
      }
    }
  }

  function saveFavorite() {
    if (!isLive() || !state.out) { PW.editor.toast('먼저 결과물을 골라 주세요.'); return; }
    var text = PW.editor.settle();
    if (!text) { PW.editor.toast('프롬프트가 아직 비어 있어요.'); return; }
    var title = labelOfSelect(fullSelection()) + ' · ' + fmtDate(Date.now());
    var rec = PW.store.addFavorite({ title: title, body: text, sel: fullSelection() });
    renderShelf();
    PW.editor.toast(rec ? '즐겨찾기에 저장했어요(이 브라우저에만).' : '저장 공간이 막혀 저장하지 못했어요.');
  }

  /* ---------------- 렌더 ---------------- */

  function render() {
    renderCount++;
    syncCatNav();
    els.wizardCard.hidden = false;

    syncRail();
    els.wstep1.hidden = false;
    els.wstep2.hidden = !state.job;
    els.wstep3.hidden = !(state.task || state.out);
    els.wstep4.hidden = !state.out;

    syncJobs();

    if (renderedJob !== state.job) {
      buildTasks();
      renderedJob = state.job;
      renderedTask = '__stale__';
    }
    syncTasks();

    if (renderedTask !== state.task) {
      buildOutputs();
      renderedTask = state.task;
    }
    syncOutputs();

    if (renderedOut !== state.out || renderedMore !== state.moreOpen) {
      buildAsks();
      renderedOut = state.out;
      renderedMore = state.moreOpen;
    }
    syncAsks();
    applyMemoField();
    syncGuards();

    var changed = [];
    PW.editor.setEmpty(!state.out);
    if (state.out) changed = PW.editor.setSegments(E.build(state));
    PW.editor.renderTips();

    var stats = computeStats();
    var bump = stats.pct !== prevPct;
    prevPct = stats.pct;
    PW.editor.setProgress(stats.pct, stats.label, bump);

    renderQuality();
    if (els.favAdd) els.favAdd.disabled = !(state.out);
    scheduleUrlSync();

    if (changed.length) PW.editor.focusTypingSeg(changed[0]);
  }

  function scheduleRender() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(function () {
      rafPending = false;
      render();
    });
  }

  /* ---------------- 동작 ---------------- */

  function setCategory(id, fromNode) {
    var c = E.byId(D.categories, id);
    if (!c) return;
    /* 준비 중 카테고리: 화면 전환 없이 현재 카테고리·위자드·에디터를 그대로 두고 모달만 띄운다 */
    if (c.status !== 'live') {
      openCatModal(c, fromNode);
      return;
    }
    closeCatModal();
    if (state.cat === id) return;
    state.cat = id;
    if (PW.editor.isEditing()) PW.editor.setEditing(false);
    render();
  }

  function selectJob(id) {
    if (!E.byId(D.jobs, id)) return;
    if (state.job === id) return;
    if (state.job && state.task) state.lastTaskByJob[state.job] = state.task;
    state.job = id;
    var job = currentJob();
    var keep = state.task;
    var inJob = false;
    jobTasks(job).forEach(function (t) { if (t.id === keep) inJob = true; });
    if (!inJob) {
      var remembered = state.lastTaskByJob[id];
      var ok = false;
      jobTasks(job).forEach(function (t) { if (t.id === remembered) ok = true; });
      state.task = ok ? remembered : null;
    }
    state.step = Math.max(state.step, 2);
    render();
    els.liveStatus.textContent = job.name + ' 직무가 선택되었습니다.';
  }

  function selectTask(id) {
    if (!E.byId(D.tasks, id)) return;
    if (state.task === id) {
      state.task = null;
      state.step = 2;
      render();
      return;
    }
    state.task = id;
    state.lastTaskByJob[state.job] = id;
    state.step = Math.max(state.step, 3);
    render();
  }

  function selectOut(id) {
    if (!E.byId(D.outputs, id)) return;
    if (state.out === id) return;
    state.out = id;
    state.answers = answersFor(id);
    state.step = 4;
    state.moreOpen = false;
    if (PW.editor.isEditing()) PW.editor.setEditing(false);
    render();
    recordRecent();
  }

  function toggleAsk(key, value) {
    if (!state.out) return;
    var a = answersFor(state.out);
    if (a[key] === value) delete a[key];
    else a[key] = value;
    render();
  }

  function resetAll() {
    state.job = null;
    state.task = null;
    state.out = null;
    state.answersByOut = {};
    state.answers = {};
    state.memo = '';
    state.guards = {};
    D.guards.forEach(function (g) { if (g.on) state.guards[g.id] = true; });
    state.step = 1;
    state.lastTaskByJob = {};
    state.moreOpen = false;
    state.qOpen = false;
    state.cat = D.liveCategoryId;
    closeCatModal();

    els.memo.value = '';
    els.memoCount.textContent = '0자';
    autoGrow();
    if (PW.editor.isEditing()) PW.editor.setEditing(false);
    renderedJob = '__init__';
    renderedTask = '__init__';
    renderedOut = '__init__';
    renderedMore = null;
    render();
    PW.editor.toast('처음 상태로 돌아갔어요.');
  }

  function wire() {
    els.catNav.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-cat]');
      if (!btn) return;
      setCategory(btn.getAttribute('data-cat'), btn);
    });

    if (els.catModal) {
      if (els.catModalOk) els.catModalOk.addEventListener('click', closeCatModal);
      if (els.catModalClose) els.catModalClose.addEventListener('click', closeCatModal);
      if (els.catModalVeil) els.catModalVeil.addEventListener('click', closeCatModal);
      els.catModal.addEventListener('click', function (ev) {
        if (ev.target === els.catModal) closeCatModal();   /* 카드 바깥을 누르면 닫힌다 */
      });
      document.addEventListener('keydown', function (ev) {
        if (!ev || ev.key !== 'Escape') return;
        if (els.catModal.hidden) return;
        if (ev.preventDefault) ev.preventDefault();
        closeCatModal();
      });
    }

    els.stepRail.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-step]');
      if (!btn) return;
      var n = Number(btn.getAttribute('data-step'));
      if (!stepUnlocked(n)) {
        PW.editor.toast('앞 단계를 먼저 골라 주세요.');
        return;
      }
      state.step = n;
      render();
      var sec = $('wstep' + n);
      if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    els.jobGrid.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-job]');
      if (btn) selectJob(btn.getAttribute('data-job'));
    });

    els.taskChips.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-task]');
      if (btn) selectTask(btn.getAttribute('data-task'));
    });

    els.outGrid.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-out]');
      if (btn) selectOut(btn.getAttribute('data-out'));
    });

    els.detailAsks.addEventListener('click', function (ev) {
      var chip = ev.target.closest('[data-ask]');
      if (!chip) return;
      toggleAsk(chip.getAttribute('data-ask'), chip.getAttribute('data-val'));
    });

    els.moreAsksBtn.addEventListener('click', function () {
      state.moreOpen = !state.moreOpen;
      render();
    });

    els.guardrailList.addEventListener('click', function (ev) {
      var chip = ev.target.closest('[data-guard]');
      if (!chip) return;
      var id = chip.getAttribute('data-guard');
      if (state.guards[id]) delete state.guards[id];
      else state.guards[id] = true;
      render();
    });

    els.memo.addEventListener('input', function () {
      state.memo = els.memo.value;
      els.memoCount.textContent = els.memo.value.length + '자';
      autoGrow();
      scheduleRender();
    });

    els.exampleBtn.addEventListener('click', function () {
      var o = currentOutput();
      if (!o) {
        PW.editor.toast('먼저 결과물을 골라 주세요.');
        return;
      }
      els.memo.value = o.memo.example;
      state.memo = o.memo.example;
      els.memoCount.textContent = o.memo.example.length + '자';
      autoGrow();
      render();
      els.memo.focus();
      PW.editor.toast('예시를 채웠어요. 내용만 바꿔 보세요.');
    });

    els.resetBtn.addEventListener('click', resetAll);

    if (els.quickStart) {
      els.quickStart.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-quick]');
        if (btn) applyQuick(btn.getAttribute('data-quick'));
      });
    }

    if (els.qualityToggle) {
      els.qualityToggle.addEventListener('click', function () {
        state.qOpen = !state.qOpen;
        qSig = '';
        renderQuality();
      });
    }

    if (els.favAdd) els.favAdd.addEventListener('click', saveFavorite);

    if (els.favClear) {
      els.favClear.addEventListener('click', function () {
        PW.store.clearFavorites();
        renderShelf();
        PW.editor.toast('즐겨찾기를 모두 지웠어요.');
      });
    }

    if (els.shelfCard) {
      els.shelfCard.addEventListener('click', function (ev) {
        var del = ev.target.closest('[data-fav-del]');
        if (del) {
          PW.store.removeFavorite(del.getAttribute('data-fav-del'));
          renderShelf();
          PW.editor.toast('즐겨찾기에서 지웠어요.');
          return;
        }
        var fav = ev.target.closest('[data-fav]');
        if (fav) { loadFavorite(fav.getAttribute('data-fav')); return; }
        var rec = ev.target.closest('[data-recent]');
        if (rec) { loadRecent(rec.getAttribute('data-recent')); return; }
      });
    }
  }

  /* ---------------- 시작 ---------------- */

  function boot() {
    PW.editor.init({
      hasSubject: function () { return isLive() && !!state.out; },
      sig: stateSig,
      memoEmpty: function () { return E.memoLines(state).length === 0; },
      tips: currentTips,
      tipsSub: function () {
        return state.out ? '그대로 복사해 답변 아래에 이어 붙이면 됩니다.' : '결과물을 고르면 그 결과물에 맞는 팁으로 바뀝니다.';
      },
      instantKey: 'situation',
      render: render
    });

    buildCatNav();
    /* 마크업의 hidden과 같은 초기 상태를 코드로도 명시한다 */
    if (els.catModal) {
      els.catModal.hidden = true;
      els.catModal.setAttribute('aria-hidden', 'true');
    }
    buildRail();
    buildJobs();
    buildGuards();
    buildTasks();
    buildOutputs();
    buildAsks();
    buildQuickStart();
    applyMemoField();
    autoGrow();
    wire();

    /* URL 프리셋은 첫 렌더 전에 적용한다 — 기본 상태를 한 번 쓴 뒤 다시 쓰는 이중 타이핑을 막는다 */
    applyUrlPreset();
    render();
    if (PW.ads && PW.ads.boot) PW.ads.boot();
    renderShelf();
  }

  PW.app = {
    state: state,
    render: render,
    computeStats: computeStats,
    stateSig: stateSig,
    parsePreset: parsePreset,
    applyPreset: applyPreset,
    applyQuick: applyQuick,
    applySelection: applySelection,
    saveFavorite: saveFavorite,
    recordRecent: recordRecent,
    stateQuery: stateQuery,
    quality: function () { return PW.quality.evaluate(qualityContext()); },
    renders: function () { return renderCount; },
    openCatModal: function (id, fromNode) {
      var c = E.byId(D.categories, id);
      if (c) openCatModal(c, fromNode);
    },
    closeCatModal: closeCatModal,
    modalOpen: function () { return !!(els.catModal && !els.catModal.hidden); },
    selected: function () {
      return {
        cat: state.cat, job: state.job, task: state.task, out: state.out,
        answers: state.out ? answersFor(state.out) : {},
        memo: state.memo, guards: state.guards
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.PW);
