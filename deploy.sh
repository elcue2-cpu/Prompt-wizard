#!/usr/bin/env bash
# prompt-wizard 배포: index.html을 main에 푸시하고 GitHub Pages 응답을 확인한다.
# 사용: ./deploy.sh [owner/repo]
set -euo pipefail
REPO="${1:-elcue2-cpu/prompt-wizard}"
URL="https://elcue2-cpu.github.io/Prompt-wizard/"
cd "$(dirname "$0")"

echo "== 1. 저장소 확인 =="
gh repo view "$REPO" --json name,visibility,url 2>&1 | head -5

echo "== 2. 푸시 =="
git remote get-url origin >/dev/null 2>&1 || git remote add origin "https://github.com/$REPO.git"
git add -A
git -c user.name=elcue2-cpu -c user.email=elcue2-cpu@users.noreply.github.com \
    commit -m "프롬프트 위자드 갱신" || echo "(커밋할 변경 없음)"
git push origin main

echo "== 3. Pages 응답 확인 (최대 90초) =="
for i in $(seq 1 18); do
  code=$(curl -sS -o /tmp/pw_live.html -m 20 -w '%{http_code}' "$URL" || true)
  echo "$(date +%H:%M:%S) $URL -> $code"
  [ "$code" = "200" ] && { md5sum /tmp/pw_live.html index.html; exit 0; }
  sleep 5
done
echo "Pages가 응답하지 않습니다. Settings → Pages (Source: Deploy from a branch, main / root)를 확인하세요."
exit 1
