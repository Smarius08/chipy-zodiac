#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
command -v python3 >/dev/null
command -v node >/dev/null
command -v npm >/dev/null
node -e 'if(Number(process.versions.node.split(".")[0])<22) throw Error("Node.js 22+ required")'
python3 scripts/unpack_assets.py
npm ci --no-audit --no-fund
python3 scripts/prepare_data.py
if [[ -d /opt/chipy-zodiac-tools/browsers ]]; then
  export PLAYWRIGHT_BROWSERS_PATH=/opt/chipy-zodiac-tools/browsers
fi
if ! node scripts/browser-doctor.mjs; then
  npx playwright install chromium
  node scripts/browser-doctor.mjs
fi
python3 scripts/preflight.py
