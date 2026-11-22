/* Prompt Wizard — 가드레일 4종 + 범용 후속 팁 */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.data = PW.data || {};

  PW.data.guards = [
    { id:'fact', on:true,
      label:'없는 수치·사실 지어내지 말기',
      rule:'확인되지 않은 수치·날짜·사람·기관·조항은 지어내지 말고, 모르면 모른다고 쓰세요.' },
    { id:'basis', on:false,
      label:'기준일·근거 출처·개정 여부 확인 표시',
      rule:'인용하는 규정·지침·통계에는 기준일과 근거 출처를 함께 적고, 위임 조항이거나 기준일·개정 여부가 불명확하면 [원문·개정 여부 확인 필요]로 표시하세요.' },
    { id:'ask', on:false,
      label:'모호한 부분은 먼저 역질문하기',
      rule:'정보가 모자라 답의 품질이 떨어질 것 같으면, 추측해서 쓰기 전에 꼭 필요한 정보 1~3가지를 먼저 질문하세요.' },
    { id:'body', on:false,
      label:'바로 복붙할 본문만 출력',
      rule:'인사말·설명·메타 코멘트 없이, 그대로 복사해 쓸 수 있는 본문만 출력하세요.' }
  ];


  PW.data.genericTips = [
    '결론부터 나오게 다시 정리하고, 첫 세 줄만 고쳐줘.',
    '빠진 근거는 [확인 필요]로 표시하고, 무엇을 확인해야 하는지 알려줘.'
  ];

})(window.PW);
