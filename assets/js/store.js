/* =========================================================
   Prompt Wizard — 즐겨찾기 · 최근 프롬프트 (localStorage 전용)
   · 최근 기록: 선택값만 저장한다(프롬프트 본문·메모는 저장하지 않는다).
   · 즐겨찾기: 사용자가 「저장」을 누른 경우에만 제목·본문까지 저장하고, 항목별 삭제를 둔다.
   · 저장소가 막힌 환경(사생활 보호 모드·쿼터 초과)에서는 오류 없이 조용히 비운다.
   · 서버로 보내는 값은 하나도 없다.
   ========================================================= */
window.PW = window.PW || {};
(function (PW) {
  'use strict';

  var KEY_RECENT = 'pw.v4.recent';
  var KEY_FAV = 'pw.v4.fav';
  var KEY_SCHEMA = 'pw.v4.schema';
  var SCHEMA = 2;
  var RECENT_MAX = 10;
  var FAV_MAX = 50;

  function backend() {
    try {
      var ls = window.localStorage;
      if (!ls) return null;
      return ls;
    } catch (e) {
      return null;
    }
  }

  function available() {
    var ls = backend();
    if (!ls) return false;
    try {
      var probe = 'pw.v4.probe';
      ls.setItem(probe, '1');
      ls.removeItem(probe);
      return true;
    } catch (e) {
      return false;
    }
  }

  function read(key) {
    var ls = backend();
    if (!ls) return [];
    try {
      var raw = ls.getItem(key);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Object.prototype.toString.call(arr) === '[object Array]' ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function write(key, list) {
    var ls = backend();
    if (!ls) return false;
    try {
      ls.setItem(key, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  function sigOf(sel) {
    sel = sel || {};
    return [sel.cat || '', sel.job || '', sel.task || '', sel.out || '', JSON.stringify(sel.answers || {})].join('|');
  }

  /* ---- 최근 ---- */

  function recent() {
    return read(KEY_RECENT);
  }

  function pushRecent(sel) {
    if (!sel || !sel.out) return recent();
    if (!available()) return recent();
    var list = recent();
    var sig = sigOf(sel);
    list = list.filter(function (r) { return r && r.sig !== sig; });
    list.unshift({
      sig: sig,
      cat: sel.cat || '',
      job: sel.job || '',
      task: sel.task || '',
      out: sel.out || '',
      answers: sel.answers || {},
      ts: Date.now()
    });
    if (list.length > RECENT_MAX) list = list.slice(0, RECENT_MAX);
    write(KEY_RECENT, list);
    return list;
  }

  function clearRecent() {
    write(KEY_RECENT, []);
    return [];
  }

  /* ---- 즐겨찾기 ---- */

  function favorites() {
    return read(KEY_FAV);
  }

  function addFavorite(item) {
    item = item || {};
    if (!item.body) return null;
    if (!available()) return null;
    var list = favorites();
    var id = 'f' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
    var rec = {
      id: id,
      title: String(item.title || '저장한 프롬프트').slice(0, 60),
      body: String(item.body),
      sel: item.sel || null,
      ts: Date.now()
    };
    list.unshift(rec);
    if (list.length > FAV_MAX) list = list.slice(0, FAV_MAX);
    write(KEY_FAV, list);
    return rec;
  }

  function removeFavorite(id) {
    var list = favorites().filter(function (f) { return f && f.id !== id; });
    write(KEY_FAV, list);
    return list;
  }

  function clearFavorites() {
    write(KEY_FAV, []);
    return [];
  }

  /* ---- schema 2 마이그레이션 도우미 (별칭 치환은 app이 한다) ---- */

  function schema() {
    var ls = backend();
    if (!ls) return 0;
    var raw = null;
    try { raw = ls.getItem(KEY_SCHEMA); } catch (e) { return 0; }
    var n = parseInt(raw, 10);
    return isNaN(n) ? 0 : n;
  }

  function setSchema(n) {
    var ls = backend();
    if (!ls) return false;
    try { ls.setItem(KEY_SCHEMA, String(n)); return true; } catch (e) { return false; }
  }

  function replaceRecent(list) {
    return write(KEY_RECENT, (list || []).slice(0, RECENT_MAX));
  }

  function replaceFavorites(list) {
    return write(KEY_FAV, (list || []).slice(0, FAV_MAX));
  }

  function favoriteById(id) {
    var list = favorites();
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
    return null;
  }

  PW.store = {
    available: available,
    recent: recent,
    pushRecent: pushRecent,
    clearRecent: clearRecent,
    schema: schema,
    setSchema: setSchema,
    replaceRecent: replaceRecent,
    replaceFavorites: replaceFavorites,
    favorites: favorites,
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
    clearFavorites: clearFavorites,
    favoriteById: favoriteById,
    sigOf: sigOf,
    keys: { recent: KEY_RECENT, fav: KEY_FAV, schema: KEY_SCHEMA },
    limits: { recent: RECENT_MAX, fav: FAV_MAX, schema: SCHEMA }
  };
})(window.PW);
