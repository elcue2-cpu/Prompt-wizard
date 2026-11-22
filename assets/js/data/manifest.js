/* 로드 순서 상수 — index.html의 <script> 순서와 pw_check_v4.py가 대조한다. */
window.PW = window.PW || {};
(function (PW) {
  PW.manifest = [
    'assets/js/data/config.js',
    'assets/js/data/categories.js',
    'assets/js/data/jobs-office.js',
    'assets/js/data/tasks-office.js',
    'assets/js/data/outputs-office.js',
    'assets/js/data/options-office.js',
    'assets/js/data/guards.js',
    'assets/js/data/quickstart.js',
    'assets/js/engine.js',
    'assets/js/quality.js',
    'assets/js/store.js',
    'assets/js/ads.js',
    'assets/js/editor.js',
    'assets/js/app.js'
  ];
})(window.PW);
