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
    tplId: null,
    orgType: null,
    orgName: '',
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
  var renderedTpl = '__init__';
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
    quickWrap: $('quickWrap'),
    wstep1: $('wstep1'),
    wstep2: $('wstep2'),
    wstep3: $('wstep3'),
    wstep4: $('wstep4'),
    stepNav: $('stepNav'),
    stepPrev: $('stepPrev'),
    stepNext: $('stepNext'),
    stepNavHint: $('stepNavHint'),
    orgTypes: $('orgTypes'),
    orgName: $('orgName'),
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
    searchInput: $('searchInput'),
    searchResults: $('searchResults'),
    searchClear: $('searchClear'),
    searchHint: $('searchHint'),
    tplWrap: $('tplWrap'),
    tplGrid: $('tplGrid'),
    tplCount: $('tplCount'),
    frameWrap: $('frameWrap'),
    frameAsks: $('frameAsks'),
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

  /* ---------------- 별칭·프레임·템플릿 도우미 ---------------- */

  /* 해석 순서: task → job → cat. 업무 별칭이 직무 별칭보다 우선이다. */
  function resolveTaskId(id) {
    if (!id) return null;
    if (E.byId(D.tasks, id)) return id;
    var a = (D.taxonomyAlias && D.taxonomyAlias.task) || {};
    if (a[id] && E.byId(D.tasks, a[id].task)) return a[id].task;
    return null;
  }

  function resolveJobId(id) {
    if (!id) return null;
    if (E.byId(D.jobs, id)) return id;
    var a = (D.taxonomyAlias && D.taxonomyAlias.job) || {};
    if (a[id] && E.byId(D.jobs, a[id].domain)) return a[id].domain;
    return null;
  }

  function currentFrame() {
    var job = currentJob();
    return job ? E.frameOf(job) : null;
  }

  function currentTpl() { return state.tplId ? E.templateOf(state) : null; }

  function taskTemplates(taskId) {
    var map = D.taskTemplates || {};
    return (map[taskId] || []).slice();
  }

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
    { n: 1, label: '분야', short: '분야' },
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

  /* ---------------- 단계 이동 (한 번에 한 단계만 표시) ----------------
     선택은 그대로 두고 보이는 단계만 바꾸므로, 앞 단계로 돌아가 고쳐도
     아래 단계의 선택값이 살아 있다. */

  function showStep(n) {
    var sec = $('wstep' + n);
    if (!sec || !sec.scrollIntoView) return;
    try { sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    catch (e) { try { sec.scrollIntoView(); } catch (e2) { /* 스크롤을 막는 환경은 무시 */ } }
  }

  function goStep(n) {
    n = Number(n);
    if (!(n >= 1 && n <= 4)) return false;
    if (n !== state.step && !stepUnlocked(n)) {
      PW.editor.toast('앞 단계를 먼저 골라 주세요.');
      return false;
    }
    if (state.step === n) { showStep(n); return false; }
    state.step = n;
    render();
    showStep(n);
    return true;
  }

  function syncStepNav() {
    var n = state.step;
    var nextOpen = n < 4 && stepUnlocked(n + 1);
    if (els.stepNav) els.stepNav.setAttribute('data-step', String(n));
    if (els.stepPrev) {
      els.stepPrev.disabled = n <= 1;
      els.stepPrev.textContent = '← 이전 단계';
    }
    if (els.stepNext) {
      els.stepNext.disabled = !nextOpen;
      els.stepNext.textContent = n >= 4 ? '마지막 단계' : '다음 단계 →';
    }
    if (!els.stepNavHint) return;
    var msg;
    if (n === 1) msg = state.job ? '02 세부 업무로 넘어갈 수 있어요.' : '분야를 고르면 02 업무가 열립니다.';
    else if (n === 2) msg = state.task ? '03 결과물로 넘어갈 수 있어요.' : '세부 업무를 고르면 03 결과물이 열립니다.';
    else if (n === 3) msg = state.out ? '04 세부 조건으로 넘어갈 수 있어요.' : '결과물을 고르면 04 조건이 열립니다.';
    else msg = '조건을 채우면 오른쪽 프롬프트가 완성됩니다.';
    els.stepNavHint.textContent = 'STEP 0' + n + ' — ' + msg;
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
      tx.appendChild(h('span', 'job-meta', ((j.taskIds || []).length) + '개 업무'));
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

  /* ---------------- STEP 01 소속 기관 (선택) ---------------- */

  function buildOrgTypes() {
    if (!els.orgTypes) return;
    els.orgTypes.innerHTML = '';
    ((PW.config && PW.config.orgTypes) || []).forEach(function (o) {
      var b = h('button', 'chip org-chip');
      b.type = 'button';
      b.setAttribute('data-org-type', o.value);
      b.setAttribute('aria-pressed', 'false');
      b.appendChild(h('span', 'chip-tick', '✓'));
      b.appendChild(h('span', null, o.label));
      els.orgTypes.appendChild(b);
    });
  }

  function syncOrgTypes() {
    if (els.orgTypes) {
      var nodes = els.orgTypes.querySelectorAll('[data-org-type]');
      Array.prototype.forEach.call(nodes, function (n) {
        var on = n.getAttribute('data-org-type') === state.orgType;
        n.classList.toggle('is-on', on);
        n.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    if (els.orgName && els.orgName.value !== state.orgName) els.orgName.value = state.orgName;
  }

  function toggleOrgType(value) {
    state.orgType = (state.orgType === value) ? null : value;
    render();
    els.liveStatus.textContent = state.orgType
      ? '소속 기관 성격을 역할 문장에 반영합니다.'
      : '소속 기관 성격을 비웠습니다. 기본 문장으로 돌아갑니다.';
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
      ? jobName + ' 분야의 세부 업무 ' + jobTasks(job).length + '개 중 하나를 골라 주세요.'
      : 'STEP 01에서 직무 분야를 먼저 골라 주세요.';
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

  /* ---------------- STEP 03 특화 템플릿 카드 ---------------- */

  function baseBadge(base) {
    return { report: '보고서', collab: '공문', mail: '메일', excel: '엑셀',
      summary: '요약', review: '검토', form: '표·서식' }[base] || '문서';
  }

  function buildTemplates() {
    if (!els.tplGrid) return;
    var cards = taskTemplates(state.task);
    els.tplGrid.innerHTML = '';
    if (els.tplWrap) els.tplWrap.hidden = !(state.task && cards.length);
    if (els.tplCount) els.tplCount.textContent = String(cards.length);
    var defs = D.templatesById || {};
    cards.forEach(function (c) {
      var def = defs[c.tpl] || E.byId(D.templates || [], c.tpl);
      if (!def) return;
      var btn = h('button', 'tpl-card');
      btn.type = 'button';
      btn.setAttribute('data-tpl', c.tpl);
      btn.setAttribute('aria-pressed', 'false');
      btn.appendChild(h('span', 'tpl-base', baseBadge(def.base)));
      btn.appendChild(h('span', 'tpl-name', c.name));
      btn.appendChild(h('span', 'tpl-desc', def.desc));
      btn.appendChild(h('span', 'tpl-check', '✓'));
      els.tplGrid.appendChild(btn);
    });
  }

  function syncTemplates() {
    if (!els.tplGrid) return;
    var nodes = els.tplGrid.querySelectorAll('[data-tpl]');
    Array.prototype.forEach.call(nodes, function (n) {
      var on = n.getAttribute('data-tpl') === state.tplId;
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* 템플릿 적용: 상속 결과물 + 미리 채우는 칩(화면에 체크로 보임) + 전용 질문 */
  function applyTemplate(tplId) {
    var def = (D.templatesById || {})[tplId] || E.byId(D.templates || [], tplId);
    if (!def) return false;
    state.tplId = def.id;
    state.out = def.base;
    if (!state.answersByOut[def.base]) state.answersByOut[def.base] = {};
    state.answers = state.answersByOut[def.base];
    var preset = def.preset || {};
    Object.keys(preset).forEach(function (k) { state.answers[k] = preset[k]; });
    return true;
  }

  function selectTemplate(tplId) {
    if (!applyTemplate(tplId)) return;
    state.step = 4;
    state.moreOpen = true;
    state.step = 4;
    render();
    recordRecent();
    var sec = $('wstep4');
    if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var def = currentTpl();
    if (def) PW.editor.toast('「' + def.name + '」 템플릿을 골랐어요. 미리 채운 칩만 확인하세요.');
  }

  /* ---------------- STEP 04 세부 조건 ---------------- */

  function askBlock(ask, group) {
    var wrap = h('div', 'q');
    wrap.setAttribute('data-ask-block', ask.key);
    if (group) wrap.setAttribute('data-ask-group', group);

    var lab = h('div', 'q-label');
    lab.appendChild(h('span', 'q-label-tx', ask.label));
    if (ask.hint) lab.appendChild(h('span', 'q-hint', ask.hint));
    if (ask.why) lab.appendChild(h('span', 'q-hint', ask.why));
    wrap.appendChild(lab);

    var chips = h('div', 'chips');
    var raw = ask.options || (D.options[ask.opt] || []);
    var opts = raw.map(function (x) {
      return (typeof x === 'string') ? { value: x, label: x } : x;
    });
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
    var frame = currentFrame();

    /* 분야 공통 조건 — 결과물을 고르면 그 분야의 필수 질문 4~5개가 뜤다 */
    if (els.frameAsks) {
      els.frameAsks.innerHTML = '';
      if (els.frameWrap) els.frameWrap.hidden = !(frame && state.out);
      if (frame && state.out) {
        (frame.asks || []).forEach(function (a) { els.frameAsks.appendChild(askBlock(a, 'frame')); });
      }
    }

    if (!o) {
      els.moreAsksBtn.hidden = true;
      els.step4Sub.textContent = 'STEP 03에서 결과물을 먼저 골라 주세요.';
      return;
    }
    var required = o.asks.filter(function (a) { return a.required; });
    var advanced = o.asks.filter(function (a) { return !a.required; });
    var def = currentTpl();
    var tplAsks = (def && def.extraAsks) ? def.extraAsks : [];

    required.forEach(function (a) { els.detailAsks.appendChild(askBlock(a, 'out')); });
    if (state.moreOpen) {
      advanced.forEach(function (a) { els.detailAsks.appendChild(askBlock(a, 'out')); });
      tplAsks.forEach(function (a) { els.detailAsks.appendChild(askBlock(a, 'tpl')); });
    }

    var more = advanced.length + tplAsks.length;
    if (more) {
      els.moreAsksBtn.hidden = false;
      els.moreAsksBtn.setAttribute('aria-expanded', state.moreOpen ? 'true' : 'false');
      els.moreAsksBtn.textContent = state.moreOpen
        ? '− 세부 조건 접기'
        : '+ 더 세부 조건 (' + more + '개)';
    } else {
      els.moreAsksBtn.hidden = true;
    }
    var tail = def ? ' 「' + def.name + '」 전용 조건 ' + tplAsks.length + '개가 더 있습니다.' : '';
    els.step4Sub.textContent = '「' + o.name + '」에 꼭 필요한 조건만 묻습니다.' + tail;
  }

  function syncAsks() {
    var a = answersFor(state.out);
    var hosts = [els.detailAsks];
    if (els.frameAsks) hosts.push(els.frameAsks);
    hosts.forEach(function (host) {
      if (!host) return;
      var nodes = host.querySelectorAll('[data-ask]');
      Array.prototype.forEach.call(nodes, function (n) {
        var on = a[n.getAttribute('data-ask')] === n.getAttribute('data-val');
        n.classList.toggle('is-on', on);
        n.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
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
    var def = currentTpl();
    if (o) {
      els.memo.setAttribute('placeholder', def ? def.memoHint : o.memo.placeholder);
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
      + JSON.stringify(state.guards) + '|' + (state.orgType || '') + '|' + state.orgName;
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
    state.tplId = null;
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

  /* ---------------- 자연어 업무 검색 ---------------- */

  function taskNameOf(id) { var t = E.byId(D.tasks, id); return t ? t.name : ''; }
  function domainNameOf(id) { var j = E.byId(D.jobs, id); return j ? j.name : ''; }
  function outShortOf(id) { var o = E.byId(D.outputs, id); return o ? (o.short || o.name) : ''; }

  function appendSearchRow(domainId, taskId, outId, why, tplId) {
    var b = h('button', 'search-hit');
    b.type = 'button';
    b.setAttribute('data-dom', domainId || '');
    b.setAttribute('data-task-id', taskId || '');
    b.setAttribute('data-out-id', outId || 'report');
    if (tplId) b.setAttribute('data-tpl-id', tplId);
    b.appendChild(h('span', 'sh-path', domainNameOf(domainId) + ' › ' + taskNameOf(taskId)));
    b.appendChild(h('span', 'sh-out', outShortOf(outId)));
    if (why) b.appendChild(h('span', 'sh-why', why));
    els.searchResults.appendChild(b);
  }

  function renderSearch() {
    if (!els.searchResults || !els.searchInput) return;
    var q = String(els.searchInput.value || '').trim();
    if (els.searchClear) els.searchClear.hidden = !q;
    els.searchResults.innerHTML = '';
    if (!q) {
      els.searchResults.hidden = true;
      if (els.searchHint) els.searchHint.textContent = '예: “전기실 정기점검 결과보고서”, “위험성평가표 만들어줘”';
      return;
    }
    var res = PW.search.query(q, 3);
    if (!res.results.length) {
      els.searchResults.appendChild(h('p', 'search-empty', '비슷한 업무를 찾지 못했어요. 자주 쓰는 업무부터 보여 드립니다.'));
      PW.search.popular(3).forEach(function (t) {
        appendSearchRow(t.domainId || t.jobId, t.id, t.recommends[0], '인기 업무', null);
      });
    } else {
      res.results.forEach(function (r) {
        appendSearchRow(r.domainId, r.taskId, r.outId, r.why, r.tplId);
      });
    }
    els.searchResults.hidden = false;
    if (els.searchHint) els.searchHint.textContent = res.results.length
      ? '결과를 누르면 그 업무로 바로 들어갑니다.'
      : '다른 말로 한 번 더 찾아보세요.';
  }

  function applySearchHit(btn) {
    if (!btn) return;
    var dom = resolveJobId(btn.getAttribute('data-dom'));
    var task = resolveTaskId(btn.getAttribute('data-task-id'));
    var outId = btn.getAttribute('data-out-id');
    var tplId = btn.getAttribute('data-tpl-id');
    if (PW.editor.isEditing()) PW.editor.setEditing(false);
    state.cat = D.liveCategoryId;
    if (dom) state.job = dom;
    if (task) state.task = task;
    var tk = task ? E.byId(D.tasks, task) : null;
    if (tk) state.job = tk.domainId || tk.jobId;
    state.tplId = null;
    var applied = false;
    if (tplId) applied = applyTemplate(tplId);
    if (!applied && outId && E.byId(D.outputs, outId)) {
      state.out = outId;
      if (!state.answersByOut[outId]) state.answersByOut[outId] = {};
      state.answers = state.answersByOut[outId];
    }
    state.moreOpen = false;
    state.step = 4;
    renderedJob = '__search__';
    renderedTask = '__search__';
    renderedOut = '__search__';
    renderedTpl = '__init__';
    render();
    recordRecent();
    els.searchResults.hidden = true;
    var sec = $('wstep4');
    if (sec && sec.scrollIntoView) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    PW.editor.toast('「' + taskNameOf(task) + '」 업무로 이동했어요.');
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
      else if (k === 'cat' || k === 'job' || k === 'task' || k === 'out' || k === 'tpl') { preset[k] = v; has = true; }
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
    /* 해석 순서: task → job → cat (업무 별칭이 직무 별칭보다 우선) */
    var taskId = p.task ? resolveTaskId(p.task) : null;
    if (taskId) {
      var t = E.byId(D.tasks, taskId);
      state.task = taskId;
      state.job = t.domainId || t.jobId;
      state.lastTaskByJob[state.job] = taskId;
      applied = true;
    } else if (p.job) {
      var jid = resolveJobId(p.job);
      if (jid && (!p.cat || state.cat === p.cat)) { state.job = jid; applied = true; }
    }
    if (taskId && p.job && !state.job) state.job = resolveJobId(p.job);
    state.tplId = null;
    if (p.tpl && (D.templatesById || {})[p.tpl]) {
      var def = D.templatesById[p.tpl];
      var ownerOk = !def.owner || def.owner === state.task;
      if (ownerOk) { applyTemplate(p.tpl); applied = true; }
    } else if (p.out) {
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
    renderedTpl = '__init__';
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
    if (state.tplId) parts.push('tpl=' + enc(state.tplId));
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
      cat: state.cat, job: state.job, task: state.task, out: state.out, tplId: state.tplId,
      orgType: state.orgType, orgName: state.orgName,
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
      orgType: state.orgType, orgName: state.orgName,
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
    if (sel.orgType !== undefined) state.orgType = sel.orgType || null;
    if (typeof sel.orgName === 'string') state.orgName = sel.orgName;
    var jid = resolveJobId(sel.job);
    if (jid) state.job = jid;
    var tid = resolveTaskId(sel.task);
    if (tid) {
      state.task = tid;
      var tk = E.byId(D.tasks, tid);
      state.job = tk.domainId || tk.jobId;
      state.lastTaskByJob[state.job] = tid;
    }
    state.tplId = null;
    if (sel.tplId && (D.templatesById || {})[sel.tplId]) {
      var d = D.templatesById[sel.tplId];
      if (!d.owner || d.owner === state.task) state.tplId = sel.tplId;
    }
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

    /* 한 번에 한 단계만 보여 준다 — 앞 단계는 접어 두어 좁은 왼쪽 칸에 세로로 쌓이지 않게 한다.
       선택이 바뀌어 현재 단계가 더는 유효하지 않으면 가까운 유효 단계로 되돌린다. */
    if (state.step > 1 && !state.job) state.step = 1;
    if (state.step > 2 && !state.task) state.step = 2;
    if (state.step > 3 && !state.out) state.step = 3;
    syncRail();
    els.wstep1.hidden = state.step !== 1;
    els.wstep2.hidden = state.step !== 2;
    els.wstep3.hidden = state.step !== 3;
    els.wstep4.hidden = state.step !== 4;
    /* 빠른 시작은 첫 단계에서만 보여 준다(2~4단계를 가리지 않게) */
    if (els.quickWrap) els.quickWrap.hidden = state.step !== 1;
    syncStepNav();

    syncJobs();
    syncOrgTypes();

    if (renderedJob !== state.job) {
      buildTasks();
      renderedJob = state.job;
      renderedTask = '__stale__';
    }
    syncTasks();

    if (renderedTask !== state.task) {
      buildOutputs();
      buildTemplates();
      renderedTask = state.task;
    }
    syncOutputs();
    syncTemplates();

    if (renderedOut !== state.out || renderedMore !== state.moreOpen || renderedTpl !== state.tplId) {
      buildAsks();
      renderedOut = state.out;
      renderedMore = state.moreOpen;
      renderedTpl = state.tplId;
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
    state.step = 2;   /* 분야를 골랐으니 바로 02 업무로 넘어간다 */
    render();
    showStep(2);
    els.liveStatus.textContent = job.name + ' 직무가 선택되었습니다.';
  }

  function selectTask(id) {
    if (!E.byId(D.tasks, id)) return;
    if (state.task === id) {
      state.task = null;
      state.tplId = null;
      state.step = 2;
      render();
      return;
    }
    state.task = id;
    state.tplId = null;
    state.lastTaskByJob[state.job] = id;
    state.step = 3;   /* 업무를 골랐으니 바로 03 결과물로 넘어간다 */
    render();
    showStep(3);
  }

  function selectOut(id) {
    if (!E.byId(D.outputs, id)) return;
    if (state.out === id) return;
    if (state.tplId) {
      var d = currentTpl();
      if (!d || d.base !== id) state.tplId = null;
    }
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
    state.tplId = null;
    state.orgType = null;
    state.orgName = '';
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
    if (els.orgName) els.orgName.value = '';
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
      /* 잠긴 단계는 goStep이 토스트로 안내한다 */
      goStep(Number(btn.getAttribute('data-step')));
    });

    if (els.stepPrev) {
      els.stepPrev.addEventListener('click', function () { goStep(state.step - 1); });
    }
    if (els.stepNext) {
      els.stepNext.addEventListener('click', function () { goStep(state.step + 1); });
    }

    if (els.orgTypes) {
      els.orgTypes.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-org-type]');
        if (btn) toggleOrgType(btn.getAttribute('data-org-type'));
      });
    }

    if (els.orgName) {
      els.orgName.addEventListener('input', function () {
        state.orgName = String(els.orgName.value || '').slice(0, 40);
        scheduleRender();
      });
    }

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

    if (els.tplGrid) {
      els.tplGrid.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-tpl]');
        if (btn) selectTemplate(btn.getAttribute('data-tpl'));
      });
    }

    if (els.searchInput) {
      els.searchInput.addEventListener('input', renderSearch);
      els.searchInput.addEventListener('keydown', function (ev) {
        if (!ev || ev.key !== 'Enter') return;
        if (ev.preventDefault) ev.preventDefault();
        var first = els.searchResults ? els.searchResults.querySelector('[data-task-id]') : null;
        if (first) applySearchHit(first);
      });
    }
    if (els.searchClear) {
      els.searchClear.addEventListener('click', function () {
        if (els.searchInput) els.searchInput.value = '';
        renderSearch();
        if (els.searchInput && els.searchInput.focus) els.searchInput.focus();
      });
    }
    if (els.searchResults) {
      els.searchResults.addEventListener('click', function (ev) {
        var btn = ev.target.closest('[data-task-id]');
        if (btn) applySearchHit(btn);
      });
    }

    els.detailAsks.addEventListener('click', function (ev) {
      var chip = ev.target.closest('[data-ask]');
      if (!chip) return;
      toggleAsk(chip.getAttribute('data-ask'), chip.getAttribute('data-val'));
    });

    if (els.frameAsks) {
      els.frameAsks.addEventListener('click', function (ev) {
        var chip = ev.target.closest('[data-ask]');
        if (!chip) return;
        toggleAsk(chip.getAttribute('data-ask'), chip.getAttribute('data-val'));
      });
    }

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

  /* ---------------- 저장값 마이그레이션 (schema 2) ---------------- */

  function migrateSelection(sel) {
    if (!sel) return null;
    var taskId = resolveTaskId(sel.task);
    var jobId = resolveJobId(sel.job);
    if (!taskId && !jobId && !sel.out) return null;
    var out = null;
    if (taskId) {
      var tk = E.byId(D.tasks, taskId);
      jobId = tk.domainId || tk.jobId;
    }
    out = sel.out && E.byId(D.outputs, sel.out) ? sel.out : null;
    var answers = {};
    if (sel.answers) {
      Object.keys(sel.answers).forEach(function (k) { answers[k] = sel.answers[k]; });
    }
    return {
      cat: sel.cat || D.liveCategoryId, job: jobId, task: taskId, out: out,
      tplId: (sel.tplId && (D.templatesById || {})[sel.tplId]) ? sel.tplId : null,
      orgType: sel.orgType || null, orgName: sel.orgName || '',
      answers: answers, memo: sel.memo, guards: sel.guards
    };
  }

  function migrateStore() {
    if (!PW.store || !PW.store.available()) return;
    if (PW.store.schema() >= 2) return;
    var recent = [];
    PW.store.recent().forEach(function (r) {
      var m = migrateSelection(r);
      if (!m || !m.out) return;
      recent.push({
        sig: PW.store.sigOf({ cat: m.cat, job: m.job, task: m.task, out: m.out, answers: m.answers }),
        cat: m.cat, job: m.job, task: m.task, out: m.out, answers: m.answers, ts: r.ts
      });
    });
    PW.store.replaceRecent(recent);
    var favs = [];
    PW.store.favorites().forEach(function (f) {
      var m = f.sel ? migrateSelection(f.sel) : null;
      if (m) f.sel = { cat: m.cat, job: m.job, task: m.task, out: m.out, tplId: m.tplId, answers: m.answers };
      favs.push(f);
    });
    PW.store.replaceFavorites(favs);
    PW.store.setSchema(2);
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
    /* 마크업 hidden과 같은 초기 상태를 코드로도 명시한다 */
    if (els.searchResults) els.searchResults.hidden = true;
    if (els.searchClear) els.searchClear.hidden = true;
    buildRail();
    buildJobs();
    buildOrgTypes();
    buildGuards();
    buildTasks();
    buildOutputs();
    buildTemplates();
    buildAsks();
    buildQuickStart();
    applyMemoField();
    autoGrow();
    wire();

    if (PW.search && PW.search.build) {
      try { PW.search.build(); } catch (e) { /* 인덱스 실패해도 위자드는 동작 */ }
    }

    /* 저장값 schema 2 — 구버전 선택값을 새 업무 id로 치환 */
    migrateStore();

    /* URL 프리셋은 첫 렌더 전에 적용한다 — 기본 상태를 한 번 쓴 뒤 다시 쓰는 이중 타이핑을 막는다 */
    applyUrlPreset();
    render();
    if (PW.ads && PW.ads.boot) PW.ads.boot();
    renderShelf();
  }

  PW.app = {
    state: state,
    render: render,
    goStep: goStep,
    computeStats: computeStats,
    stateSig: stateSig,
    parsePreset: parsePreset,
    applyPreset: applyPreset,
    applyQuick: applyQuick,
    applyTemplate: applyTemplate,
    selectTemplate: selectTemplate,
    applySearchHit: applySearchHit,
    renderSearch: renderSearch,
    migrateStore: migrateStore,
    resolveTaskId: resolveTaskId,
    resolveJobId: resolveJobId,
    migrateStore: migrateStore,
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
        cat: state.cat, job: state.job, task: state.task, out: state.out, tplId: state.tplId,
        orgType: state.orgType, orgName: state.orgName,
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
