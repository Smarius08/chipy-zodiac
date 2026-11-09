# Chipy Zodiac mockup: review note
Deliverable: `output/zodiac-lucky-day-full-mockup.html` (self-contained, opens from disk). Source: `src/template.html`; rebuild with `node scripts/build_mockup.mjs`. Checks: `npm run test:smoke`, `node scripts/qa-interaction.mjs`. Nothing was committed, pushed, deployed, or written to Jira/Figma.

## Environment / access (actually run)
- `bash scripts/setup.sh`: **stops** at `unpack_assets.py` ("Missing asset pack: asset-packs/figma-assets-01.zip"). The 414 Figma assets and the ZIPs were not uploaded (per instruction, not retried). `asset-manifest.json`, `index.html` at repo root do not exist (the manifest is under `references/figma/`).
- Run individually: `npm ci` OK; `prepare_data.py` OK (2026/2027/2028 verified, 365/365/366 dates per sign); `preflight.py` passes all source/message/fixture checks, then **fails at the asset-hash step** (assets absent). `browser-doctor` fails with the stock Playwright launch (browser revision mismatch) and **passes** with the preinstalled Chromium (`CHROMIUM_PATH=/opt/pw-browsers/chromium`; I added that optional env var to `browser-smoke.mjs` / `browser-doctor.mjs`).
- Linked SEO worksheet was readable (Google Sheets connector). Aries tab holds only URL/H1/title/description/H2/keywords. **No lower article, FAQ or contributor copy exists there.**

## Implemented
Header/breadcrumb/H1 · ball tool with live inputs, validation and states (form → loading → score → result, request failure, reset) · M3-style modal picker (calendar + dd/mm/yyyy, sign-only dates, Capricorn Dec→Jan, Pisces 29 Feb, age 18, cross-sign error after date/age checks) · info strip · exact disclaimer · in-page nav · outlook (badge, verbatim approved message, ≤5 strictly-later Strongest cards, none-note) · year calendar (12 rows, legend counts, hover/focus/tap details; mobile month view with arrows + chips, 44px pitch) · Other Signs (11 real anchors) · simulator cards (BFC-56623 order/URLs/alt) · local-date rollover (timer/focus) · review panel outside the product. The initial sign (Aries, build date 2026-11-09) is pre-rendered; the same render code then hydrates for the visitor's local date.

## Source conflicts resolved
- Nav label: "Today's Outlook" (BFC-56633) used over "Lucky Strength Level" (BFC-56618). **Documentation discrepancy to reconcile.**
- SEO sheet vs Jira (Aries): Jira H1 "Aries Lucky Days to Gamble - Your Luck Score Across [Year]" vs sheet H1 "Aries Lucky Days to Gamble in [Year] | Check Your Luck"; Jira meta title "…in [Year] | Check Your Luck" vs sheet title "…in [Year]: Check Your Luck | Chipy". Jira (BFC-56617) used; **unresolved which is final.** Other signs' sheet tabs not compared.
- All other corrections per BUILD-PROMPT §2 applied (min age 18, no cross-sign result, no browser scoring).

## Unresolved (quotes from docs/jira/BFC-56633.md, BFC-56619.md, BFC-56622.md)
- "Cancer needs its own darker set of four colours: [TBD – Figma]." Shown with a **PROPOSAL** placeholder (hero secondary #AABBD0 mixed with white 20/40/80/100%), tagged on page.
- "Design to confirm these four or supply darker values: [TBD – Figma]" (Leo/Sagittarius/Aquarius/Pisces Quiet): exact table values used; I added a 1px border to cells/cards (**proposal**).
- Mobile month view, date-detail look/position, 768/600 lower-section layouts, 1–4 card/no-card look, badge in Quiet/Mixed/Strong, picker visuals, category/sign contrast: all "[TBD – Figma]". Proposals: month view below 720px, tooltip, simple badge pills, picker M3 defaults.
- Other-sign icons "[TBD]": zodiac glyph placeholder. Simulator icons: lettered placeholders (Figma 319:8115 not imported).

## Not done / limits
- **No Figma artwork or banners** (not imported by instruction). Hero is CSS placeholder (theme colours from BFC-56619, outlined glyphs, labelled with the Figma node IDs and artwork brief). No comparison against Figma screenshots was possible. Fonts/motion unchecked; loading/score-reveal are simple proposed transitions (reduced-motion respected). Category colours (Low/Some/Good/Jackpot) are my placeholders, not Figma values.
- Lower sign content, How It Works, FAQ, contributors: labelled placeholders, nothing invented. Header/footer are simplified placeholders; newsletter omitted.
- Personal results: only documented fixture is Capricorn/Marius/08-01-1986 @ 2025-01-24 (Good, 5.07/10; message index 0 is my pick, the model documents none). Every other valid input returns a **labelled mock scenario** (review panel selector; flagged under the disclaimer in review mode). Sign-level fixtures cover 2026–2028 only; other years show a notice. Backend endpoint/transport is integration work.
- Assumptions to confirm: picker year list starts at 1900; manual-input date/age errors reuse "Please enter a valid date"; empty manual OK clears the field; Sunday-first weekdays; Feb 29 "today" age cutoff uses 28 Feb.
- Production integration (other pages, sitemaps, search, SSR) untouched.

## Checks actually run
`npm run test:smoke` (5 widths, initial render) and `scripts/qa-interaction.mjs` (results in `output/qa/interaction-result.txt`): 12-sign headings/strip/links/messages/badge-vs-calendar/legend sums/365 cells; Aries upcoming edge cases (5 Nov, 30 Dec, 1 Jan, 31 Dec, year switch, unsupported year, fake-clock midnight); validation, simultaneous errors, picker modes, age boundary, cross-sign message + link + re-entry, Capricorn crossing, Pisces leap; pending/failure/retry/reset/same-message/four scenarios/fixture; mobile month nav, tap/hover/keyboard details; overflow at 1920/768/600/360/320; no-JS render; no ENGINE/scoring strings. Visual review was by screenshot only at 1280, 360 and 320; 768/600 were checked for overflow, not visually.
