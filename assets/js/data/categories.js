/* Prompt Wizard — 상위 카테고리 5개
   status: 'live'    → 지금 끝까지 동작하는 위자드
           'planned' → 준비 중. 예정 도구·활용 예시만 보여 주고,
                       누르면 아무 일도 없는 가짜 버튼은 만들지 않는다.
   새 카테고리를 실제로 여는 순간에만 status를 'live'로 바꾸고
   jobs/tasks/outputs 데이터 파일을 추가한다 (UI 코드는 건드리지 않는다). */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.data = PW.data || {};
  PW.data.categories = [
    {
      id: 'public', order: 1, status: 'live',
      name: '공공기관·공무원',
      short: '공공기관',
      icon: '🏛️',
      tagline: '보고서·공문·감사 대응·민원까지 공공 실무 전용',
      description: '공공기관·공기업 실무 기준(개조식 보고, 공문 갑지, 감사·의회 대응, 계약·용역 절차)으로 프롬프트를 조립합니다.',
      defaultJobId: 'ops'
    },
    {
      id: 'corp', order: 2, status: 'planned',
      name: '일반기업·회사원',
      short: '일반기업',
      icon: '🏢',
      tagline: '품의서·주간업무보고·KPI·거래처 메일',
      description: '대기업·중소기업 실무에 맞춘 결재·보고·영업 문서 도구를 준비하고 있습니다.',
      examples: [
        { title: '품의서·지출결의', desc: '구매 사유·견적 비교·예산 근거를 갖춘 품의서' },
        { title: '주간·월간 업무보고', desc: '진행률·이슈·다음 주 계획을 한 장으로' },
        { title: 'KPI·실적 리포트', desc: '목표 대비 실적과 미달 원인 정리' },
        { title: '거래처 요청·회신 메일', desc: '납기 조정·단가 협의·클레임 수습' }
      ],
      plans: ['품의서·지출결의', '주간·월간 업무보고', 'KPI·실적 리포트', '거래처·협력사 메일', '회의록·액션아이템 정리']
    },
    {
      id: 'biz', order: 3, status: 'planned',
      name: '자영업·소상공인',
      short: '자영업',
      icon: '🏪',
      tagline: '가게 홍보 문구·리뷰 답글·단골 관리',
      description: '매장 운영에 바로 쓰는 홍보·응대 문구 도구를 준비하고 있습니다.',
      examples: [
        { title: '가게 홍보 문구', desc: '메뉴·이벤트를 SNS·배달앱 문구로' },
        { title: '리뷰 답글', desc: '칭찬·불만 리뷰에 정중하게 답하기' },
        { title: '단골 안내 메시지', desc: '휴무·신메뉴·쿠폰 안내 문자' }
      ],
      plans: ['홍보 문구 생성', '리뷰 답글', '단골 안내 문자', '직원 채용 공고']
    },
    {
      id: 'student', order: 4, status: 'planned',
      name: '대학생·취준생',
      short: '대학생',
      icon: '🎓',
      tagline: '자기소개서·과제·발표 자료',
      description: '지원 동기·경험 정리·과제 구조화 도구를 준비하고 있습니다.',
      examples: [
        { title: '자기소개서', desc: '경험을 직무 역량으로 바꿔 쓰기' },
        { title: '과제·리포트 구조', desc: '서론·근거·결론을 논리 있게' },
        { title: '발표 스크립트', desc: '슬라이드 흐름에 맞춘 발표문' }
      ],
      plans: ['자기소개서', '과제·리포트 개요', '발표 스크립트', '면접 예상 질문']
    },
    {
      id: 'life', order: 5, status: 'planned',
      name: '일상·생활·재테크',
      short: '일상',
      icon: '🏠',
      tagline: '생활 속 요청·민원·가계 관리',
      description: '일상에서 마주치는 요청·항의·정리 문서 도구를 준비하고 있습니다.',
      examples: [
        { title: '생활 속 요청 메일', desc: '수리·환불·보상 요청을 정중하게' },
        { title: '가계·구독 정리', desc: '고정지출·구독료를 한눈에' },
        { title: '관공서 민원 문의', desc: '필요 서류·절차를 빠짐없이 묻기' }
      ],
      plans: ['생활 요청 메일', '가계·구독 정리', '민원 문의 문구', '여행 일정 정리']
    }
  ];
  PW.data.liveCategoryId = 'public';
})(window.PW);
