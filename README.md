# Prompt Wizard

공공기관·공무원 실무 프롬프트를 4단계 질문으로 조립하는 정적 웹앱입니다.
빌드 도구 없이 `index.html`을 열면 바로 동작합니다(로컬 `file://` 포함).

- 서비스: https://elcue2-cpu.github.io/Prompt-wizard/ (대문자 `P`)
- 태그: `v3-final`(v3 기준점), `v4.0`(5~7단계 포함 배포본)

## 지금 되는 것 (v4 전체)

- **상위 카테고리 5개** — `공공기관·공무원`(live) / `일반기업·회사원` · `자영업·소상공인` · `대학생·취준생` · `일상·생활·재테크`(준비 중, 예시·예정 도구만 노출)
- **4단계 위자드** — STEP 01 직무(4종) → STEP 02 세부 업무(8/8/4/3=23개) → STEP 03 결과물(6종) → STEP 04 결과물별 세부 조건(필수 + 접힌 선택 항목) + 메모 + 가드레일
- **공통 조립 엔진** — 역할·직무맥락·요청·상황·출력형식·문체·세부요구·관점·분량·유의사항·검증 11문단
- **v3 에디터 그대로** — 실시간 타이핑(15ms), 바뀐 문단 하이라이트, 커서, 직접 수정 보호(`선택이 바뀌었어요 · ↻ 자동 생성 반영`), 1클릭 복사, 챗GPT 열기(긴 프롬프트는 복사 후 이동), 후속 팁, 모바일 sticky 카드 + `전체 보기` 시트
- **공문 갑지 분기 유지** — `타 부서·대외 협조공문`만 갑지, 감사·의회·계약은 개조식
- **빠른 시작 5종** — 보고서·공문·엑셀·눈치 보이는 이메일·회의록 요약. 누르면 직무/업무/결과물/세부조건이 채워진 STEP 04로 바로 들어갑니다
- **품질 점검(AI 호출 0)** — 역할 지정·상황 설명·목적 명확성·출력 형식·제약 조건 5지표 × 20점. 부족한 항목마다 무엇을 채우면 되는지 안내
- **즐겨찾기·최근(localStorage)** — 최근은 선택값만 최대 10건(본문·메모 미저장), 즐겨찾기는 사용자가 저장한 제목·본문만. 저장소가 막히면 조용히 숨김
- **URL 프리셋** — `?cat=&job=&task=&out=&opt=`, 첫 렌더 전에 적용(이중 타이핑 없음). 데스크톱에서는 선택 상태를 주소창에 되씁니다
- **SEO 랜딩 6종** — `landing/*.html`, 각 페이지 고유 title·description·canonical·OG·FAQ JSON-LD + 위자드 CTA
- **수익화 기반** — `assets/js/data/config.js`의 `ads.enabled:false`. 승인 전에는 광고 스크립트·슬롯 요청이 0건입니다

## 파일 구조

```
index.html                       화면 골격 + SEO 메타 + script 로드 순서
privacy.html                     개인정보처리방침
sitemap.xml · robots.txt         검색엔진용 (모두 대문자 Pages 주소)
.nojekyll                        GitHub Pages 정적 서빙
landing/*.html                   SEO 랜딩 6종 (생성물)
tools/build_landing.py           랜딩·sitemap 생성기 (배포 대상 아님)
assets/css/app.css               위자드 스타일
assets/css/landing.css           랜딩 스타일
assets/img/og-default.png        공유 카드 이미지
assets/js/data/manifest.js       로드 순서 상수 (index.html과 대조 검사)
assets/js/data/config.js         실행 설정 (ads.enabled, urlSync)
assets/js/data/categories.js     상위 카테고리 5개
assets/js/data/jobs-office.js    직무 4종
assets/js/data/tasks-office.js   세부 업무 23개 (v3 키 21개 보존 + 2개 추가)
assets/js/data/outputs-office.js 결과물 6종 (질문·문장 뼈대·팁·예시)
assets/js/data/options-office.js 선택지 사전 (불변 키 + 화면 문구)
assets/js/data/guards.js         가드레일 4종
assets/js/data/quickstart.js     빠른 시작 5종 프리셋
assets/js/engine.js              문단 조립 엔진
assets/js/quality.js             품질 점검 5지표
assets/js/store.js               즐겨찾기·최근 (localStorage, 실패 시 무해 폴백)
assets/js/ads.js                 애드센스 슬롯 (enabled=false면 아무것도 안 함)
assets/js/editor.js              타이핑·직접수정·복사·챗GPT·모바일
assets/js/app.js                 4단계 위자드 UI·상태·프리셋·부팅
```

데이터는 `fetch` 대신 `.js` 전역 대입(`window.PW.data`)으로 읽습니다. ES module·JSON fetch는 `file://`에서 막히기 때문입니다.
새 카테고리는 데이터 파일 1개 + `index.html` script 1줄 + `manifest.js` 1줄로 추가하고, UI·엔진·에디터는 건드리지 않습니다.
랜딩 문구를 고칠 때는 `tools/build_landing.py`의 `PAGES` 표를 고치고 `python3 tools/build_landing.py`를 다시 돌립니다.

## 검증

```
bash work/pw_verify_v4.sh
```

- `work/pw_check_v4.py` — 구조·로드 순서·HTML/CSS/JS 문법·DOM 참조·데이터(21키 보존, need 해시 일치, 8/8/4/3)·결과물 6종·갑지 분기·카테고리 5개·에디터 불변식·문장 보존·빠른 시작/품질/저장 모듈·랜딩 6종·sitemap/robots·canonical 대문자·광고 꺼짐·민감정보 0건
- `work/run_pw_sim_v4.py` + `work/pw_sim_v4.js` — quickjs 런타임 352개 단언(4직무 × 6결과물 24조합, 공문 갑지/본문만, 타이핑·직접수정 보호, 복사·챗GPT, 모바일, v3 문장 패리티 120문단, 빠른 시작 5종, 품질 5지표 경계, 즐겨찾기/최근·저장소 차단, URL 프리셋) + URL 프리셋 부팅 13개 단언
- `work/pw_v3_snapshot.html` · 태그 `v3-final` — v3 배포본(md5 `70c3f100…`) 기준점

## 배포

`./deploy.sh` — v4 검증 게이트 통과 → main 푸시 → `v4.0` 태그 → Pages 응답·새 파일 반영 확인.
게이트를 끄고 배포하는 경로는 없습니다(`PW_VERIFY`로 경로만 바꿀 수 있음).

## 아직 사용자 확인이 필요한 것

- Google Search Console·애드센스 계정 등록(사용자 계정 작업)
- 아이폰 사파리 실기기 확인
