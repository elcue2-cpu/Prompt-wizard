/* Prompt Wizard — 자주 쓰는 5종 원클릭 프리셋
   각 항목은 위자드의 단계(cat·job·task·out)와 세부 조건(opt)을 모두 담는다.
   v4.1: 8분야 개편으로 job 값만 새 분야 id로 바꿨다(업무 id는 그대로).
   opt는 선택지 value를 |로 이은 문자열이다. */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.data = PW.data || {};
  PW.data.quickStart = [
    {
      id: 'quick-report',
      label: '보고서 작성',
      icon: '📄',
      desc: '결재·보고용 문서를 개조식으로',
      cat: 'public', job: 'biz', task: 'program', out: 'report',
      opt: 'doc:internal|goal:status|tone:brief'
    },
    {
      id: 'quick-official',
      label: '공문 작성',
      icon: '🏷️',
      desc: '타부서·유관기관 협조공문',
      cat: 'public', job: 'offc', task: 'admin', out: 'collab',
      opt: 'cTarget:dept|cWhy:coop|cForm:cover'
    },
    {
      id: 'quick-excel',
      label: '엑셀 자동화',
      icon: '📊',
      desc: '수식·매크로·데이터 정리',
      cat: 'public', job: 'biz', task: 'performance', out: 'excel',
      opt: 'tool:excel|xl:build|depth:beginner'
    },
    {
      id: 'quick-mail',
      label: '눈치 보이는 이메일',
      icon: '✉️',
      desc: '거절·독촉·사과 메일',
      cat: 'public', job: 'offc', task: 'complaint', out: 'mail',
      opt: 'mailTo:vendor|mailWhy:push|mailTone:soft'
    },
    {
      id: 'quick-summary',
      label: '회의록 요약',
      icon: '🗒️',
      desc: '결정사항·할 일만 뽑기',
      cat: 'public', job: 'biz', task: 'sop', out: 'summary',
      opt: 'src:meeting|focus:todo|len:half'
    }
  ];
})(window.PW);
