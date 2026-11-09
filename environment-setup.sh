#!/usr/bin/env bash
# Paste this standalone script into the chipy-zodiac Claude environment setup.
# Does not assume the repository has been cloned. Contains no credentials.
set -uo pipefail
ZODIAC_TOOLS_DIR=/opt/chipy-zodiac-tools
mkdir -p "$ZODIAC_TOOLS_DIR" || { echo "SETUP INCOMPLETE: cannot create tools directory; run scripts/setup.sh in-session."; exit 0; }
for tool in python3 node npm timeout; do
  command -v "$tool" >/dev/null || { echo "SETUP INCOMPLETE: missing $tool"; exit 0; }
done
node -e 'if(Number(process.versions.node.split(".")[0])<22)process.exit(1)' || { echo "SETUP INCOMPLETE: Node.js 22+ required."; exit 0; }
if ! timeout 90 npm install --prefix "$ZODIAC_TOOLS_DIR" --no-save --package-lock=false --no-audit --no-fund playwright@1.65.0; then
  echo "SETUP INCOMPLETE: npm install failed. Check registry.npmjs.org and run scripts/setup.sh in-session."
  exit 0
fi
export PLAYWRIGHT_BROWSERS_PATH="$ZODIAC_TOOLS_DIR/browsers"
if ! timeout 170 "$ZODIAC_TOOLS_DIR/node_modules/.bin/playwright" install --with-deps chromium; then
  echo "BROWSER SETUP INCOMPLETE: check browser CDN and OS package access. Source work can continue; visual verification is blocked."
  exit 0
fi
node --input-type=module -e "import('$ZODIAC_TOOLS_DIR/node_modules/playwright/index.mjs').then(async ({chromium})=>{const b=await chromium.launch({headless:true});await b.close();console.log('Chromium launch verified.');}).catch(e=>{console.error(e.message);process.exit(1);})" || {
  echo "BROWSER SETUP INCOMPLETE: launch failed; run repository doctor in-session."
  exit 0
}
echo "Environment tools ready. After project extraction, run bash scripts/setup.sh."
