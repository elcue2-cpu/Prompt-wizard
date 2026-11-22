/* =========================================================
   Prompt Wizard — 화면(위자드)과 부팅
   선택 상태를 들고, 엔진이 만든 문단을 에디터에 넘긴다.
   ========================================================= */
window.PW = window.PW || {};

(function (PW) {
  'use strict';

  var D = PW.data;
  var E = PW.engine;

  var state = {
    purpose: null,
    answers: {},
    memo: '',
    guards: {}
  };
  D.guards.forEach(function (g) { if (g.on) state.guards[g.id] = true; });

  var renderedPurpose = null;
  var questionsDirty = false;
  var rafPending = false;
  var prevPct = -1;

  function $(id) { return document.getElementById(id); }
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }

  var els = {
    purposeGrid: $('purposeGrid'),
    questions: $('questions'),
    step2Sub: $('step2Sub'),
    memo: $('memo'),
    memoLabel: $('memoLabel'),
    memoCount: $('memoCount'),
    memoHint: $('memoHint'),
    exampleBtn: $('exampleBtn'),
    guardrailList: $('guardrailList'),
    resetBtn: $('resetBtn'),
    liveStatus: $('liveStatus')
  };

  /* ---------------- 그리기 ---------------- */

  function buildPurposes() {
    els.purposeGrid.innerHTML = '';
    D.order.forEach(function (key) {
      var p = D.outputs[key];
      var btn = h('button', 'purpose');
      btn.type = 'button';
      btn.setAttribute('data-purpose', key);
      btn.setAttribute('aria-pressed', 'false');

      var icon = h('span', 'purpose-icon', p.icon);
      icon.setAttribute('aria-hidden', 'true');

      var txt = h('span', 'purpose-text');
      txt.appendChild(h('span', 'purpose-title', p.title));
      txt.appendChild(h('span', 'purpose-desc', p.desc));

      btn.appendChild(icon);
      btn.appendChild(txt);
      btn.appendChild(h('span', 'purpose-check', '✓'));
      els.purposeGrid.appendChild(btn);
    });
  }

  function syncPurposes() {
    var nodes = els.purposeGrid.querySelectorAll('[data-purpose]');
    Array.prototype.forEach.call(nodes, function (n) {
      var on = n.getAttribute('data-purpose') === state.purpose;
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

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

  function buildQuestions() {
    els.questions.innerHTML = '';
    var p = state.purpose ? D.outputs[state.purpose] : null;

    if (!p) {
      var box = h('div', 'q-empty');
      box.appendChild(h('span', 'q-empty-ic', '👈'));
      box.appendChild(h('span', null, '왼쪽에서 용도를 고르면, 그 용도에만 맞는 질문이 여기에 나타납니다.'));
      els.questions.appendChild(box);
      applyMemoField(null);
      return;
    }

    p.questions.forEach(function (q) {
      var wrap = h('div', 'q');
      var lab = h('div', 'q-label');
      lab.appendChild(h('span', 'q-label-tx', q.label));
      if (q.hint) lab.appendChild(h('span', 'q-hint', q.hint));
      wrap.appendChild(lab);

      var chips = h('div', 'chips');
      q.chips.forEach(function (c) {
        var b = h('button', 'chip');
        b.type = 'button';
        b.setAttribute('data-q', q.key);
        b.setAttribute('data-val', c);
        b.setAttribute('aria-pressed', 'false');
        b.appendChild(h('span', 'chip-tick', '✓'));
        b.appendChild(h('span', null, c));
        chips.appendChild(b);
      });
      wrap.appendChild(chips);

      if (q.key === 'job') {
        var jobSel = (state.answers.job && D.jobs[state.answers.job]) ? D.jobs[state.answers.job] : null;
        var sub = h('div', 'subchips' + (jobSel ? '' : ' is-empty'));
        if (jobSel) {
          sub.appendChild(h('span', 'subchips-label', '세부 업무 (하나 선택)'));
          jobSel.tasks.forEach(function (t) {
            var tb = h('button', 'chip chip-sub');
            tb.type = 'button';
            tb.setAttribute('data-task', t);
            tb.setAttribute('aria-pressed', 'false');
            tb.appendChild(h('span', 'chip-tick', '✓'));
            tb.appendChild(h('span', null, t));
            sub.appendChild(tb);
          });
        } else {
          sub.appendChild(h('span', 'subchips-label', '직무를 먼저 고르면 세부 업무 선택지가 나타납니다.'));
        }
        wrap.appendChild(sub);
      }

      els.questions.appendChild(wrap);
    });

    applyMemoField(p);
  }

  function applyMemoField(p) {
    if (p) {
      els.memo.setAttribute('placeholder', p.placeholder);
      els.memoLabel.textContent = '핵심 상황·메모';
      els.exampleBtn.hidden = false;
      els.memoHint.textContent = '구체적인 숫자·기한·이름이 들어갈수록 결과가 좋아집니다.';
    } else {
      els.memo.setAttribute('placeholder', '용도를 고르면 여기에 어떤 내용을 적으면 되는지 예시로 알려드립니다.');
      els.memoLabel.textContent = '핵심 상황·메모';
      els.exampleBtn.hidden = true;
      els.memoHint.textContent = '먼저 용도를 골라 주세요.';
    }
  }

  function syncChips() {
    var nodes = els.questions.querySelectorAll('[data-q]');
    Array.prototype.forEach.call(nodes, function (n) {
      var on = state.answers[n.getAttribute('data-q')] === n.getAttribute('data-val');
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var subs = els.questions.querySelectorAll('[data-task]');
    Array.prototype.forEach.call(subs, function (n) {
      var on = state.answers.task === n.getAttribute('data-task');
      n.classList.toggle('is-on', on);
      n.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ---------------- 상태 / 진행률 ---------------- */

  function stateSig() {
    return state.purpose + '|' + JSON.stringify(state.answers) + '|' + state.memo + '|' + JSON.stringify(state.guards);
  }

  function computeStats() {
    if (!state.purpose) return { pct: 0, label: '시작 전' };

    var s = 25;
    var qs = D.outputs[state.purpose].questions;
    var rest = qs.length - 1;
    var qScore = 0;
    qs.forEach(function (q, i) {
      if (!state.answers[q.key]) return;
      qScore += (i === 0) ? 15 : (rest > 0 ? 30 / rest : 0);
    });
    s += Math.round(qScore);

    if (state.memo.trim().length > 0) s += 15;

    var g = 0;
    D.guards.forEach(function (x) { if (state.guards[x.id]) g++; });
    s += Math.min(g, 3) * 5;

    if (s > 100) s = 100;

    var label = s >= 100 ? '완성 · 복사하기'
      : s >= 85 ? '마지막 한 칸'
      : s >= 55 ? '거의 다 됐어요'
      : '조립 중';

    return { pct: s, label: label };
  }

  function currentTips() {
    var p = state.purpose ? D.outputs[state.purpose] : null;
    return p ? p.tips : D.genericTips;
  }

  /* ---------------- 렌더 ---------------- */

  function render() {
    var p = state.purpose ? D.outputs[state.purpose] : null;

    els.step2Sub.textContent = p ? p.lead : '용도를 먼저 골라 주세요.';

    if (renderedPurpose !== state.purpose || questionsDirty) {
      var keepsMemo = els.memo.value;
      buildQuestions();
      renderedPurpose = state.purpose;
      questionsDirty = false;
      els.memo.value = keepsMemo;
    }

    syncPurposes();
    syncGuards();
    syncChips();

    var changed = [];
    PW.editor.setEmpty(!p);

    if (p) {
      changed = PW.editor.setSegments(E.build(state));
    }

    PW.editor.renderTips();

    var stats = computeStats();
    var bump = stats.pct !== prevPct;
    prevPct = stats.pct;
    PW.editor.setProgress(stats.pct, stats.label, bump);

    if (changed.length && p) PW.editor.focusTypingSeg(changed[0]);
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

  function autoGrow() {
    var t = els.memo;
    t.style.height = 'auto';
    var next = Math.min(Math.max(t.scrollHeight, 104), 280);
    t.style.height = next + 'px';
  }

  function wire() {
    els.purposeGrid.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-purpose]');
      if (!btn) return;
      var key = btn.getAttribute('data-purpose');
      if (state.purpose === key) return;

      state.purpose = key;
      state.answers = {};
      if (PW.editor.isEditing()) PW.editor.setEditing(false);
      render();
      els.liveStatus.textContent = D.outputs[key].title + ' 용도가 선택되었습니다.';

      if (window.matchMedia('(max-width: 1024px)').matches) {
        var q = els.questions;
        if (q && q.scrollIntoView) q.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    els.questions.addEventListener('click', function (ev) {
      var tchip = ev.target.closest('[data-task]');
      if (tchip) {
        var tv = tchip.getAttribute('data-task');
        if (state.answers.task === tv) delete state.answers.task;
        else state.answers.task = tv;
        render();
        return;
      }

      var chip = ev.target.closest('[data-q]');
      if (!chip) return;
      var key = chip.getAttribute('data-q');
      var val = chip.getAttribute('data-val');
      if (state.answers[key] === val) delete state.answers[key];
      else state.answers[key] = val;

      if (key === 'job') {
        var jsel = state.answers.job ? D.jobs[state.answers.job] : null;
        if (state.answers.task && (!jsel || jsel.tasks.indexOf(state.answers.task) < 0)) delete state.answers.task;
        questionsDirty = true;
      }
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
      var p = state.purpose ? D.outputs[state.purpose] : null;
      if (!p) {
        PW.editor.toast('먼저 용도를 골라 주세요.');
        return;
      }
      els.memo.value = p.example;
      state.memo = p.example;
      els.memoCount.textContent = p.example.length + '자';
      autoGrow();
      render();
      els.memo.focus();
      PW.editor.toast('예시를 채웠어요. 내용만 바꿔 보세요.');
    });

    els.resetBtn.addEventListener('click', function () {
      state.purpose = null;
      state.answers = {};
      state.memo = '';
      state.guards = {};
      D.guards.forEach(function (g) { if (g.on) state.guards[g.id] = true; });

      els.memo.value = '';
      els.memoCount.textContent = '0자';
      autoGrow();

      if (PW.editor.isEditing()) PW.editor.setEditing(false);
      renderedPurpose = '__none__';
      render();
      PW.editor.toast('처음 상태로 돌아갔어요.');
    });
  }

  /* ---------------- 시작 ---------------- */

  function boot() {
    PW.editor.init({
      hasSubject: function () { return !!state.purpose; },
      sig: stateSig,
      memoEmpty: function () { return E.memoLines(state).length === 0; },
      tips: currentTips,
      tipsSub: function () {
        return state.purpose ? '그대로 복사해 답변 아래에 이어 붙이면 됩니다.' : '용도를 고르면 그 용도에 맞는 팁으로 바뀝니다.';
      },
      instantKey: 'context',
      render: render
    });

    buildPurposes();
    buildGuards();
    buildQuestions();
    applyMemoField(null);
    autoGrow();
    wire();
    render();
  }

  PW.app = { state: state, render: render, computeStats: computeStats, stateSig: stateSig };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window.PW);
