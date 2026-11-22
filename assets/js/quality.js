/* =========================================================
   Prompt Wizard — 프롬프트 품질 점검 (AI 호출 0)
   5가지 기준 × 20점 = 100점. 화면에 보이는 선택값만으로 계산하고,
   부족한 항목마다 무엇을 채우면 되는지 한 줄로 알려 준다.
   진행률(얼마나 채웠나)과는 다른 미터다 — 품질은 "프롬프트가 얼마나 단단한가"다.
   ========================================================= */
window.PW = window.PW || {};
(function (PW) {
  'use strict';

  var MAX = 20;

  /* 출력 형식을 정하는 칩들 — 결과물마다 이름이 다르지만 뜻은 같다 */
  var FORMAT_KEYS = ['tone', 'length', 'kind', 'mailTone', 'len', 'depth', 'deliverable', 'cForm', 'include', 'exclude'];

  function memoStats(memo) {
    var lines = String(memo || '').split('\n').map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });
    var len = String(memo || '').replace(/\s+/g, '').length;
    return { lines: lines.length, len: len };
  }

  function hasFormatChoice(answers) {
    for (var i = 0; i < FORMAT_KEYS.length; i++) {
      if (answers && answers[FORMAT_KEYS[i]]) return true;
    }
    return false;
  }

  function countGuards(guards) {
    var n = 0;
    if (guards) Object.keys(guards).forEach(function (k) { if (guards[k]) n++; });
    return n;
  }

  /* ctx: {job, out, answers, memo, guards, requiredKeys:[], requiredAnswered:n} */
  function evaluate(ctx) {
    ctx = ctx || {};
    var answers = ctx.answers || {};
    var guards = ctx.guards || {};
    var hasOut = !!ctx.out;
    var reqKeys = ctx.requiredKeys || [];
    var reqDone = typeof ctx.requiredAnswered === 'number' ? ctx.requiredAnswered : 0;
    var reqComplete = hasOut && reqKeys.length > 0 && reqDone >= reqKeys.length;
    var memo = memoStats(ctx.memo);
    var nGuards = countGuards(guards);

    var items = [];

    /* ① 역할 지정 — 직무를 골랐는가(엔진이 전문가 역할 문단을 붙인다) */
    var roleScore = ctx.job ? MAX : 0;
    items.push({
      key: 'role', label: '역할 지정', score: roleScore, max: MAX, ok: roleScore === MAX,
      advice: 'STEP 01에서 직무를 고르면 「15년차 실무자」 역할이 프롬프트 맨 앞에 붙습니다.'
    });

    /* ② 상황 설명 — 숫자·기한이 들어간 2줄 이상의 메모 */
    var sitScore = memo.lines >= 2 && memo.len >= 40 ? MAX : (memo.len > 0 ? 10 : 0);
    items.push({
      key: 'situation', label: '상황 설명', score: sitScore, max: MAX, ok: sitScore === MAX,
      advice: '핵심 상황·메모에 숫자·기한·이름을 넣어 2줄 이상 적어 보세요.'
    });

    /* ③ 목적 명확성 — 결과물 + 필수 질문(목적·대상) 응답 */
    var purScore = !hasOut ? 0 : (reqComplete ? MAX : (reqDone > 0 ? 10 : 0));
    items.push({
      key: 'purpose', label: '목적 명확성', score: purScore, max: MAX, ok: purScore === MAX,
      advice: hasOut
        ? '필수 질문 ' + (reqKeys.length - reqDone) + '개가 비어 있어요. 목적·대상 칩을 끝까지 골라 주세요.'
        : 'STEP 03에서 결과물을 고르면 목적 질문이 열립니다.'
    });

    /* ④ 출력 형식 — 문체·분량·형식 칩 1개 이상 */
    var fmtScore = hasFormatChoice(answers) ? MAX : 0;
    items.push({
      key: 'format', label: '출력 형식', score: fmtScore, max: MAX, ok: fmtScore === MAX,
      advice: '문체·분량·형식을 하나만 정해도 결과가 훨씬 안정됩니다. 「+ 더 세부 조건」을 열어 보세요.'
    });

    /* ⑤ 제약 조건 — 가드레일 2개 이상 또는 (가드 1개 + 필수 질문 완료) */
    var conScore = !hasOut ? 0 : (nGuards >= 2 ? MAX : (nGuards === 1 ? (reqComplete ? MAX : 10) : 0));
    items.push({
      key: 'constraint', label: '제약 조건', score: conScore, max: MAX, ok: conScore === MAX,
      advice: 'AI 헛소리 방지 장치를 하나 더 켜 보세요(예: 기준일·출처 확인, 모호하면 역질문).'
    });

    var score = 0;
    items.forEach(function (it) { score += it.score; });
    if (score > 100) score = 100;

    return {
      score: score,
      max: 100,
      label: label(score),
      items: items,
      missing: items.filter(function (it) { return !it.ok; })
    };
  }

  function label(score) {
    if (score >= 90) return '아주 단단해요';
    if (score >= 70) return '좋아요';
    if (score >= 50) return '조금만 더';
    if (score > 0) return '보완이 필요해요';
    return '시작 전';
  }

  PW.quality = {
    evaluate: evaluate,
    label: label,
    formatKeys: FORMAT_KEYS,
    memoStats: memoStats
  };
})(window.PW);
