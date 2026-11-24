/* Prompt Wizard — 실행 설정 한 곳
   ads.enabled:false  → 승인 전에는 광고 스크립트를 부르지도, 슬롯을 그리지도 않는다.
                         승인 뒤 client·slots 값만 채우면 켜진다.
   urlSync            → 데스크톱에서만 주소창에 선택 상태를 되쓴다(공유·뒤로가기 대응). */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.config = {
    version: 'v4.4',
    urlSync: true,
    /* STEP 01 「소속 기관 성격」 칩 — 고르지 않아도 된다(선택).
       value는 저장값·URL에 쓰지 않고, 엔진이 label을 역할 문장에 넣는다. */
    orgTypes: [
      { value: 'public-corp', label: '공단·공사' },
      { value: 'gov', label: '중앙부처·지자체' },
      { value: 'inst', label: '출연연·교육기관' },
      { value: 'other', label: '기타 공공기관' }
    ],
    ads: {
      enabled: false,
      client: '',
      slots: { main: '', start: '', end: '', landing: '' }
    }
  };
})(window.PW);
