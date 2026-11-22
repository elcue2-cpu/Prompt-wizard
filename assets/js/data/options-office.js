/* Prompt Wizard — 선택지(칩) 사전
   value는 절대 바뀌지 않는 키(문장 조립의 분기 기준), label은 화면 문구.
   문구를 다듬어도 조립 로직이 깨지지 않도록 v3의 indexOf 판정을 이 구조가 대체한다. */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.data = PW.data || {};
  PW.data.options = {

    /* ── 보고서·기안문 ── */
    doc: [
      { value: 'doc:internal', label: '내부결재·방침수립' },
      { value: 'doc:gongmun', label: '타부서·대외 협조공문' },
      { value: 'doc:audit', label: '감사·의회·외부 요구자료' },
      { value: 'doc:contract', label: '계약·발주·예산 검토' }
    ],
    goal: [
      { value: 'goal:approve', label: '신규 승인·추진 요청' },
      { value: 'goal:status', label: '현황·실적 보고' },
      { value: 'goal:defend', label: '문제 해결·예산 방어' },
      { value: 'goal:rule', label: '규정·지침 검토' }
    ],
    tone: [
      { value: 'tone:brief', label: '공공기관 개조식(□·ㅇ·-)' },
      { value: 'tone:table', label: '대안 비교표 중심' },
      { value: 'tone:prose', label: '논리 서술형(대외/제출용)' }
    ],
    kind: [
      { value: 'kind:plan', label: '추진계획' },
      { value: 'kind:result', label: '결과보고' },
      { value: 'kind:review', label: '검토보고' },
      { value: 'kind:status', label: '현황보고' },
      { value: 'kind:audit', label: '행정사무감사 답변' }
    ],
    length: [
      { value: 'length:one', label: 'A4 1장' },
      { value: 'length:two', label: 'A4 1~2장' },
      { value: 'length:three', label: 'A4 3장 이상' }
    ],
    include: [
      { value: 'include:core', label: '추진배경·현황·문제점·대안·계획' },
      { value: 'include:budget', label: '소요예산·일정' },
      { value: 'include:org', label: '조직·인력' },
      { value: 'include:impact', label: '민원·안전 영향' }
    ],
    exclude: [
      { value: 'exclude:privacy', label: '개인정보·실명' },
      { value: 'exclude:unsettled', label: '미확정 계획' },
      { value: 'exclude:secret', label: '외부 공개 금지 수치' }
    ],

    /* ── 타 부서 협조·공문 ── */
    cTarget: [
      { value: 'cTarget:dept', label: '타부서·유관기관' },
      { value: 'cTarget:vendor', label: '계약·용역사' },
      { value: 'cTarget:citizen', label: '시민·민원인' },
      { value: 'cTarget:upper', label: '상급기관' }
    ],
    cWhy: [
      { value: 'cWhy:coop', label: '업무협조 요청' },
      { value: 'cWhy:data', label: '자료 제출 요청' },
      { value: 'cWhy:reply', label: '공식 회신' },
      { value: 'cWhy:schedule', label: '일정 안내' },
      { value: 'cWhy:result', label: '조치 결과 통보' }
    ],
    cForm: [
      { value: 'cForm:cover', label: '갑지+본문' },
      { value: 'cForm:body', label: '본문만' },
      { value: 'cForm:email', label: '이메일 공문' }
    ],
    cDue: [
      { value: 'cDue:fixed', label: '기한 명시' },
      { value: 'cDue:open', label: '기한 미정' }
    ],
    cAttach: [
      { value: 'cAttach:yes', label: '붙임 있음' },
      { value: 'cAttach:none', label: '붙임 없음' }
    ],

    /* ── 이메일·메시지 ── */
    mailTo: [
      { value: 'mailTo:boss', label: '상사·임원' },
      { value: 'mailTo:peer', label: '타부서·동료' },
      { value: 'mailTo:vendor', label: '외부 거래처·용역사' }
    ],
    mailWhy: [
      { value: 'mailWhy:refuse', label: '정중한 거절' },
      { value: 'mailWhy:push', label: '일정·회신 독촉' },
      { value: 'mailWhy:request', label: '협조·자료 요청' },
      { value: 'mailWhy:apology', label: '실수 사과·수습' }
    ],
    mailTone: [
      { value: 'mailTone:firm', label: '격식 있고 단호하게' },
      { value: 'mailTone:soft', label: '부드럽고 유연하게' },
      { value: 'mailTone:short', label: '짧고 핵심만' }
    ],
    sensitive: [
      { value: 'sensitive:normal', label: '일반' },
      { value: 'sensitive:boss', label: '상사 보고' },
      { value: 'sensitive:emotion', label: '감정 이슈' },
      { value: 'sensitive:publicok', label: '외부 공개 가능' }
    ],

    /* ── 엑셀·데이터 ── */
    tool: [
      { value: 'tool:excel', label: '엑셀 수식' },
      { value: 'tool:sheets', label: '구글 스프레드시트' },
      { value: 'tool:python', label: '파이썬/자동화' },
      { value: 'tool:vba', label: 'VBA/매크로' },
      { value: 'tool:sql', label: 'SQL 쿼리' }
    ],
    xlSituation: [
      { value: 'xl:build', label: '원하는 기능 새로 짜기' },
      { value: 'xl:error', label: '오류 메시지 해결' },
      { value: 'xl:slow', label: '느린 파일·코드 개선' },
      { value: 'xl:cleanup', label: '데이터 정리·통계 내기' }
    ],
    depth: [
      { value: 'depth:beginner', label: '초보자도 복붙만 하게' },
      { value: 'depth:why', label: '원리까지 간단히' }
    ],

    /* ── 회의록·요약 ── */
    src: [
      { value: 'src:meeting', label: '회의 녹취·대화' },
      { value: 'src:longdoc', label: '긴 보고서·기사' },
      { value: 'src:thread', label: '이메일 스레드' }
    ],
    focus: [
      { value: 'focus:todo', label: '결정사항·할 일(담당/기한)' },
      { value: 'focus:key3', label: '핵심 3줄 + 리스크' },
      { value: 'focus:debate', label: '찬반·쟁점 비교' }
    ],
    len: [
      { value: 'len:half', label: '임원 보고용 반 페이지' },
      { value: 'len:detail', label: '실무자용 상세 정리' }
    ],

    /* ── 문제 해결·업무 검토 ── */
    issue: [
      { value: 'issue:cause', label: '문제 원인 분석' },
      { value: 'issue:law', label: '법령·규정 검토' },
      { value: 'issue:response', label: '대응방안 도출' },
      { value: 'issue:improve', label: '개선대책 수립' },
      { value: 'issue:process', label: '업무 프로세스 개선' }
    ],
    scope: [
      { value: 'scope:case', label: '단일 사안' },
      { value: 'scope:team', label: '부서·팀' },
      { value: 'scope:org', label: '기관 전체' }
    ],
    basisType: [
      { value: 'basis:internal', label: '내부 규정·지침' },
      { value: 'basis:law', label: '법령·조례' },
      { value: 'basis:contract', label: '계약·협약' },
      { value: 'basis:precedent', label: '선례·타 기관' }
    ],
    deliverable: [
      { value: 'deliverable:brief', label: '보고용 요약' },
      { value: 'deliverable:plan', label: '실행 계획서' },
      { value: 'deliverable:opinion', label: '검토 의견서' }
    ]
  };
})(window.PW);
