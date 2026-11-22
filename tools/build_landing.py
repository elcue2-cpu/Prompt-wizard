#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Prompt Wizard — SEO 랜딩 페이지 생성기

landing/<slug>.html 6종과 sitemap.xml을 만든다.
· 배포 대상은 생성물(HTML)이고, 이 스크립트는 워크스페이스에서만 돈다.
· 모든 URL은 실제 Pages 주소(대문자 `Prompt-wizard`)를 쓴다 — 소문자 경로는 404다.
· 문구를 고칠 때는 이 파일의 PAGES 표만 고치고 다시 생성한다.

사용: python3 tools/build_landing.py
"""
import html
import os
import re
from urllib.parse import quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://elcue2-cpu.github.io/Prompt-wizard/'
LAST_MOD = '2026-11-22'
BRAND = 'Prompt Wizard'

# ---------------------------------------------------------------- 페이지 표
PAGES = [
    {
        'slug': 'public-report',
        'nav': '공공기관 보고서 작성',
        'title': '공공기관 보고서 작성 AI 프롬프트 · 결재·보고서 문장 만들기',
        'description': '내부결재·결과보고·검토보고를 개조식(□·ㅇ·-)으로 쓰는 AI 프롬프트를 3단계로 만드세요. 결재권자가 30초에 판단하도록 결론·근거·계획 순서를 자동 구성합니다.',
        'h1': '공공기관 보고서 작성 AI 프롬프트',
        'lead': [
            '보고서는 “무엇을 했는지”보다 “결재권자가 무엇을 결정해야 하는지”가 먼저 보여야 합니다. 그래서 프롬프트에 문서 성격, 결재권자가 판단할 목적, 개조식 서식, 직무별 점검 기준을 함께 넣어야 결과가 흔들리지 않습니다.',
            '이 페이지의 프롬프트 예시는 공공기관 실무 서식(□ 대제목 → ㅇ 중항목 → - 세부내용, 「~함/~임/~예정/~필요」)을 그대로 따릅니다. 위자드에서 8대 분야와 세부 업무를 고르면 그 분야의 판단 기준(예산 근거, 이해관계 조정, 성과지표)까지 문장에 붙습니다.'
        ],
        'solves': [
            ('결론이 뒤에 숨는 보고서', '결론 → 근거 → 추진계획 → 행정사항 순서를 프롬프트에 고정해, 첫 문단에서 승인 여부를 판단할 수 있게 합니다.'),
            ('근거 없는 수치', '기본 가드레일이 확인되지 않은 수치·날짜를 지어내지 못하게 막고, 모르면 [확인 필요]로 표시하게 합니다.'),
            ('감사에서 걸리는 표현', '감사·의회 요구자료는 요구 항목별 1:1 답변 구조로, 개인정보·미확정 계획은 빼도록 제외 조건을 겁니다.')
        ],
        'steps': [
            ('분야와 세부 업무 선택', '사무·행정, 인사·재무, 기획, IT, 기술, 시설, 현장, 안전 8개 분야 중 하나를 고르고 세부 업무를 지정합니다.'),
            ('문서 성격·목적·문체 선택', '내부결재·협조공문·감사 대응·계약 검토 중 하나, 목적, 문체를 칩으로 고릅니다.'),
            ('상황 메모를 채우고 복사', '숫자·기한·예산을 두세 줄 적으면 프롬프트가 완성됩니다. 복사해서 쓰는 AI에 붙여 넣습니다.')
        ],
        'example': """당신은 공공기관의 기획·예산·성과·민원을 아우르는 운영 실무를 15년 넘게 맡아 온 실무 문서 전문가입니다. 결재권자가 30초 안에 승인 여부를 판단하도록 결론과 근거 숫자를 앞세우고, 감사 지적을 받지 않을 구조로 씁니다.
