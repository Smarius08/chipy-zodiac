# Lucky Day to Gamble — LLM Migration Pack

This folder is a self-contained handoff for continuing the **Chipy “Is It My Lucky Day to Gamble?”** project in a new ChatGPT/personal account or another LLM.

## Read order
1. `01_PROJECT_HANDOFF.md` — source-of-truth overview and current architecture.
2. `02_CURRENT_JIRA_SPECS.md` — current intended Jira task structure and copy-ready requirements.
3. `03_CALCULATION_MODEL.md` — V2 calculation engine, terminology, formulas, ranking, reference data, validation example.
4. `04_UI_UX_AND_STATES.md` — form, validation, Material 3 DOB picker, loading/result states, responsive behavior, failure state.
5. `05_DECISION_HISTORY.md` — chronological record of decisions, rejected approaches, terminology changes, and why.
6. `06_ZODIAC_EXPANSION.md` — new scope: one dedicated page per Zodiac sign using the same engine/mechanics.
7. `07_OPEN_ITEMS_AND_QA.md` — unresolved items, implementation risks, QA checklist, and LLM guardrails.

## External sources to reconnect in the new account
- Main Figma project: `https://www.figma.com/design/mRGsMU76MmiKMnzQkwYKgG/Tools---Calculators`
- Zodiac expansion Figma node (read-only reference): `https://www.figma.com/design/mRGsMU76MmiKMnzQkwYKgG/Tools---Calculators?node-id=11458-19975&p=f&t=t7bKFH0AUnaUKxpj-0`
- V2 simulator Google Sheet: `https://docs.google.com/spreadsheets/d/1LnO679B4vIRbFvy_Z_q69SVStwnvS6RMurR9iYIzbT0/edit?gid=362012040#gid=362012040`
- Material Design 3 date picker: `https://m3.material.io/components/date-pickers/overview`
- Functionality Jira: `https://gtmarketing.atlassian.net/browse/BFC-52417`

## Important source-of-truth rule
The project returned to the **V2 Percentile Calibrated Simulator** model. A later “Profile Reference / precomputed profile” experiment was discarded. Do not reintroduce that later experiment unless explicitly requested.

## Terminology rule
Use the current project terms consistently:
- **Luck Score** = sum of the four scoring rules, before annual comparison.
- **Final Luck Score** = final 1.00–10.00 score after annual ranking/position.
- **Annual Luck Position** = percentage derived from Annual Rank.
- **Date Number Total** = sum of all date digits before reduction.
- **Final Luck Category** = Low Luck / Some Luck / Good Luck / Jackpot Luck.
