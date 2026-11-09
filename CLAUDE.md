# Chipy Zodiac HTML mockup
Read README.md, docs/CURRENT-REQUIREMENTS.md and BUILD-PROMPT.txt before implementation.
The user requests a full interactive mockup, using the selected Figma direction and current Jira behavior.
All original attachments are under sources/; archived project MD files under docs/handoff/; current Jira description snapshots under docs/jira/.
Current explicitly agreed November requirements supersede outdated October wireframe assumptions as documented in docs/CURRENT-REQUIREMENTS.md. Do not silently blend approaches.

Use the first overall Figma design (14463:7805), wide outlook (14463:7879), compact Other Signs (14463:8329). Do not use panel 14463:9100.
See references/figma/banner-nodes.csv for all 48 responsive frames, asset-manifest.json for local exports/raw assets and index.html for visual references.
Use actual assets, live semantic HTML controls and exact approved copy. Never use a painted form screenshot as the functional UI.
Build one self-contained output/zodiac-lucky-day-full-mockup.html. Do not include scripts/prepare_data.py, old ENGINE or scoring formulas in the browser.
data/sign-levels-*.json contain build-time verified level fixtures only; data/approved-sign-messages.json and data/approved-personal-messages.json are separate pools.
Personal result fixtures/backend adapter must be implemented honestly; do not return one fabricated score for arbitrary inputs.
No production endpoint, live site deployment, Jira write or Figma edit is requested.
Preserve TBDs. For unresolved requirements quote exact sources, explain impact and continue independent work. Proposed visuals must be labelled as proposals in review notes.
Keep preview controls outside the product layout. Full prompt and existing QA checklist govern verification.
Run bash scripts/setup.sh; npm run preflight; npm run doctor. If browser setup fails, source/fixture work can continue, but visual testing is blocked.
After building run npm run test:smoke, then test all full interaction requirements; the smoke harness alone is insufficient.
Do not claim environment installation, browser testing or production readiness without evidence. Do not commit or push unless the user authorizes it.


Repository delivery: run python3 scripts/unpack_assets.py before opening local Figma references if setup has not yet run. The standard setup command already does this.