저는 기획·운영·행정 직무에서 「주요사업 추진·관리」 업무를 담당하고 있습니다.
내부 결재권자가 계획 대비 실적과 미달 원인을 한눈에 파악할 수 있도록 보고서를 작성해 주세요.
상황은 다음과 같습니다.
12월 정기점검 용역 인력 2명 증원을 요청드립니다.
현재 1인당 점검 대상 320건, 야간 고장 대응 평균 41분, 11월에 2시간 초과 3건이 발생했습니다.
추가 인건비 월 480만 원, 외주 대체 시 월 720만 원이며 예산 잔액 1,200만 원 범위에서 처리 가능합니다.
개조식 보고서로 작성해 주세요. □ 대제목 → ㅇ 중항목 → - 세부내용 순으로 내려가고, 문장은 「~함 / ~임 / ~예정 / ~필요」로 끝맺어 주세요. 본문은 추진배경 → 현황 및 문제점 → 검토내용(대안 비교) → 추진계획(소요예산·일정·전결권 확인) → 행정사항 순서로 잡아 주세요.
특히 예산·규정 근거와 상위계획 정합성, 부서 간 역할·일정 조율, 계획 대비 성과지표(BSC)와 환류 기준으로 판단해 주세요.
다음 원칙은 반드시 지켜 주세요. 확인되지 않은 수치·날짜·사람·기관·조항은 지어내지 말고, 모르면 모른다고 쓰세요.""",
        'faq': [
            ('보고서 프롬프트에 꼭 들어가야 하는 항목은 무엇인가요?',
             '문서 성격(내부결재·협조공문·감사 대응·계약 검토), 결재권자가 결정할 목적, 문체(개조식·비교표·서술형), 그리고 확인되지 않은 수치를 지어내지 말라는 원칙입니다. 여기에 담당 직무의 점검 기준을 붙이면 결재 과정에서 되돌아오는 일이 줄어듭니다.'),
            ('개조식과 서술형 중 무엇을 골라야 하나요?',
             '내부 결재와 감사 대비는 개조식(□·ㅇ·-)이 안전합니다. 외부 제출용이나 위원회 보고처럼 읽는 사람이 처음 접하는 문서는 논리 서술형이 낫습니다. 위자드에서는 문체 칩 하나로 바꿀 수 있습니다.'),
            ('회사 기밀이 입력값으로 서버에 저장되나요?',
             '아니요. 프롬프트는 브라우저 안에서만 조립되고 입력값은 서버로 전송되지 않습니다. 즐겨찾기를 저장하면 그 내용만 사용자의 브라우저 저장소에 남고, 언제든 직접 삭제할 수 있습니다.'),
            ('완성된 프롬프트는 어디에 붙여 넣나요?',
             'ChatGPT, Claude, Gemini 등 사용하는 AI 대화창이면 됩니다. 위자드의 「1클릭 복사」로 복사한 뒤 대화창에 붙여 넣고, 마지막에 실제 상황 메모를 덧붙이면 됩니다.')
        ],
        'cta': ('보고서 프롬프트 만들기', 'public', 'biz', 'program', 'report', 'doc:internal|goal:status|tone:brief'),
        'related': ['official-document', 'meeting-summary', 'issue-review']
    },
    {
        'slug': 'official-document',
        'nav': '공문 작성',
        'title': '공공기관 공문 작성 AI 프롬프트 · 협조 요청·회신 문장',
        'description': '타부서·유관기관 협조공문을 갑지 서식(1. 관련 → 2. 위 호와 관련하여 → 가./나. → 붙임 → 끝.)으로 쓰는 AI 프롬프트. 수신 대상·목적·형식을 고르면 문장이 완성됩니다.',
        'h1': '공공기관 공문 작성 AI 프롬프트',
        'lead': [
            '공문은 형식이 곧 신뢰입니다. 「1. 관련」에 근거 공문을 밝히고, 「2. 위 호와 관련하여 … 협조 요청드립니다」로 요지를 쓰고, 세부사항은 「가./나.」로 나눈 뒤 「붙임」과 「끝.」으로 닫는 구조를 프롬프트에 그대로 넣습니다.',
            '대상이 타부서인지, 계약·용역사인지, 시민·민원인인지에 따라 높임말과 책임 범위가 달라집니다. 위자드는 수신 대상, 공문 목적, 형식(갑지+본문 / 본문만 / 이메일 공문)을 먼저 묻고 그에 맞는 문장만 조립합니다.'
        ],
        'solves': [
            ('형식이 매번 달라지는 공문', '갑지 서식 문장을 한 곳에서 관리해, 담당자가 바뀌어도 같은 구조로 나갑니다.'),
            ('기한·담당이 빠진 요청', '요청 사항마다 기한·제출 형식·담당 연락처를 한 줄로 특정하도록 문장 규칙을 넣습니다.'),
            ('책임 경계가 흐린 협조', '업무 범위와 책임 주체를 구분해 쓰도록 직무 기준을 붙입니다.')
        ],
        'steps': [
            ('수신 대상과 목적 선택', '타부서·유관기관, 계약·용역사, 시민·민원인, 상급기관 중 하나와 협조·자료·회신·일정·결과 통보 중 하나를 고릅니다.'),
            ('형식 선택', '갑지+본문, 본문만, 이메일 공문 중 실제로 보낼 형식을 고릅니다.'),
            ('관련 근거와 기한 메모', '근거 공문 번호, 요청 항목, 기한을 적고 복사합니다.')
        ],
        'example': """당신은 공공기관의 기획·예산·성과·민원을 아우르는 운영 실무를 15년 넘게 맡아 온 실무 문서 전문가입니다. 결재권자가 30초 안에 승인 여부를 판단하도록 결론과 근거 숫자를 앞세우고, 감사 지적을 받지 않을 구조로 씁니다.
