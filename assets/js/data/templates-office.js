/* Prompt Wizard v4.1 — 업무별 특화 템플릿 카드 216장 (고유 정의 164종)
   · templates: 공유(S##)·기술 공통(G#)·분야 고유(tpl:업무:번호) 정의. 한 번만 정의하고 여러 업무가 참조한다.
   · taskTemplates: 업무별 카드 순서. 카드는 정의 id(tpl)와 표시명(name)만 갖는다.
   · preset의 키·값은 outputs-office.js의 asks·options 값과 정확히 일치한다(게이트 검사).
   · 금지어(기관명·서비스명·인명) 0건. */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.data = PW.data || {};
  PW.data.templates = [
  {
    id: 'tpl:admin:1',
    name: '기안문(일반·간이)',
    base: 'report',
    desc: '「기안문(일반·간이)」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '서무 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「기안문(일반·간이)」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'admin'
  },
  {
    id: 'tpl:admin:2',
    name: '접수·발송 대장',
    base: 'form',
    desc: '「접수·발송 대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '서무 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「접수·발송 대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'admin'
  },
  {
    id: 'tpl:admin:3',
    name: '공문 시행·회신',
    base: 'collab',
    desc: '「공문 시행·회신」 수신처·요청·기한·붙임까지',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:reply',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '서무 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「공문 시행·회신」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'admin'
  },
  {
    id: 'S01',
    name: '업무·교대 인수인계서',
    base: 'form',
    desc: '「업무·교대 인수인계서」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:confirm',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '서무 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「업무·교대 인수인계서」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: 'S01',
    owner: null
  },
  {
    id: 'tpl:meeting-event:1',
    name: '회의 소집·안건 통지',
    base: 'mail',
    desc: '「회의 소집·안건 통지」 대상·사유·조치·기한까지',
    preset: {
      mailTo: 'mailTo:peer',
      mailWhy: 'mailWhy:request',
      mailTone: 'mailTone:soft'
    },
    extraAsks: [
      {
        key: 'xExpect',
        label: '상대의 다음 행동은?',
        opt: 'xExpect'
      }
    ],
    memoHint: '회의 — 받는 사람과 관계·요청 배경·원하는 답·기한',
    verify: '「회의 소집·안건 통지」 제출 전에 다음을 확인해 주세요: ① 요청·기한이 첫 화면 ② 상대의 다음 행동이 분명 ③ 감정 표현 없음',
    shared: null,
    owner: 'meeting-event'
  },
  {
    id: 'S06',
    name: '회의록·결정사항',
    base: 'summary',
    desc: '「회의록·결정사항」 결정사항·할 일 정리까지',
    preset: {
      src: 'src:meeting',
      focus: 'focus:todo',
      len: 'len:half'
    },
    extraAsks: [
      {
        key: 'xFmt',
        label: '정리 형식은?',
        opt: 'xFmt'
      }
    ],
    memoHint: '회의 — 원문 범위·참석자·보고 대상·뽑아야 할 것',
    verify: '「회의록·결정사항」 제출 전에 다음을 확인해 주세요: ① 원문에 없는 내용 없음 ② 담당·기한 누락 없음 ③ 결정·보류 구분',
    shared: 'S06',
    owner: null
  },
  {
    id: 'tpl:meeting-event:3',
    name: '행사 운영계획·정산',
    base: 'report',
    desc: '「행사 운영계획·정산」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '회의 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「행사 운영계획·정산」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'meeting-event'
  },
  {
    id: 'S02',
    name: '민원·이용자 회신문',
    base: 'collab',
    desc: '「민원·이용자 회신문」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:citizen',
      cWhy: 'cWhy:reply',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '민원 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「민원·이용자 회신문」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: 'S02',
    owner: null
  },
  {
    id: 'tpl:complaint:2',
    name: '처리 경과·재발방지',
    base: 'report',
    desc: '「처리 경과·재발방지」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '민원 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「처리 경과·재발방지」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'complaint'
  },
  {
    id: 'tpl:complaint:3',
    name: '이송·보완 요구',
    base: 'collab',
    desc: '「이송·보완 요구」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '민원 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「이송·보완 요구」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'complaint'
  },
  {
    id: 'tpl:complaint:4',
    name: '응대 스크립트·FAQ',
    base: 'summary',
    desc: '「응대 스크립트·FAQ」 예상 질문·응대 문구까지',
    preset: {
      src: 'src:longdoc',
      focus: 'focus:key3',
      len: 'len:half'
    },
    extraAsks: [
      {
        key: 'xFmt',
        label: '정리 형식은?',
        opt: 'xFmt'
      }
    ],
    memoHint: '민원 — 원문 범위·참석자·보고 대상·뽑아야 할 것',
    verify: '「응대 스크립트·FAQ」 제출 전에 다음을 확인해 주세요: ① 원문에 없는 내용 없음 ② 담당·기한 누락 없음 ③ 결정·보류 구분',
    shared: null,
    owner: 'complaint'
  },
  {
    id: 'tpl:external-coop:1',
    name: '협약·MOU 검토',
    base: 'report',
    desc: '「협약·MOU 검토」 기준·쟁점·판단 근거까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:review'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '대외협력 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「협약·MOU 검토」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'external-coop'
  },
  {
    id: 'tpl:external-coop:2',
    name: '협조 요청 공문',
    base: 'collab',
    desc: '「협조 요청 공문」 수신처·요청·기한·붙임까지',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '대외협력 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「협조 요청 공문」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'external-coop'
  },
  {
    id: 'tpl:external-coop:3',
    name: '유관기관 협의 결과 보고',
    base: 'report',
    desc: '「유관기관 협의 결과 보고」 실시 결과·지적·조치까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:result'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '대외협력 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「유관기관 협의 결과 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'external-coop'
  },
  {
    id: 'tpl:council:1',
    name: '요구자료 답변서',
    base: 'report',
    desc: '「요구자료 답변서」 사실·수치·출처까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '감사대응 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「요구자료 답변서」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'council'
  },
  {
    id: 'S03',
    name: '감사·의회 지적 답변·조치계획',
    base: 'report',
    desc: '「감사·의회 지적 답변·조치계획」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:audit',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '감사대응 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「감사·의회 지적 답변·조치계획」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'S03',
    owner: null
  },
  {
    id: 'tpl:council:3',
    name: '현안 설명·예상 질의',
    base: 'summary',
    desc: '「현안 설명·예상 질의」 결정사항·할 일 정리까지',
    preset: {
      src: 'src:meeting',
      focus: 'focus:key3',
      len: 'len:half'
    },
    extraAsks: [
      {
        key: 'xFmt',
        label: '정리 형식은?',
        opt: 'xFmt'
      }
    ],
    memoHint: '감사대응 — 원문 범위·참석자·보고 대상·뽑아야 할 것',
    verify: '「현안 설명·예상 질의」 제출 전에 다음을 확인해 주세요: ① 원문에 없는 내용 없음 ② 담당·기한 누락 없음 ③ 결정·보류 구분',
    shared: null,
    owner: 'council'
  },
  {
    id: 'tpl:council:4',
    name: '제출 목록·대응표',
    base: 'form',
    desc: '「제출 목록·대응표」 항목·수량·보관 위치까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '감사대응 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「제출 목록·대응표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'council'
  },
  {
    id: 'tpl:records:1',
    name: '이관·폐기 목록',
    base: 'form',
    desc: '「이관·폐기 목록」 항목·수량·보관 위치까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '기록물 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「이관·폐기 목록」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'records'
  },
  {
    id: 'tpl:records:2',
    name: '정보공개 처리·부분공개 검토',
    base: 'report',
    desc: '「정보공개 처리·부분공개 검토」 기준·쟁점·판단 근거까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:review'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '기록물 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「정보공개 처리·부분공개 검토」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'records'
  },
  {
    id: 'tpl:records:3',
    name: '기록물 관리 점검표',
    base: 'form',
    desc: '「기록물 관리 점검표」 확인 항목·판정·조치란까지 표로',
    preset: {
      formUse: 'form:log',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '기록물 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「기록물 관리 점검표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'records'
  },
  {
    id: 'S19',
    name: '규정 검토 의견서',
    base: 'review',
    desc: '「규정 검토 의견서」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:law',
      scope: 'scope:case',
      basisType: 'basis:law'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '법령검토 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「규정 검토 의견서」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: 'S19',
    owner: null
  },
  {
    id: 'tpl:legal:2',
    name: '신구조문 대비표',
    base: 'form',
    desc: '「신구조문 대비표」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '법령검토 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「신구조문 대비표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'legal'
  },
  {
    id: 'tpl:legal:3',
    name: '위반·제재 검토 메모',
    base: 'report',
    desc: '「위반·제재 검토 메모」 기준·쟁점·판단 근거까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:review'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '법령검토 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「위반·제재 검토 메모」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'legal'
  },
  {
    id: 'S18',
    name: '보도·해명자료',
    base: 'report',
    desc: '「보도·해명자료」 사실·수치·출처까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '홍보 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「보도·해명자료」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'S18',
    owner: null
  },
  {
    id: 'S17',
    name: '안내문·공지',
    base: 'mail',
    desc: '「안내문·공지」 문구·발송 시점·후속 답변까지',
    preset: {
      mailTo: 'mailTo:peer',
      mailWhy: 'mailWhy:request',
      mailTone: 'mailTone:soft'
    },
    extraAsks: [
      {
        key: 'xExpect',
        label: '상대의 다음 행동은?',
        opt: 'xExpect'
      }
    ],
    memoHint: '홍보 — 받는 사람과 관계·요청 배경·원하는 답·기한',
    verify: '「안내문·공지」 제출 전에 다음을 확인해 주세요: ① 요청·기한이 첫 화면 ② 상대의 다음 행동이 분명 ③ 감정 표현 없음',
    shared: 'S17',
    owner: null
  },
  {
    id: 'tpl:pr-comms:3',
    name: '홍보 계획·성과',
    base: 'report',
    desc: '「홍보 계획·성과」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '홍보 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「홍보 계획·성과」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'pr-comms'
  },
  {
    id: 'tpl:hr:1',
    name: '채용계획·공고문',
    base: 'report',
    desc: '「채용계획·공고문」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '인사 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「채용계획·공고문」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'hr'
  },
  {
    id: 'tpl:hr:2',
    name: '심사·면접 평가표',
    base: 'form',
    desc: '「심사·면접 평가표」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '인사 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「심사·면접 평가표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'hr'
  },
  {
    id: 'tpl:hr:3',
    name: '임용·발령 문서',
    base: 'report',
    desc: '「임용·발령 문서」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '인사 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「임용·발령 문서」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'hr'
  },
  {
    id: 'tpl:training:1',
    name: '교육계획·과정안',
    base: 'report',
    desc: '「교육계획·과정안」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '교육 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「교육계획·과정안」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'training'
  },
  {
    id: 'tpl:training:2',
    name: '교육결과·전이 평가',
    base: 'report',
    desc: '「교육결과·전이 평가」 실시 결과·지적·조치까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:result'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '교육 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「교육결과·전이 평가」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'training'
  },
  {
    id: 'tpl:training:3',
    name: '역량진단·수요조사',
    base: 'form',
    desc: '「역량진단·수요조사」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '교육 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「역량진단·수요조사」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'training'
  },
  {
    id: 'tpl:labor:1',
    name: '근로계약·복무 검토',
    base: 'review',
    desc: '「근로계약·복무 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '노무 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「근로계약·복무 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'labor'
  },
  {
    id: 'tpl:labor:2',
    name: '징계·인사위 자료',
    base: 'report',
    desc: '「징계·인사위 자료」 사실·수치·출처까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '노무 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「징계·인사위 자료」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'labor'
  },
  {
    id: 'tpl:labor:3',
    name: '노사협의 안건·합의문',
    base: 'report',
    desc: '「노사협의 안건·합의문」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '노무 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「노사협의 안건·합의문」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'labor'
  },
  {
    id: 'tpl:payroll:1',
    name: '급여·수당 산출표',
    base: 'excel',
    desc: '「급여·수당 산출표」 산식·단가·집계 기준까지',
    preset: {
      tool: 'tool:excel',
      xlSituation: 'xl:build',
      depth: 'depth:beginner'
    },
    extraAsks: [
      {
        key: 'xBasis',
        label: '계산·집계 기준은?',
        opt: 'xBasis'
      }
    ],
    memoHint: '급여 — 시트 구조·행/열 의미·원하는 계산·원본 예시 5행',
    verify: '「급여·수당 산출표」 제출 전에 다음을 확인해 주세요: ① 수식·코드 실행 가능 ② 적용 시트·범위 명시 ③ 결과 확인 방법 포함',
    shared: null,
    owner: 'payroll'
  },
  {
    id: 'tpl:payroll:2',
    name: '퇴직·정산 검토',
    base: 'report',
    desc: '「퇴직·정산 검토」 기준·쟁점·판단 근거까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:review'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '급여 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「퇴직·정산 검토」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'payroll'
  },
  {
    id: 'tpl:payroll:3',
    name: '4대보험·원천세 점검표',
    base: 'form',
    desc: '「4대보험·원천세 점검표」 확인 항목·판정·조치란까지 표로',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '급여 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「4대보험·원천세 점검표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'payroll'
  },
  {
    id: 'tpl:accounting:1',
    name: '전표·분개 검토',
    base: 'review',
    desc: '「전표·분개 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '회계 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「전표·분개 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'accounting'
  },
  {
    id: 'tpl:accounting:2',
    name: '월·분기 결산 보고',
    base: 'report',
    desc: '「월·분기 결산 보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '회계 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「월·분기 결산 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'accounting'
  },
  {
    id: 'tpl:accounting:3',
    name: '재무제표·주석 초안',
    base: 'report',
    desc: '「재무제표·주석 초안」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '회계 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「재무제표·주석 초안」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'accounting'
  },
  {
    id: 'tpl:accounting:4',
    name: '내부통제·감사 대응',
    base: 'report',
    desc: '「내부통제·감사 대응」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:audit',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '회계 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「내부통제·감사 대응」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'accounting'
  },
  {
    id: 'S20',
    name: '예산 요구·집행계획',
    base: 'report',
    desc: '「예산 요구·집행계획」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:contract',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '예산 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「예산 요구·집행계획」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'S20',
    owner: null
  },
  {
    id: 'S08',
    name: '지출품의·집행 품의',
    base: 'report',
    desc: '「지출품의·집행 품의」 사유·산출근거·예산 과목까지',
    preset: {
      doc: 'doc:contract',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '예산 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「지출품의·집행 품의」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'S08',
    owner: null
  },
  {
    id: 'tpl:budget:3',
    name: '전용·이용·변경 요구',
    base: 'report',
    desc: '「전용·이용·변경 요구」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '예산 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「전용·이용·변경 요구」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'budget'
  },
  {
    id: 'S21',
    name: '목표·실적 관리표',
    base: 'excel',
    desc: '「목표·실적 관리표」 계산식·집계 기준까지',
    preset: {
      tool: 'tool:excel',
      xlSituation: 'xl:cleanup',
      depth: 'depth:beginner'
    },
    extraAsks: [
      {
        key: 'xBasis',
        label: '계산·집계 기준은?',
        opt: 'xBasis'
      }
    ],
    memoHint: '예산 — 시트 구조·행/열 의미·원하는 계산·원본 예시 5행',
    verify: '「목표·실적 관리표」 제출 전에 다음을 확인해 주세요: ① 수식·코드 실행 가능 ② 적용 시트·범위 명시 ③ 결과 확인 방법 포함',
    shared: 'S21',
    owner: null
  },
  {
    id: 'tpl:procurement:1',
    name: '과업지시서·RFP',
    base: 'collab',
    desc: '「과업지시서·RFP」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:vendor',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '계약 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「과업지시서·RFP」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'procurement'
  },
  {
    id: 'S09',
    name: '견적·대안 비교표',
    base: 'excel',
    desc: '「견적·대안 비교표」 항목·금액·조건 비교표까지',
    preset: {
      tool: 'tool:excel',
      xlSituation: 'xl:build',
      depth: 'depth:beginner'
    },
    extraAsks: [
      {
        key: 'xBasis',
        label: '계산·집계 기준은?',
        opt: 'xBasis'
      }
    ],
    memoHint: '계약 — 시트 구조·행/열 의미·원하는 계산·원본 예시 5행',
    verify: '「견적·대안 비교표」 제출 전에 다음을 확인해 주세요: ① 수식·코드 실행 가능 ② 적용 시트·범위 명시 ③ 결과 확인 방법 포함',
    shared: 'S09',
    owner: null
  },
  {
    id: 'tpl:procurement:3',
    name: '계약심사·일상감사 체크',
    base: 'review',
    desc: '「계약심사·일상감사 체크」 확인 항목·판정란까지 표로',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '계약 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「계약심사·일상감사 체크」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'procurement'
  },
  {
    id: 'tpl:procurement:4',
    name: '검수·대금·지체상금',
    base: 'collab',
    desc: '「검수·대금·지체상금」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '계약 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「검수·대금·지체상금」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'procurement'
  },
  {
    id: 'tpl:asset:1',
    name: '물품 관리대장·재물조사',
    base: 'form',
    desc: '「물품 관리대장·재물조사」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '자산 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「물품 관리대장·재물조사」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'asset'
  },
  {
    id: 'tpl:asset:2',
    name: '불용·처분 검토',
    base: 'report',
    desc: '「불용·처분 검토」 기준·쟁점·판단 근거까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:defend',
      tone: 'tone:brief',
      kind: 'kind:review'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '자산 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「불용·처분 검토」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'asset'
  },
  {
    id: 'tpl:plan:1',
    name: '추진계획·시행계획',
    base: 'report',
    desc: '「추진계획·시행계획」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '기획 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「추진계획·시행계획」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'plan'
  },
  {
    id: 'tpl:plan:3',
    name: '협조·의견수렴 공문',
    base: 'collab',
    desc: '「협조·의견수렴 공문」 수신처·요청·기한·붙임까지',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '기획 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「협조·의견수렴 공문」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'plan'
  },
  {
    id: 'tpl:plan:4',
    name: '정합성 검토 메모',
    base: 'review',
    desc: '「정합성 검토 메모」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '기획 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「정합성 검토 메모」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'plan'
  },
  {
    id: 'tpl:newbiz:1',
    name: '사업 타당성 검토',
    base: 'review',
    desc: '「사업 타당성 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '신규사업 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「사업 타당성 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'newbiz'
  },
  {
    id: 'tpl:newbiz:2',
    name: '수요·시장 분석',
    base: 'excel',
    desc: '「수요·시장 분석」 계산식·집계 기준까지',
    preset: {
      tool: 'tool:excel',
      xlSituation: 'xl:cleanup',
      depth: 'depth:beginner'
    },
    extraAsks: [
      {
        key: 'xBasis',
        label: '계산·집계 기준은?',
        opt: 'xBasis'
      }
    ],
    memoHint: '신규사업 — 시트 구조·행/열 의미·원하는 계산·원본 예시 5행',
    verify: '「수요·시장 분석」 제출 전에 다음을 확인해 주세요: ① 수식·코드 실행 가능 ② 적용 시트·범위 명시 ③ 결과 확인 방법 포함',
    shared: null,
    owner: 'newbiz'
  },
  {
    id: 'S07',
    name: '주간·월간 업무보고',
    base: 'report',
    desc: '「주간·월간 업무보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '프로젝트 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「주간·월간 업무보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'S07',
    owner: null
  },
  {
    id: 'tpl:program:3',
    name: '성과 분석·환류',
    base: 'review',
    desc: '「성과 분석·환류」 판단 기준·대안 비교까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '프로젝트 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「성과 분석·환류」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'program'
  },
  {
    id: 'tpl:program:4',
    name: '이해관계자·협약 문서',
    base: 'collab',
    desc: '「이해관계자·협약 문서」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '프로젝트 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「이해관계자·협약 문서」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'program'
  },
  {
    id: 'tpl:performance:1',
    name: '지표 정의서',
    base: 'report',
    desc: '「지표 정의서」 지표 정의·산식·측정 주기까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '성과 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「지표 정의서」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'performance'
  },
  {
    id: 'tpl:performance:3',
    name: '성과보고서',
    base: 'report',
    desc: '「성과보고서」 결론·근거·조치까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '성과 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「성과보고서」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'performance'
  },
  {
    id: 'tpl:performance:4',
    name: '지표 개선안',
    base: 'review',
    desc: '「지표 개선안」 판단 기준·대안 비교까지',
    preset: {
      issue: 'issue:improve',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '성과 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「지표 개선안」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'performance'
  },
  {
    id: 'tpl:evaluation:1',
    name: '경영평가 대응 계획',
    base: 'report',
    desc: '「경영평가 대응 계획」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '경영평가 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「경영평가 대응 계획」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'evaluation'
  },
  {
    id: 'tpl:evaluation:2',
    name: '지표별 증빙 목록',
    base: 'form',
    desc: '「지표별 증빙 목록」 항목·수량·보관 위치까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '경영평가 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「지표별 증빙 목록」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'evaluation'
  },
  {
    id: 'tpl:evaluation:3',
    name: '서술평가 초안',
    base: 'report',
    desc: '「서술평가 초안」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '경영평가 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「서술평가 초안」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'evaluation'
  },
  {
    id: 'tpl:policy:2',
    name: '규정 개정안·신구조문대비표',
    base: 'form',
    desc: '「규정 개정안·신구조문대비표」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '제도개선 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「규정 개정안·신구조문대비표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'policy'
  },
  {
    id: 'tpl:policy:3',
    name: '영향분석·의견수렴',
    base: 'collab',
    desc: '「영향분석·의견수렴」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '제도개선 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「영향분석·의견수렴」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'policy'
  },
  {
    id: 'tpl:sop:1',
    name: '운영계획·업무분장',
    base: 'report',
    desc: '「운영계획·업무분장」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '운영절차 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「운영계획·업무분장」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'sop'
  },
  {
    id: 'tpl:sop:2',
    name: '절차서(SOP)·매뉴얼',
    base: 'report',
    desc: '「절차서(SOP)·매뉴얼」 절차·담당·비상 시 조치까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '운영절차 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「절차서(SOP)·매뉴얼」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'sop'
  },
  {
    id: 'S16',
    name: '비상대응·훈련 계획·결과',
    base: 'report',
    desc: '「비상대응·훈련 계획·결과」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '운영절차 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「비상대응·훈련 계획·결과」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'S16',
    owner: null
  },
  {
    id: 'tpl:service-review:1',
    name: '도입 검토서(대안 비교)',
    base: 'review',
    desc: '「도입 검토서(대안 비교)」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '시스템도입 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「도입 검토서(대안 비교)」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'service-review'
  },
  {
    id: 'tpl:service-review:2',
    name: '요구사항 정의서',
    base: 'report',
    desc: '「요구사항 정의서」 지표 정의·산식·측정 주기까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '시스템도입 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「요구사항 정의서」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'service-review'
  },
  {
    id: 'tpl:service-review:3',
    name: '타당성·예산 검토',
    base: 'review',
    desc: '「타당성·예산 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '시스템도입 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「타당성·예산 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'service-review'
  },
  {
    id: 'tpl:service-review:4',
    name: '시범적용·성과 계획',
    base: 'report',
    desc: '「시범적용·성과 계획」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '시스템도입 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「시범적용·성과 계획」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'service-review'
  },
  {
    id: 'tpl:integration:1',
    name: '연계 협약·MOU',
    base: 'collab',
    desc: '「연계 협약·MOU」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '연계 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「연계 협약·MOU」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'integration'
  },
  {
    id: 'tpl:integration:2',
    name: '인터페이스 규격서',
    base: 'report',
    desc: '「인터페이스 규격서」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '연계 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「인터페이스 규격서」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'integration'
  },
  {
    id: 'tpl:integration:3',
    name: '연계 운영·오류 대장',
    base: 'form',
    desc: '「연계 운영·오류 대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '연계 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「연계 운영·오류 대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'integration'
  },
  {
    id: 'tpl:integration:4',
    name: '제공·위탁 검토',
    base: 'review',
    desc: '「제공·위탁 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '연계 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「제공·위탁 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'integration'
  },
  {
    id: 'S13',
    name: '작업계획·사전 결재',
    base: 'report',
    desc: '「작업계획·사전 결재」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '패치 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「작업계획·사전 결재」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'S13',
    owner: null
  },
  {
    id: 'tpl:patch-report:2',
    name: '작업 결과·검증 보고',
    base: 'report',
    desc: '「작업 결과·검증 보고」 실시 결과·지적·조치까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:result'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '패치 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「작업 결과·검증 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'patch-report'
  },
  {
    id: 'tpl:patch-report:3',
    name: '취약점·패치 대장',
    base: 'form',
    desc: '「취약점·패치 대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '패치 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「취약점·패치 대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'patch-report'
  },
  {
    id: 'tpl:patch-report:4',
    name: '배포·변경 이력',
    base: 'form',
    desc: '「배포·변경 이력」 설치·수선·교체 이력까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '패치 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「배포·변경 이력」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'patch-report'
  },
  {
    id: 'tpl:privacy:1',
    name: '내부 관리계획',
    base: 'report',
    desc: '「내부 관리계획」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '개인정보 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「내부 관리계획」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'privacy'
  },
  {
    id: 'tpl:privacy:2',
    name: '영향평가·위험도 점검',
    base: 'review',
    desc: '「영향평가·위험도 점검」 판단 기준·대안 비교까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '개인정보 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「영향평가·위험도 점검」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'privacy'
  },
  {
    id: 'tpl:privacy:3',
    name: '권한·접속기록 점검',
    base: 'form',
    desc: '「권한·접속기록 점검」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:log',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '개인정보 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「권한·접속기록 점검」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'privacy'
  },
  {
    id: 'tpl:privacy:4',
    name: '유출·침해 통지',
    base: 'report',
    desc: '「유출·침해 통지」 대상·사유·조치·기한까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '개인정보 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「유출·침해 통지」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'privacy'
  },
  {
    id: 'tpl:maintenance:1',
    name: '과업지시서·SLA',
    base: 'collab',
    desc: '「과업지시서·SLA」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:vendor',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '유지관리 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「과업지시서·SLA」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'maintenance'
  },
  {
    id: 'tpl:maintenance:2',
    name: '월간 점검·실적',
    base: 'excel',
    desc: '「월간 점검·실적」 계산식·집계 기준까지',
    preset: {
      tool: 'tool:excel',
      xlSituation: 'xl:cleanup',
      depth: 'depth:beginner'
    },
    extraAsks: [
      {
        key: 'xBasis',
        label: '계산·집계 기준은?',
        opt: 'xBasis'
      }
    ],
    memoHint: '유지관리 — 시트 구조·행/열 의미·원하는 계산·원본 예시 5행',
    verify: '「월간 점검·실적」 제출 전에 다음을 확인해 주세요: ① 수식·코드 실행 가능 ② 적용 시트·범위 명시 ③ 결과 확인 방법 포함',
    shared: null,
    owner: 'maintenance'
  },
  {
    id: 'S05',
    name: '투입·상주 인력 관리대장',
    base: 'form',
    desc: '「투입·상주 인력 관리대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '유지관리 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「투입·상주 인력 관리대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: 'S05',
    owner: null
  },
  {
    id: 'S10',
    name: '업체 평가·계약연계 검토',
    base: 'review',
    desc: '「업체 평가·계약연계 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '유지관리 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「업체 평가·계약연계 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: 'S10',
    owner: null
  },
  {
    id: 'tpl:incident:1',
    name: '초동 대응·상황전파',
    base: 'report',
    desc: '「초동 대응·상황전파」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '장애대응 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「초동 대응·상황전파」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'incident'
  },
  {
    id: 'tpl:incident:2',
    name: '원인분석·사후관리',
    base: 'report',
    desc: '「원인분석·사후관리」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '장애대응 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「원인분석·사후관리」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'incident'
  },
  {
    id: 'tpl:incident:3',
    name: '침해사고 조사·신고',
    base: 'report',
    desc: '「침해사고 조사·신고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '장애대응 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「침해사고 조사·신고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'incident'
  },
  {
    id: 'S15',
    name: '위험요인·조치 대장',
    base: 'form',
    desc: '「위험요인·조치 대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '장애대응 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「위험요인·조치 대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: 'S15',
    owner: null
  },
  {
    id: 'tpl:it-audit:2',
    name: '요구자료 대응표',
    base: 'form',
    desc: '「요구자료 대응표」 사실·수치·출처까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: 'IT감사 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「요구자료 대응표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'it-audit'
  },
  {
    id: 'tpl:it-audit:3',
    name: '통제 자체점검',
    base: 'form',
    desc: '「통제 자체점검」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: 'IT감사 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「통제 자체점검」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'it-audit'
  },
  {
    id: 'tpl:it-audit:4',
    name: '이행결과 보고',
    base: 'report',
    desc: '「이행결과 보고」 실시 결과·지적·조치까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:result'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: 'IT감사 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「이행결과 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'it-audit'
  },
  {
    id: 'tpl:it-project:2',
    name: '요구사항·과업 범위',
    base: 'collab',
    desc: '「요구사항·과업 범위」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:vendor',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '정보화사업 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「요구사항·과업 범위」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'it-project'
  },
  {
    id: 'tpl:it-project:3',
    name: '검수·성과 확인',
    base: 'report',
    desc: '「검수·성과 확인」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '정보화사업 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「검수·성과 확인」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'it-project'
  },
  {
    id: 'S22',
    name: '데이터 정제·집계',
    base: 'excel',
    desc: '「데이터 정제·집계」 계산식·집계 기준까지',
    preset: {
      tool: 'tool:excel',
      xlSituation: 'xl:cleanup',
      depth: 'depth:beginner'
    },
    extraAsks: [
      {
        key: 'xBasis',
        label: '계산·집계 기준은?',
        opt: 'xBasis'
      }
    ],
    memoHint: '데이터AI — 시트 구조·행/열 의미·원하는 계산·원본 예시 5행',
    verify: '「데이터 정제·집계」 제출 전에 다음을 확인해 주세요: ① 수식·코드 실행 가능 ② 적용 시트·범위 명시 ③ 결과 확인 방법 포함',
    shared: 'S22',
    owner: null
  },
  {
    id: 'tpl:data-ai:2',
    name: '분석·대시보드 기획',
    base: 'report',
    desc: '「분석·대시보드 기획」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '데이터AI — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「분석·대시보드 기획」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'data-ai'
  },
  {
    id: 'S23',
    name: 'AI 활용 절차·가이드',
    base: 'report',
    desc: '「AI 활용 절차·가이드」 절차·금지사항·검증 방법까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '데이터AI — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「AI 활용 절차·가이드」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'S23',
    owner: null
  },
  {
    id: 'G1',
    name: '기준 적합성 검토서',
    base: 'review',
    desc: '「기준 적합성 검토서」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:law',
      scope: 'scope:case',
      basisType: 'basis:law'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '토목 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「기준 적합성 검토서」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: 'G1',
    owner: null
  },
  {
    id: 'G2',
    name: '설계·계산서',
    base: 'excel',
    desc: '「설계·계산서」 계산식·대입값·단위까지',
    preset: {
      tool: 'tool:excel',
      xlSituation: 'xl:build',
      depth: 'depth:beginner'
    },
    extraAsks: [
      {
        key: 'xBasis',
        label: '계산·집계 기준은?',
        opt: 'xBasis'
      }
    ],
    memoHint: '토목 — 시트 구조·행/열 의미·원하는 계산·원본 예시 5행',
    verify: '「설계·계산서」 제출 전에 다음을 확인해 주세요: ① 수식·코드 실행 가능 ② 적용 시트·범위 명시 ③ 결과 확인 방법 포함',
    shared: 'G2',
    owner: null
  },
  {
    id: 'tpl:eng-civil:3',
    name: '포장·배수 상세 검토',
    base: 'review',
    desc: '「포장·배수 상세 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '토목 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「포장·배수 상세 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'eng-civil'
  },
  {
    id: 'G5',
    name: '시험·검사 계획·성적서',
    base: 'form',
    desc: '「시험·검사 계획·성적서」 일정·담당·자원·예산까지',
    preset: {
      formUse: 'form:plan',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '토목 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「시험·검사 계획·성적서」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: 'G5',
    owner: null
  },
  {
    id: 'tpl:eng-arch:3',
    name: '마감·방수·단열 상세',
    base: 'review',
    desc: '「마감·방수·단열 상세」 판단 기준·대안 비교까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '건축 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「마감·방수·단열 상세」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'eng-arch'
  },
  {
    id: 'G4',
    name: '시공계획·공정표',
    base: 'report',
    desc: '「시공계획·공정표」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '건축 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「시공계획·공정표」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'G4',
    owner: null
  },
  {
    id: 'tpl:eng-elec:3',
    name: '접지·보호협조 검토',
    base: 'review',
    desc: '「접지·보호협조 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '전기 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「접지·보호협조 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'eng-elec'
  },
  {
    id: 'tpl:eng-mech:3',
    name: '덕트·배관 경로 검토',
    base: 'review',
    desc: '「덕트·배관 경로 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '기계 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「덕트·배관 경로 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'eng-mech'
  },
  {
    id: 'tpl:eng-fire-it:3',
    name: '통신·정보통신 구성도',
    base: 'form',
    desc: '「통신·정보통신 구성도」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '소방통신 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「통신·정보통신 구성도」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'eng-fire-it'
  },
  {
    id: 'tpl:eng-env:3',
    name: '환경영향·저감 대책',
    base: 'review',
    desc: '「환경영향·저감 대책」 판단 기준·대안 비교까지',
    preset: {
      issue: 'issue:improve',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '환경기술 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「환경영향·저감 대책」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'eng-env'
  },
  {
    id: 'tpl:eng-trans:3',
    name: '동선·운행계획',
    base: 'review',
    desc: '「동선·운행계획」 일정·담당·자원·예산까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '교통 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「동선·운행계획」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'eng-trans'
  },
  {
    id: 'G6',
    name: '준공·인수 확인',
    base: 'report',
    desc: '「준공·인수 확인」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '교통 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「준공·인수 확인」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'G6',
    owner: null
  },
  {
    id: 'tpl:design-review:2',
    name: '도면 간섭·정합성 검토',
    base: 'review',
    desc: '「도면 간섭·정합성 검토」 기준·쟁점·판단 근거까지',
    preset: {
      issue: 'issue:cause',
      scope: 'scope:case',
      basisType: 'basis:internal'
    },
    extraAsks: [
      {
        key: 'xChoice',
        label: '권고 수준은?',
        opt: 'xChoice'
      }
    ],
    memoHint: '설계검토 — 문제 현상·근거 규정·검토 범위·이미 시도한 대안',
    verify: '「도면 간섭·정합성 검토」 제출 전에 다음을 확인해 주세요: ① 현상과 원인 분리 ② 대안별 비용·기간·리스크 ③ 단정 대신 [확인 필요]',
    shared: null,
    owner: 'design-review'
  },
  {
    id: 'tpl:design-review:3',
    name: '기준 개정 영향 검토',
    base: 'report',
    desc: '「기준 개정 영향 검토」 기준·쟁점·판단 근거까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:rule',
      tone: 'tone:brief',
      kind: 'kind:review'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '설계검토 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「기준 개정 영향 검토」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'design-review'
  },
  {
    id: 'tpl:test-qc:2',
    name: '계측기 검교정 대장',
    base: 'form',
    desc: '「계측기 검교정 대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '시험품질 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「계측기 검교정 대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'test-qc'
  },
  {
    id: 'tpl:test-qc:3',
    name: '부적합·시정조치 보고',
    base: 'report',
    desc: '「부적합·시정조치 보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '시험품질 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「부적합·시정조치 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'test-qc'
  },
  {
    id: 'tpl:facility-ops:1',
    name: '운영계획·이용관리',
    base: 'report',
    desc: '「운영계획·이용관리」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '시설운영 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「운영계획·이용관리」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'facility-ops'
  },
  {
    id: 'tpl:facility-ops:2',
    name: '안전관리계획',
    base: 'report',
    desc: '「안전관리계획」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '시설운영 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「안전관리계획」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'facility-ops'
  },
  {
    id: 'S11',
    name: '점검 계획·일정표',
    base: 'form',
    desc: '「점검 계획·일정표」 일정·담당·자원·예산까지',
    preset: {
      formUse: 'form:plan',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '점검 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「점검 계획·일정표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: 'S11',
    owner: null
  },
  {
    id: 'S12',
    name: '점검 결과·지적·조치 보고',
    base: 'report',
    desc: '「점검 결과·지적·조치 보고」 실시 결과·지적·조치까지',
    preset: {
      doc: 'doc:audit',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:result'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '점검 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「점검 결과·지적·조치 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: 'S12',
    owner: null
  },
  {
    id: 'tpl:inspection:3',
    name: '법정 자체점검 결과',
    base: 'report',
    desc: '「법정 자체점검 결과」 실시 결과·지적·조치까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:result'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '점검 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「법정 자체점검 결과」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'inspection'
  },
  {
    id: 'S04',
    name: '시정·개선 요구 공문',
    base: 'collab',
    desc: '「시정·개선 요구 공문」 수신처·요청·기한·붙임까지',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '점검 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「시정·개선 요구 공문」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: 'S04',
    owner: null
  },
  {
    id: 'tpl:preventive:1',
    name: '예방정비 계획·주기표',
    base: 'form',
    desc: '「예방정비 계획·주기표」 일정·담당·자원·예산까지',
    preset: {
      formUse: 'form:plan',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '예방정비 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「예방정비 계획·주기표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'preventive'
  },
  {
    id: 'tpl:preventive:2',
    name: '부품·자재 소요 계획',
    base: 'excel',
    desc: '「부품·자재 소요 계획」 일정·담당·자원·예산까지',
    preset: {
      tool: 'tool:excel',
      xlSituation: 'xl:build',
      depth: 'depth:beginner'
    },
    extraAsks: [
      {
        key: 'xBasis',
        label: '계산·집계 기준은?',
        opt: 'xBasis'
      }
    ],
    memoHint: '예방정비 — 시트 구조·행/열 의미·원하는 계산·원본 예시 5행',
    verify: '「부품·자재 소요 계획」 제출 전에 다음을 확인해 주세요: ① 수식·코드 실행 가능 ② 적용 시트·범위 명시 ③ 결과 확인 방법 포함',
    shared: null,
    owner: 'preventive'
  },
  {
    id: 'tpl:preventive:3',
    name: '정비 이력·효과 분석',
    base: 'report',
    desc: '「정비 이력·효과 분석」 설치·수선·교체 이력까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '예방정비 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「정비 이력·효과 분석」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'preventive'
  },
  {
    id: 'tpl:repair:1',
    name: '고장 접수·원인 보고',
    base: 'report',
    desc: '「고장 접수·원인 보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '고장수리 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「고장 접수·원인 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'repair'
  },
  {
    id: 'tpl:fac-history:1',
    name: '시설물 대장·이력카드',
    base: 'form',
    desc: '「시설물 대장·이력카드」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '이력관리 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「시설물 대장·이력카드」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'fac-history'
  },
  {
    id: 'G3',
    name: '시방·도면 목록',
    base: 'form',
    desc: '「시방·도면 목록」 항목·수량·보관 위치까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '이력관리 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「시방·도면 목록」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: 'G3',
    owner: null
  },
  {
    id: 'tpl:fac-history:3',
    name: '수선이력·내용연수 검토',
    base: 'report',
    desc: '「수선이력·내용연수 검토」 설치·수선·교체 이력까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:review'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '이력관리 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「수선이력·내용연수 검토」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'fac-history'
  },
  {
    id: 'S24',
    name: '일일 작업·순찰일지',
    base: 'form',
    desc: '「일일 작업·순찰일지」 시각·위치·내용·특이사항 열까지',
    preset: {
      formUse: 'form:log',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '작업관리 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「일일 작업·순찰일지」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: 'S24',
    owner: null
  },
  {
    id: 'tpl:work-result:3',
    name: '작업 사진·증빙 대장',
    base: 'form',
    desc: '「작업 사진·증빙 대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '작업관리 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「작업 사진·증빙 대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'work-result'
  },
  {
    id: 'tpl:patrol:2',
    name: '순찰 점검표·이상 조치',
    base: 'form',
    desc: '「순찰 점검표·이상 조치」 확인 항목·판정·조치란까지 표로',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '순찰 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「순찰 점검표·이상 조치」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'patrol'
  },
  {
    id: 'tpl:patrol:3',
    name: '이상 발견 즉시 보고',
    base: 'report',
    desc: '「이상 발견 즉시 보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '순찰 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「이상 발견 즉시 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'patrol'
  },
  {
    id: 'tpl:service-ops:1',
    name: '운영시간·인력배치표',
    base: 'form',
    desc: '「운영시간·인력배치표」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '서비스운영 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「운영시간·인력배치표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'service-ops'
  },
  {
    id: 'tpl:service-ops:3',
    name: '혼잡·이용실적 분석',
    base: 'report',
    desc: '「혼잡·이용실적 분석」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '서비스운영 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「혼잡·이용실적 분석」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'service-ops'
  },
  {
    id: 'tpl:field-complaint:1',
    name: '민원 접수·경위 기록',
    base: 'report',
    desc: '「민원 접수·경위 기록」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '현장응대 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「민원 접수·경위 기록」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'field-complaint'
  },
  {
    id: 'tpl:field-complaint:2',
    name: '현장 수습 보고',
    base: 'report',
    desc: '「현장 수습 보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '현장응대 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「현장 수습 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'field-complaint'
  },
  {
    id: 'tpl:field-complaint:4',
    name: '유관기관 협조 요청',
    base: 'collab',
    desc: '「유관기관 협조 요청」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '현장응대 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「유관기관 협조 요청」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'field-complaint'
  },
  {
    id: 'tpl:site-incident:1',
    name: '사고 초동 보고·전파',
    base: 'report',
    desc: '「사고 초동 보고·전파」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '현장사고 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「사고 초동 보고·전파」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'site-incident'
  },
  {
    id: 'tpl:site-incident:2',
    name: '통제·복구 조치 기록',
    base: 'report',
    desc: '「통제·복구 조치 기록」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '현장사고 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「통제·복구 조치 기록」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'site-incident'
  },
  {
    id: 'tpl:site-incident:3',
    name: '재발방지·종결 보고',
    base: 'report',
    desc: '「재발방지·종결 보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '현장사고 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「재발방지·종결 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'site-incident'
  },
  {
    id: 'tpl:shift:3',
    name: '미결·위험요소 인계표',
    base: 'form',
    desc: '「미결·위험요소 인계표」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '인수인계 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「미결·위험요소 인계표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'shift'
  },
  {
    id: 'tpl:equipment-supply:2',
    name: '수선 요청서',
    base: 'collab',
    desc: '「수선 요청서」 수신처·요청·기한까지 공문 형식으로',
    preset: {
      cTarget: 'cTarget:dept',
      cWhy: 'cWhy:coop',
      cForm: 'cForm:cover',
      cDue: 'cDue:fixed'
    },
    extraAsks: [
      {
        key: 'xReply',
        label: '회신 기한·형식은 정해졌나요?',
        opt: 'xReply'
      }
    ],
    memoHint: '장비물품 — 수신처·요청 사항·회신 기한·붙임',
    verify: '「수선 요청서」 제출 전에 다음을 확인해 주세요: ① 수신처·근거 공문 번호 ② 요청 사항·기한 ③ 붙임·담당 연락처',
    shared: null,
    owner: 'equipment-supply'
  },
  {
    id: 'tpl:equipment-supply:3',
    name: '납품 검수 확인서',
    base: 'report',
    desc: '「납품 검수 확인서」 확인 항목·서명란까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '장비물품 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「납품 검수 확인서」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'equipment-supply'
  },
  {
    id: 'tpl:equipment-supply:4',
    name: '재고·소모품 관리대장',
    base: 'form',
    desc: '「재고·소모품 관리대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '장비물품 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「재고·소모품 관리대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'equipment-supply'
  },
  {
    id: 'tpl:risk-assess:2',
    name: '위험요인 개선대책',
    base: 'report',
    desc: '「위험요인 개선대책」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '위험성평가 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「위험요인 개선대책」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'risk-assess'
  },
  {
    id: 'S14',
    name: '안전작업허가서(PTW)',
    base: 'form',
    desc: '「안전작업허가서(PTW)」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '산업안전 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「안전작업허가서(PTW)」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: 'S14',
    owner: null
  },
  {
    id: 'tpl:safety:3',
    name: '안전보건관리체계 점검',
    base: 'form',
    desc: '「안전보건관리체계 점검」 열 구성·기재 요령·서명란까지',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '산업안전 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「안전보건관리체계 점검」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'safety'
  },
  {
    id: 'tpl:serious:1',
    name: '중대재해 대응체계 점검',
    base: 'report',
    desc: '「중대재해 대응체계 점검」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '중대재해 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「중대재해 대응체계 점검」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'serious'
  },
  {
    id: 'tpl:serious:2',
    name: '사고 보고·수습 보고',
    base: 'report',
    desc: '「사고 보고·수습 보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '중대재해 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「사고 보고·수습 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'serious'
  },
  {
    id: 'tpl:serious:3',
    name: '재발방지 이행계획',
    base: 'report',
    desc: '「재발방지 이행계획」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '중대재해 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「재발방지 이행계획」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'serious'
  },
  {
    id: 'tpl:health:1',
    name: '작업환경측정 결과 보고',
    base: 'report',
    desc: '「작업환경측정 결과 보고」 실시 결과·지적·조치까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief',
      kind: 'kind:result'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '산업보건 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「작업환경측정 결과 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'health'
  },
  {
    id: 'tpl:health:2',
    name: '건강진단·사후관리 대장',
    base: 'form',
    desc: '「건강진단·사후관리 대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '산업보건 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「건강진단·사후관리 대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'health'
  },
  {
    id: 'tpl:health:3',
    name: '화학물질·MSDS 관리대장',
    base: 'form',
    desc: '「화학물질·MSDS 관리대장」 열 구성·기재 요령·누적 관리까지',
    preset: {
      formUse: 'form:ledger',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '산업보건 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「화학물질·MSDS 관리대장」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'health'
  },
  {
    id: 'tpl:safety-edu:2',
    name: 'TBM·위험예지 활동일지',
    base: 'form',
    desc: '「TBM·위험예지 활동일지」 시각·위치·내용·특이사항 열까지',
    preset: {
      formUse: 'form:log',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '안전교육 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「TBM·위험예지 활동일지」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'safety-edu'
  },
  {
    id: 'tpl:environment:1',
    name: '환경법규 이행 점검표',
    base: 'form',
    desc: '「환경법규 이행 점검표」 확인 항목·판정·조치란까지 표로',
    preset: {
      formUse: 'form:check',
      formCols: 'formcols:standard',
      formRows: 'formrows:blank'
    },
    extraAsks: [
      {
        key: 'xUse',
        label: '표의 용도는?',
        opt: 'xUse'
      }
    ],
    memoHint: '환경 — 표 용도·필수 열·행 수·서명/확인란',
    verify: '「환경법규 이행 점검표」 제출 전에 다음을 확인해 주세요: ① 필수 열 누락 없음 ② 빈칸·해당 없음 표기 규칙 ③ 서명·확인란 존재',
    shared: null,
    owner: 'environment'
  },
  {
    id: 'tpl:environment:3',
    name: '환경개선 계획·보고',
    base: 'report',
    desc: '「환경개선 계획·보고」 일정·담당·자원·예산까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:approve',
      tone: 'tone:brief',
      kind: 'kind:plan'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '환경 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「환경개선 계획·보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'environment'
  },
  {
    id: 'tpl:disaster:3',
    name: '상황보고·복구 보고',
    base: 'report',
    desc: '「상황보고·복구 보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '재난 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「상황보고·복구 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'disaster'
  },
  {
    id: 'tpl:anomaly-report:1',
    name: '즉시·사후 보고서',
    base: 'report',
    desc: '「즉시·사후 보고서」 결론·근거·조치까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '아차사고 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「즉시·사후 보고서」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'anomaly-report'
  },
  {
    id: 'tpl:anomaly-report:4',
    name: '조치 완료·종결 보고',
    base: 'report',
    desc: '「조치 완료·종결 보고」 본문 구조·근거·승인 항목까지',
    preset: {
      doc: 'doc:internal',
      goal: 'goal:status',
      tone: 'tone:brief'
    },
    extraAsks: [
      {
        key: 'xDecide',
        label: '이 문서로 무엇을 결정받나요?',
        opt: 'xDecide'
      }
    ],
    memoHint: '아차사고 — 추진 배경·현황 수치(건수·금액·기간)·요청 사항·기한',
    verify: '「조치 완료·종결 보고」 제출 전에 다음을 확인해 주세요: ① 요구 항목 1:1 대응 ② 근거 조항·문서번호 표기 ③ 기한·담당·연락처 확인',
    shared: null,
    owner: 'anomaly-report'
  }
];

  PW.data.taskTemplates = {
  admin: [
    {
      tpl: 'tpl:admin:1',
      name: '기안문(일반·간이)'
    },
    {
      tpl: 'tpl:admin:2',
      name: '접수·발송 대장'
    },
    {
      tpl: 'tpl:admin:3',
      name: '공문 시행·회신'
    },
    {
      tpl: 'S01',
      name: '업무 인계·인수서'
    }
  ],
  'meeting-event': [
    {
      tpl: 'tpl:meeting-event:1',
      name: '회의 소집·안건 통지'
    },
    {
      tpl: 'S06',
      name: '회의록·결정사항'
    },
    {
      tpl: 'tpl:meeting-event:3',
      name: '행사 운영계획·정산'
    }
  ],
  complaint: [
    {
      tpl: 'S02',
      name: '민원 답변서'
    },
    {
      tpl: 'tpl:complaint:2',
      name: '처리 경과·재발방지'
    },
    {
      tpl: 'tpl:complaint:3',
      name: '이송·보완 요구'
    },
    {
      tpl: 'tpl:complaint:4',
      name: '응대 스크립트·FAQ'
    }
  ],
  'external-coop': [
    {
      tpl: 'tpl:external-coop:1',
      name: '협약·MOU 검토'
    },
    {
      tpl: 'tpl:external-coop:2',
      name: '협조 요청 공문'
    },
    {
      tpl: 'tpl:external-coop:3',
      name: '유관기관 협의 결과 보고'
    }
  ],
  council: [
    {
      tpl: 'tpl:council:1',
      name: '요구자료 답변서'
    },
    {
      tpl: 'S03',
      name: '지적사항 조치결과'
    },
    {
      tpl: 'tpl:council:3',
      name: '현안 설명·예상 질의'
    },
    {
      tpl: 'tpl:council:4',
      name: '제출 목록·대응표'
    }
  ],
  records: [
    {
      tpl: 'tpl:records:1',
      name: '이관·폐기 목록'
    },
    {
      tpl: 'tpl:records:2',
      name: '정보공개 처리·부분공개 검토'
    },
    {
      tpl: 'tpl:records:3',
      name: '기록물 관리 점검표'
    }
  ],
  legal: [
    {
      tpl: 'S19',
      name: '규정 검토 의견서'
    },
    {
      tpl: 'tpl:legal:2',
      name: '신구조문 대비표'
    },
    {
      tpl: 'tpl:legal:3',
      name: '위반·제재 검토 메모'
    }
  ],
  'pr-comms': [
    {
      tpl: 'S18',
      name: '보도·해명자료'
    },
    {
      tpl: 'S17',
      name: '안내문·SNS 문구'
    },
    {
      tpl: 'tpl:pr-comms:3',
      name: '홍보 계획·성과'
    }
  ],
  hr: [
    {
      tpl: 'tpl:hr:1',
      name: '채용계획·공고문'
    },
    {
      tpl: 'tpl:hr:2',
      name: '심사·면접 평가표'
    },
    {
      tpl: 'tpl:hr:3',
      name: '임용·발령 문서'
    }
  ],
  training: [
    {
      tpl: 'tpl:training:1',
      name: '교육계획·과정안'
    },
    {
      tpl: 'tpl:training:2',
      name: '교육결과·전이 평가'
    },
    {
      tpl: 'tpl:training:3',
      name: '역량진단·수요조사'
    }
  ],
  labor: [
    {
      tpl: 'tpl:labor:1',
      name: '근로계약·복무 검토'
    },
    {
      tpl: 'tpl:labor:2',
      name: '징계·인사위 자료'
    },
    {
      tpl: 'tpl:labor:3',
      name: '노사협의 안건·합의문'
    }
  ],
  payroll: [
    {
      tpl: 'tpl:payroll:1',
      name: '급여·수당 산출표'
    },
    {
      tpl: 'tpl:payroll:2',
      name: '퇴직·정산 검토'
    },
    {
      tpl: 'tpl:payroll:3',
      name: '4대보험·원천세 점검표'
    }
  ],
  accounting: [
    {
      tpl: 'tpl:accounting:1',
      name: '전표·분개 검토'
    },
    {
      tpl: 'tpl:accounting:2',
      name: '월·분기 결산 보고'
    },
    {
      tpl: 'tpl:accounting:3',
      name: '재무제표·주석 초안'
    },
    {
      tpl: 'tpl:accounting:4',
      name: '내부통제·감사 대응'
    }
  ],
  budget: [
    {
      tpl: 'S20',
      name: '세출예산 요구서'
    },
    {
      tpl: 'S08',
      name: '지출품의·집행계획'
    },
    {
      tpl: 'tpl:budget:3',
      name: '전용·이용·변경 요구'
    },
    {
      tpl: 'S21',
      name: '집행률·불용 점검'
    }
  ],
  procurement: [
    {
      tpl: 'tpl:procurement:1',
      name: '과업지시서·RFP'
    },
    {
      tpl: 'S09',
      name: '예정가격·원가계산'
    },
    {
      tpl: 'tpl:procurement:3',
      name: '계약심사·일상감사 체크'
    },
    {
      tpl: 'tpl:procurement:4',
      name: '검수·대금·지체상금'
    }
  ],
  asset: [
    {
      tpl: 'tpl:asset:1',
      name: '물품 관리대장·재물조사'
    },
    {
      tpl: 'tpl:asset:2',
      name: '불용·처분 검토'
    },
    {
      tpl: 'S08',
      name: '자산 취득·이관 품의'
    }
  ],
  plan: [
    {
      tpl: 'tpl:plan:1',
      name: '추진계획·시행계획'
    },
    {
      tpl: 'S21',
      name: '계획 대비 실적 점검표'
    },
    {
      tpl: 'tpl:plan:3',
      name: '협조·의견수렴 공문'
    },
    {
      tpl: 'tpl:plan:4',
      name: '정합성 검토 메모'
    }
  ],
  newbiz: [
    {
      tpl: 'tpl:newbiz:1',
      name: '사업 타당성 검토'
    },
    {
      tpl: 'tpl:newbiz:2',
      name: '수요·시장 분석'
    },
    {
      tpl: 'S20',
      name: '사업화 추진계획'
    }
  ],
  program: [
    {
      tpl: 'S20',
      name: '사업 총괄 추진계획'
    },
    {
      tpl: 'S07',
      name: '추진상황 보고'
    },
    {
      tpl: 'tpl:program:3',
      name: '성과 분석·환류'
    },
    {
      tpl: 'tpl:program:4',
      name: '이해관계자·협약 문서'
    }
  ],
  performance: [
    {
      tpl: 'tpl:performance:1',
      name: '지표 정의서'
    },
    {
      tpl: 'S21',
      name: '목표·실적표'
    },
    {
      tpl: 'tpl:performance:3',
      name: '성과보고서'
    },
    {
      tpl: 'tpl:performance:4',
      name: '지표 개선안'
    }
  ],
  evaluation: [
    {
      tpl: 'tpl:evaluation:1',
      name: '경영평가 대응 계획'
    },
    {
      tpl: 'tpl:evaluation:2',
      name: '지표별 증빙 목록'
    },
    {
      tpl: 'tpl:evaluation:3',
      name: '서술평가 초안'
    }
  ],
  policy: [
    {
      tpl: 'S19',
      name: '제도개선 검토보고'
    },
    {
      tpl: 'tpl:policy:2',
      name: '규정 개정안·신구조문대비표'
    },
    {
      tpl: 'tpl:policy:3',
      name: '영향분석·의견수렴'
    }
  ],
  sop: [
    {
      tpl: 'tpl:sop:1',
      name: '운영계획·업무분장'
    },
    {
      tpl: 'tpl:sop:2',
      name: '절차서(SOP)·매뉴얼'
    },
    {
      tpl: 'S16',
      name: '비상대응·훈련 계획·결과'
    }
  ],
  'service-review': [
    {
      tpl: 'tpl:service-review:1',
      name: '도입 검토서(대안 비교)'
    },
    {
      tpl: 'tpl:service-review:2',
      name: '요구사항 정의서'
    },
    {
      tpl: 'tpl:service-review:3',
      name: '타당성·예산 검토'
    },
    {
      tpl: 'tpl:service-review:4',
      name: '시범적용·성과 계획'
    }
  ],
  integration: [
    {
      tpl: 'tpl:integration:1',
      name: '연계 협약·MOU'
    },
    {
      tpl: 'tpl:integration:2',
      name: '인터페이스 규격서'
    },
    {
      tpl: 'tpl:integration:3',
      name: '연계 운영·오류 대장'
    },
    {
      tpl: 'tpl:integration:4',
      name: '제공·위탁 검토'
    }
  ],
  'patch-report': [
    {
      tpl: 'S13',
      name: '작업계획서'
    },
    {
      tpl: 'tpl:patch-report:2',
      name: '작업 결과·검증 보고'
    },
    {
      tpl: 'tpl:patch-report:3',
      name: '취약점·패치 대장'
    },
    {
      tpl: 'tpl:patch-report:4',
      name: '배포·변경 이력'
    }
  ],
  privacy: [
    {
      tpl: 'tpl:privacy:1',
      name: '내부 관리계획'
    },
    {
      tpl: 'tpl:privacy:2',
      name: '영향평가·위험도 점검'
    },
    {
      tpl: 'tpl:privacy:3',
      name: '권한·접속기록 점검'
    },
    {
      tpl: 'tpl:privacy:4',
      name: '유출·침해 통지'
    }
  ],
  maintenance: [
    {
      tpl: 'tpl:maintenance:1',
      name: '과업지시서·SLA'
    },
    {
      tpl: 'tpl:maintenance:2',
      name: '월간 점검·실적'
    },
    {
      tpl: 'S05',
      name: '상주인력 관리대장'
    },
    {
      tpl: 'S10',
      name: '유지보수 비용·계약변경 검토'
    }
  ],
  incident: [
    {
      tpl: 'tpl:incident:1',
      name: '초동 대응·상황전파'
    },
    {
      tpl: 'tpl:incident:2',
      name: '원인분석·사후관리'
    },
    {
      tpl: 'tpl:incident:3',
      name: '침해사고 조사·신고'
    },
    {
      tpl: 'S15',
      name: '대책 이행 점검표'
    }
  ],
  'it-audit': [
    {
      tpl: 'S03',
      name: '지적 답변·조치계획'
    },
    {
      tpl: 'tpl:it-audit:2',
      name: '요구자료 대응표'
    },
    {
      tpl: 'tpl:it-audit:3',
      name: '통제 자체점검'
    },
    {
      tpl: 'tpl:it-audit:4',
      name: '이행결과 보고'
    }
  ],
  'it-project': [
    {
      tpl: 'S20',
      name: 'ISP·정보화계획'
    },
    {
      tpl: 'tpl:it-project:2',
      name: '요구사항·과업 범위'
    },
    {
      tpl: 'tpl:it-project:3',
      name: '검수·성과 확인'
    }
  ],
  'data-ai': [
    {
      tpl: 'S22',
      name: '데이터 정제·품질 점검'
    },
    {
      tpl: 'tpl:data-ai:2',
      name: '분석·대시보드 기획'
    },
    {
      tpl: 'S23',
      name: 'AI 활용 절차·가이드'
    }
  ],
  'eng-civil': [
    {
      tpl: 'G1',
      name: '기준 적합성 검토서'
    },
    {
      tpl: 'G2',
      name: '설계·계산서'
    },
    {
      tpl: 'tpl:eng-civil:3',
      name: '포장·배수 상세 검토'
    },
    {
      tpl: 'G5',
      name: '시험·검사 계획'
    }
  ],
  'eng-arch': [
    {
      tpl: 'G1',
      name: '기준 적합성 검토서'
    },
    {
      tpl: 'G2',
      name: '설계·계산서'
    },
    {
      tpl: 'tpl:eng-arch:3',
      name: '마감·방수·단열 상세'
    },
    {
      tpl: 'G4',
      name: '시공·공정표'
    }
  ],
  'eng-elec': [
    {
      tpl: 'G1',
      name: '기준 적합성 검토서'
    },
    {
      tpl: 'G2',
      name: '부하·전압강하 계산서'
    },
    {
      tpl: 'tpl:eng-elec:3',
      name: '접지·보호협조 검토'
    },
    {
      tpl: 'G5',
      name: '시험·측정 계획'
    }
  ],
  'eng-mech': [
    {
      tpl: 'G1',
      name: '기준 적합성 검토서'
    },
    {
      tpl: 'G2',
      name: '열부하·용량 계산서'
    },
    {
      tpl: 'tpl:eng-mech:3',
      name: '덕트·배관 경로 검토'
    },
    {
      tpl: 'G5',
      name: '시운전·성능시험'
    }
  ],
  'eng-fire-it': [
    {
      tpl: 'G1',
      name: '기준 적합성 검토서'
    },
    {
      tpl: 'G2',
      name: '소방시설 성능·계산서'
    },
    {
      tpl: 'tpl:eng-fire-it:3',
      name: '통신·정보통신 구성도'
    },
    {
      tpl: 'G5',
      name: '성능시험·검사'
    }
  ],
  'eng-env': [
    {
      tpl: 'G1',
      name: '기준 적합성 검토서'
    },
    {
      tpl: 'G2',
      name: '배출·에너지 산정서'
    },
    {
      tpl: 'tpl:eng-env:3',
      name: '환경영향·저감 대책'
    },
    {
      tpl: 'G5',
      name: '측정·모니터링 계획'
    }
  ],
  'eng-trans': [
    {
      tpl: 'G1',
      name: '기준 적합성 검토서'
    },
    {
      tpl: 'G2',
      name: '교통량·수송능력 산정'
    },
    {
      tpl: 'tpl:eng-trans:3',
      name: '동선·운행계획'
    },
    {
      tpl: 'G6',
      name: '운영시험·평가'
    }
  ],
  'design-review': [
    {
      tpl: 'G1',
      name: '설계도서 기준검토서'
    },
    {
      tpl: 'tpl:design-review:2',
      name: '도면 간섭·정합성 검토'
    },
    {
      tpl: 'tpl:design-review:3',
      name: '기준 개정 영향 검토'
    }
  ],
  'test-qc': [
    {
      tpl: 'G5',
      name: '시험 계획·성적서'
    },
    {
      tpl: 'tpl:test-qc:2',
      name: '계측기 검교정 대장'
    },
    {
      tpl: 'tpl:test-qc:3',
      name: '부적합·시정조치 보고'
    }
  ],
  'facility-ops': [
    {
      tpl: 'tpl:facility-ops:1',
      name: '운영계획·이용관리'
    },
    {
      tpl: 'tpl:facility-ops:2',
      name: '안전관리계획'
    },
    {
      tpl: 'S07',
      name: '운영실적 보고'
    }
  ],
  inspection: [
    {
      tpl: 'S11',
      name: '점검 계획·일정표'
    },
    {
      tpl: 'S12',
      name: '점검 결과·지적 조치'
    },
    {
      tpl: 'tpl:inspection:3',
      name: '법정 자체점검 결과'
    },
    {
      tpl: 'S04',
      name: '보수·보강 요구서'
    }
  ],
  preventive: [
    {
      tpl: 'tpl:preventive:1',
      name: '예방정비 계획·주기표'
    },
    {
      tpl: 'tpl:preventive:2',
      name: '부품·자재 소요 계획'
    },
    {
      tpl: 'tpl:preventive:3',
      name: '정비 이력·효과 분석'
    }
  ],
  repair: [
    {
      tpl: 'tpl:repair:1',
      name: '고장 접수·원인 보고'
    },
    {
      tpl: 'S13',
      name: '긴급복구 작업계획'
    },
    {
      tpl: 'S09',
      name: '수리비·업체 견적 비교'
    }
  ],
  contractor: [
    {
      tpl: 'S04',
      name: '작업 지시·이행확인'
    },
    {
      tpl: 'S05',
      name: '인력 투입대장'
    },
    {
      tpl: 'S04',
      name: '시정 요청·계약 조치'
    },
    {
      tpl: 'S10',
      name: '업체 수행평가'
    }
  ],
  'fac-history': [
    {
      tpl: 'tpl:fac-history:1',
      name: '시설물 대장·이력카드'
    },
    {
      tpl: 'G3',
      name: '시방·도면·준공도서 목록'
    },
    {
      tpl: 'tpl:fac-history:3',
      name: '수선이력·내용연수 검토'
    }
  ],
  'work-result': [
    {
      tpl: 'S24',
      name: '일일 작업일지'
    },
    {
      tpl: 'S07',
      name: '작업 결과 보고'
    },
    {
      tpl: 'tpl:work-result:3',
      name: '작업 사진·증빙 대장'
    },
    {
      tpl: 'S13',
      name: '작업계획·순서표'
    }
  ],
  patrol: [
    {
      tpl: 'S24',
      name: '순찰일지·경로표'
    },
    {
      tpl: 'tpl:patrol:2',
      name: '순찰 점검표·이상 조치'
    },
    {
      tpl: 'tpl:patrol:3',
      name: '이상 발견 즉시 보고'
    }
  ],
  'service-ops': [
    {
      tpl: 'tpl:service-ops:1',
      name: '운영시간·인력배치표'
    },
    {
      tpl: 'S17',
      name: '이용안내·공지문'
    },
    {
      tpl: 'tpl:service-ops:3',
      name: '혼잡·이용실적 분석'
    }
  ],
  'field-complaint': [
    {
      tpl: 'tpl:field-complaint:1',
      name: '민원 접수·경위 기록'
    },
    {
      tpl: 'tpl:field-complaint:2',
      name: '현장 수습 보고'
    },
    {
      tpl: 'S02',
      name: '회신·안내문'
    },
    {
      tpl: 'tpl:field-complaint:4',
      name: '유관기관 협조 요청'
    }
  ],
  'site-incident': [
    {
      tpl: 'tpl:site-incident:1',
      name: '사고 초동 보고·전파'
    },
    {
      tpl: 'tpl:site-incident:2',
      name: '통제·복구 조치 기록'
    },
    {
      tpl: 'tpl:site-incident:3',
      name: '재발방지·종결 보고'
    }
  ],
  shift: [
    {
      tpl: 'S24',
      name: '교대일지'
    },
    {
      tpl: 'S01',
      name: '인수인계서'
    },
    {
      tpl: 'tpl:shift:3',
      name: '미결·위험요소 인계표'
    }
  ],
  'equipment-supply': [
    {
      tpl: 'S08',
      name: '비품·자재 요청·품의'
    },
    {
      tpl: 'tpl:equipment-supply:2',
      name: '수선 요청서'
    },
    {
      tpl: 'tpl:equipment-supply:3',
      name: '납품 검수 확인서'
    },
    {
      tpl: 'tpl:equipment-supply:4',
      name: '재고·소모품 관리대장'
    }
  ],
  'risk-assess': [
    {
      tpl: 'S15',
      name: '위험성평가표'
    },
    {
      tpl: 'tpl:risk-assess:2',
      name: '위험요인 개선대책'
    },
    {
      tpl: 'S15',
      name: '재평가·이행 확인'
    }
  ],
  safety: [
    {
      tpl: 'S12',
      name: '안전점검 계획·결과'
    },
    {
      tpl: 'S14',
      name: '안전작업허가서(PTW)'
    },
    {
      tpl: 'tpl:safety:3',
      name: '안전보건관리체계 점검'
    },
    {
      tpl: 'S04',
      name: '도급·협력사 안전조치 요구'
    }
  ],
  serious: [
    {
      tpl: 'tpl:serious:1',
      name: '중대재해 대응체계 점검'
    },
    {
      tpl: 'tpl:serious:2',
      name: '사고 보고·수습 보고'
    },
    {
      tpl: 'tpl:serious:3',
      name: '재발방지 이행계획'
    }
  ],
  health: [
    {
      tpl: 'tpl:health:1',
      name: '작업환경측정 결과 보고'
    },
    {
      tpl: 'tpl:health:2',
      name: '건강진단·사후관리 대장'
    },
    {
      tpl: 'tpl:health:3',
      name: '화학물질·MSDS 관리대장'
    }
  ],
  'safety-edu': [
    {
      tpl: 'S16',
      name: '안전교육 계획·실시 결과'
    },
    {
      tpl: 'tpl:safety-edu:2',
      name: 'TBM·위험예지 활동일지'
    },
    {
      tpl: 'S05',
      name: '교육 효과·이수 관리'
    }
  ],
  environment: [
    {
      tpl: 'tpl:environment:1',
      name: '환경법규 이행 점검표'
    },
    {
      tpl: 'S15',
      name: '폐기물·배출 관리대장'
    },
    {
      tpl: 'tpl:environment:3',
      name: '환경개선 계획·보고'
    }
  ],
  disaster: [
    {
      tpl: 'S16',
      name: '위기대응 매뉴얼·비상계획'
    },
    {
      tpl: 'S16',
      name: '대피·훈련 결과'
    },
    {
      tpl: 'tpl:disaster:3',
      name: '상황보고·복구 보고'
    }
  ],
  'anomaly-report': [
    {
      tpl: 'tpl:anomaly-report:1',
      name: '즉시·사후 보고서'
    },
    {
      tpl: 'S15',
      name: '아차사고 관리대장'
    },
    {
      tpl: 'S04',
      name: '위험요소 시정 요청'
    },
    {
      tpl: 'tpl:anomaly-report:4',
      name: '조치 완료·종결 보고'
    }
  ]
};

  PW.data.templatesById = (function (list) {
    var map = {};
    list.forEach(function (t) { map[t.id] = t; });
    return map;
  })(PW.data.templates);
})(window.PW);
