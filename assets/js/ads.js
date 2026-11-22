/* =========================================================
   Prompt Wizard — 애드센스 슬롯 (승인 전 기본 꺼짐)
   PW.config.ads.enabled === false 이면
     · 광고 스크립트를 부르지 않고
     · 슬롯을 그리지 않으며(빈 자리도 남기지 않음)
     · 레이아웃 이동도 만들지 않는다.
   승인 뒤 config.js의 client·slots 값만 채우면 켜진다.
   ?dev=1 은 개발 확인용 점선 자리 표시일 뿐, 광고 요청은 하지 않는다.
   ========================================================= */
window.PW = window.PW || {};
(function (PW) {
  'use strict';

  var SLOT_IDS = { start: 'adStart', end: 'adEnd', main: 'adMain' };
  var LOADER_ID = 'adsenseLoader';
  var mounted = false;
  var requested = 0;

  function cfg() {
    return (PW.config && PW.config.ads) || { enabled: false, client: '', slots: {} };
  }

  function isEnabled() {
    var c = cfg();
    return !!(c.enabled && c.client);
  }

  function devMode() {
    try {
      return typeof location !== 'undefined' && String(location.search || '').indexOf('dev=1') >= 0;
    } catch (e) {
      return false;
    }
  }

  function hideAll() {
    Object.keys(SLOT_IDS).forEach(function (k) {
      var el = document.getElementById(SLOT_IDS[k]);
      if (el) {
        el.hidden = true;
        el.innerHTML = '';
      }
    });
  }

  function loadScript(client) {
    if (document.getElementById(LOADER_ID)) return;
    var s = document.createElement('script');
    s.id = LOADER_ID;
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(client);
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }

  function mount(el, slotId) {
    if (!el || !slotId) return false;
    var c = cfg();
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.setAttribute('data-ad-client', c.client);
    ins.setAttribute('data-ad-slot', String(slotId));
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    el.innerHTML = '';
    el.appendChild(ins);
    el.hidden = false;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      requested++;
    } catch (e) { /* 스크립트가 아직 없으면 애드센스가 나중에 처리한다 */ }
    return true;
  }

  function mountAll() {
    if (!isEnabled()) {
      hideAll();
      return 0;
    }
    var c = cfg();
    loadScript(c.client);
    var n = 0;
    Object.keys(SLOT_IDS).forEach(function (k) {
      var el = document.getElementById(SLOT_IDS[k]);
      if (el && c.slots[k]) { if (mount(el, c.slots[k])) n++; }
    });
    try {
      var nodes = document.querySelectorAll('[data-ad-slot="landing"]');
      for (var i = 0; i < nodes.length; i++) {
        if (c.slots.landing) { if (mount(nodes[i], c.slots.landing)) n++; }
      }
    } catch (e) { /* 무시 */ }
    mounted = n > 0;
    return n;
  }

  function devPaint() {
    if (!devMode() || isEnabled()) return;
    Object.keys(SLOT_IDS).forEach(function (k) {
      var el = document.getElementById(SLOT_IDS[k]);
      if (!el) return;
      el.innerHTML = '';
      var box = document.createElement('div');
      box.className = 'ad-dev';
      box.textContent = '광고 자리 (미리보기) · 승인 전에는 표시되지 않습니다';
      el.appendChild(box);
      el.hidden = false;
    });
  }

  function state() {
    return { enabled: isEnabled(), mounted: mounted, requested: requested, dev: devMode() };
  }

  function boot() {
    if (isEnabled()) mountAll();
    else { hideAll(); devPaint(); }
  }

  PW.ads = {
    boot: boot,
    mountAll: mountAll,
    hideAll: hideAll,
    isEnabled: isEnabled,
    state: state,
    slotIds: SLOT_IDS
  };

  if (typeof document !== 'undefined' && document.addEventListener) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
})(window.PW);
