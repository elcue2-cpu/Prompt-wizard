/* =========================================================
   Prompt Wizard — 자연어 업무 검색 (v4.1)
   · API 호출 0. 부팅 시 메모리 인덱스(분야 8 + 업무 62 + 템플릿 164)를 한 번 만든다.
   · 정규화(소문자·특수문자 제거·공백 제거·어미 절단) → 사전 부분일치 → 동의어 확장 → 점수.
   · 결과는 업무 단위로 묶어 상위 3개를 돌려준다(같은 업무의 템플릿은 대표 1개만).
   · 점수 상한 미달(1.0 미만)이면 빈 배열을 돌려주고, 화면은 인기 업무를 대신 보여 준다.
   ========================================================= */
window.PW = window.PW || {};
(function (PW) {
  'use strict';

  var HINTS = [
    ['결과보고', 'R'], ['보고서', 'R'], ['계획서', 'R'], ['기획', 'R'], ['품의', 'R'], ['기안', 'R'], ['합의문', 'R'],
    ['공문', 'C'], ['시행문', 'C'], ['회신', 'C'], ['요청서', 'C'], ['답변', 'C'],
    ['메일', 'M'], ['메시지', 'M'], ['안내문', 'M'],
    ['엑셀', 'X'], ['수식', 'X'], ['집계', 'X'], ['계산', 'X'], ['산출', 'X'], ['명세', 'X'],
    ['요약', 'S'], ['회의록', 'S'],
    ['검토서', 'V'], ['검토', 'V'], ['원인분석', 'V'],
    ['점검표', 'F'], ['체크리스트', 'F'], ['대장', 'F'], ['일지', 'F'], ['명부', 'F'], ['표', 'F'],
    ['이수', 'F'], ['목록', 'F'], ['증빙', 'F'], ['시험', 'F'], ['성적서', 'F']
  ];
  var OUT_BY_CODE = { R: 'report', C: 'collab', M: 'mail', X: 'excel', S: 'summary', V: 'review', F: 'form' };
  var CODE_BY_OUT = { report: 'R', collab: 'C', mail: 'M', excel: 'X', summary: 'S', review: 'V', form: 'F' };

  var ENDINGS = ['만들어줘', '만들어', '작성해줘', '작성해', '써줘', '해줘', '해주세요', '주세요',
    '부탁해', '부탁드립니다', '알려줘', '정리해줘', '하고싶어', '하려면', '하는', '하고', '작성', '싶다'];

  function norm(s) {
    var t = String(s == null ? '' : s).toLowerCase();
    t = t.replace(/[^0-9a-z가-힣]/g, '');
    t = t.replace(/\s+/g, '');
    return t;
  }

  function stripEnding(s) {
    for (var i = 0; i < ENDINGS.length; i++) {
      var e = ENDINGS[i];
      if (s.length > e.length + 1 && s.slice(-e.length) === e) return s.slice(0, -e.length);
    }
    return s;
  }

  /* 한국어 조사·어미 절단 — 토큰 끝에서만 */
  function stripJosa(s) {
    var parts = ['으로서', '으로써', '에서는', '에게서', '이라고', '으로', '에서', '에게', '부터', '까지',
      '은', '는', '이', '가', '을', '를', '의', '에', '로', '와', '과', '도', '만', '께', '랑'];
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (s.length > p.length + 1 && s.slice(-p.length) === p) return s.slice(0, -p.length);
    }
    return s;
  }

  function termList(s) {
    return String(s || '').split(/[\s,·\/()]+/).map(norm).filter(function (x) { return x.length >= 2; });
  }

  /* ---------- 인덱스 ---------- */

  var index = null;
  var synGroups = null;

  function buildSyn() {
    if (synGroups) return synGroups;
    synGroups = [];
    var src = (PW.data && PW.data.searchSynonyms) || {};
    Object.keys(src).forEach(function (key) {
      var all = [key].concat(src[key] || []);
      synGroups.push({ canon: norm(key), members: all.map(norm) });
    });
    return synGroups;
  }

  function build() {
    var D = PW.data;
    var entries = [];
    (D.domains || D.jobs || []).forEach(function (d) {
      var terms = [];
      terms = terms.concat(termList(d.name)).concat(termList(d.alias)).concat(termList(d.desc));
      entries.push({ type: 'domain', id: d.id, domainId: d.id, terms: terms,
        keys: [d.name, d.short, d.alias].filter(Boolean), weight: 0.8 });
    });
    (D.tasks || []).forEach(function (t) {
      var terms = [];
      terms = terms.concat(termList(t.name)).concat(termList(t.short)).concat(termList(t.label))
        .concat(termList(t.detailLabel)).concat(termList(t.quote));
      (t.aliases || []).forEach(function (a) { terms = terms.concat(termList(a)); });
      entries.push({ type: 'task', id: t.id, taskId: t.id, domainId: t.domainId || t.jobId,
        terms: dedupe(terms), keys: [t.name, t.short].concat(t.aliases || []).filter(Boolean),
        recommends: t.recommends || [], weight: 2.0 });
    });
    (D.templates || []).forEach(function (tp) {
      var terms = termList(tp.name);
      var owners = [];
      if (tp.owner) owners.push(tp.owner);
      else {
        var map = D.taskTemplates || {};
        Object.keys(map).forEach(function (tid) {
          (map[tid] || []).forEach(function (c) { if (c.tpl === tp.id) owners.push(tid); });
        });
      }
      entries.push({ type: 'template', id: tp.id, tplId: tp.id, taskId: owners[0] || null,
        taskIds: owners, domainId: null, terms: dedupe(terms), keys: [tp.name], base: tp.base, weight: 1.5 });
    });
    index = entries;
    return entries.length;
  }

  function dedupe(arr) {
    var seen = {}, out = [];
    arr.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  /* ---------- 채점 ---------- */

  function hintsIn(q) {
    var found = [];
    HINTS.forEach(function (h) {
      if (q.indexOf(norm(h[0])) >= 0) found.push(h[1]);
    });
    /* 중복 제거 */
    return dedupe(found);
  }

  function scoreEntry(e, q, synMatches, hintCodes) {
    var score = 0;
    var hit = [];
    for (var i = 0; i < e.terms.length; i++) {
      var t = e.terms[i];
      if (t.length < 2) continue;
      if (q.indexOf(t) >= 0) {
        var base = (i < 3 ? 3.0 : 2.2);
        if (t.length >= 4) base += 0.8;
        score += base;
        hit.push(t);
      }
    }
    /* 동의어 확장 */
    for (var s = 0; s < synMatches.length; s++) {
      var members = synMatches[s];
      for (var m = 0; m < members.length; m++) {
        if (e.terms.indexOf(members[m]) >= 0) { score += 2.0; hit.push(members[m]); break; }
      }
    }
    if (score <= 0) return null;
    score = score * e.weight;
    if (hit.length > 1) score += 1.2 * (hit.length - 1);
    /* 결과물 힌트 가산 */
    if (e.type === 'task' && hintCodes.length) {
      for (var h = 0; h < hintCodes.length; h++) {
        var outId = OUT_BY_CODE[hintCodes[h]];
        if ((e.recommends || []).indexOf(outId) >= 0) { score += 1.5; break; }
      }
    }
    if (e.type === 'template' && hintCodes.length) {
      if (hintCodes.indexOf(CODE_BY_OUT[e.base]) >= 0) score += 1.2;
    }
    return { score: score, hit: hit };
  }

  function synMatchesFor(q) {
    var groups = buildSyn();
    var out = [];
    groups.forEach(function (g) {
      for (var i = 0; i < g.members.length; i++) {
        var m = g.members[i];
        if (m.length >= 2 && q.indexOf(m) >= 0) { out.push(g.members); return; }
      }
    });
    return out;
  }

  function pickOut(task, hintCodes) {
    if (!task) return '';
    for (var i = 0; i < hintCodes.length; i++) {
      var id = OUT_BY_CODE[hintCodes[i]];
      if ((task.recommends || []).indexOf(id) >= 0) return id;
    }
    return (task.recommends || [])[0] || 'report';
  }

  function query(text, limit) {
    if (!index) build();
    var raw = String(text == null ? '' : text);
    var q = stripEnding(norm(raw));
    if (q.length < 2) return { q: q, results: [], low: true };
    var hintCodes = hintsIn(raw + ' ' + q);
    var syn = synMatchesFor(q);

    var scored = [];
    index.forEach(function (e) {
      var r = scoreEntry(e, q, syn, hintCodes);
      if (r && r.score >= 1.0) scored.push({ e: e, score: r.score, hit: r.hit });
    });
    scored.sort(function (a, b) { return b.score - a.score; });

    /* 업무 단위로 묶는다 — 템플릿 항목은 그 업무의 대표 결과로 */
    var byTask = {}, order = [];
    scored.forEach(function (s) {
      var e = s.e;
      if (e.type === 'domain') return;                /* 분야 단독 추천은 업무가 없을 때만 */
      var taskId = e.taskId;
      if (e.type === 'template' && e.taskIds && e.taskIds.length > 1) {
        /* 공유 템플릿 — 이미 점수가 있는 참조 업무를 우선하고, 없으면 첫 참조 업무로 */
        var best = null, bestScore = -1;
        e.taskIds.forEach(function (tid) {
          var sc = byTask[tid] ? byTask[tid].score : 0;
          if (sc > bestScore) { bestScore = sc; best = tid; }
        });
        taskId = best || e.taskIds[0];
      }
      if (!taskId) return;
      if (!byTask[taskId]) {
        var domainOfTask = e.domainId;
        if (!domainOfTask) {
          var allTasks = PW.data.tasks || [];
          for (var q2 = 0; q2 < allTasks.length; q2++) {
            if (allTasks[q2].id === taskId) domainOfTask = allTasks[q2].domainId || allTasks[q2].jobId;
          }
        }
        byTask[taskId] = { taskId: taskId, domainId: domainOfTask, score: s.score, hit: s.hit, tplId: null, base: null };
        order.push(taskId);
      }
      var cur = byTask[taskId];
      if (s.score > cur.score) { cur.score = s.score; cur.hit = s.hit; }
      if (e.type === 'template' && (e.base || '') && !cur.tplId) {
        cur.tplId = e.tplId;
        cur.base = e.base;
        cur.score = Math.max(cur.score, s.score);
      }
    });

    var tasks = (PW.data.tasks || []);
    var results = order.slice(0, limit || 3).map(function (taskId) {
      var c = byTask[taskId];
      var task = null;
      for (var i = 0; i < tasks.length; i++) if (tasks[i].id === taskId) task = tasks[i];
      var outId = pickOut(task, hintCodes);
      return {
        taskId: taskId,
        domainId: c.domainId || (task && (task.domainId || task.jobId)),
        tplId: c.tplId,
        out: CODE_BY_OUT[outId] || 'R',
        outId: outId,
        score: Math.round(c.score * 100) / 100,
        why: whyOf(c, task)
      };
    });
    return { q: q, results: results, low: results.length === 0 };
  }

  function whyOf(c, task) {
    var hits = (c.hit || []).slice(0, 2);
    var shown = hits.length ? hits.join(' + ') : (task ? task.name : '');
    return shown + (task ? ' → ' + task.name : '');
  }

  function popular(n) {
    var tasks = (PW.data.tasks || []).slice();
    var want = ['admin', 'inspection', 'privacy', 'complaint', 'budget', 'work-result', 'safety', 'hr'];
    var list = [];
    want.forEach(function (id) {
      for (var i = 0; i < tasks.length; i++) if (tasks[i].id === id) list.push(tasks[i]);
    });
    return list.slice(0, n || 3);
  }

  PW.search = {
    build: build,
    query: query,
    popular: popular,
    norm: norm,
    size: function () { return (index || []).length; },
    outByCode: OUT_BY_CODE,
    codeByOut: CODE_BY_OUT
  };
})(window.PW);
