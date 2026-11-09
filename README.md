# Chipy Zodiac — implementation starter kit
Prepared 9 November 2026. This is the source/dependency package for the requested HTML mockup; the finished product page has not been built.

## Start in your chipy-zodiac Claude Code environment
1. Extract this package into your project/repository. Keep its folder structure. If you extract into a subfolder, work from that folder.
2. Optionally load environment-setup.sh into the environment's Setup script setting. It installs Playwright 1.65.0 and Chromium in a reusable tool directory without needing the repository to exist yet.
The Figma artwork is stored in asset-packs/ as verified ZIP files. The setup command automatically restores all 414 original assets to assets/figma/. No manual unpacking is needed.

3. In the Claude Code session, run:
   ```bash
   bash scripts/setup.sh
   npm run preflight
   npm run doctor
   ```
4. Give Claude the text in START-HERE.txt. CLAUDE.md points it to the build prompt and source files.
5. The deliverable belongs at output/zodiac-lucky-day-full-mockup.html. After it exists:
   ```bash
   npm run test:smoke
   npm run serve
   ```
   The preview server is at http://127.0.0.1:8000; use your platform's preview/port controls to view it. Opening the finished self-contained file directly must also work.

I cannot remotely configure your Claude environment from this ChatGPT session. The script and settings are prepared; run them in the selected environment to establish readiness. No GitHub repository was created, changed or pushed.

## Dependencies
- Node.js 22+ and npm, for development/browser QA.
- Python 3.10+; standard library only, for fixture preparation and integrity checks.
- Playwright 1.65.0, pinned in package.json and package-lock.json.
- Chromium matched to that Playwright version, installed by the setup script.
- Linux browser system libraries, installed by the optional environment script's playwright install --with-deps chromium.
- No React, Vite, bundler, PHP server or Python pip packages are required for this offline HTML mockup.
- The final page must have no package/runtime dependency. Embed the selected assets and data in the output HTML.
No credentials are included. Live Figma/Jira access is optional for refreshing the supplied snapshots and resolving gaps, not for reading the bundled files.

## Included
- BUILD-PROMPT.txt: full implementation prompt.
- sources/: both original uploaded HTML files, unchanged.
- docs/handoff/: all eight original project Markdown files, unchanged.
- docs/jira/: 20 Jira description snapshots including the parent, all 14 subtasks and inherited tool/math/backend tasks. Snapshot descriptions are not a live comment/history export.
- docs/CURRENT-REQUIREMENTS.md: reconciliations, remaining gaps and source limitations.
- references/figma/: all 48 banner frame mappings, full-frame exports, asset index and machine-readable asset manifest.
- assets/figma/: downloaded Figma exports, original raster assets and SVGs, deduplicated by SHA-256.
- data/: 12 signs' Reference Data; exact 48 approved sign messages; 40 approved personal messages; calendar palette table retaining Cancer TBDs; verified sign-level fixtures for 2026, 2027 and leap-year 2028.
- scripts/: setup, data preparation, preflight, browser readiness and initial-render smoke check.
- environment-setup.sh: standalone environment setup script.
- docs/ENVIRONMENT.md: access requirements and troubleshooting.
- docs/VERIFICATION.md: actual checks performed and their limits.
- SHA256SUMS: checksums of package files, excluding itself and generated/install directories.

The asset manifest records capped parent exports. Targeted exports for required simulator icons and individual result hands/orbs supplement the truncated parent collections. Full decorative libraries or unused assets are not promised.

## Source fidelity
The uploaded wireframe contains obsolete behavior and browser calculation code. It is a structural/source reference, not implementation truth.
All 48 sign messages match BFC-56885 verbatim despite the old copy-review page's draft labels.
All 12 desktop and 36 responsive banner exports are available locally. Some Figma labels incorrectly say Scorpio; use node mappings. Aries responsive artwork has incorrect painted reference values; render corrected live text from Jira.
Use raw assets for decoration and exported full frames for comparison. Do not ship full-frame screenshots as the functional form.

## Verification
npm run preflight checks files, messages, date fixtures and asset integrity. It does not certify UI behavior.
npm run doctor additionally launches Chromium on a local test page.
npm run test:smoke needs the finished HTML and checks initial render at 1920, 768, 600, 360 and 320 widths. Full validation/date-picker/result/calendar interaction checks in BUILD-PROMPT.txt still need implementation and execution.
Browser binaries/node_modules are deliberately not distributed. Install using the pinned lockfile in your environment.