저는 기획·운영·행정 직무에서 「문서·서무 관리」 업무를 담당하고 있습니다.
협조를 요청받는 타부서 담당자와 결재권자가 요청 내용과 기한을 바로 확인할 수 있도록 공문을 작성해 주세요.
상황은 다음과 같습니다.
12월 정기점검 일정 조정 협조 요청(관련: ○○-1234호, 2026.11.18.)
점검 대상 32개소 중 5개소는 야간에만 작업 가능, 12월 8~12일 희망
회신 기한은 11월 27일까지, 담당 연락처는 사무실 대표번호로 안내
공문 갑지 서식으로 작성해 주세요. 제목 → 「1. 관련: [근거 공문·계획]」 → 「2. 위 호와 관련하여 ~ 협조 요청드립니다」 → 「가. ~ / 나. ~」 세부사항 → 「붙임  1. ~ 1부.」 순서로 두고, 문서 마지막은 「끝.」으로 닫아 주세요. 문장은 「~바랍니다」·「~요청드립니다」로 끝맺고, 요청 사항에는 기한·제출 형식·담당 연락처를 한 줄로 특정해 주세요.
특히 예산·규정 근거와 상위계획 정합성, 부서 간 역할·일정 조율 기준으로 판단해 주세요.""",
        'faq': [
            ('협조공문 갑지와 본문은 어떻게 다른가요?',
             '갑지는 문서 번호·시행일·수신·제목을 담는 표지 역할이고, 본문은 「1. 관련 → 2. 요지 → 가./나. 세부 → 붙임 → 끝.」 순서로 쓰는 실제 내용입니다. 위자드에서 「본문만」을 고르면 갑지 부분을 생략한 문장이 나옵니다.'),
            ('감사·의회 요구자료도 공문 형식으로 쓰나요?',
             '아니요. 요구자료 답변은 개조식 보고서 구조가 안전합니다. 갑지 형식은 타부서·대외 협조공문에만 적용하고, 나머지는 개조식으로 조립하도록 분기해 두었습니다.'),
            ('이메일로 보내는 공문도 만들 수 있나요?',
             '가능합니다. 형식에서 「이메일 공문」을 고르면 제목(공문 제목) → 본문(관련 → 요청 사항 → 붙임) → 발신 부서·담당·연락처 순서로 정리됩니다.'),
            ('기관 이름이나 문서 번호가 자동으로 들어가나요?',
             '아니요. 실제 기관명·문서 번호는 넣지 않고, 사용자가 메모에 적은 값을 그 자리에 배치합니다. 확인되지 않은 번호를 지어내지 않도록 가드레일이 켜져 있습니다.')
        ],
        'cta': ('공문 프롬프트 만들기', 'public', 'offc', 'admin', 'collab', 'cTarget:dept|cWhy:coop|cForm:cover'),
        'related': ['public-report', 'business-email', 'meeting-summary']
    },
    {
        'slug': 'excel-automation',
        'nav': '엑셀 함수·자동화',
        'title': '엑셀 함수·자동화 AI 프롬프트 · 오류 해결과 데이터 정리',
        'description': '엑셀 수식, VBA 매크로, 파이썬 자동화, SQL 쿼리를 상황에 맞게 설명하는 AI 프롬프트. 초보자용 복붙 설명과 원리 설명을 골라 받고, 오류 메시지 해결까지 다룹니다.',
        'h1': '엑셀 함수·자동화 AI 프롬프트',
        'lead': [
            '엑셀 질문이 어긋나는 이유는 대부분 상황 설명이 빠져서입니다. 열 구성, 데이터 범위, 원하는 결과, 사용하는 버전을 함께 주면 같은 질문도 답의 질이 달라집니다.',
            '이 위자드는 도구(엑셀 수식·구글 스프레드시트·파이썬·VBA·SQL)와 상황(새로 짜기·오류 해결·느린 파일 개선·데이터 정리)을 먼저 고르게 하고, 설명 수준(초보자 복붙 / 원리까지)을 정해 프롬프트를 조립합니다.'
        ],
        'solves': [
            ('복붙해도 안 되는 수식', '열 이름과 범위, 결과 예시를 프롬프트에 넣어 실제 파일에 맞는 수식을 받습니다.'),
            ('원인을 모르는 오류', '오류 메시지와 직전에 바꾼 내용을 정리해 원인 → 수정 → 예방 순서로 답하게 합니다.'),
            ('매달 반복하는 작업', '파이썬·VBA·매크로로 옮길 때 필요한 입력·출력·예외 처리를 함께 설계합니다.')
        ],
        'steps': [
            ('도구와 상황 선택', '엑셀 수식, 구글 스프레드시트, 파이썬, VBA, SQL 중 하나와 새로 짜기·오류 해결·개선·정리 중 하나를 고릅니다.'),
            ('설명 수준 선택', '처음 쓰는 함수면 「초보자도 복붙만 하게」를, 응용이 필요하면 「원리까지」를 고릅니다.'),
            ('시트 구조를 메모', '열 이름, 데이터 범위, 원하는 결과 한 줄을 적고 복사합니다.')
        ],
        'example': """당신은 공공기관의 엑셀·데이터 자동화를 실무에서 15년 다뤄 온 실무 문서 전문가입니다. 사용자가 자기 파일에 바로 적용할 수 있도록 열 이름과 범위를 확인하고, 결과 예시까지 붙여 설명합니다.
