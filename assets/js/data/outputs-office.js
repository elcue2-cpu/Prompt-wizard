/* Prompt Wizard — 공공기관·공무원 결과물 6종
   asks      : STEP04에 동적으로 뜨는 질문 (required 먼저, advanced는 「+ 더 세부 조건」)
   memo      : 예시 placeholder / 예시 채우기 문장
   template  : 엔진이 문단으로 조립할 때 쓰는 뼈대.
               request는 {변수} 치환, format/style은 선택값→문장, rules는 조건부 추가 문장.
   ※ 문장 조각은 v3와 동일하게 유지한다(회귀 기준). 새 결과물만 새 문장을 쓴다. */
window.PW = window.PW || {};
(function (PW) {
  'use strict';
  PW.data = PW.data || {};
  PW.data.outputs = [
    /* ───────────────────────── 1. 보고서·기안문 ───────────────────────── */
    {
      id: 'report', cat: 'public', order: 1,
      name: '보고서·기안문 작성',
      short: '보고서·기안문',
      icon: '📄',
      desc: '결재·감사·계약 검토까지 실무 문서',
      examples: '추진계획 · 결과보고 · 검토보고 · 현황보고 · 감사 답변',
      asks: [
        { key: 'doc', opt: 'doc', required: true, label: '문서 성격·독자는 무엇인가요?', hint: '결재선·수신처를 떠올려 보세요' },
        { key: 'goal', opt: 'goal', required: true, label: '문서의 목적은 무엇인가요?', hint: '한 문장으로 말할 수 있어야 합니다' },
        { key: 'tone', opt: 'tone', required: true, label: '문체와 구조는 어느 쪽이 좋나요?', hint: '감사 대비는 개조식이 안전합니다' },
        { key: 'kind', opt: 'kind', required: false, label: '보고서 종류가 정해져 있나요?', hint: '선택 사항' },
        { key: 'length', opt: 'length', required: false, label: '분량은 어느 정도인가요?', hint: '기본 A4 1~2장' },
        { key: 'include', opt: 'include', required: false, label: '반드시 포함할 항목', hint: '하나 선택' },
        { key: 'exclude', opt: 'exclude', required: false, label: '빼야 할 항목', hint: '하나 선택' }
      ],
      memo: {
        placeholder: '예) 12월 정기점검 용역 인력 2명 증원 요청 / 현재 1인당 점검 대상 320건, 야간 고장 대응 평균 41분 / 11월에 2시간 초과 3건 / 추가 인건비 월 480만 원, 외주 대체 시 월 720만 원 / 올해 예산 잔액 1,200만 원 범위',
        example: '12월 정기점검 용역 인력 2명 증원을 요청드립니다. 현재 1인당 점검 대상 320건을 맡아 야간 고장 대응이 평균 41분 걸리고 있고, 11월에만 2시간을 넘긴 건이 3건 있었습니다. 추가 인건비는 월 480만 원이고, 외주로 돌리면 월 720만 원입니다. 올해 예산 잔액 1,200만 원 안에서 처리가 가능합니다.'
      },
      tips: [
        '결재권자가 30초에 판단할 수 있게, 맨 위에 결론 3줄 요약을 붙여줘.',
        '예산 방어 논리를 「외주 대비 월 얼마 절감」 한 줄로 더 선명하게 만들어줘.'
      ],
      template: {
        org: '공공기관의',
        expert: '실무 문서 전문가',
        backdrop: '대한민국 공공기관·공기업에서 15년 넘게 기안·결재·감사 대응을 다뤄 온 실무 문서 전문가',
        principle: '결재권자가 30초 안에 승인 여부를 판단하도록 결론과 근거 숫자를 앞세우고, 감사·의회 지적을 받지 않을 구조로 씁니다.',
        noun: '보고서',
        request: {
          tpl: '{reader} {decide} {noun}를 작성해 주세요.',
          consts: { noun: '보고서' },
          vars: {
            reader: {
              by: 'doc',
              map: {
                'doc:internal': '내부 결재권자가',
                'doc:gongmun': '협조를 요청받는 타부서 담당자와 결재권자가',
                'doc:audit': '감사·의회 담당자와 자료를 요구한 외부 기관이',
                'doc:contract': '계약·예산 심사 담당자와 결재권자가'
              },
              fallback: '결재권자가'
            },
            decide: {
              by: 'goal',
              map: {
                'goal:approve': '핵심을 30초 안에 파악해 신규 승인·추진 여부를 결정할 수 있도록',
                'goal:status': '계획 대비 실적과 미달 원인을 한눈에 파악할 수 있도록',
                'goal:defend': '문제의 원인과 대안 비용을 나란히 비교해 예산을 방어할 수 있도록',
                'goal:rule': '적용 조항과 쟁점, 개정 여부를 빠르게 확인할 수 있도록'
              },
              fallback: '핵심을 30초 안에 파악할 수 있도록'
            }
          }
        },
        format: {
          by: 'doc',
          map: {
            'doc:internal': 'brief',
            'doc:gongmun': 'official',
            'doc:audit': 'brief',
            'doc:contract': 'brief'
          },
          fallback: 'plain'
        },
        style: {
          by: 'tone',
          map: {
            'tone:brief': '문체는 공공기관 개조식으로, 감정·추측을 빼고 사실과 수치만 남겨 항목마다 한 줄로 끝맺어 주세요.',
            'tone:table': '검토 내용은 비용·기간·리스크·근거 규정을 열로 둔 대안 비교표로 정리하고, 결론은 표 아래 3줄 이내로 써 주세요.',
            'tone:prose': '각 항목 아래에 근거와 경위를 2~3문장으로 풀어 써서, 처음 받는 부서도 이해할 수 있게 해 주세요.'
          },
          fallback: '문체는 간결한 실무 문체로, 한 문단 3줄을 넘기지 않게 해 주세요.'
        },
        rules: [
          { when: { doc: ['doc:audit'] }, texts: [
            '감정·변명·추측을 빼고 사실 → 수치 → 원인 → 개선대책(이행기한·담당) 순으로만 쓰고, 요구 범위 밖 자료는 넣지 마세요.',
            '요구 항목별로 답변을 1:1로 맞추고, 산출할 수 없는 항목은 사유와 대체 자료를 함께 표시해 주세요.'
          ] },
          { when: { doc: ['doc:contract'] }, texts: [
            '계약 방식(수의/경쟁)과 근거 조항, 사전 절차(방침 수립 → 계약심사 → 일상감사) 이행 여부, 과업·규격·예산 변경 시 절차와 결재선을 밝히고, 분할 발주·규격 변경·부당 수의처럼 지적 소지가 있는 부분은 근거와 함께 먼저 설명해 주세요.'
          ] },
          { when: { doc: ['doc:internal'] }, texts: [
            '결재선은 기안자 → 검토자 → 결재권자 순으로 판단 근거가 이어지게 쓰고, 전결권자와 전결 범위를 표시해 주세요.'
          ] },
          { when: { goal: ['goal:defend'] }, texts: [
            '추가 소요액과 외주·민간 위탁 같은 대체안 비용을 같은 기준으로 나란히 제시하고, 절감·회피 효과를 숫자로 밝혀 주세요.'
          ] },
          { when: { goal: ['goal:approve'] }, texts: [
            '무엇을·언제까지·얼마로 승인받으려는지 첫 세 줄에 밝히고, 승인되지 않을 때 일정·민원·안전에 생길 영향을 함께 적어 주세요.'
          ] },
          { when: { goal: ['goal:status'] }, texts: [
            '계획 대비 실적을 같은 기준으로 비교하고, 미달 항목은 원인과 보완 계획까지 붙여 주세요.'
          ] },
          { when: { goal: ['goal:rule'] }, texts: [
            '적용 조항과 기준일을 먼저 밝히고, 상위 규정·개정 여부와 충돌하는 부분은 따로 표시해 주세요.'
          ] },
          { when: { kind: ['kind:plan'] }, texts: ['추진계획서이므로 추진 일정·담당·소요예산을 표로 붙여 주세요.'] },
          { when: { kind: ['kind:result'] }, texts: ['결과보고이므로 목표 대비 실적과 차이가 난 원인을 먼저 써 주세요.'] },
          { when: { kind: ['kind:review'] }, texts: ['검토보고이므로 대안별 장단점과 권고안을 함께 써 주세요.'] },
          { when: { kind: ['kind:status'] }, texts: ['현황보고이므로 현재 상태와 쟁점, 후속 조치를 구분해 주세요.'] },
          { when: { kind: ['kind:audit'] }, texts: ['행정사무감사 답변이므로 요구 항목 번호를 그대로 두고 1:1로 답변해 주세요.'] },
          { when: { include: ['include:core'] }, texts: ['추진배경·현황·문제점·대안·계획을 빠짐없이 담아 주세요.'] },
          { when: { include: ['include:budget'] }, texts: ['소요예산과 추진 일정을 항목별로 표로 정리해 주세요.'] },
          { when: { include: ['include:org'] }, texts: ['담당 조직과 필요 인력을 함께 밝혀 주세요.'] },
          { when: { include: ['include:impact'] }, texts: ['민원·안전에 미치는 영향과 대응 계획을 함께 적어 주세요.'] },
          { when: { exclude: ['exclude:privacy'] }, texts: ['개인정보와 실명은 빼고 직위·부서명으로만 표기해 주세요.'] },
          { when: { exclude: ['exclude:unsettled'] }, texts: ['확정되지 않은 계획은 넣지 말고, 꼭 필요하면 [확정 예정]으로 표시해 주세요.'] },
          { when: { exclude: ['exclude:secret'] }, texts: ['외부 공개가 제한된 수치는 넣지 말고, 꼭 필요하면 [비공개]로 표시해 주세요.'] }
        ],
        limit: {
          by: 'length',
          map: { 'length:one': 'A4 1장', 'length:two': 'A4 1~2장', 'length:three': 'A4 3장 이상' },
          fallback: 'A4 1~2장',
          tpl: '분량은 {v}, 한 문단 3줄 이내, 표는 5열 이내로 해 주세요. 인용한 규정·통계·기준일은 문장 끝에 괄호로 출처와 기준일을 적어 주세요.'
        },
        verify: '제출 전에 ① 요구 항목에 1:1로 답했는지 ② 확인되지 않은 수치를 [확인 필요]로 표시했는지 ③ 결론 → 근거 → 추진계획 순서가 유지되는지 스스로 점검해 주세요.'
      }
    },

    /* ───────────────────────── 2. 타 부서 협조·공문 ───────────────────────── */
    {
      id: 'collab', cat: 'public', order: 2,
      name: '타 부서 협조·공문 작성',
      short: '협조·공문',
      icon: '📮',
      desc: '업무협조·자료요청·회신·일정 안내 공문',
      examples: '업무협조 요청 · 자료 제출 요청 · 공식 회신 · 일정 안내 · 조치 결과 통보',
      asks: [
        { key: 'cTarget', opt: 'cTarget', required: true, label: '누구에게 보내는 공문인가요?', hint: '수신처를 정확히' },
        { key: 'cWhy', opt: 'cWhy', required: true, label: '공문의 목적은 무엇인가요?', hint: '' },
        { key: 'cForm', opt: 'cForm', required: true, label: '어떤 형식으로 보내나요?', hint: '갑지+본문 / 본문만 / 이메일' },
        { key: 'cDue', opt: 'cDue', required: false, label: '처리 기한을 명시할까요?', hint: '선택 사항' },
        { key: 'cAttach', opt: 'cAttach', required: false, label: '붙임 자료가 있나요?', hint: '선택 사항' }
      ],
      memo: {
        placeholder: '예) 시설팀에 본관 3층 회의실 냉난방기 교체 협조 요청 / 12월 18일 오전 작업, 2시간 소요 예상 / 사용 부서 협조 필요: 좌석 25석 임시 이전 / 담당 연락처: 시설관리팀 내선 1234',
        example: '시설관리팀에 본관 3층 회의실 냉난방기 교체 작업 협조를 요청드립니다. 12월 18일 오전 9시부터 2시간 정도 작업이 필요하고, 그동안 3층 회의실 사용이 어렵습니다. 25석 규모라 2층 소회의실로 임시 이전이 필요합니다. 담당은 시설관리팀 내선 1234입니다.'
      },
      tips: [
        '같은 내용을 받는 부서가 바로 처리할 수 있게, 요청 사항과 기한만 3줄로 다시 정리해줘.',
        '본문에 붙임 목록과 담당 연락처를 넣어 공문 형식에 맞게 다듬어줘.'
      ],
      template: {
        org: '공공기관의',
        expert: '공문·협조 문서 전문가',
        backdrop: '공공기관에서 타 부서·유관기관과 협조 문서를 15년 넘게 다뤄 온 공문 실무 전문가',
        principle: '받는 쪽이 근거·요청·기한을 한 번에 확인하고 바로 처리할 수 있도록, 갑지와 본문 구조를 지켜 씁니다.',
        noun: '공문',
        request: {
          tpl: '{target}에게 {why} 공문을 작성해 주세요. {due}',
          vars: {
            target: {
              by: 'cTarget',
              map: {
                'cTarget:dept': '협조를 요청받는 타부서·유관기관 담당자',
                'cTarget:vendor': '계약·용역사 담당자',
                'cTarget:citizen': '민원인',
                'cTarget:upper': '상급기관 담당자'
              },
              fallback: '수신처 담당자'
            },
            why: {
              by: 'cWhy',
              map: {
                'cWhy:coop': '업무 협조를 요청하는',
                'cWhy:data': '자료 제출을 요청하는',
                'cWhy:reply': '공식 회신을 보내는',
                'cWhy:schedule': '일정을 안내하는',
                'cWhy:result': '조치 결과를 통보하는'
              },
              fallback: '협조를 요청하는'
            },
            due: {
              by: 'cDue',
              map: {
                'cDue:fixed': '처리 기한과 제출 형식, 담당자 연락처를 본문에 한 줄로 명시해 주세요.',
                'cDue:open': '기한은 상대가 조정할 수 있게 여지를 두고, 담당자 연락처는 남겨 주세요.'
              },
              fallback: '처리 기한과 담당자 연락처는 상황에 맞게 제안해 주세요.'
            }
          }
        },
        format: {
          by: 'cForm',
          map: {
            'cForm:cover': 'collabCover',
            'cForm:body': 'collabBody',
            'cForm:email': 'collabEmail'
          },
          fallback: 'collabCover'
        },
        style: {
          by: 'cForm',
          map: {
            'cForm:email': '이메일 본문은 인사 → 요청 사항 → 기한 → 붙임 순서로 짧게 쓰고, 공문 번호와 시행일은 머리말에 표기해 주세요.'
          },
          fallback: '문체는 감정·추측 없이 요청 사항만 남기고, 존칭과 공문 용어를 문서 끝까지 일관되게 써 주세요.'
        },
        rules: [
          { when: { cDue: ['cDue:fixed'] }, texts: ['기한은 날짜와 시각까지 적고, 그날까지 어려울 때 연락할 담당자와 번호를 함께 적어 주세요.'] },
          { when: { cAttach: ['cAttach:yes'] }, texts: ['붙임 자료의 목록과 부수를 본문 끝에 표기하고, 개인정보가 담긴 자료는 암호화해 별도 송부해 주세요.'] },
          { when: { cAttach: ['cAttach:none'] }, texts: ['붙임이 없으면 본문 끝에 「붙임 없음」으로 표기해 주세요.'] }
        ],
        verify: '보내기 전에 ① 수신처·근거 공문 번호 ② 요청 사항과 기한 ③ 담당자 연락처·붙임 표시가 모두 들어갔는지 확인해 주세요.'
      }
    },

    /* ───────────────────────── 3. 이메일·메시지 ───────────────────────── */
    {
      id: 'mail', cat: 'public', order: 3,
      name: '이메일·메시지 작성',
      short: '이메일·메시지',
      icon: '✉️',
      desc: '거절·일정 독촉·협조 요청·사과 (눈치 보이는 메일 포함)',
      examples: '정중한 거절 · 일정·회신 독촉 · 협조·자료 요청 · 실수 사과·수습',
      asks: [
        { key: 'mailTo', opt: 'mailTo', required: true, label: '누구에게 보내나요?', hint: '관계에 따라 표현이 달라집니다' },
        { key: 'mailWhy', opt: 'mailWhy', required: true, label: '무엇을 이루려 하나요?', hint: '' },
        { key: 'mailTone', opt: 'mailTone', required: true, label: '말투는 어느 쪽이 좋나요?', hint: '' },
        { key: 'sensitive', opt: 'sensitive', required: false, label: '메일의 민감도', hint: '선택 사항' }
      ],
      memo: {
        placeholder: '예) 정기점검 용역사가 작업일을 12/20 → 12/13으로 앞당겨 달라고 요청 / 자재·인력 투입 일정상 12/18이면 가능 / 관계는 유지하면서 이번 요청은 정중히 거절하고 대안 날짜를 제시하고 싶음',
        example: '정기점검 용역사 담당자가 작업일을 12월 20일에서 12월 13일로 일주일 앞당겨 달라고 요청했습니다. 저희 자재·인력 투입 일정상 그대로는 어렵고, 12월 18일이면 맞출 수 있습니다. 관계는 유지하면서 이번 요청은 정중히 거절하고 대안 날짜를 제시하고 싶습니다.'
      },
      tips: [
        '같은 내용을 메신저용 3문장으로 줄여줘.',
        '사유는 그대로 두고, 상대가 부담을 덜 느끼도록 표현만 부드럽게 다듬어줘.'
      ],
      template: {
        org: '공공기관의',
        expert: '메일 커뮤니케이션 코치',
        backdrop: '공공기관에서 상사·타부서·외부 용역사와 주고받는 비즈니스 커뮤니케이션을 15년간 다뤄 온 코치',
        principle: '관계를 해치지 않으면서 원하는 결과를 얻도록, 상대가 읽고 바로 행동할 수 있는 메시지를 씁니다.',
        noun: '메일',
        request: {
          tpl: '{to} {?why}메일을 써 주세요. 관계를 해치지 않으면서 상대가 읽고 바로 행동할 수 있어야 합니다.',
          vars: {
            to: {
              by: 'mailTo',
              map: {
                'mailTo:boss': '상사·임원에게',
                'mailTo:peer': '타부서 동료에게',
                'mailTo:vendor': '외부 거래처·용역사 담당자에게'
              },
              fallback: '상대에게'
            },
            why: {
              by: 'mailWhy',
              map: {
                'mailWhy:refuse': '이번 요청은 정중히 거절하면서 대안을 제시하는',
                'mailWhy:push': '일정과 회신을 재촉하는',
                'mailWhy:request': '협조와 자료를 요청하는',
                'mailWhy:apology': '실수를 사과하고 수습 방안을 전하는'
              },
              fallback: ''
            }
          }
        },
        format: '제목 1개와 본문(인사 → 상황·사유 → 요청 사항(기한·형식 명시) → 마무리 인사)으로 구성해 주세요. 같은 내용을 메신저·유선 후속용 3~5문장 축약본으로도 주고, 공문으로 보낼 때는 수신처·결재선을 표기해 주세요.',
        style: {
          by: 'mailTone',
          map: {
            'mailTone:firm': '말투는 격식 있고 단호하게, 결론과 요청을 첫 문단에 두세요.',
            'mailTone:soft': '말투는 부드럽고 유연하게, 상대의 사정을 먼저 인정한 뒤 요청을 두세요.',
            'mailTone:short': '말투는 짧고 핵심만, 3문장 안에 요청과 기한만 남기세요.'
          },
          fallback: '말투는 정중하고 군더더기 없이, 결론과 요청이 한 번에 읽히게 써 주세요.'
        },
        rules: [
          { when: { sensitive: ['sensitive:boss'] }, texts: ['상사 보고용이므로 결론과 요청을 첫 문단에 두고, 사유는 간결하게 정리해 주세요.'] },
          { when: { sensitive: ['sensitive:emotion'] }, texts: ['감정적 표현은 빼고 사실과 요청만 남기되, 상대가 부담을 덜 느끼도록 표현을 다듬어 주세요.'] },
          { when: { sensitive: ['sensitive:publicok'] }, texts: ['외부에 공개되어도 문제가 없도록 내부 정보와 개인정보를 빼고 써 주세요.'] }
        ],
        verify: '보내기 전에 ① 요청 사항과 기한이 첫 화면에 보이는지 ② 상대가 다음에 할 일이 분명한지 ③ 감정적 표현이 남아 있지 않은지 확인해 주세요.'
      }
    },

    /* ───────────────────────── 4. 엑셀·데이터 정리 ───────────────────────── */
    {
      id: 'excel', cat: 'public', order: 4,
      name: '엑셀·데이터 정리',
      short: '엑셀·데이터',
      icon: '📊',
      desc: '수식·피벗·VBA·파이썬·SQL 오류 해결',
      examples: '수식 작성 · 피벗·집계 · VBA/파이썬 자동화 · SQL 조회 · 오류 해결',
      asks: [
        { key: 'tool', opt: 'tool', required: true, label: '어떤 도구를 쓰고 있나요?', hint: '' },
        { key: 'xlSituation', opt: 'xlSituation', required: true, label: '지금 어떤 상태인가요?', hint: '' },
        { key: 'depth', opt: 'depth', required: true, label: '설명은 어느 정도가 좋나요?', hint: '' }
      ],
      memo: {
        placeholder: '예) 점검일지 시트의 A열(일자), B열(시설명), D열(지적건수)에서 시설별·월별 합계를 요약 시트에 자동으로 채우고 싶음 / 원본 행은 매일 아래로 추가됨 / 시설명은 A2:A12에 미리 적혀 있음',
        example: '점검일지 시트의 A열(일자), B열(시설명), D열(지적건수)에서 시설별·월별 합계를 요약 시트에 자동으로 채우고 싶습니다. 원본 행은 매일 아래로 추가됩니다. 시설명은 A2:A12에 미리 적혀 있습니다.'
      },
      tips: [
        '방금 준 수식을 엑셀 2019에서도 돌아가게 바꿔줘.',
        '샘플 데이터 5행을 가정해 실제 계산 결과를 표로 보여줘.'
      ],
      template: {
        org: '공공기관의',
        expert: '데이터 업무 전문가',
        backdrop: '엑셀·구글 스프레드시트·VBA·파이썬 자동화를 공공기관 실무에서 15년 다뤄 온 데이터 업무 전문가',
        principle: '실무자가 복사해 바로 붙여 넣을 수 있는 답을 주고, 왜 그렇게 되는지도 한두 줄로 설명합니다.',
        noun: '작업',
        request: {
          tpl: '{?tool}{need}',
          vars: {
            tool: {
              by: 'tool',
              map: {
                'tool:excel': '지금 쓰는 도구는 엑셀 수식입니다.',
                'tool:sheets': '지금 쓰는 도구는 구글 스프레드시트입니다.',
                'tool:python': '지금 쓰는 도구는 파이썬 자동화입니다.',
                'tool:vba': '지금 쓰는 도구는 VBA 매크로입니다.',
                'tool:sql': '지금 쓰는 도구는 SQL 쿼리입니다.'
              },
              fallback: ''
            },
            need: {
              by: 'xlSituation',
              map: {
                'xl:build': '필요한 기능을 처음부터 만들어 주세요.',
                'xl:error': '지금 뜨는 오류 메시지의 원인을 찾아 고쳐 주세요.',
                'xl:slow': '느려진 파일이나 코드를 빠르게 개선해 주세요.',
                'xl:cleanup': '쌓인 데이터를 정리하고 통계를 낼 수 있게 만들어 주세요.'
              },
              fallback: '원하는 결과를 바로 쓸 수 있는 형태로 만들어 주세요.'
            }
          }
        },
        format: '답은 ① 바로 쓸 수식·코드 → ② 붙여 넣을 위치와 방법 → ③ 예상 결과 → ④ 흔한 오류와 대처 순서로 주세요. 코드는 복사 가능한 코드 블록으로 주고, 시트명·범위는 예시로 밝혀 주세요. 집계 결과는 원본 5행 정도로 손계산해 확인할 수 있게 근거를 함께 주세요.',
        style: {
          by: 'depth',
          map: {
            'depth:beginner': '설명은 초보자가 복사·붙여넣기만 해도 되도록 단계별로 써 주세요.',
            'depth:why': '왜 그렇게 되는지 원리도 한두 줄로 설명해 주세요.'
          },
          fallback: '설명은 필요한 만큼만, 복사해서 바로 쓸 수 있는 형태로 주세요.'
        },
        rules: [],
        verify: '답을 주기 전에 ① 수식·코드가 실제로 돌아가는 형태인지 ② 적용할 시트·범위가 분명한지 ③ 결과를 확인할 방법을 함께 줬는지 점검해 주세요.'
      }
    },

    /* ───────────────────────── 5. 회의록·문서 요약 ───────────────────────── */
    {
      id: 'summary', cat: 'public', order: 5,
      name: '회의록·문서 요약',
      short: '회의록·요약',
      icon: '📝',
      desc: '긴 회의록·문서 → 결론·할 일 추출',
      examples: '회의 녹취 · 긴 보고서·기사 · 이메일 스레드 · 결정사항·할 일 정리',
      asks: [
        { key: 'src', opt: 'src', required: true, label: '무엇을 요약하나요?', hint: '' },
        { key: 'focus', opt: 'focus', required: true, label: '무엇을 뽑아야 하나요?', hint: '' },
        { key: 'len', opt: 'len', required: true, label: '분량은 어느 정도인가요?', hint: '' }
      ],
      memo: {
        placeholder: '예) 오전 운영회의 녹취(부서장 + 3개 팀장 + 나, 약 50분) / 다음 주 예산 심의 전에 결정사항과 팀별 할 일만 뽑아 한 장으로 보고해야 함',
        example: '오늘 오전 운영회의 녹취입니다. 참석자는 부서장과 3개 팀장, 저를 포함해 6명이고 50분 분량입니다. 다음 주 예산 심의 전에 결정된 것과 팀별 할 일만 뽑아서 부서장님께 한 장으로 보고해야 합니다.'
      },
      tips: [
        '할 일만 뽑아서 담당자별로 묶어 표로 다시 정리해줘.',
        '결정되지 않고 넘어간 안건만 따로 뽑아줘.'
      ],
      template: {
        org: '공공기관의',
        expert: '요약 전문가',
        backdrop: '회의록과 긴 자료에서 의사결정에 필요한 정보만 뽑아내는 요약 전문가',
        principle: '원문에 없는 내용은 보태지 않고, 누가·언제·무엇을 하기로 했는지를 먼저 찾습니다.',
        noun: '정리',
        request: {
          tpl: '{src} {focus} 뽑아 주세요.',
          vars: {
            src: {
              by: 'src',
              map: {
                'src:meeting': '회의 녹취나 대화 기록에서',
                'src:longdoc': '긴 보고서나 기사에서',
                'src:thread': '이메일 스레드에서'
              },
              fallback: '긴 자료에서'
            },
            focus: {
              by: 'focus',
              map: {
                'focus:todo': '결정사항과 할 일(담당·기한)을',
                'focus:key3': '핵심 3줄과 리스크를',
                'focus:debate': '찬반 논거와 쟁점을'
              },
              fallback: '필요한 내용만'
            }
          }
        },
        format: '① 한 줄 결론 ② 핵심 요약 ③ 표(항목/담당/기한) ④ 리스크·확인 필요 사항 순서로 정리하고, 원문에 없는 추론은 넣지 말고 확인이 필요한 부분만 따로 표시해 주세요.',
        style: {
          by: 'len',
          map: {
            'len:half': '분량은 임원 보고용 반 페이지로 줄여 주세요.',
            'len:detail': '분량은 실무자가 바로 실행할 수 있게 충분히 상세히 정리해 주세요.'
          },
          fallback: '분량은 보고 한 장 안쪽으로 줄여 주세요.'
        },
        rules: [],
        verify: '정리한 뒤 ① 원문에 없는 내용을 보태지 않았는지 ② 담당·기한이 빠진 할 일이 없는지 ③ 결정과 보류를 구분했는지 확인해 주세요.'
      }
    },

    /* ───────────────────────── 6. 문제 해결·업무 검토 ───────────────────────── */
    {
      id: 'review', cat: 'public', order: 6,
      name: '문제 해결·업무 검토',
      short: '문제 해결·검토',
      icon: '🧭',
      desc: '원인 분석·규정 검토·대응방안·개선대책',
      examples: '문제 원인 분석 · 법령·규정 검토 · 대응방안 도출 · 개선대책 · 프로세스 개선',
      asks: [
        { key: 'issue', opt: 'issue', required: true, label: '어떤 검토가 필요한가요?', hint: '결과물의 성격' },
        { key: 'scope', opt: 'scope', required: true, label: '검토 범위는 어디까지인가요?', hint: '' },
        { key: 'basisType', opt: 'basisType', required: true, label: '무엇을 기준으로 판단하나요?', hint: '규정·법령·계약·선례' },
        { key: 'deliverable', opt: 'deliverable', required: false, label: '산출물 형태', hint: '선택 사항' }
      ],
      memo: {
        placeholder: '예) 민원이 반복되는 지점: 신청 서류 누락 안내가 전화로만 이루어짐 / 월 평균 12건 재방문 / 담당자 2명이 하루 1시간 이상 응대 / 온라인 안내문 개선과 서류 체크리스트 추가를 검토 중',
        example: '민원인이 서류를 빠뜨려 재방문하는 일이 반복되고 있습니다. 원인은 누락 안내가 전화로만 이루어지고, 온라인 안내문에 준비 서류 목록이 없기 때문으로 보입니다. 월 평균 12건이 재방문이고, 담당자 2명이 하루 1시간 이상 응대에 쓰고 있습니다. 온라인 안내문 개선과 서류 체크리스트 추가를 검토하려고 합니다.'
      },
      tips: [
        '대안을 비용·기간·리스크로 비교하는 표를 하나 더 만들어줘.',
        '결론을 먼저 3줄로 요약하고, 반대 논거도 함께 적어줘.'
      ],
      template: {
        org: '공공기관의',
        expert: '업무 검토·문제 해결 전문가',
        backdrop: '공공기관에서 규정 검토·원인 분석·개선대책 수립을 15년 넘게 맡아 온 업무 검토 전문가',
        principle: '현상·원인·영향·대안·권고 순서로 정리하고, 근거 없는 단정 대신 확인이 필요한 항목을 따로 표시합니다.',
        noun: '검토',
        request: {
          tpl: '지금 겪고 있는 문제를 {basis} 기준으로 검토해 {issue} 내용을 정리해 주세요. 검토 범위는 {scope}입니다.',
          vars: {
            basis: {
              by: 'basisType',
              map: {
                'basis:internal': '내부 규정·지침',
                'basis:law': '법령·조례',
                'basis:contract': '계약·협약',
                'basis:precedent': '선례·타 기관 사례'
              },
              fallback: '내부 규정·지침'
            },
            issue: {
              by: 'issue',
              map: {
                'issue:cause': '원인을 밝히는',
                'issue:law': '적용 법령·규정을 확인하는',
                'issue:response': '대응방안을 도출하는',
                'issue:improve': '개선대책을 세우는',
                'issue:process': '업무 프로세스를 개선하는'
              },
              fallback: '원인과 대안을 정리하는'
            },
            scope: {
              by: 'scope',
              map: {
                'scope:case': '단일 사안',
                'scope:team': '부서·팀 단위',
                'scope:org': '기관 전체'
              },
              fallback: '단일 사안'
            }
          }
        },
        format: '① 현상(무엇이 문제인지) ② 원인 ③ 영향(일정·비용·민원·안전) ④ 대안 비교(비용·기간·리스크) ⑤ 권고안 순서로 정리하고, 각 항목에 근거(규정 조항·수치·선례)를 붙여 주세요.',
        style: '문체는 결론과 근거가 한 줄씩 이어지게 쓰고, 추측은 「확인 필요」로 구분해 주세요.',
        rules: [
          { when: { deliverable: ['deliverable:brief'] }, texts: ['산출물은 보고용 요약으로, 첫 세 줄에 결론과 권고안을 먼저 적어 주세요.'] },
          { when: { deliverable: ['deliverable:plan'] }, texts: ['산출물은 실행 계획서로, 담당·기한·소요 자원을 표로 정리해 주세요.'] },
          { when: { deliverable: ['deliverable:opinion'] }, texts: ['산출물은 검토 의견서로, 검토 범위와 전제, 판단 근거를 먼저 밝혀 주세요.'] }
        ],
        verify: '마무리 전에 ① 현상과 원인을 섞지 않았는지 ② 대안마다 비용·기간·리스크를 비교했는지 ③ 근거가 없는 단정을 [확인 필요]로 표시했는지 점검해 주세요.'
      }
    },
    /* ───────────────────────── 7. 표·서식·대장 (v4.1 신설) ───────────────────────── */
    {
      id: 'form', cat: 'public', order: 7,
      name: '표·서식·대장 작성',
      short: '표·서식',
      icon: '📋',
      desc: '점검표·작업일지·관리대장·인력명부',
      examples: '점검표 · 작업일지 · 관리대장 · 명부 · 확인서 · 체크리스트',
      asks: [
        { key: 'formUse', opt: 'formUse', required: true, label: '표를 어떤 용도로 쓰나요?', hint: '용도가 열 구성을 정합니다' },
        { key: 'formCols', opt: 'formCols', required: true, label: '꼭 들어갈 열·항목은?', hint: '판정·서명 포함 여부' },
        { key: 'formRows', opt: 'formRows', required: true, label: '행 수·작성 방식은?', hint: '빈 서식인지 예시 포함인지' }
      ],
      memo: {
        placeholder: '예) 지하주차장 소방설비 월간 점검표 / 대상: 소화전 12기, 스프링클러 4개 구역 / 판정은 적합·부적합·해당없음 3단계 / 부적합이면 조치 담당과 조치기한을 적어야 함 / 작성자는 시설팀 담당, 확인자는 팀장',
        example: '지하주차장 소방설비 월간 점검표를 만들려고 합니다. 대상은 소화전 12기와 스프링클러 4개 구역입니다. 판정은 적합·부적합·해당 없음 3단계로 하고, 부적합이면 조치 담당과 조치기한을 적어야 합니다. 작성자는 시설팀 담당이고 확인자는 팀장입니다.'
      },
      tips: [
        '같은 내용을 엑셀 수식으로 합계·판정이 자동으로 계산되게 바꿔줘.',
        '이 표를 한 장 출력할 때 들어갈 머리말·결재란까지 붙여줘.'
      ],
      template: {
        org: '공공기관의',
        expert: '서식·표 설계 전문가',
        backdrop: '공공기관에서 점검표·대장·일지 서식을 15년 넘게 설계해 온 서식 실무 전문가',
        principle: '표 머리글·기재 요령·빈칸 처리·서명란까지, 현장에서 바로 인쇄해 쓸 수 있는 표를 만듭니다.',
        noun: '표',
        request: {
          tpl: '{use} 표를 만들어 주세요.',
          vars: {
            use: {
              by: 'formUse',
              map: {
                'form:check': '점검 결과를 항목별로 판정하는',
                'form:ledger': '대상을 누적 관리하는 대장',
                'form:log': '매일 기록하는 일지',
                'form:plan': '일정을 관리하는 계획표',
                'form:confirm': '확인·인수를 남기는 확인서'
              },
              fallback: '실무에서 쓰는'
            }
          }
        },
        format: '표는 ① 표 제목·작성 기준일 ② 머리글(열 이름·단위) ③ 본문 행 ④ 합계·판정 행 ⑤ 작성자·확인자 서명란 순서로 구성하고, 각 열의 기재 요령을 표 아래에 한 줄씩 적어 주세요. 빈칸은 「-」, 해당 없음은 「해당 없음」으로 표기 규칙을 정해 주세요.',
        style: {
          by: 'formRows',
          map: {
            'formrows:blank': '행은 빈 서식 20행으로 두고, 첫 2행만 예시 값으로 채워 주세요.',
            'formrows:sample': '실제 값 예시 5행을 채운 뒤 빈 행 15행을 이어 붙여 주세요.',
            'formrows:few': '행은 10행 이내로 간결하게 하고, 대신 기재 요령을 자세히 적어 주세요.'
          },
          fallback: '행 수는 용도에 맞게 정하고, 빈 서식으로 바로 쓸 수 있게 해 주세요.'
        },
        rules: [
          { when: { formCols: ['formcols:judge'] }, texts: ['판정 열(적합/부적합/해당 없음)과 조치 열을 반드시 넣고, 지적사항은 위험도(상·중·하) 순으로 정렬해 주세요.'] },
          { when: { formCols: ['formcols:sign'] }, texts: ['표 하단에 작성자·확인자 서명과 일시를 넣고, 인수인계 표라면 인수자 확인란을 따로 두세요.'] },
          { when: { formCols: ['formcols:amount'] }, texts: ['수량·단가·금액 열을 넣고 합계 행에서 자동 합산되는 계산식을 함께 적어 주세요.'] },
          { when: { formUse: ['form:ledger'] }, texts: ['누적 관리대장이므로 일련번호·등록일·처리 상태·담당 열을 넣고, 이월 건수를 첫 행에 표시해 주세요.'] },
          { when: { formUse: ['form:log'] }, texts: ['일지이므로 일시·위치·내용·조치·확인 순서로 열을 두고, 하루 단위로 페이지가 끊기게 해 주세요.'] }
        ],
        verify: '표를 넘기기 전에 ① 열 이름과 단위가 1:1로 맞는지 ② 합계·소계가 행 합과 일치하는지 ③ 빈칸·해당 없음 표기 규칙이 지켜졌는지 확인해 주세요.'
      }
    }
  ];
})(window.PW);
