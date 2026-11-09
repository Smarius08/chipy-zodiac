# Reconciled source register
Prepared from the attached sources and live Jira descriptions on 9 November 2026. Original files remain unchanged.

## Confirmed resolutions
| Old source | Current source / resolution |
| --- | --- |
| Wireframe: “any birth date is accepted” | BFC-56620 rejects another sign's DOB inside manual picker mode, after normal date/age checks. Same-tab correction link; destination requires re-entry. |
| Wireframe: “from the average result of all 81 name and life-path combinations” | BFC-56621 adopted v1.0 uses sign/date Lucky Day + Lucky Number scores only; no averaging, ranking or personal inputs for sign sections. |
| Uploaded copy page: “These messages are drafts for review” | BFC-56885: “Supporting messages (approved, 5 November 2026)”. All 48 texts match exactly. |
| Archived age TBD | Current BFC-52417 and BFC-56620 specify minimum age 18. |
| Archived sign restrictions / URLs TBD | Current BFC-56620 and BFC-56622 resolve these. |
| Wireframe dark outlook/calendar panels | BFC-56633 requires light #F9FAFA layout, filled V1 badge and approved palette. |
| Tiny whole-year mobile calendar in Figma | BFC-56885 requires one month at a time, arrows/chips and tap date details. Exact visual composition remains TBD. |
| Figma heading/date/count placeholders | BFC-56617 supplies per-sign headings; BFC-56621/56885 supply real levels, counts and dates. |
| Figma four blackjack tools | BFC-56623 requires the simulator collection, with generic Lucky Day first. |
| BFC-56618 nav “Lucky Strength Level” vs BFC-56633 “Today's Outlook” | Section-specific BFC-56633 is the mockup label source. Record the documentation discrepancy; behavior is unchanged. |

## Design selection
Overall 14463:7805; outlook 14463:7879; compact sign cards 14463:8329. Exclude 14463:9100.
Optional badge sizing, grouping and icon/shadow refinements are review proposals, not approved requirements.

## Still unresolved in the reviewed descriptions
- BFC-56633: “Cancer needs its own darker set of four colours: [TBD – Figma].”
- BFC-56633, Leo/Sagittarius/Aquarius/Pisces Quiet colours: “Design to confirm these four or supply darker values: [TBD – Figma].”
- BFC-56633 mobile month view: “The month view is needed in Figma: [TBD – Figma].”
- BFC-56633 date details: “Look and position: [TBD – Figma].”
- Detailed lower-section tablet layouts, remaining badge/card states and exact picker visuals.
- BFC-56619 category/sign contrast treatments include “[TBD – Figma]”.
Recheck live sources if available. Use clearly labelled review proposals for missing visuals only; never invent missing calculation/validation/backend behavior.

## Known asset errors and limitations
Sagittarius, Capricorn, Aquarius and Pisces frame names repeat Scorpio. Use banner-nodes.csv.
Aries responsive banners include “Dec 2 - Jan 19”, “Thursday, Saturday” and “7, 16, 25, 34, 43, 53”. Correct Aries values: Mar 21–Apr 19; Tuesday; 1, 8, 17.
Banner desktop names say 960x638 but actual inspected frames are 1920x638.
Parent collections 14463:7805, 319:8115 and 11809:102658 hit asset caps. Individual required icon/result nodes are separately exported; parent collections are not complete design-library archives.
Per-sign raw assets are downloaded, but their final decomposition and composition into the actual HTML still need to be done. Reference exports are not interactive UI.
Fonts and exact motion must be checked against the relevant Figma layers/prototype during implementation. No font binary or motion implementation is claimed to be included.
SEO spreadsheet link is retained in BFC-56617. The spreadsheet itself was not retrieved for this kit; lower article/FAQ/contributor copy is not certified complete. Do not invent approved content.
API endpoint URL/auth/transport are production integration details, not supplied by this mockup kit.
Fixture coverage: sign levels for 2026, 2027, 2028. No personal-result fixture generator or PHP backend is supplied. Implement an honest mock response adapter per BUILD-PROMPT.txt; do not reuse the wireframe browser engine.