저는 기획·운영·행정 직무에서 「BSC 성과지표 관리」 업무를 담당하고 있습니다.
초보자도 복사해 붙이면 바로 쓸 수 있도록 엑셀 수식을 만들어 주세요.
상황은 다음과 같습니다.
시트: '실적' — A열 부서명, B열 지표명, C열 목표, D열 실적, E열 측정월(2026-01 형식)
부서·지표별로 최근 3개월 평균 달성률을 구하고, 90% 미만이면 '미달'로 표시하고 싶습니다.
지표가 같은 행이 여러 개 있고, 측정월이 비어 있는 행은 계산에서 빼야 합니다.
수식과 함께 왜 그렇게 되는지 한 줄씩 설명하고, 붙여 넣을 위치를 알려 주세요.
특히 지표 정의·산식·측정 주기와 목표 대비 실적을 같은 기준으로 비교해야 합니다.
다음 원칙은 반드시 지켜 주세요. 확인되지 않은 수치·날짜·사람·기관·조항은 지어내지 말고, 모르면 모른다고 쓰세요.""",
        'faq': [
            ('엑셀 버전을 알려줘야 하나요?',
             '네. Microsoft 365, 2019, 2016처럼 버전을 적으면 동적 배열 함수(FILTER, XLOOKUP) 사용 가능 여부를 구분해 답합니다. 버전을 모르면 호환되는 함수로 먼저 제안하도록 요청하세요.'),
            ('VBA와 파이썬 중 무엇을 고르나요?',
             '그 파일을 계속 손으로 쓸 거라면 VBA가 편하고, 여러 파일을 한꺼번에 처리하거나 정기 실행이 필요하면 파이썬이 낫습니다. 위자드에서는 도구 선택만 바꾸면 문장이 그에 맞게 조립됩니다.'),
            ('오류 메시지는 어떻게 적어야 하나요?',
             '오류 문구 전체, 오류가 나는 셀·행, 직전에 바꾼 내용을 그대로 적는 것이 가장 빠릅니다. 메모에 세 줄로 정리해 넣으면 원인 → 수정 → 예방 순서로 답이 나옵니다.'),
            ('수식이 길어서 이해가 어려울 때는?',
             '설명 수준에서 「원리까지 간단히」를 고르면 각 함수의 역할과 계산 순서를 풀어 설명합니다. 초보자 모드는 복붙용 수식과 적용 위치만 짧게 제시합니다.')
        ],
        'cta': ('엑셀 프롬프트 만들기', 'public', 'biz', 'performance', 'excel', 'tool:excel|xl:build|depth:beginner'),
        'related': ['public-report', 'meeting-summary', 'issue-review']
    },
    {
        'slug': 'business-email',
        'nav': '업체·눈치 보는 이메일',
        'title': '업체 요청·눈치 보이는 이메일 AI 프롬프트 · 거절·독촉·사과',
        'description': '납기 독촉, 정중한 거절, 실수 사과, 협조 요청 메일을 상황과 상대에 맞춰 쓰는 AI 프롬프트. 상사·동료·거래처별 말투와 민감도를 골라 문장을 조립합니다.',
        'h1': '업체 요청·눈치 보이는 이메일 AI 프롬프트',
        'lead': [
            '답장이 늦어지는 메일에는 공통점이 있습니다. 요청이 여러 개 섞여 있고, 기한이 흐리고, 상대가 무엇을 해야 하는지 첫 문단에 없습니다. 프롬프트에 받는 사람, 목적, 말투, 민감도를 먼저 정해 두면 이 세 가지가 자동으로 정리됩니다.',
            '거래처에 납기를 재촉하면서도 관계를 해치지 않으려면 사실과 요청을 분리해야 합니다. 위자드는 「일정·회신 독촉」과 「부드럽고 유연하게」를 고르면 감정 표현 없이 사실 → 요청 → 기한 순서로 문장을 씁니다.'
        ],
        'solves': [
            ('거절이 어려운 요청', '정중하지만 단호한 거절 문장을 만들고, 대안 조건을 함께 제시하게 합니다.'),
            ('독촉이 무례해질까 걱정될 때', '사실과 요청을 분리하고 감정·추측을 빼는 규칙을 넣습니다.'),
            ('사과 메일의 책임 범위', '원인·영향·재발 방지·보상 범위를 구분해, 책임을 과하게 인정하지 않도록 씁니다.')
        ],
        'steps': [
            ('받는 사람과 목적 선택', '상사·임원, 타부서·동료, 외부 거래처 중 하나와 거절·독촉·요청·사과 중 하나를 고릅니다.'),
            ('말투와 민감도 선택', '격식·단호, 부드럽고 유연, 짧고 핵심만 중 하나를 고르고 민감도를 표시합니다.'),
            ('사실 관계를 메모', '무엇을 언제까지 요청했고 무엇이 늦어졌는지 두세 줄로 적습니다.')
        ],
        'example': """당신은 공공기관의 대외 협력과 계약 실무에서 15년 넘게 문서를 다뤄 온 실무 문서 전문가입니다. 감정과 추측을 빼고 사실 → 요청 → 기한 순서로 쓰되, 상대가 다음 행동을 바로 알 수 있게 씁니다.
