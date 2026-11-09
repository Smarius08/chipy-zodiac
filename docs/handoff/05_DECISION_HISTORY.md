# Decision History and Conversation Summary

This is a chronological, LLM-readable reconstruction of the project discussion. It is not a verbatim transcript; it records decisions, rejected approaches, terminology changes, and implementation clarifications.

## Phase 1 — Model selection
- Multiple simulator/model approaches were explored.
- A later “Profile Reference” approach considered precomputed user profiles/cutoffs/ranking keys.
- That approach was discarded.
- Project returned to **V2 Percentile Calibrated Simulator** as source of truth.
- The Google Sheet was considered the best available working model.

## Phase 2 — Terminology cleanup
The original documentation used technical/calibration language. The project deliberately simplified terms for Jira/developer readability.

Changes:
- Date Digit Sum → **Date Number Total**
- Today Number → **Date Numerology Number**
- Annual Percentile → **Annual Luck Position**
- Calibrated Category → **Final Luck Category**
- Calibrated Score → **Final Luck Score**
- Final calibrated result → **Final Result**
- Position within category range → **Position Within Category**
- Lookup Tables (generic section label) → **Reference Data**
- “Scoring checks” → **Scoring rules**
- “Recalculate each date” → **Calculate each date**
- “Date being evaluated” → **Today / today’s date**

Later naming decision:
- Intermediate score should be called **Luck Score**, not Raw Luck Score.
- Final score remains **Final Luck Score**.

Current canonical flow:
`Four Scoring Rules → Luck Score → Annual Rank → Annual Luck Position → Final Luck Category → Final Luck Score`

## Phase 3 — Jira responsibility split
Three key subtasks were separated to reduce overlap:
- Layout = appearance/states/responsive design
- Functionality = input and interaction behavior
- Calculation Logic = exact formulas/reference data

This separation should remain; avoid duplicating exact scoring math in Layout or Functionality.

## Phase 4 — Annual ranking and tie-break
Annual Rank = position after sorting every date of the year strongest to weakest.

Tie-break order:
1. Luck Score
2. Lucky Day Score
3. Lucky Number Score
4. Life Path Score
5. Name Score
6. Earlier calendar date

A spreadsheet formula was inspected that encoded these priorities into a single weighted ranking number, e.g. a result like `111131285`.
Decision: **the spreadsheet’s numeric ranking-key formula is not a mandatory implementation requirement**. Developers may use multi-column sort or any equivalent implementation as long as output order is identical.

## Phase 5 — Annual Rank vs Annual Luck Position
Annual Rank = exact position among year dates.
Annual Luck Position = rank converted to 0–100%.

Formula:
`(Days - Rank) / (Days - 1)`

Examples (365 days):
- Rank 1 → 100%
- Rank 183 → ~50%
- Rank 365 → 0%

## Phase 6 — Input behavior
### First Name
Several international-input approaches were discussed.
An earlier proposal allowed accented Latin characters, spaces, hyphens, apostrophes and normalized them for A–Z calculation.

Latest Figma/error-state decision is stricter:
- Error copy for unsupported names: **Use A-Z letters only for your first name.**
- Treat this as current unless product explicitly reopens international-name support.

### Date of Birth
Material Design 3 Modal Date Picker chosen.
Both calendar and manual input modes should remain.
Future and underage DOBs are invalid.
Exact minimum age remains an explicit requirement/configuration to confirm if not globally defined.

## Phase 7 — Validation UX
Latest form behavior:
- Reveal My Luck CTA is active by default.
- Validation happens on CTA click.
- Empty/invalid first name: “Please enter a valid name”.
- Unsupported name: “Use A-Z letters only for your first name.”
- Empty/invalid DOB: “Please enter a valid date”.
- Both errors may show together.

## Phase 8 — Result UI
One result structure is reused across four categories.
Visuals change by category:
- Jackpot: teal/cyan
- Good: blue/electric blue
- Some: purple/magenta
- Low: red/burgundy

Result content includes score, category, category message, Zodiac/lucky data and CTA.

## Phase 9 — Daily Luck Reading Messages
10 approved message variations exist per category.
Selection must be deterministic:
- same user + same date → same message
- different date may change message
- select only within matching category

## Phase 10 — Responsive design
Desktop/mobile/tablet designs were supplied.
Key breakpoint compositions:
- Desktop: hands left/right
- 768 portrait tablet: left/right retained
- 600 portrait tablet: top/bottom hands
- Mobile: top/bottom vertical composition

## Phase 11 — Reset CTA
Final result CTA is **Reset**.
Reset restores initial form and clears user/result/error data without reload.

## Phase 12 — Backend migration/security
Developer flagged that the calculation was readable in `public/JS/tools/luckyDayGenerator.js`.
Tal’s requirement: move calculation backend-side to protect scoring/reference/ranking logic.
Front end now requests result over AJAX.

New failure state was accepted with refinement:
- form-level request error below CTA
- preserve entered values
- copy: “Something went wrong. Please try again.”
- use Reveal My Luck to retry
- no separate Retry CTA

## Phase 13 — User local date
Developer noted that “today” remains relative to user timezone.
Client-local-date + ±1 UTC-day backend validation was accepted as reasonable.
Timezone-to-backend derivation was noted as a cleaner optional architecture.

## Phase 14 — Zodiac expansion
New planned scope:
- Expand the Luck Tool to dedicated pages for all 12 Zodiac signs.
- Reuse the same engine and mechanics.
- Create new page/interface designs for each sign.
- Current read-only Figma reference: node `11458:19975`, canvas named “Lucky Day to Gamble V2”.
