#!/usr/bin/env bash
# prompt-wizard 배포: v4 검증 게이트를 통과해야만 main에 푸시한다.
# 사용: ./deploy.sh [owner/repo]
#   게이트 경로는 기본 ../../work/pw_verify_v4.sh 이고, PW_VERIFY 환경변수로 바꿀 수 있다.
set -euo pipefail
REPO="${1:-elcue2-cpu/prompt-wizard}"
URL="https://elcue2-cpu.github.io/Prompt-wizard/"
VERIFY="${PW_VERIFY:-../../work/pw_verify_v4.sh}"
cd "$(dirname "$0")"

echo "== 0. v4 검증 게이트 =="
if [ ! -f "$VERIFY" ]; then
  echo "검증 스크립트를 찾을 수 없습니다: $VERIFY"
  echo "배포 게이트 없이는 푸시하지 않습니다. PW_VERIFY 환경변수로 경로를 지정하세요."
  exit 2
fi
bash "$VERIFY"

echo "== 1. 저장소 확인 =="
gh repo view "$REPO" --json name,visibility,url 2>&1 | head -5

echo "== 2. 푸시 =="
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
git add -A
git -c user.name=elcue2-cpu -c user.email=elcue2-cpu@users.noreply.github.com \
    commit -m "${PW_COMMIT_MSG:-프롬프트 위자드 v4 배포}" || echo "(커밋할 변경 없음)"
git push origin main

echo "== 3. v4.0 태그 =="
if git rev-parse -q --verify refs/tags/v4.0 >/dev/null; then
  echo "v4.0 태그가 이미 있습니다."
else
  git -c user.name=elcue2-cpu -c user.email=elcue2-cpu@users.noreply.github.com \
      tag -a v4.0 -m "Prompt Wizard v4.0 — 4단계 위자드·품질 점검·즐겨찾기·SEO 랜딩"
  git push origin v4.0
fi

echo "== 4. Pages 응답 확인 (최대 120초) =="
for i in $(seq 1 24); do
  code=$(curl -sS -o /tmp/pw_live.html -m 20 -w '%{http_code}' "$URL" || true)
  echo "$(date +%H:%M:%S) $URL -> $code"
  if [ "$code" = "200" ]; then
    md5sum /tmp/pw_live.html index.html
    break
  fi
  sleep 5
done

echo "== 5. 새 파일 반영 확인 =="
for path in sitemap.xml robots.txt privacy.html landing/public-report.html assets/js/quality.js; do
  code=$(curl -sS -o /dev/null -m 20 -w '%{http_code}' "${URL}${path}" || true)
  echo "  ${path} -> ${code}"
  [ "$code" = "200" ] || echo "  (아직 반영 전일 수 있습니다 — Pages 빌드를 확인하세요)"
done
