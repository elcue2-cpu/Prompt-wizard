#!/usr/bin/env bash
# prompt-wizard 배포: 공개 저장소가 준비되면 실행한다.
# 사용: ./deploy.sh [owner/repo]
set -euo pipefail
REPO="${1:-elcue2-cpu/prompt-wizard}"
cd "$(dirname "$0")"

echo "== 1. 저장소 확인 =="
gh repo view "$REPO" --json name,visibility,url,defaultBranchRef 2>&1 | head -5

echo "== 2. 원격 설정 및 푸시 =="
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/$REPO.git"
git add -A
git -c user.name=elcue2-cpu -c user.email=elcue2-cpu@users.noreply.github.com \
    commit -m "GitHub Pages 배포 워크플로 추가" || echo "(커밋할 변경 없음)"
git push -u origin main

echo "== 3. Pages API 시도 (권한 없으면 워크플로가 활성화한다) =="
gh api -X POST "repos/$REPO/pages" -f build_type=workflow 2>&1 | head -3 || true

echo "== 4. 워크플로 실행 대기 =="
sleep 10
gh run list -R "$REPO" --limit 3 2>&1 | head -5