저는 기획·운영·행정 직무에서 「민원 접수·처리」 업무를 담당하고 있습니다.
외부 거래처 담당자가 일정과 회신 기한을 분명히 알 수 있도록 부드럽고 유연한 말투로 메일을 작성해 주세요.
상황은 다음과 같습니다.
11월 4일 요청한 견적서가 아직 오지 않아 12월 발주 일정이 밀리고 있습니다.
11월 20일 1차 독촉 메일을 보냈고, 11월 26일까지 회신이 없으면 차순위 업체로 진행해야 합니다.
관계는 나쁘지 않고, 내년에도 함께 일할 업체입니다.
제목 → 인사 → 요청 배경(사실) → 요청 사항(기한·형식) → 양해와 대안 → 마무리 순서로 짧게 써 주세요. 감정적인 표현과 추측은 넣지 말고, 상대가 무엇을 언제까지 보내면 되는지 한 문장으로 분명히 적어 주세요.""",
        'faq': [
            ('납기 독촉 메일에서 가장 중요한 것은 무엇인가요?',
             '요청과 기한을 한 문장으로 분명히 하는 것입니다. 감정적인 표현이나 추측(「연락이 없어 걱정됩니다」)은 빼고, 무엇을 언제까지 어떤 형식으로 받으면 되는지 적으면 답장률이 올라갑니다.'),
            ('상사에게 보내는 사과 메일은 어떻게 달라야 하나요?',
             '원인과 영향, 이미 한 조치, 재발 방지를 순서대로 쓰고 변명은 넣지 않습니다. 위자드에서 「상사 보고」 민감도를 고르면 책임 범위를 과하게 인정하지 않도록 문장이 조정됩니다.'),
            ('거절 메일에서 대안을 꼭 제시해야 하나요?',
             '관계를 이어 갈 상대라면 제안하는 편이 좋습니다. 조건(일정·범위·비용)을 한 줄로 붙이면 거절이 아니라 조정 요청으로 읽힙니다.'),
            ('메일 본문만 받을 수 있나요?',
             '가능합니다. 가드레일에서 「바로 복붙할 본문만 출력」을 켜면 인사말·설명 없이 본문만 나옵니다.')
        ],
        'cta': ('이메일 프롬프트 만들기', 'public', 'offc', 'complaint', 'mail', 'mailTo:vendor|mailWhy:push|mailTone:soft'),
        'related': ['official-document', 'public-report', 'issue-review']
    },
    {
        'slug': 'meeting-summary',
        'nav': '회의록·문서 요약',
        'title': '회의록·문서 요약 AI 프롬프트 · 결정사항과 할 일 정리',
        'description': '회의 녹취, 긴 보고서, 이메일 스레드를 결정사항·할 일 중심으로 요약하는 AI 프롬프트. 담당·기한을 표로 뽑고, 임원용 반 페이지와 실무자용 상세를 골라 받습니다.',
        'h1': '회의록·문서 요약 AI 프롬프트',
        'lead': [
            '요약이 쓸모 있으려면 “무엇을 결정했고, 누가 언제까지 무엇을 하는가”가 남아야 합니다. 길이를 줄이는 요약은 회의록이 아니라 그냥 짧은 글입니다.',
            '위자드는 원문 성격(회의 녹취·긴 보고서·이메일 스레드)과 추출 초점(결정사항·핵심 3줄+리스크·찬반 쟁점), 분량(임원용 반 페이지·실무자용 상세)을 골라 요약 프롬프트를 만듭니다.'
        ],
        'solves': [
            ('결정사항이 묻히는 회의록', '결정 / 할 일 / 보류를 구분하고, 할 일은 담당·기한 표로 뽑습니다.'),
            ('빠진 리스크', '핵심 3줄과 함께 확인이 필요한 쟁점·전제를 따로 표시하게 합니다.'),
            ('원문에 없는 내용 추가', '원문에 없는 추론은 넣지 말고, 불명확하면 [원문 확인 필요]로 남기게 합니다.')
        ],
        'steps': [
            ('원문 성격 선택', '회의 녹취·대화, 긴 보고서·기사, 이메일 스레드 중 하나를 고릅니다.'),
            ('추출 초점과 분량 선택', '결정사항·할 일, 핵심 3줄+리스크, 찬반·쟁점 중 하나와 분량을 고릅니다.'),
            ('원문을 붙여 넣기', '프롬프트를 복사한 뒤 원문을 이어 붙여 AI에 전달합니다.')
        ],
        'example': """당신은 공공기관의 회의 운영과 문서 정리를 15년 넘게 맡아 온 실무 문서 전문가입니다. 원문에 있는 내용만으로 결정과 할 일을 구분하고, 불명확한 부분은 표시해 남깁니다.
