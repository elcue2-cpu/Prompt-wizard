/* Prompt Wizard — 공공기관·공무원 직무 4종
   name     : STEP01 카드 표시명 (성흥 님 확정 — 구 운영팀/현장관리직/시스템·IT관리/현장직)
   alias    : v3 표기 (검색·호환용)
   domain   : 역할 문장에 들어가는 v3 문장 그대로 (프롬프트 회귀 기준)
   contextPhrase: STEP04 맥락 문장("저는 ○○ 직무에서 …")에 들어가는 표현
   points   : 직무 공통 판단 기준 3개 (v3 그대로) */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.data = PW.data || {};
  PW.data.jobs = [
    {
      id: 'ops', cat: 'public', order: 1,
      name: '사무·행정직',
      alias: '기획·운영·행정',
      icon: '🗂️',
      desc: '기획·예산·서무·의회·주요사업·성과·민원',
      domain: '기획·예산·성과·민원을 아우르는 운영',
      contextPhrase: '기획·운영·행정',
      points: ['예산·규정 근거와 상위계획 정합성', '부서 간 역할·일정 조율', '계획 대비 성과지표(BSC)와 환류'],
      taskIds: ['plan', 'budget', 'admin', 'council', 'program', 'bsc', 'operation', 'complaint']
    },
    {
      id: 'it', cat: 'public', order: 2,
      name: 'IT·전산·보안직',
      alias: '시스템·IT·보안',
      icon: '💻',
      desc: '시스템 운영·개인정보·용역·장애 대응·IT 감사',
      domain: '시스템·IT 보안',
      contextPhrase: '시스템·IT 보안',
      points: ['서비스 운영과 장애 이력·원인', '외부 연계·용역 계약 범위와 책임 경계', '개인정보·보안 규정 준수 여부'],
      taskIds: ['service-review', 'integration', 'patch-report', 'privacy', 'maintenance', 'procurement', 'incident', 'it-audit']
    },
    {
      id: 'site', cat: 'public', order: 3,
      name: '시설·기술·안전직',
      alias: '현장관리·안전감독',
      icon: '🛠️',
      desc: '시설·전기·소방·기계·안전점검·유지보수·공정관리',
      domain: '시설·장비 점검과 협력사 안전관리',
      contextPhrase: '시설·기술·안전',
      points: ['시설·장비 점검 결과와 위험 요인', '협력사·현장인력 지시와 이행 확인', '안전·보건 조치와 민원 수습'],
      taskIds: ['facility-check', 'contractor', 'safety', 'field-complaint']
    },
    {
      id: 'field', cat: 'public', order: 4,
      name: '현장 실무직',
      alias: '현장 실무',
      icon: '🧰',
      desc: '일일 작업·점검일지, 아차사고·안전보고, 현장 민원·교대 인수인계',
      domain: '현장 작업',
      contextPhrase: '현장 실무',
      points: ['현장 작업 결과와 소요 시간·수량', '비품·수선 요청의 필요성과 긴급도', '특이사항·안전 이상 보고'],
      taskIds: ['work-result', 'supply-request', 'anomaly-report']
    }
  ];
})(window.PW);
