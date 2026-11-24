/* =========================================================
   Prompt Wizard — 공통 프롬프트 조립 엔진 (v4.4)
   입력: state {cat, job, task, out, tplId, answers, memo, guards, orgType, orgName, keyword}
   출력: [{key, text}] 문단 배열 — 역할·맥락·요청·프레임·상황·형식·문체·규칙·조건·관점·분량·원칙·검증
   v4.3: 결과물(out)을 고르기 전에도 분야·업무·소속만으로 역할·맥락·프레임을 조립한다(첫 카드부터 실시간).
   v4.4: 핵심 키워드(keyword)를 받아 「topic」 문단으로 맥락 바로 뒤에 끼워 넣는다.
         키워드가 비어 있으면 문단 자체가 생기지 않아 v4.3 출력과 완전히 같다.
   엔진은 특정 도메인을 모른다. 문장 뼈대는 data/outputs-*.js의 template이 갖고,
   분야 전문성은 data/frames-office.js의 frame이, 문서별 특화는 templates-office.js의 정의가 맡는다.
   v3 문단(역할·맥락·요청·상황·형식·문체·규칙·관점·분량·원칙·검증)은 문장 그대로 보존한다.
   ========================================================= */
window.PW = window.PW || {};

(function (PW) {
  'use strict';

  var D = PW.data;

  /* ---------- 공문 서식 상수 (한 곳에서만 정의해 결과물끼리 공유) ---------- */
  var OFF_HEAD = '공문 갑지 서식으로 작성해 주세요. 제목 → 「1. 관련: [근거 공문·계획]」 → 「2. 위 호와 관련하여 ~ 협조 요청드립니다」 → ';
  var OFF_BODY = '「가. ~ / 나. ~」 세부사항 → 「붙임  1. ~ 1부.」 순서로 두고, 문서 마지막은 「끝.」으로 닫아 주세요. 문장은 「~바랍니다」·「~요청드립니다」로 끝맺고, 요청 사항에는 기한·제출 형식·담당 연락처를 한 줄로 특정해 주세요.';

  /* ---------- 결과물을 고르기 전의 기본 뼈대 (v4.3) ----------
     STEP 01에서 분야나 소속을 고르면 역할·맥락 문단부터 바로 써 내려가고,
     결과물을 고르면 그 결과물 template의 전문가·원칙·요청·형식으로 다듬어진다. */
  var NEUTRAL = {
    org: '공공기관의',
    expert: '실무 문서 전문가',
    backdrop: '대한민국 공공기관·공기업에서 15년 넘게 기안·결재·보고를 다뤄 온 실무 문서 전문가',
    principle: '결론과 근거 숫자를 앞세워, 읽는 사람이 바로 판단할 수 있는 문서로 정리합니다.'
  };

  /* 결과물을 고르기 전에 만드는 문단 — 분야(1단계) → 업무·프레임(2단계) */
  var PARTIAL_ORDER = ['role', 'context', 'topic', 'frame'];

  var BLOCKS = {
    official: OFF_HEAD + OFF_BODY,
    collabCover: OFF_HEAD + OFF_BODY,
    collabBody: '공문 본문 서식으로 작성해 주세요. 제목 → 「2. 위 호와 관련하여 ~ 협조 요청드립니다」 → ' + OFF_BODY,
    collabEmail: '이메일 공문 서식으로 작성해 주세요. 제목(공문 제목) → 본문(「1. 관련」 → 요청 사항 → 「붙임」) → 발신 부서·담당·연락처 순서로 두고, 문장은 「~바랍니다」로 끝맺어 주세요.',
    brief: '개조식 보고서로 작성해 주세요. □ 대제목 → ㅇ 중항목 → - 세부내용 순으로 내려가고, 문장은 「~함 / ~임 / ~예정 / ~필요」로 끝맺어 주세요. 본문은 추진배경(관련 규정·상위계획) → 현황 및 문제점 → 검토내용(대안 비교) → 추진계획(소요예산·일정·전결권 확인) → 행정사항 순서로 잡아 주세요.',
    plain: '본문은 결론 → 근거 → 추진계획(소요예산·일정·전결권) → 행정사항 순서로 잡고, 한 문단은 3줄을 넘기지 않게 해 주세요.'
  };

  /* ---------- 한국어 조사 ---------- */
  var TRIM_CHARS = ' \t)]}.,';
  function trimEnd(s) {
    var t = String(s || '');
    while (t.length && TRIM_CHARS.indexOf(t.charAt(t.length - 1)) >= 0) t = t.slice(0, t.length - 1);
    return t;
  }
  function josa(word, withBatchim, withoutBatchim) {
    var s = trimEnd(word);
    if (!s) return withBatchim;
    var code = s.charCodeAt(s.length - 1);
    if (code < 0xAC00 || code > 0xD7A3) return withoutBatchim;
    return (((code - 0xAC00) % 28) === 0) ? withoutBatchim : withBatchim;
  }
  function objList(arr) {
    var s = (arr || []).join(', ');
    return s + josa(s, '을', '를');
  }

  function memoLines(st) {
    return String((st && st.memo) || '').split('\n').map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
  }

  /* ---------- 핵심 키워드 (v4.4) ----------
     사용자가 카드 5에서 적은 한 줄. 쉼표로 여러 개를 적어도 그대로 살린다.
     비어 있으면 빈 문자열 — 이때는 topic 문단이 생기지 않아 예전 출력과 같다. */
  function keywordOf(st) {
    return String((st && st.keyword) || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  }

  /* ---------- 데이터 조회 ---------- */
  function byId(list, id) {
    for (var i = 0; i < (list || []).length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function jobOf(st) { return st.job ? byId(D.jobs, st.job) : null; }
  function taskOf(st) { return st.task ? byId(D.tasks, st.task) : null; }
  function outputOf(st) { return st.out ? byId(D.outputs, st.out) : null; }
  function frameOf(job) {
    if (!job) return null;
    var list = D.frames || [];
    var fid = job.frameId || job.id;
    for (var i = 0; i < list.length; i++) if (list[i].id === fid) return list[i];
    return null;
  }
  function templateOf(st) {
    if (!st || !st.tplId) return null;
    if (D.templatesById && D.templatesById[st.tplId]) return D.templatesById[st.tplId];
    return byId(D.templates || [], st.tplId);
  }

  /* ---------- 템플릿 치환 ---------- */
  function pick(map, value, fallback) {
    if (map && value && Object.prototype.hasOwnProperty.call(map, value)) return map[value];
    return fallback === undefined ? '' : fallback;
  }

  /* '{reader} {?why}메일' — {?x}는 값이 있을 때만 "값 + 공백"을 넣는다 */
  function fillTpl(tpl, vars) {
    return String(tpl || '').replace(/\{(\??)([A-Za-z0-9_]+)\}/g, function (m, opt, name) {
      var v = vars[name];
      v = (v === undefined || v === null) ? '' : String(v);
      if (opt === '?') return v ? v + ' ' : '';
      return v;
    });
  }

  function resolveVars(spec, answers) {
    var out = {};
    if (!spec) return out;
    var consts = spec.consts || {};
    Object.keys(consts).forEach(function (k) { out[k] = consts[k]; });
    var vars = spec.vars || {};
    Object.keys(vars).forEach(function (k) {
      var v = vars[k];
      out[k] = pick(v.map, answers[v.by], v.fallback);
    });
    return out;
  }

  function tokenText(v) {
    if (v === undefined || v === null) return '';
    return Object.prototype.hasOwnProperty.call(BLOCKS, v) ? BLOCKS[v] : v;
  }

  /* 선택지 value → 화면 라벨 (조건 문단용) */
  function optionLabel(optKey, value) {
    var opts = (D.options || {})[optKey] || [];
    for (var i = 0; i < opts.length; i++) if (opts[i].value === value) return opts[i].label;
    return value;
  }

  /* ---------- 소속 기관 (선택) ----------
     state.orgType: config.orgTypes의 value / state.orgName: 짧은 기관명.
     비어 있으면 v3·v4.1 문장 그대로(하위 호환). */
  function orgLabel(type) {
    var list = (PW.config && PW.config.orgTypes) || [];
    for (var i = 0; i < list.length; i++) if (list[i].value === type) return list[i].label;
    return '';
  }

  function orgNameOf(st) {
    return String((st && st.orgName) || '').replace(/\s+/g, ' ').trim();
  }

  /* '○○공단(공단·공사)' / '공단·공사 소속 기관' / '○○공단' — 없으면 빈 문자열 */
  function orgPhrase(st) {
    var name = orgNameOf(st);
    var label = orgLabel(st && st.orgType);
    if (name && label) return name + '(' + label + ')';
    if (name) return name;
    if (label) return label + ' 소속 기관';
    return '';
  }

  /* ---------- 문단 빌더 ---------- */

  /* ① 역할 — 직무를 고르면 그 직무 실무자로 역할을 좁힌다 */
  function roleSegment(tpl, job, st) {
    var org = orgPhrase(st);
    var lead;
    if (job) {
      var who = org ? org + '의' : tpl.org;
      lead = '당신은 ' + who + ' ' + job.domain + ' 실무를 15년 넘게 맡아 온 ' + tpl.expert + '입니다.';
    } else if (org) {
      lead = '당신은 ' + org + '의 ' + tpl.expert + '입니다.';
    } else {
      lead = '당신은 ' + tpl.backdrop + '입니다.';
    }
    return lead + ' ' + tpl.principle;
  }

  /* ② 직무·업무 맥락 — 업무를 아직 고르지 않았으면 직무까지만 쓴다 */
  function contextSegment(job, task, st) {
    if (!job) return '';
    var org = orgPhrase(st);
    var where = org ? org + '의 ' + job.contextPhrase : job.contextPhrase;
    if (!task) return '저는 ' + where + ' 직무를 담당하고 있습니다.';
    return '저는 ' + where + ' 직무에서 「' + task.label + '」 업무를 담당하고 있습니다.';
  }

  /* ③ 요청사항 */
  function requestSegment(tpl, answers) {
    var spec = tpl.request;
    if (!spec) return '';
    if (typeof spec === 'string') return spec;
    return fillTpl(spec.tpl, resolveVars(spec, answers));
  }

  /* ③-b 분야 사고 프레임 — 프레임이 없으면 빈 문자열(v3 출력 그대로) */
  function frameSegment(frame) {
    if (!frame) return '';
    var steps = (frame.thinking || []).map(function (s, i) {
      return '①②③④⑤⑥'.charAt(i) + ' ' + s;
    }).join(' → ');
    var parts = [];
    if (steps) parts.push('판단은 다음 순서로 해 주세요: ' + steps + '.');
    if (frame.format) parts.push(frame.format);
    if (frame.style) parts.push(frame.style);
    return parts.join(' ');
  }

  /* ③-c 핵심 키워드 — 맥락 바로 뒤에서 이번 작업의 주제를 못 박는다 (v4.4) */
  function topicSegment(st) {
    var kw = keywordOf(st);
    if (!kw) return '';
    return '이번 작업의 핵심 주제는 「' + kw + '」입니다. 이 주제를 문서의 근거·요청·형식 전반에 반영하고, '
      + '주제와 무관한 내용은 억지로 채우지 마세요.';
  }

  /* ④ 상황(메모) */
  function situationSegment(st) {
    var lines = memoLines(st);
    if (!lines.length) return '';
    return '상황은 다음과 같습니다.\n' + lines.join('\n');
  }

  /* ⑤ 출력 형식 */
  function formatSegment(tpl, answers) {
    var spec = tpl.format;
    if (!spec) return '';
    if (typeof spec === 'string') return tokenText(spec);
    return tokenText(pick(spec.map, answers[spec.by], spec.fallback));
  }

  /* ⑥ 문체 */
  function styleSegment(tpl, answers) {
    var spec = tpl.style;
    if (!spec) return '';
    if (typeof spec === 'string') return spec;
    return pick(spec.map, answers[spec.by], spec.fallback);
  }

  /* ⑦ 세부 요구·문서 규칙 */
  function detailSegment(tpl, answers) {
    var arr = [];
    (tpl.rules || []).forEach(function (rule) {
      var when = rule.when || {};
      var keys = Object.keys(when);
      var hit = keys.length > 0;
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if ((when[k] || []).indexOf(answers[k]) < 0) { hit = false; break; }
      }
      if (hit) arr = arr.concat(rule.texts || []);
    });
    return arr.join(' ');
  }

  /* ⑦-b 분야 공통 조건 + 템플릿 전용 조건 (사용자가 고른 칩만 문장으로) */
  function condSegment(st, frame, tpl) {
    var a = (st && st.answers) || {};
    var parts = [];
    var domainBits = [];
    ((frame && frame.asks) || []).forEach(function (ask) {
      var v = a[ask.key];
      if (v) domainBits.push(ask.label.replace(/\?$/, '') + '=' + v);
    });
    if (domainBits.length) parts.push('분야 조건은 ' + domainBits.join(', ') + '입니다.');
    var tplBits = [];
    ((tpl && tpl.extraAsks) || []).forEach(function (ask) {
      var v = a[ask.key];
      if (!v) return;
      var label = ask.opt ? optionLabel(ask.opt, v) : v;
      tplBits.push(ask.label.replace(/\?$/, '') + '=' + label);
    });
    if (tplBits.length) {
      parts.push('이 문서에만 적용할 조건은 ' + tplBits.join(', ') + '입니다.');
    }
    return parts.join(' ');
  }

  /* ⑧ 직무·업무 관점 (검증 기준) */
  function checkSegment(job, task) {
    if (!job) return '';
    var parts = ['특히 ' + objList(job.points) + ' 기준으로 판단해 주세요.'];
    if (task) {
      parts.push('그중 「' + task.quote + '」 업무에 해당하니, ' + task.detailLabel + ' 관점에서 ' + task.need);
    }
    return parts.join(' ');
  }

  /* ⑨ 분량 */
  function limitSegment(tpl, answers) {
    var spec = tpl.limit;
    if (!spec) return '';
    if (typeof spec === 'string') return spec;
    var v = pick(spec.map, answers[spec.by], spec.fallback);
    return fillTpl(spec.tpl, { v: v });
  }

  /* ⑩ 유의사항(가드레일) */
  function ruleSegment(st) {
    var arr = [];
    D.guards.forEach(function (g) { if (st.guards && st.guards[g.id]) arr.push(g.rule); });
    if (!arr.length) return '';
    return '다음 원칙은 반드시 지켜 주세요. ' + arr.join(' ');
  }

  /* ⑪ 결과물 검증 조건 + 템플릿·분야 점검 */
  function verifySegment(tpl, tplDef, frame) {
    var parts = [];
    if (tpl && tpl.verify) parts.push(tpl.verify);
    if (tplDef && tplDef.verify) parts.push(tplDef.verify);
    if (frame && (frame.checks || []).length) {
      parts.push('분야 점검 기준: ' + frame.checks.map(function (c, i) {
        return '①②③④⑤'.charAt(i) + ' ' + c;
      }).join(', ') + '을 확인해 주세요.');
    }
    return parts.join(' ');
  }

  var ORDER = ['role', 'context', 'topic', 'request', 'frame', 'situation', 'format', 'style', 'detail', 'cond', 'check', 'limit', 'rule', 'verify'];

  /* 결과물을 고르기 전이라도 소속·분야가 있으면 문장이 시작된다. */
  function hasSubject(st) {
    if (!st) return false;
    return !!(st.orgType || String(st.orgName || '').replace(/\s+/g, '') || st.job || st.task || st.out
      || keywordOf(st));
  }

  function build(st) {
    var out = outputOf(st);
    if (!out && !hasSubject(st)) return [];
    var tpl = (out && out.template) || NEUTRAL;
    var a = (st && st.answers) || {};
    var job = jobOf(st);
    var task = taskOf(st);
    var frame = frameOf(job);
    var tplDef = templateOf(st);
    var segs = [];
    var keys = out ? (tpl.segments || ORDER) : PARTIAL_ORDER;

    keys.forEach(function (key) {
      var text = '';
      if (key === 'role') text = roleSegment(tpl, job, st);
      else if (key === 'context') text = contextSegment(job, task, st);
      else if (key === 'topic') text = topicSegment(st);
      else if (key === 'request') text = requestSegment(tpl, a);
      else if (key === 'frame') text = (out || task) ? frameSegment(frame) : '';
      else if (key === 'situation') text = situationSegment(st);
      else if (key === 'format') text = formatSegment(tpl, a);
      else if (key === 'style') text = styleSegment(tpl, a);
      else if (key === 'detail') text = detailSegment(tpl, a);
      else if (key === 'cond') text = condSegment(st, frame, tplDef);
      else if (key === 'check') text = checkSegment(job, task);
      else if (key === 'limit') text = limitSegment(tpl, a);
      else if (key === 'rule') text = ruleSegment(st);
      else if (key === 'verify') text = verifySegment(tpl, tplDef, frame);
      if (text) segs.push({ key: key, text: text });
    });

    return segs;
  }

  PW.engine = {
    build: build,
    blocks: BLOCKS,
    order: ORDER,
    objList: objList,
    memoLines: memoLines,
    hasSubject: hasSubject,
    keywordOf: keywordOf,
    neutral: NEUTRAL,
    partialOrder: PARTIAL_ORDER,
    orgLabel: orgLabel,
    orgPhrase: orgPhrase,
    jobOf: jobOf,
    taskOf: taskOf,
    outputOf: outputOf,
    frameOf: frameOf,
    templateOf: templateOf,
    optionLabel: optionLabel,
    byId: byId,
    fillTpl: fillTpl,
    segmentTexts: {
      role: roleSegment,
      context: contextSegment,
      topic: topicSegment,
      request: requestSegment,
      frame: frameSegment,
      situation: situationSegment,
      format: formatSegment,
      style: styleSegment,
      detail: detailSegment,
      cond: condSegment,
      check: checkSegment,
      limit: limitSegment,
      rule: ruleSegment,
      verify: verifySegment
    }
  };
})(window.PW);
