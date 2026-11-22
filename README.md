# Prompt Wizard

공공기관·공무원 실무 프롬프트를 4단계 질문으로 조립하는 정적 웹앱입니다.
빌드 도구 없이 `index.html`을 열면 바로 동작합니다(로컬 `file://` 포함).

## 지금 되는 것 (v4 2~4단계 완료분)

- **상위 카테고리 5개** — `공공기관·공무원`(live) / `일반기업·회사원` · `자영업·소상공인` · `대학생·취준생` · `일상·생활·재테크`(준비 중, 예시·예정 도구만 노출)
- **4단계 위자드** — STEP 01 직무(4종) → STEP 02 세부 업무(8/8/4/3=23개) → STEP 03 결과물(6종) → STEP 04 결과물별 세부 조건(필수 + 접힌 선택 항목) + 메모 + 가드레일
- **공통 조립 엔진** — 역할·직무맥락·요청·상황·출력형식·문체·세부요구·관점·분량·유의사항·검증 11문단
- **v3 에디터 그대로** — 실시간 타이핑(15ms), 바뀐 문단 하이라이트, 커서, 직접 수정 보호(`선택이 바뀌었어요 · ↻ 자동 생성 반영`), 1클릭 복사, 챗GPT 열기(긴 프롬프트는 복사 후 이동), 후속 팁, 모바일 sticky 카드 + `전체 보기` 시트
- **공문 갑지 분기 유지** — `타 부서·대외 협조공문`만 갑지, 감사·의회·계약은 개조식. 협조공문 결과물은 `갑지+본문 / 본문만 / 이메일 공문`으로 분기하며 갑지 문장은 엔진 상수 하나를 공유합니다.

## 파일 구조

```
index.html                     화면 골격 + script 로드 순서
assets/css/app.css             전체 스타일 (v3 CSS + v4 내비·레일·카드)
assets/js/data/manifest.js     로드 순서 상수 (index.html과 대조 검사)
assets/js/data/categories.js   상위 카테고리 5개
assets/js/data/jobs-office.js  직무 4종
assets/js/data/tasks-office.js 세부 업무 23개 (v3 키 21개 보존 + 2개 추가)
assets/js/data/outputs-office.js 결과물 6종 (질문·문장 뼈대·팁·예시)
assets/js/data/options-office.js 선택지 사전 (불변 키 + 화면 문구)
assets/js/data/guards.js       가드레일 4종
assets/js/engine.js            문단 조립 엔진
assets/js/editor.js            타이핑·직접수정·복사·챗GPT·모바일
assets/js/app.js               4단계 위자드 UI·상태·부팅
```

데이터는 `fetch` 대신 `.js` 전역 대입(`window.PW.data`)으로 읽습니다. ES module·JSON fetch는 `file://`에서 막히기 때문입니다.
새 카테고리는 데이터 파일 1개 + `index.html` script 1줄 + `manifest.js` 1줄로 추가하고, UI·엔진·에디터는 건드리지 않습니다.

## 검증

```
bash work/pw_verify_v4.sh
```

- `work/pw_check_v4.py` — 구조·로드 순서·HTML/CSS/JS 문법·DOM 참조·데이터(21키 보존, need 해시 일치, 8/8/4/3)·결과물 6종·갑지 분기·카테고리 5개·에디터 불변식·문장 보존·민감정보 0건
- `work/run_pw_sim_v4.py` + `work/pw_sim_v4.js` — quickjs 런타임 234개 단언 (4직무 × 6결과물 24조합, 공문 갑지/본문만, 타이핑·직접수정 보호, 복사·챗GPT, 모바일, v3 문장 패리티 120문단)
- `work/pw_v3_snapshot.html` · 태그 `v3-final` — v3 배포본(md5 `70c3f100…`) 기준점
- `work/run_pw_sim_split.py` — 2단계 파일 분리 시점의 v3 회귀 222개 단언 실행기

## 아직 안 한 것 (다음 단계)

- 5단계: 빠른 시작 5종, 품질 점검(AI 호출 0), 즐겨찾기·최근(localStorage), URL 프리셋
- 6단계: SEO 랜딩 6개, sitemap·robots·canonical·OG, 애드센스 슬롯(꺼진 상태), 개인정보처리방침
- 7단계: 실기기 확인·GitHub Pages 배포·`v4.0` 태그

## 배포

`./deploy.sh` (GitHub Pages: https://elcue2-cpu.github.io/Prompt-wizard/ — 대문자 P)
