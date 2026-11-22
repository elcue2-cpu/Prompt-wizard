/* Prompt Wizard — 실행 설정 한 곳
   ads.enabled:false  → 승인 전에는 광고 스크립트를 부르지도, 슬롯을 그리지도 않는다.
                         승인 뒤 client·slots 값만 채우면 켜진다.
   urlSync            → 데스크톱에서만 주소창에 선택 상태를 되쓴다(공유·뒤로가기 대응). */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.config = {
    version: 'v4.1',
    urlSync: true,
    ads: {
      enabled: false,
      client: '',
      slots: { main: '', start: '', end: '', landing: '' }
    }
  };
})(window.PW);