저는 기획·운영·행정 직무에서 「운영 총괄·절차 관리」 업무를 담당하고 있습니다.
회의 참석자가 다음 행동을 바로 알 수 있도록 결정사항과 할 일 중심으로 정리해 주세요.
상황은 다음과 같습니다.
12월 정기점검 일정 조정 회의(참석 6명, 50분). 점검 32개소 중 5개소 야간 작업 필요, 인력 2명 증원은 예산 확인 후 결정, 협력사 통보는 총무팀이 담당.
회의록 형식: ① 한 줄 요약 ② 결정사항(표: 안건 / 결정 / 근거) ③ 할 일(표: 담당 / 내용 / 기한) ④ 보류·확인 필요 ⑤ 다음 회의 안건.
임원 보고용 반 페이지로 압축하고, 원문에 없는 추론은 넣지 말며 불명확하면 [원문 확인 필요]로 표시해 주세요.""",
        'faq': [
            ('회의 녹취를 그대로 넣어도 되나요?',
             '개인정보나 민감한 발언이 포함될 수 있으니 사내 규정을 먼저 확인하세요. 프롬프트 자체는 브라우저에서만 만들어지고 서버로 전송되지 않지만, 붙여 넣는 AI 서비스의 정책은 별개입니다.'),
            ('할 일에 담당과 기한이 없으면 어떻게 하나요?',
             '프롬프트가 담당·기한 열을 비워 두고 [미정]으로 표시합니다. 회의에서 정하지 않은 것을 지어내지 않도록 하는 것이 기본값입니다.'),
            ('임원용과 실무자용은 무엇이 다른가요?',
             '임원용은 결정과 리스크 중심으로 반 페이지, 실무자용은 논의 경과와 세부 할 일까지 상세히 정리합니다. 분량 칩만 바꾸면 됩니다.'),
            ('긴 보고서 요약에도 쓸 수 있나요?',
             '가능합니다. 원문 성격에서 「긴 보고서·기사」를 고르면 핵심 주장 → 근거 → 한계 순서로 요약합니다.')
        ],
        'cta': ('요약 프롬프트 만들기', 'public', 'biz', 'sop', 'summary', 'src:meeting|focus:todo|len:half'),
        'related': ['public-report', 'excel-automation', 'issue-review']
    },
    {
        'slug': 'issue-review',
        'nav': '문제 해결·법령 검토',
        'title': '문제 해결·법령 검토 AI 프롬프트 · 원인 분석과 대응방안',
        'description': '업무 문제의 원인 분석, 법령·규정 검토, 대응방안 도출을 현상 → 원인 → 영향 → 대안 비교 → 권고 순서로 정리하는 AI 프롬프트. 판단 기준과 범위를 먼저 정합니다.',
        'h1': '문제 해결·법령 검토 AI 프롬프트',
        'lead': [
            '문제 해결 문서에서 자주 빠지는 것은 “무엇을 기준으로 판단했는가”입니다. 내부 규정인지, 법령·조례인지, 계약·협약인지에 따라 같은 사실도 결론이 달라집니다.',
            '위자드는 검토 유형(원인 분석·법령 검토·대응방안·개선대책·프로세스 개선), 범위(단일 사안·부서·기관 전체), 판단 기준을 먼저 고르게 하고, 현상 → 원인 → 영향 → 대안 비교(비용·기간·리스크) → 권고 순서로 조립합니다.'
        ],
        'solves': [
            ('결론이 안 서는 검토보고', '판단 기준을 명시하고, 기준별로 결론이 갈리는 지점을 표시하게 합니다.'),
            ('근거 없는 법령 해석', '조문 인용은 기준일과 개정 여부를 함께 확인하고, 불명확하면 [원문 확인 필요]로 남깁니다.'),
            ('대안 비교가 빠진 보고', '비용·기간·리스크를 같은 표에서 비교하고 권고안 하나를 고르게 합니다.')
        ],
        'steps': [
            ('검토 유형과 범위 선택', '원인 분석, 법령·규정 검토, 대응방안, 개선대책, 프로세스 개선 중 하나와 단일 사안·부서·기관 전체를 고릅니다.'),
            ('판단 기준 선택', '내부 규정·지침, 법령·조례, 계약·협약, 선례·타 기관 중 무엇을 기준으로 볼지 정합니다.'),
            ('사실 관계를 메모', '무엇이 문제이고 언제부터 발생했는지, 이미 확인한 자료를 적습니다.')
        ],
        'example': """당신은 공공기관의 개인정보·정보보안과 규정 검토를 15년 넘게 맡아 온 실무 문서 전문가입니다. 사실과 해석을 구분하고, 적용 조항과 기준일을 밝히며, 확인되지 않은 조문은 지어내지 않습니다.
