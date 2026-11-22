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
    moreOpen: false
  };
  D.guards.forEach(function (g) { if (g.on) state.guards[g.id] = true; });

  var renderedJob = '__init__';
  var renderedTask = '__init__';
  var renderedOut = '__init__';
  var renderedMore = null;
  var renderedCat = '__init__';
  var prevPct = -1;
  var rafPending = false;

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
    plannedPanel: $('plannedPanel'),
    plannedName: $('plannedName'),
    plannedDesc: $('plannedDesc'),
    plannedExamples: $('plannedExamples'),
    plannedPlans: $('plannedPlans'),
    plannedGo: $('plannedGo')
  };

  /* ---------------- 조회 도우미 ---------------- */

  function liveCat() { return E.byId(D.categories, D.liveCategoryId); }
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
      var btn = h('button', 'cat' + (c.status === 'live' ? ' is-live' : ''));
      btn.type = 'button';
      btn.setAttribute('data-cat', c.id);
      btn.setAttribute('aria-pressed', 'false');
      btn.appendChild(h('span', 'cat-ic', c.icon));
      btn.appendChild(h('span', 'cat-name', c.name));
      if (c.status !== 'live') btn.appendChild(h('span', 'cat-soon', '준비 중'));
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
      els.brandSub.textContent = c
        ? (c.status === 'live' ? c.name + ' 실무 프롬프트' : c.name + ' · 준비 중')
        : '공공기관·공무원 실무 프롬프트';
    }
  }

  function renderPlanned() {
    var c = currentCat();
    if (!c || c.status === 'live') {
      els.plannedPanel.hidden = true;
      return;
    }
    els.wizardCard.hidden = true;
    els.plannedPanel.hidden = false;
    els.plannedName.textContent = c.name;
    els.plannedDesc.textContent = c.description || '';

    els.plannedExamples.innerHTML = '';
    (c.examples || []).forEach(function (ex) {
      var card = h('div', 'example-card');
      card.appendChild(h('b', null, ex.title));
      card.appendChild(h('span', null, ex.desc));
      els.plannedExamples.appendChild(card);
    });

    els.plannedPlans.innerHTML = '';
    (c.plans || []).forEach(function (p) {
      els.plannedPlans.appendChild(h('li', null, p));
    });

    var live = liveCat();
    els.plannedGo.textContent = (live ? live.name : '공공기관·공무원') + ' 도구로 이동';
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

  /* ---------------- 렌더 ---------------- */

  function render() {
    syncCatNav();

    if (!isLive()) {
      renderPlanned();
      els.wizardCard.hidden = true;
      PW.editor.setEmpty(true);
      PW.editor.renderTips();
      PW.editor.setProgress(0, '시작 전', false);
      return;
    }
    els.wizardCard.hidden = false;
    els.plannedPanel.hidden = true;

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

  function setCategory(id) {
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
    if (state.step < 2) state.step = 2;
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
    if (state.step < 3) state.step = 3;
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
    state.cat = D.liveCategoryId;

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
      setCategory(btn.getAttribute('data-cat'));
    });

    els.plannedGo.addEventListener('click', function () {
      setCategory(D.liveCategoryId);
    });

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
    buildRail();
    buildJobs();
    buildGuards();
    buildTasks();
    buildOutputs();
    buildAsks();
    applyMemoField();
    autoGrow();
    wire();
    render();
  }

  PW.app = {
    state: state,
    render: render,
    computeStats: computeStats,
    stateSig: stateSig,
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
