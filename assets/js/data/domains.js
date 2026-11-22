/* Prompt Wizard v4.1 — 8개 직무 분야 (설계서 §1·§6.2)
   기존 jobs-office.js는 이 파일을 가리키는 한 줄만 남긴다(엔진·앱은 jobs를 읽는다).
   frameId: assets/js/data/frames-office.js의 프레임 id */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.data = PW.data || {};
  PW.data.domains = [
  {
    id: 'offc',
    cat: 'public',
    order: 1,
    name: '일반 사무·행정',
    short: '사무·행정',
    icon: '🗂️',
    desc: '문서·공문·회의·민원·기록·규정 검토',
    alias: '사무·행정·서무',
    domain: '사무·행정 문서와 기록을 근거로 완결하는',
    contextPhrase: '사무·행정',
    points: ['문서 목적·수신자·결재선의 명확성', '근거 규정·상위계획·관련 공문 번호', '기한·담당·공개구분·보존기간의 완결'],
    taskIds: ['admin', 'meeting-event', 'complaint', 'external-coop', 'council', 'records', 'legal', 'pr-comms'],
    frameId: 'offc',
    status: 'ready'
  },
  {
    id: 'mgmt',
    cat: 'public',
    order: 2,
    name: '경영지원·인사·재무',
    short: '인사·재무',
    icon: '💼',
    desc: '인사·교육·노무·급여·회계·예산·계약·자산',
    alias: '인사·총무·재무·회계',
    domain: '사람·돈·물자를 규정과 산출근거로 움직이는',
    contextPhrase: '경영지원·인사·재무',
    points: ['적용 규정과 산출근거의 명시', '합계·대사·기간 귀속의 정합성', '승인·전결 절차와 증빙 확보'],
    taskIds: ['hr', 'training', 'labor', 'payroll', 'accounting', 'budget', 'procurement', 'asset'],
    frameId: 'mgmt',
    status: 'ready'
  },
  {
    id: 'biz',
    cat: 'public',
    order: 3,
    name: '사업기획·프로젝트 관리',
    short: '기획·PM',
    icon: '📈',
    desc: '중장기 계획·신규사업·프로젝트·성과·평가·정책',
    alias: '기획·전략·성과·평가',
    domain: '무엇을 왜 하는지를 정하고 일정·성과로 닫는',
    contextPhrase: '사업기획·프로젝트 관리',
    points: ['목표와 상위계획의 정합성', '대안·타당성·재원의 비교', '성과지표와 환류의 연결'],
    taskIds: ['plan', 'newbiz', 'program', 'performance', 'evaluation', 'policy', 'sop'],
    frameId: 'biz',
    status: 'ready'
  },
  {
    id: 'it',
    cat: 'public',
    order: 4,
    name: 'IT·전산·디지털·보안',
    short: 'IT·보안',
    icon: '💻',
    desc: '시스템 운영·연계·패치·개인정보·장애·정보화 사업',
    alias: '시스템·전산·정보보안·데이터',
    domain: '정보시스템을 기획·운영하고 데이터와 보안으로 지키는',
    contextPhrase: 'IT·전산·디지털·보안',
    points: ['서비스 운영과 장애 이력·원인', '연계·용역의 책임 경계', '개인정보·보안 통제 준수'],
    taskIds: ['service-review', 'integration', 'patch-report', 'privacy', 'maintenance', 'incident', 'it-audit', 'it-project', 'data-ai'],
    frameId: 'it',
    status: 'ready'
  },
  {
    id: 'eng',
    cat: 'public',
    order: 5,
    name: '기술·엔지니어링',
    short: '기술',
    icon: '📐',
    desc: '토목·건축·전기·기계·소방·환경·교통·설계검토',
    alias: '설계·시공·기술검토·계산',
    domain: '기준·계산·도면·시험으로 물리적 결과를 보증하는',
    contextPhrase: '기술·엔지니어링',
    points: ['적용 기준·설계조건의 적합성', '계산·측정값의 재현성', '시험·검증 절차와 기록'],
    taskIds: ['eng-civil', 'eng-arch', 'eng-elec', 'eng-mech', 'eng-fire-it', 'eng-env', 'eng-trans', 'design-review', 'test-qc'],
    frameId: 'eng',
    status: 'ready'
  },
  {
    id: 'fac',
    cat: 'public',
    order: 6,
    name: '시설·설비 운영관리',
    short: '시설',
    icon: '🛠️',
    desc: '시설물 운영·정기점검·예방정비·고장 수리·업체 관리',
    alias: '시설관리·설비·정비·점검',
    domain: '시설을 고장 전에 지키고 고장 뒤에는 이력으로 남기는',
    contextPhrase: '시설·설비 운영관리',
    points: ['설비 이력과 점검 주기의 근거', '지적사항과 조치 결과', '업체 지시·이행 확인·비용'],
    taskIds: ['facility-ops', 'inspection', 'preventive', 'repair', 'contractor', 'fac-history'],
    frameId: 'fac',
    status: 'ready'
  },
  {
    id: 'field',
    cat: 'public',
    order: 7,
    name: '현장 운영·서비스',
    short: '현장',
    icon: '🧰',
    desc: '작업일지·순찰·서비스 운영·현장 민원·사고·인수인계',
    alias: '현장·운영·순찰·교대',
    domain: '현장에서 순서·시간·인원으로 일을 닫는',
    contextPhrase: '현장 운영·서비스',
    points: ['일시·장소·인원의 기록', '이상·민원의 즉시 조치', '다음 조 인계와 사진 증빙'],
    taskIds: ['work-result', 'patrol', 'service-ops', 'field-complaint', 'site-incident', 'shift', 'equipment-supply'],
    frameId: 'field',
    status: 'ready'
  },
  {
    id: 'saf',
    cat: 'public',
    order: 8,
    name: '안전·보건·환경',
    short: '안전',
    icon: '⛑️',
    desc: '위험성평가·안전점검·중대재해·보건·교육·환경·재난',
    alias: '안전·보건·환경·재난',
    domain: '위험을 찾아 없애고 법정 이행을 증명하는',
    contextPhrase: '안전·보건·환경',
    points: ['위험요인과 위험도 산정의 일관성', '감소대책과 이행 확인', '법정 의무·보고·기록'],
    taskIds: ['risk-assess', 'safety', 'serious', 'health', 'safety-edu', 'environment', 'disaster', 'anomaly-report'],
    frameId: 'saf',
    status: 'ready'
  }
];
  PW.data.jobs = PW.data.domains;
})(window.PW);