저는 시스템·IT 보안 직무에서 「개인정보·정보보안 관리」 업무를 담당하고 있습니다.
검토 결과를 결재권자가 바로 판단할 수 있도록 현상 → 원인 → 영향 → 대안 비교 → 권고 순서로 정리해 주세요.
상황은 다음과 같습니다.
외부 업체가 운영하는 홈페이지에서 수집한 상담 신청 데이터를 내부 시스템으로 매일 이관하고 있습니다.
위탁 계약에는 이관·보관 조항이 있고, 파기 조항은 없습니다. 접근 권한은 업체 담당자 3명에게 부여되어 있습니다.
최근 개인정보 처리방침을 개정했고, 위탁 현황 공개 자료에는 이 업체가 빠져 있습니다.
판단 기준은 내부 규정·지침과 개인정보 관련 법령이며, 범위는 단일 사안입니다.
확인이 필요한 조항은 [원문·개정 여부 확인 필요]로 표시하고, 대안은 2~3개를 비용·기간·리스크로 비교해 권고안 하나를 골라 주세요.""",
        'faq': [
            ('법령 검토에서 AI 답변을 그대로 써도 되나요?',
             '조문 번호와 개정 여부는 반드시 원문으로 확인해야 합니다. 프롬프트에 「기준일·출처·개정 여부 확인」 가드레일을 켜면 불명확한 인용을 [원문 확인 필요]로 표시합니다.'),
            ('내부 규정만 있는 사안도 검토할 수 있나요?',
             '가능합니다. 판단 기준에서 「내부 규정·지침」을 고르면 규정 조항 → 적용 판단 → 예외 사유 순서로 정리합니다.'),
            ('대안 비교는 어떤 항목으로 하나요?',
             '비용, 기간, 리스크, 실행 난이도를 기본으로 합니다. 사안에 따라 인력·민원 영향을 추가할 수 있습니다.'),
            ('감사 지적에 대한 답변에도 쓸 수 있나요?',
             '가능합니다. 검토 유형에서 「개선대책 수립」을 고르면 지적사항 → 원인 → 개선대책 → 이행기한·담당 순서로 조립됩니다.')
        ],
        'cta': ('검토 프롬프트 만들기', 'public', 'it', 'privacy', 'review', 'issue:cause|scope:case|basis:internal'),
        'related': ['public-report', 'official-document', 'meeting-summary']
    }
]

# ---------------------------------------------------------------- 렌더링


def esc(s):
    return html.escape(str(s), quote=True)


def cta_href(p):
    _, cat, job, task, out, opt = p['cta']
    return ('../?cat=%s&job=%s&task=%s&out=%s&opt=%s'
            % (quote(cat), quote(job), quote(task), quote(out), quote(opt, safe='')))


def tool_links(p):
    href = cta_href(p)
    items = [
        ('<a class="inline-cta" href="%s">이 조건으로 위자드에서 바로 시작하기 →</a>' % esc(href)),
        ('<a class="inline-cta" href="../">프롬프트 위자드 전체 도구 보기</a>')
    ]
    for slug in p['related']:
        other = next(x for x in PAGES if x['slug'] == slug)
        items.append('<a class="inline-cta" href="%s.html">%s</a>' % (esc(slug), esc(other['nav'])))
    return '\n      '.join(items)


def faq_json(p):
    rows = []
    for q, a in p['faq']:
        rows.append(
            '{"@type":"Question","name":%s,"acceptedAnswer":{"@type":"Answer","text":%s}}'
            % (json_str(q), json_str(a))
        )
    return ('{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[%s]}'
            % ','.join(rows))


def json_str(s):
    out = ['"']
    for ch in str(s):
        if ch == '"':
            out.append('\\"')
        elif ch == '\\':
            out.append('\\\\')
        elif ch == '\n':
            out.append('\\n')
        elif ch == '<':
            out.append('\\u003c')
        elif ch == '>':
            out.append('\\u003e')
        elif ch == '&':
            out.append('\\u0026')
        else:
            out.append(ch)
    out.append('"')
    return ''.join(out)


def render(p):
    canonical = SITE + 'landing/' + p['slug'] + '.html'
    solves = '\n        '.join(
        '<article class="card-mini"><h3>%s</h3><p>%s</p></article>' % (esc(t), esc(d))
        for t, d in p['solves'])
    steps = '\n        '.join(
        '<li><b>%s</b><p>%s</p></li>' % (esc(t), esc(d))
        for t, d in p['steps'])
    faq = '\n        '.join(
        '<details class="faq"><summary>%s</summary><p>%s</p></details>' % (esc(q), esc(a))
        for q, a in p['faq'])
    lead = '\n      '.join('<p>%s</p>' % esc(t) for t in p['lead'])
    cta_label = esc(p['cta'][0])
    href = esc(cta_href(p))

    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>{esc(p['title'])}</title>
<meta name="description" content="{esc(p['description'])}">
<meta name="robots" content="index,follow">
<meta name="theme-color" content="#4a5cf5">
<link rel="canonical" href="{esc(canonical)}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="{BRAND}">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="{esc(p['title'])}">
<meta property="og:description" content="{esc(p['description'])}">
<meta property="og:url" content="{esc(canonical)}">
<meta property="og:image" content="{esc(SITE)}assets/img/og-default.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(p['title'])}">
<meta name="twitter:description" content="{esc(p['description'])}">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='88'%3E%E2%9C%A8%3C/text%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/landing.css">
</head>
<body>

<header class="lp-top">
  <a class="lp-brand" href="../"><span class="lp-mark" aria-hidden="true">✦</span> {BRAND}</a>
  <nav class="lp-nav" aria-label="활용 가이드">
    <a href="public-report.html">보고서</a>
    <a href="official-document.html">공문</a>
    <a href="excel-automation.html">엑셀</a>
    <a href="business-email.html">이메일</a>
    <a href="meeting-summary.html">요약</a>
  </nav>
</header>

<main class="lp">
  <article>
    <p class="lp-crumb"><a href="../">{BRAND}</a> › {esc(p['nav'])}</p>
    <h1>{esc(p['h1'])}</h1>
    <div class="lp-lead">
      {lead}
    </div>

    <p class="lp-cta-row">
      <a class="lp-cta" href="{href}">{cta_label} →</a>
      <span class="lp-cta-note">3단계 선택, 30초면 끝납니다. 설치·회원가입 없이 무료입니다.</span>
    </p>

    <section>
      <h2>무엇을 해결하나요</h2>
      <div class="lp-cards">
        {solves}
      </div>
    </section>

    <section>
      <h2>사용 방법 3단계</h2>
      <ol class="lp-steps">
        {steps}
      </ol>
    </section>

    <section>
      <h2>실제 완성 프롬프트 예시</h2>
      <p>아래는 이 페이지의 프리셋으로 만든 프롬프트입니다. 그대로 복사해 쓰거나, 위자드에서 자기 상황으로 바꿔 다시 만들 수 있습니다.</p>
      <pre class="lp-prompt"><code>{esc(p['example'])}</code></pre>
      <p class="lp-cta-row">
        <a class="lp-cta" href="{href}">내 상황으로 프롬프트 만들기 →</a>
      </p>
    </section>

    <!-- 광고 자리(랜딩): 승인 전에는 스크립트가 슬롯을 그리지 않습니다 -->
    <div class="ad-slot" data-ad-slot="landing" hidden aria-hidden="true"></div>

    <section>
      <h2>자주 묻는 질문</h2>
      {faq}
    </section>

    <section>
      <h2>관련 도구</h2>
      <p class="lp-links">
      {tool_links(p)}
      </p>
    </section>
  </article>
</main>

<footer class="lp-foot">
  <p>프롬프트는 브라우저 안에서만 조립되며, 입력값은 서버로 전송되지 않습니다.</p>
  <p><a href="../">Prompt Wizard</a> · <a href="../privacy.html">개인정보처리방침</a></p>
</footer>

<script type="application/ld+json">{faq_json(p)}</script>
<script defer src="../assets/js/data/config.js"></script>
<script defer src="../assets/js/ads.js"></script>
</body>
</html>
"""


