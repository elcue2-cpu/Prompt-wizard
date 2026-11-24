/* =========================================================
   Prompt Wizard — 실시간 타이핑 에디터
   v3의 스트리밍·커서·직접수정·복사·챗GPT·모바일 시트를 그대로 이관했다.
   화면 상태(선택값)는 모르고, app이 넘겨주는 hooks로만 판단한다.
   ========================================================= */
window.PW = window.PW || {};

(function (PW) {
  'use strict';

  /* 타이핑 리듬 (v4.2) — 15ms/32프레임은 너무 즉시 바뀌어 보였다.
     한 번의 변경이 약 1.5초에 걸쳐 천천히 흘러가도록 간격을 늘리고 프레임을 나눈다.
     최대 프레임은 FRAMES(55×28ms≈1.54초)이고, 짧은 문단은 글자 수만큼만 진행된다. */
  var TICK = 28;
  var FRAMES = 55;
  var MAX_CHUNK = 24;

  var hooks = {
    hasSubject: function () { return false; },
    sig: function () { return ''; },
    memoEmpty: function () { return true; },
    hintReady: function () { return true; },
    tips: function () { return []; },
    tipsSub: function () { return ''; },
    instantKey: 'context',
    render: function () {},
    onTextInput: function () {}
  };

  var els = {};
  var ready = false;

  var segs = [];
  var segText = {};
  var shown = {};
  var fromIdx = {};
  var segNodes = {};
  var typingKeys = [];
  var streamTimer = null;
  var streamActive = false;
  var streamChunk = 1;
  var activeKey = null;
  var caretEl = null;
  var editing = false;
  var editSig = '';
  var desktopTipsOpen = false;
  var toastTimer = null;

  function $(id) { return document.getElementById(id); }

  function init(options) {
    if (options) for (var k in options) hooks[k] = options[k];

    els = {
      emptyState: $('emptyState'),
      promptBody: $('promptBody'),
      promptDoc: $('promptDoc'),
      pwEditor: $('promptEditor'),
      pwTextarea: $('pwTextarea'),
      pwBar: $('pwBar'),
      pwDot: $('pwDot'),
      pwStatus: $('pwStatus'),
      pwMeta: $('pwMeta'),
      pwEdit: $('pwEdit'),
      pwHint: $('pwHint'),
      pwFoot: $('pwFoot'),
      pwRebuild: $('pwRebuild'),
      pctNum: $('pctNum'),
      pctLabel: $('pctLabel'),
      gaugeFill: $('gaugeFill'),
      copyBtn: $('copyBtn'),
      gptBtn: $('gptBtn'),
      tipsBtn: $('tipsBtn'),
      tipsPanel: $('tipsPanel'),
      previewCol: $('previewCol'),
      toast: $('toast'),
      liveStatus: $('liveStatus')
    };

    wire();
    ready = true;
    syncTopbarHeight();
    paintStatus();
    syncPrompt();
  }

  /* =======================================================
     타이핑 스트리밍
     ======================================================= */
  function commonPrefix(a, b) {
    var n = Math.min(a.length, b.length);
    var i = 0;
    while (i < n && a.charAt(i) === b.charAt(i)) i++;
    return i;
  }

  function ensureCaret() {
    if (caretEl) return caretEl;
    caretEl = document.createElement('span');
    caretEl.className = 'pw-caret';
    caretEl.setAttribute('aria-hidden', 'true');
    return caretEl;
  }

  function lastTyping() {
    var found = null;
    for (var i = 0; i < typingKeys.length; i++) {
      var k = typingKeys[i];
      if ((shown[k] || 0) < (segText[k] || '').length) found = k;
    }
    return found;
  }

  function placeCaret() {
    if (!caretEl || !segs.length) return;
    var key = activeKey;
    if (!key || !segNodes[key]) key = segs[segs.length - 1].key;
    var node = segNodes[key];
    if (node) node.appendChild(caretEl);
  }

  function paintSeg(k) {
    var node = segNodes[k];
    if (!node) return;
    var t = segText[k] || '';
    var n = shown[k];
    if (n === undefined) n = 0;
    var from = fromIdx[k];
    if (from === undefined || from > n) from = n;

    var head = t.slice(0, n);
    node.innerHTML = '';
    var plain = head.slice(0, from);
    var mark = head.slice(from);
    if (plain) node.appendChild(document.createTextNode(plain));
    if (mark) {
      var m = document.createElement('mark');
      m.className = 'pw-mark';
      m.textContent = mark;
      node.appendChild(m);
    }
  }

  function paintAll() {
    segs.forEach(function (s) { paintSeg(s.key); });
    placeCaret();
  }

  function startStream(maxLen) {
    stopStream();
    streamActive = true;
    streamChunk = Math.max(1, Math.ceil(maxLen / FRAMES));
    if (streamChunk > MAX_CHUNK) streamChunk = MAX_CHUNK;
    activeKey = lastTyping();
    if (ensureCaret()) caretEl.classList.add('is-writing');
    paintStatus();
    streamTick();
  }

  function streamTick() {
    streamTimer = null;
    var done = true;
    for (var i = 0; i < typingKeys.length; i++) {
      var k = typingKeys[i];
      var t = segText[k] || '';
      if ((shown[k] || 0) < t.length) {
        shown[k] = Math.min(t.length, (shown[k] || 0) + streamChunk);
        paintSeg(k);
      }
      if ((shown[k] || 0) < t.length) done = false;
    }
    activeKey = lastTyping();
    if (done) {
      typingKeys = [];
      streamActive = false;
      activeKey = null;
      if (caretEl) caretEl.classList.remove('is-writing');
      placeCaret();
      paintStatus();
      syncPrompt();
      fadeMarks();
      announce();
    } else {
      placeCaret();
      paintStatus();
      streamTimer = window.setTimeout(streamTick, TICK);
    }
  }

  function finishStream() {
    if (streamTimer) { window.clearTimeout(streamTimer); streamTimer = null; }
    for (var i = 0; i < typingKeys.length; i++) {
      shown[typingKeys[i]] = (segText[typingKeys[i]] || '').length;
    }
    typingKeys = [];
    streamActive = false;
    activeKey = null;
    if (caretEl) caretEl.classList.remove('is-writing');
    paintAll();
    paintStatus();
    fadeMarks();
    syncPrompt();
    announce();
  }

  function stopStream() {
    if (streamTimer) { window.clearTimeout(streamTimer); streamTimer = null; }
    streamActive = false;
  }

  function fadeMarks() {
    window.setTimeout(function () {
      if (streamActive || !els.pwEditor) return;
      var marks = els.pwEditor.querySelectorAll('.pw-mark');
      for (var i = 0; i < marks.length; i++) marks[i].classList.add('is-faded');
    }, 1100);
  }

  function announce() {
    if (!els.liveStatus) return;
    els.liveStatus.textContent = '프롬프트가 갱신되었습니다. ' + segs.length + '문단 ' + displayedLength() + '자.';
  }

  function displayedLength() {
    if (editing) return (els.pwTextarea.value || '').length;
    var n = 0;
    segs.forEach(function (s) { n += (shown[s.key] || 0); });
    return n;
  }

  function syncEditor() {
    var changed = [];
    var keep = {};
    segs.forEach(function (s) { keep[s.key] = 1; });

    Object.keys(segNodes).forEach(function (k) {
      if (keep[k]) return;
      var node = segNodes[k];
      if (node.parentNode) node.parentNode.removeChild(node);
      delete segNodes[k];
      delete segText[k];
      delete shown[k];
      delete fromIdx[k];
    });

    var maxLen = 0;
    typingKeys = [];

    segs.forEach(function (s, i) {
      var node = segNodes[s.key];
      if (!node) {
        node = document.createElement('p');
        node.className = 'pw-seg';
        node.setAttribute('data-seg', s.key);
        segNodes[s.key] = node;
        segText[s.key] = null;
      }
      var at = els.pwEditor.children[i] || null;
      if (at !== node) els.pwEditor.insertBefore(node, at);

      var target = s.text || '';
      var old = segText[s.key];

      if (old === null || old === undefined) {
        shown[s.key] = 0;
        fromIdx[s.key] = 0;
        changed.push(s.key);
      } else if (old !== target) {
        var cp = commonPrefix(old, target);
        fromIdx[s.key] = cp;
        shown[s.key] = cp;
        changed.push(s.key);
      } else {
        // 같은 내용이면 새로 쓰지 않는다. 아직 타이핑 중이던 문단은
        // 진행 중인 글자 수와 하이라이트 시작점을 그대로 두어 애니메이션이 끊기지 않게 하고,
        // 이미 다 쓴 문단은 하이라이트를 남기지 않는다.
        if (shown[s.key] === undefined) {
          shown[s.key] = target.length;
          fromIdx[s.key] = target.length;
        } else if (shown[s.key] >= target.length) {
          fromIdx[s.key] = target.length;
        }
      }

      segText[s.key] = target;

      if (hooks.instantKey && s.key === hooks.instantKey) {
        shown[s.key] = target.length;
        fromIdx[s.key] = target.length;
      }
      if (shown[s.key] === undefined) shown[s.key] = 0;
      if (shown[s.key] < target.length) {
        typingKeys.push(s.key);
        if (target.length - shown[s.key] > maxLen) maxLen = target.length - shown[s.key];
      }
      paintSeg(s.key);
    });

    if (typingKeys.length) {
      startStream(maxLen);
    } else {
      streamActive = false;
      activeKey = null;
      if (caretEl) caretEl.classList.remove('is-writing');
      placeCaret();
      paintStatus();
      syncPrompt();
    }
    return changed;
  }

  function clearEditor() {
    stopStream();
    segs = [];
    segText = {};
    shown = {};
    fromIdx = {};
    segNodes = {};
    typingKeys = [];
    activeKey = null;
    if (caretEl && caretEl.parentNode) caretEl.parentNode.removeChild(caretEl);
    if (els.pwEditor) els.pwEditor.innerHTML = '';
  }

  function paintStatus() {
    if (!els.pwStatus) return;
    els.pwStatus.classList.remove('is-typing');
    els.pwStatus.classList.remove('is-done');
    if (els.pwDot) els.pwDot.classList.remove('is-typing');

    var label;
    if (!hooks.hasSubject()) {
      label = '대기';
    } else if (editing) {
      label = '직접 수정 중';
    } else if (streamActive) {
      label = '실시간 프롬프트 생성 중…';
      els.pwStatus.classList.add('is-typing');
      if (els.pwDot) els.pwDot.classList.add('is-typing');
    } else {
      label = '작성 완료';
      els.pwStatus.classList.add('is-done');
    }
    els.pwStatus.textContent = label;
    if (els.pwMeta) els.pwMeta.textContent = hooks.hasSubject() ? (segs.length + '문단 · ' + displayedLength() + '자') : '';
  }

  function promptText() {
    if (editing) return (els.pwTextarea && els.pwTextarea.value) || '';
    var out = [];
    segs.forEach(function (s) { out.push(s.text); });
    return out.join('\n\n');
  }

  function syncPrompt() {
    var text = promptText();
    var on = hooks.hasSubject();
    if (els.copyBtn) els.copyBtn.disabled = !on;
    if (els.gptBtn) {
      els.gptBtn.setAttribute('href', on ? 'https://chatgpt.com/?q=' + encodeURIComponent(text) : '#');
      els.gptBtn.classList.toggle('is-off', !on);
    }
  }

  function syncHint() {
    if (!els.pwHint) return;
    /* 메모 안내는 결과물까지 고른 뒤(STEP 03 이후)에만 띄운다 —
       1단계에서 역할 문단만 써질 때 "STEP 04의 메모를…"이 먼저 나오지 않게. */
    els.pwHint.hidden = !(hooks.hasSubject() && !editing && hooks.hintReady() && hooks.memoEmpty());
  }

  /* =======================================================
     바깥에서 부르는 API
     ======================================================= */

  function setSegments(list) {
    if (!ready) return [];
    segs = (list || []).slice();
    if (editing) {
      if (els.pwFoot) els.pwFoot.hidden = (hooks.sig() === editSig);
      paintStatus();
      syncPrompt();
      return [];
    }
    var changed = syncEditor();
    syncHint();
    return changed;
  }

  function setEmpty(empty) {
    if (!ready) return;
    if (empty) {
      els.emptyState.hidden = false;
      els.promptDoc.hidden = true;
      els.pwTextarea.hidden = true;
      els.pwEditor.hidden = false;
      els.pwFoot.hidden = true;
      clearEditor();
    } else {
      els.emptyState.hidden = true;
      els.promptDoc.hidden = false;
    }
    paintStatus();
    syncPrompt();
    syncHint();
  }

  function setProgress(pct, label, bump) {
    if (!ready) return;
    if (els.pctNum) els.pctNum.textContent = String(pct);
    if (els.gaugeFill) els.gaugeFill.style.width = pct + '%';
    if (els.pctLabel) {
      els.pctLabel.textContent = label;
      els.pctLabel.classList.toggle('is-done', pct >= 100);
    }
  }

  function setEditing(on, customText) {
    if (on && !hooks.hasSubject()) {
      toast('먼저 분야나 결과물을 골라 주세요.');
      return;
    }
    if (on && streamActive) finishStream();

    var base = (typeof customText === 'string') ? customText : promptText();
    editing = !!on;
    els.pwEditor.hidden = editing;
    els.pwTextarea.hidden = !editing;
    els.pwEdit.setAttribute('aria-pressed', editing ? 'true' : 'false');
    els.pwEdit.textContent = editing ? '↺ 자동 생성' : '✎ 직접 수정';

    if (editing) {
      els.pwTextarea.value = base;
      editSig = hooks.sig();
      els.pwFoot.hidden = true;
      els.pwHint.hidden = true;
      els.pwTextarea.focus();
    } else {
      els.pwFoot.hidden = true;
    }
    paintStatus();
    syncPrompt();
    syncHint();
  }

  function isEditing() { return editing; }

  function text() { return promptText(); }

  function settle() {
    if (streamActive) finishStream();
    return promptText();
  }

  function renderTips() {
    if (!els.tipsPanel) return;
    els.tipsPanel.innerHTML = '';
    var tips = hooks.tips() || [];

    var h3 = document.createElement('h3');
    h3.textContent = 'AI가 첫 답을 준 뒤, 이어서 한 줄만 붙여 보세요';
    els.tipsPanel.appendChild(h3);

    var sub = document.createElement('p');
    sub.className = 'tips-sub';
    sub.textContent = hooks.tipsSub() || '그대로 복사해 답변 아래에 이어 붙이면 됩니다.';
    els.tipsPanel.appendChild(sub);

    tips.forEach(function (t, i) {
      var row = document.createElement('div');
      row.className = 'tip';
      var span = document.createElement('span');
      span.textContent = t;
      row.appendChild(span);
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = '복사';
      btn.setAttribute('data-tip', String(i));
      row.appendChild(btn);
      els.tipsPanel.appendChild(row);
    });

    els.tipsPanel.classList.toggle('is-open', desktopTipsOpen);
  }

  /* =======================================================
     토스트 / 복사
     ======================================================= */

  function toast(msg) {
    if (!els.toast) return;
    els.toast.textContent = msg;
    els.toast.classList.add('is-on');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      els.toast.classList.remove('is-on');
    }, 2400);
  }

  function copyText(textValue) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(textValue).then(
        function () { return true; },
        function () { return legacyCopy(textValue); }
      );
    }
    return Promise.resolve(legacyCopy(textValue));
  }

  function legacyCopy(textValue) {
    try {
      var ta = document.createElement('textarea');
      ta.value = textValue;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      ta.style.left = '0';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, textValue.length);
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (e) {
      return false;
    }
  }

  /* =======================================================
     모바일 — 위자드 아래 프롬프트가 그대로 이어지는 배치(v4.3)
     ======================================================= */

  function isMobileView() {
    return !!(window.matchMedia && window.matchMedia('(max-width: 1024px)').matches);
  }

  function syncTopbarHeight() {
    if (!document.querySelector || !document.documentElement) return;
    var tb = document.querySelector('.topbar');
    if (!tb) return;
    var hh = tb.offsetHeight || 56;
    document.documentElement.style.setProperty('--topbar-h', hh + 'px');
  }

  /* 모바일에서는 프롬프트 창이 화면 아래에 따로 놓이므로,
     타이핑 중인 문단이 창 밖으로 밀리지 않게 창 안에서만 부드럽게 따라간다. */
  function focusTypingSeg(key) {
    if (!key || !isMobileView()) return;
    var target = els.pwEditor.querySelector('[data-seg="' + key + '"]');
    if (!target || !els.promptBody) return;
    var top;
    if (els.promptBody.getBoundingClientRect && target.getBoundingClientRect) {
      var bodyRect = els.promptBody.getBoundingClientRect();
      var tRect = target.getBoundingClientRect();
      top = els.promptBody.scrollTop + (tRect.top - bodyRect.top) - 6;
    } else {
      top = (typeof target.offsetTop === 'number' ? target.offsetTop : 0) - 6;
    }
    if (top < 0) top = 0;
    if (els.promptBody.scrollTo) els.promptBody.scrollTo({ top: top, behavior: 'smooth' });
    else els.promptBody.scrollTop = top;
  }

  /* =======================================================
     배선
     ======================================================= */

  function wire() {
    els.pwEdit.addEventListener('click', function () {
      if (editing) {
        setEditing(false);
        hooks.render();
        toast('자동 생성본으로 돌아왔어요.');
      } else {
        setEditing(true);
      }
    });

    els.pwTextarea.addEventListener('input', function () {
      syncPrompt();
      paintStatus();
      hooks.onTextInput();
    });

    els.pwRebuild.addEventListener('click', function () {
      setEditing(false);
      hooks.render();
      toast('선택한 내용으로 다시 썼어요.');
    });

    els.copyBtn.addEventListener('click', function () {
      var value = settle();
      if (!value) {
        toast('먼저 분야나 결과물을 골라 주세요.');
        return;
      }
      copyText(value).then(function (ok) {
        if (ok) {
          els.copyBtn.textContent = '✅ 복사 완료';
          els.copyBtn.dataset.mode = 'done';
          toast('프롬프트를 복사했어요. 챗GPT에 붙여 넣어 보세요.');
          window.setTimeout(function () {
            if (els.copyBtn.dataset.mode === 'done') {
              els.copyBtn.textContent = '📋 1클릭 복사';
              els.copyBtn.dataset.mode = 'copy';
            }
          }, 1800);
        } else {
          toast('복사가 막힌 환경이에요. 프롬프트를 직접 선택해 주세요.');
        }
      });
    });

    els.gptBtn.addEventListener('click', function (ev) {
      var value = settle();
      if (!value) {
        ev.preventDefault();
        toast('먼저 분야나 결과물을 골라 주세요.');
        return;
      }
      if (('https://chatgpt.com/?q=' + encodeURIComponent(value)).length > 1900) {
        ev.preventDefault();
        copyText(value).then(function (ok) {
          toast(ok
            ? '프롬프트가 길어 복사해 뒀어요. 열리는 챗GPT에 붙여 넣어 주세요.'
            : '프롬프트가 길어요. 본문을 직접 복사해 주세요.');
          window.open('https://chatgpt.com/', '_blank', 'noopener');
        });
      }
    });

    els.tipsBtn.addEventListener('click', function () {
      desktopTipsOpen = !desktopTipsOpen;
      els.tipsPanel.classList.toggle('is-open', desktopTipsOpen);
      if (desktopTipsOpen) els.tipsPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    els.tipsPanel.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-tip]');
      if (!btn) return;
      var tips = hooks.tips() || [];
      var idx = Number(btn.getAttribute('data-tip'));
      var value = tips[idx];
      if (!value) return;
      copyText(value).then(function (ok) {
        toast(ok ? '후속 요청 문장을 복사했어요.' : '복사가 막혔어요. 문장을 직접 선택해 주세요.');
      });
    });

    window.addEventListener('resize', syncTopbarHeight);
  }

  PW.editor = {
    init: init,
    setSegments: setSegments,
    setEmpty: setEmpty,
    setProgress: setProgress,
    setEditing: setEditing,
    isEditing: isEditing,
    text: text,
    settle: settle,
    renderTips: renderTips,
    focusTypingSeg: focusTypingSeg,
    copyText: copyText,
    toast: toast,
    syncTopbarHeight: syncTopbarHeight,
    paintStatus: paintStatus,
    /* 검증용 — 타이핑 리듬 상수(화면에는 영향 없음) */
    timing: function () { return { tick: TICK, frames: FRAMES, maxChunk: MAX_CHUNK }; }
  };
})(window.PW);
