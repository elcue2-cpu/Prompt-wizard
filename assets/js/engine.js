/* =========================================================
   Prompt Wizard — 프롬프트 조립 엔진
   선택값(state)만 받아 문단 배열 [{key, text}]을 돌려준다.
   화면(DOM)을 모르고, 어떤 결과물인지도 데이터에서 읽는다.
   ========================================================= */
window.PW = window.PW || {};

(function (PW) {
  'use strict';

  var D = PW.data;

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
  /* ['a','b'] → 'a, b를' */
  function objList(arr) {
    var s = arr.join(', ');
    return s + josa(s, '을', '를');
  }

  function memoLines(st) {
    return String(st.memo || '').split('\n').map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
  }

  /* ---------- 1. 역할 ---------- */
  function roleText(p, job) {
    var lead = job
      ? '당신은 ' + p.org + ' ' + job.domain + ' 실무를 15년 넘게 맡아 온 ' + p.expert + '입니다.'
      : '당신은 ' + p.backdrop + '입니다.';
    return lead + ' ' + p.principle;
  }

  /* ---------- 2. 요청사항 ---------- */
  var REPORT_READER = {
    '내부결재·방침수립': '내부 결재권자가',
    '타부서·대외 협조공문': '협조를 요청받는 타부서 담당자와 결재권자가',
    '감사·의회·외부 요구자료': '감사·의회 담당자와 자료를 요구한 외부 기관이',
    '계약·발주·예산 검토': '계약·예산 심사 담당자와 결재권자가'
  };
  var REPORT_DECIDE = {
    '신규 승인·추진 요청': '핵심을 30초 안에 파악해 신규 승인·추진 여부를 결정할 수 있도록',
    '현황·실적 보고': '계획 대비 실적과 미달 원인을 한눈에 파악할 수 있도록',
    '문제 해결·예산 방어': '문제의 원인과 대안 비용을 나란히 비교해 예산을 방어할 수 있도록',
    '규정·지침 검토': '적용 조항과 쟁점, 개정 여부를 빠르게 확인할 수 있도록'
  };

  function requestText(key, p, a) {
    if (key === 'report') {
      var reader = REPORT_READER[a.doc] || '결재권자가';
      var decide = REPORT_DECIDE[a.goal] || '핵심을 30초 안에 파악할 수 있도록';
      return reader + ' ' + decide + ' ' + p.docNoun + '를 작성해 주세요.';
    }
    if (key === 'mail') {
      var to = { '상사·임원': '상사·임원에게', '타부서·동료': '타부서 동료에게', '외부 거래처·용역사': '외부 거래처·용역사 담당자에게' }[a.to] || '상대에게';
      var why = { '정중한 거절': '이번 요청은 정중히 거절하면서 대안을 제시하는', '일정·회신 독촉': '일정과 회신을 재촉하는', '협조·자료 요청': '협조와 자료를 요청하는', '실수 사과·수습': '실수를 사과하고 수습 방안을 전하는' }[a.why] || '';
      return to + ' ' + (why ? why + ' ' : '') + '메일을 써 주세요. 관계를 해치지 않으면서 상대가 읽고 바로 행동할 수 있어야 합니다.';
    }
    if (key === 'excel') {
      var tool = { '엑셀 수식': '지금 쓰는 도구는 엑셀 수식입니다.', '구글 스프레드시트': '지금 쓰는 도구는 구글 스프레드시트입니다.', '파이썬/자동화': '지금 쓰는 도구는 파이썬 자동화입니다.', 'VBA/매크로': '지금 쓰는 도구는 VBA 매크로입니다.' }[a.tool] || '';
      var need = { '원하는 기능 새로 짜기': '필요한 기능을 처음부터 만들어 주세요.', '오류 메시지 해결': '지금 뜨는 오류 메시지의 원인을 찾아 고쳐 주세요.', '느린 파일·코드 개선': '느려진 파일이나 코드를 빠르게 개선해 주세요.' }[a.situation] || '원하는 결과를 바로 쓸 수 있는 형태로 만들어 주세요.';
      return (tool ? tool + ' ' : '') + need;
    }
    var src = { '회의 녹취·대화': '회의 녹취나 대화 기록에서', '긴 보고서·기사': '긴 보고서나 기사에서', '이메일 스레드': '이메일 스레드에서' }[a.src] || '긴 자료에서';
    var focus = { '결정사항·할 일(담당/기한)': '결정사항과 할 일(담당·기한)을', '핵심 3줄 + 리스크': '핵심 3줄과 리스크를', '찬반·쟁점 비교': '찬반 논거와 쟁점을' }[a.focus] || '필요한 내용만';
    return src + ' ' + focus + ' 뽑아 주세요.';
  }

  /* ---------- 3. 출력 형식 ---------- */
  function formatText(key, p, a) {
    if (key === 'report') {
      var doc = a.doc || '';
      var official = (doc.indexOf('타부서') >= 0 || doc.indexOf('대외') >= 0);
      if (official) {
        return '공문 갑지 서식으로 작성해 주세요. 제목 → 「1. 관련: [근거 공문·계획]」 → 「2. 위 호와 관련하여 ~ 협조 요청드립니다」 → 「가. ~ / 나. ~」 세부사항 → 「붙임  1. ~ 1부.」 순서로 두고, 문서 마지막은 「끝.」으로 닫아 주세요. 문장은 「~바랍니다」·「~요청드립니다」로 끝맺고, 요청 사항에는 기한·제출 형식·담당 연락처를 한 줄로 특정해 주세요.';
      }
      if (doc) {
        return '개조식 보고서로 작성해 주세요. □ 대제목 → ㅇ 중항목 → - 세부내용 순으로 내려가고, 문장은 「~함 / ~임 / ~예정 / ~필요」로 끝맺어 주세요. 본문은 추진배경(관련 규정·상위계획) → 현황 및 문제점 → 검토내용(대안 비교) → 추진계획(소요예산·일정·전결권 확인) → 행정사항 순서로 잡아 주세요.';
      }
      return '본문은 결론 → 근거 → 추진계획(소요예산·일정·전결권) → 행정사항 순서로 잡고, 한 문단은 3줄을 넘기지 않게 해 주세요.';
    }
    if (key === 'mail') {
      return '제목 1개와 본문(인사 → 상황·사유 → 요청 사항(기한·형식 명시) → 마무리 인사)으로 구성해 주세요. 같은 내용을 메신저·유선 후속용 3~5문장 축약본으로도 주고, 공문으로 보낼 때는 수신처·결재선을 표기해 주세요.';
    }
    if (key === 'excel') {
      return '답은 ① 바로 쓸 수식·코드 → ② 붙여 넣을 위치와 방법 → ③ 예상 결과 → ④ 흔한 오류와 대처 순서로 주세요. 코드는 복사 가능한 코드 블록으로 주고, 시트명·범위는 예시로 밝혀 주세요. 집계 결과는 원본 5행 정도로 손계산해 확인할 수 있게 근거를 함께 주세요.';
    }
    return '① 한 줄 결론 ② 핵심 요약 ③ 표(항목/담당/기한) ④ 리스크·확인 필요 사항 순서로 정리하고, 원문에 없는 추론은 넣지 말고 확인이 필요한 부분만 따로 표시해 주세요.';
  }

  /* ---------- 4. 문체 ---------- */
  function styleText(key, a) {
    if (key === 'report') {
      var t = a.tone || '';
      if (t.indexOf('개조식') >= 0) return '문체는 공공기관 개조식으로, 감정·추측을 빼고 사실과 수치만 남겨 항목마다 한 줄로 끝맺어 주세요.';
      if (t.indexOf('비교표') >= 0) return '검토 내용은 비용·기간·리스크·근거 규정을 열로 둔 대안 비교표로 정리하고, 결론은 표 아래 3줄 이내로 써 주세요.';
      if (t.indexOf('서술형') >= 0) return '각 항목 아래에 근거와 경위를 2~3문장으로 풀어 써서, 처음 받는 부서도 이해할 수 있게 해 주세요.';
      return '문체는 간결한 실무 문체로, 한 문단 3줄을 넘기지 않게 해 주세요.';
    }
    if (key === 'mail') {
      var m = a.tone || '';
      if (m.indexOf('단호') >= 0) return '말투는 격식 있고 단호하게, 결론과 요청을 첫 문단에 두세요.';
      if (m.indexOf('부드럽') >= 0) return '말투는 부드럽고 유연하게, 상대의 사정을 먼저 인정한 뒤 요청을 두세요.';
      if (m.indexOf('짧고') >= 0) return '말투는 짧고 핵심만, 3문장 안에 요청과 기한만 남기세요.';
      return '말투는 정중하고 군더더기 없이, 결론과 요청이 한 번에 읽히게 써 주세요.';
    }
    if (key === 'excel') {
      var d = a.depth || '';
      if (d.indexOf('초보자') >= 0) return '설명은 초보자가 복사·붙여넣기만 해도 되도록 단계별로 써 주세요.';
      if (d.indexOf('원리') >= 0) return '왜 그렇게 되는지 원리도 한두 줄로 설명해 주세요.';
      return '설명은 필요한 만큼만, 복사해서 바로 쓸 수 있는 형태로 주세요.';
    }
    var l = a.len || '';
    if (l.indexOf('반 페이지') >= 0) return '분량은 임원 보고용 반 페이지로 줄여 주세요.';
    if (l.indexOf('상세') >= 0) return '분량은 실무자가 바로 실행할 수 있게 충분히 상세히 정리해 주세요.';
    return '분량은 보고 한 장 안쪽으로 줄여 주세요.';
  }

  /* ---------- 5. 문서 규칙 ---------- */
  function docRuleText(key, a) {
    if (key !== 'report') return '';
    var doc = a.doc || '';
    var goal = a.goal || '';
    var arr = [];
    if (doc.indexOf('감사') >= 0 || doc.indexOf('의회') >= 0) {
      arr.push('감정·변명·추측을 빼고 사실 → 수치 → 원인 → 개선대책(이행기한·담당) 순으로만 쓰고, 요구 범위 밖 자료는 넣지 마세요.');
      arr.push('요구 항목별로 답변을 1:1로 맞추고, 산출할 수 없는 항목은 사유와 대체 자료를 함께 표시해 주세요.');
    }
    if (doc.indexOf('계약') >= 0 || doc.indexOf('발주') >= 0) {
      arr.push('계약 방식(수의/경쟁)과 근거 조항, 사전 절차(방침 수립 → 계약심사 → 일상감사) 이행 여부, 과업·규격·예산 변경 시 절차와 결재선을 밝히고, 분할 발주·규격 변경·부당 수의처럼 지적 소지가 있는 부분은 근거와 함께 먼저 설명해 주세요.');
    }
    if (doc.indexOf('내부결재') >= 0 || doc.indexOf('방침') >= 0) {
      arr.push('결재선은 기안자 → 검토자 → 결재권자 순으로 판단 근거가 이어지게 쓰고, 전결권자와 전결 범위를 표시해 주세요.');
    }
    if (goal.indexOf('예산 방어') >= 0) {
      arr.push('추가 소요액과 외주·민간 위탁 같은 대체안 비용을 같은 기준으로 나란히 제시하고, 절감·회피 효과를 숫자로 밝혀 주세요.');
    }
    if (goal.indexOf('신규 승인') >= 0) {
      arr.push('무엇을·언제까지·얼마로 승인받으려는지 첫 세 줄에 밝히고, 승인되지 않을 때 일정·민원·안전에 생길 영향을 함께 적어 주세요.');
    }
    if (goal.indexOf('현황') >= 0) {
      arr.push('계획 대비 실적을 같은 기준으로 비교하고, 미달 항목은 원인과 보완 계획까지 붙여 주세요.');
    }
    if (goal.indexOf('규정') >= 0) {
      arr.push('적용 조항과 기준일을 먼저 밝히고, 상위 규정·개정 여부와 충돌하는 부분은 따로 표시해 주세요.');
    }
    return arr.join(' ');
  }

  /* ---------- 6. 직무·업무 관점 ---------- */
  function checkText(key, p, a, job) {
    if (!job) return '';
    var parts = [];
    parts.push('특히 ' + objList(job.points) + ' 기준으로 판단해 주세요.');
    if (a.task) {
      var f = D.tasks[a.task];
      if (f) {
        parts.push('그중 「' + a.task + '」 업무에 해당하니, ' + f.label + ' 관점에서 ' + f.need);
      } else if (D.taskNotes[a.task]) {
        parts.push('그중 「' + a.task + '」 업무에 해당하니, ' + D.taskNotes[a.task]);
      }
    }
    return parts.join(' ');
  }

  /* ---------- 7. 분량 ---------- */
  function limitText(key) {
    if (key !== 'report') return '';
    return '분량은 A4 1~2장, 한 문단 3줄 이내, 표는 5열 이내로 해 주세요. 인용한 규정·통계·기준일은 문장 끝에 괄호로 출처와 기준일을 적어 주세요.';
  }

  /* ---------- 8. 유의사항 ---------- */
  function rulesText(st) {
    var arr = [];
    D.guards.forEach(function (g) { if (st.guards[g.id]) arr.push(g.rule); });
    if (!arr.length) return '';
    return '다음 원칙은 반드시 지켜 주세요. ' + arr.join(' ');
  }

  /* ---------- 9. 메모(상황) ---------- */
  function situationText(st) {
    var lines = memoLines(st);
    if (!lines.length) return '';
    return '상황은 다음과 같습니다.\n' + lines.join('\n');
  }

  /* ---------- 조립 ---------- */
  function build(st) {
    if (!st.purpose) return [];
    var key = st.purpose;
    var p = D.outputs[key];
    if (!p) return [];
    var a = st.answers;
    var job = (a.job && D.jobs[a.job]) ? D.jobs[a.job] : null;
    var out = [];

    out.push({ key: 'role', text: roleText(p, job) });
    out.push({ key: 'request', text: requestText(key, p, a) });

    var ctx = situationText(st);
    if (ctx) out.push({ key: 'context', text: ctx });

    out.push({ key: 'format', text: formatText(key, p, a) });

    var stl = styleText(key, a);
    if (stl) out.push({ key: 'style', text: stl });

    var dr = docRuleText(key, a);
    if (dr) out.push({ key: 'docrule', text: dr });

    var ck = checkText(key, p, a, job);
    if (ck) out.push({ key: 'check', text: ck });

    var lm = limitText(key);
    if (lm) out.push({ key: 'limit', text: lm });

    var rl = rulesText(st);
    if (rl) out.push({ key: 'rule', text: rl });

    return out;
  }

  PW.engine = {
    build: build,
    objList: objList,
    memoLines: memoLines,
    roleText: roleText,
    requestText: requestText,
    formatText: formatText,
    styleText: styleText,
    docRuleText: docRuleText,
    checkText: checkText,
    limitText: limitText,
    rulesText: rulesText
  };
})(window.PW);