def sitemap():
    urls = [SITE]
    urls += [SITE + 'landing/' + p['slug'] + '.html' for p in PAGES]
    urls.append(SITE + 'privacy.html')
    rows = '\n'.join(
        '  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>%s</priority>\n  </url>'
        % (esc(u), LAST_MOD, '1.0' if u == SITE else '0.8')
        for u in urls)
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            + rows + '\n</urlset>\n')


def main():
    out_dir = os.path.join(ROOT, 'landing')
    os.makedirs(out_dir, exist_ok=True)
    for p in PAGES:
        path = os.path.join(out_dir, p['slug'] + '.html')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(render(p))
        print('wrote', os.path.relpath(path, ROOT), os.path.getsize(path), 'bytes')
    sm = os.path.join(ROOT, 'sitemap.xml')
    with open(sm, 'w', encoding='utf-8') as f:
        f.write(sitemap())
    print('wrote sitemap.xml', os.path.getsize(sm), 'bytes')

    # 간단한 자체 점검 — 생성물이 비어 있거나 URL 표기가 어긋나면 바로 알린다
    bad = []
    for p in PAGES:
        body = open(os.path.join(out_dir, p['slug'] + '.html'), encoding='utf-8').read()
        if 'prompt-wizard/' in body:
            bad.append(p['slug'] + ': 소문자 URL')
        if 'elcue2-cpu.github.io/Prompt-wizard/' not in body:
            bad.append(p['slug'] + ': 대문자 URL 없음')
        if body.count('<h1>') != 1:
            bad.append(p['slug'] + ': h1 개수')
        if len(p['description']) > 155:
            bad.append(p['slug'] + ': description 155자 초과 (%d)' % len(p['description']))
    if bad:
        raise SystemExit('생성물 점검 실패: ' + ', '.join(bad))
    print('OK — %d pages' % len(PAGES))


if __name__ == '__main__':
    main()
