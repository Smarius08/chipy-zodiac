# Current Jira Specifications

This document consolidates the intended current state of the key Jira subtasks. It is written for both developers and LLM-assisted implementation.

---

# BFC-52416 — Lucky Day to Gamble: Tool Layout

> **Important:** Contact Marius before starting FE development to review the requirements and clarify design questions.

## Scope
Implement the front-end for the interactive **“Is It My Lucky Day to Gamble?”** tool only.

The surrounding page sections (breadcrumbs, article, related tools, contributors, footer, etc.) are separate tasks.

For the tool, Figma is the source of truth for layout, spacing, typography, colours, assets, states, and responsive presentation.

## Tool flow/states
Main success flow:
`Form → Validate → Loading / Transition → Score Reveal → Final Result`

Failure branch:
`Loading / Transition → Form + Request Error`

No full-page reload/navigation should occur during the tool interaction.

### States
| State | Front-end requirement |
|---|---|
| Form | First Name, Date of Birth, active Reveal My Luck CTA inside crystal-ball composition |
| Date Picker | Material 3 DOB picker opens from DOB field |
| Field Error | Inline error styling/message for invalid field(s) |
| Loading / Transition | Replace form content with Figma zodiac/crystal-ball transition |
| Request Error | Return to form, preserve entered values, show “Something went wrong. Please try again.” below CTA |
| Score Reveal | Reveal calculated score per Figma sequence |
| Final Result | Show the relevant Low / Some / Good / Jackpot result treatment |

## Form state
Inputs:
1. Your First Name
2. Your Date of Birth
3. Reveal My Luck

CTA is active by default. Validation occurs on click.

### Field error copy
- Empty/invalid first name: **Please enter a valid name**
- Unsupported name characters: **Use A-Z letters only for your first name.**
- Empty/invalid DOB: **Please enter a valid date**

## Request error presentation
Request failure is a **form-level error**, not a field error.
- Preserve both entered values.
- Show below Reveal My Luck.
- Copy: **Something went wrong. Please try again.**
- Use the existing CTA to retry.

## Date picker
Use Material Design 3 Modal Date Picker.
Support:
- Calendar/date selection
- Month navigation
- Year selection
- Manual input mode using the pen/input-mode control
- Switching back to calendar mode
- Clear / Cancel / OK

Both calendar and manual input use the same DOB validation rules.

## Loading/result transition
After valid submission:
`Form → Zodiac/Crystal-Ball Transition → Score Reveal → Final Result`

Follow Figma animation/transition treatment. The backend request runs during this sequence; request failure uses the failure branch above.

## Final result content
Display:
- Final Luck Score with `/10`
- Final Luck Category
- Daily Luck Reading Message
- Reset CTA
- Zodiac sign
- Lucky Day(s)
- Lucky Numbers
- Tool disclaimer

### Category visual treatments
| Category | Colour treatment | Matching assets |
|---|---|---|
| Jackpot Luck | Teal/cyan glow + purple/pink highlights | Jackpot hand + orb/crystal-ball assets |
| Good Luck | Blue/electric-blue glow + purple/pink highlights | Good Luck hand + orb/crystal-ball assets |
| Some Luck | Purple/magenta glow + pink highlights | Some Luck hand + orb/crystal-ball assets |
| Low Luck | Red/burgundy glow + pink/purple highlights | Low Luck hand + orb/crystal-ball assets |

Use exact Figma category colours/assets. Do not invent/recolour alternative treatments.

## Supporting result information
Show Zodiac, Lucky Day(s), Lucky Numbers.
The layout must support:
- one or two Lucky Days
- the full Lucky Numbers list
without clipping, overlap, or layout breakage.

## Responsive layout
Use Figma as source of truth. Composition changes by viewport; do not merely scale desktop.

| Viewport | Requirement |
|---|---|
| Desktop | Crystal ball centered, one hand each side; supporting info horizontal |
| Tablet 768px portrait | Side-hand composition retained but resized/repositioned per Figma |
| Tablet 600px portrait | Switch to vertical composition: one hand above, one below; title/content wrap per Figma |
| Mobile | Dedicated vertical top/bottom hand composition; supporting info stacked vertically |

Apply equivalent composition rules to Form, Loading/Transition, Request Error, Score Reveal and Result states.

## Disclaimer
**For entertainment purposes only. Your luck score does not predict gambling outcomes or change the mathematical odds of any game.**

---

# BFC-52417 — Lucky Day to Gamble: Tool Functionality

> **Important:** Contact Marius before starting development to review behavior requirements.

## User inputs
- First Name
- Date of Birth

Reveal My Luck is active by default. Validation runs on click.

### First Name
Required.
Current agreed unsupported-name behavior:
- A–Z letters are accepted.
- Upper/lowercase are equivalent for calculation.
- Unsupported characters such as numbers/symbols produce: **Use A-Z letters only for your first name.**
- Empty field produces: **Please enter a valid name**.

Note: an earlier discussion considered supporting accented Latin letters, spaces, hyphens, and apostrophes, but the latest error-state design/copy reverted to the stricter A–Z-only rule. Treat A–Z-only as current unless product explicitly changes it again.

### DOB
Required.
Use Material Design 3 Modal Date Picker with both calendar and manual entry modes.
- Future dates: invalid/unavailable.
- Under-minimum-age dates: invalid/unavailable.
- Empty/invalid DOB error: **Please enter a valid date**.
- Manual entry must enforce the same restrictions as calendar mode.

**Open item:** exact minimum permitted age must be specified before implementation if it is not already defined globally by site/product configuration.

### Validation behavior
- No errors on initial load.
- Clicking Reveal My Luck validates both fields.
- Show only relevant field errors.
- If both fields are invalid, show both errors.
- Do not start backend calculation while invalid.
- Remove error state once corrected.

## Personal values
From valid inputs determine:
- Name Number (1–9)
- Life Path Number (1–9)
- Zodiac Sign
- Zodiac Lucky Day(s)
- Zodiac Lucky Numbers

## Today’s date values
For today determine:
- Date Number Total
- Date Numerology Number
- Day of Week

## Four scoring rules
Determine:
- Name Score
- Life Path Score
- Lucky Day Score
- Lucky Number Score

`Luck Score = Name Score + Life Path Score + Lucky Day Score + Lucky Number Score`

Maximum = 10.

## Full-year comparison
Calculate the same Luck Score for every date in the user’s current calendar year, rank dates strongest to weakest, and assign today an Annual Rank.

Annual Luck Position then converts that rank into a position from weakest (0%) to strongest (100%).

## Final result
Determine:
- Final Luck Category: Low / Some / Good / Jackpot
- Final Luck Score: 1.00–10.00

Flow:
`Four Scoring Rules → Luck Score → Annual Rank → Annual Luck Position → Final Luck Category → Final Luck Score`

## Daily Luck Reading Message
After Final Luck Category is known, select one message from the corresponding 10-message pool.

Requirements:
- Only choose from the matching category.
- Same user + same date = same message.
- Message may change on a different date.
- Use deterministic selection based on first name + DOB + today’s date.
- Do not choose a fresh random message on every page load.

## Backend request behavior
After valid inputs are submitted:
- Send request to backend.
- Prevent duplicate submissions while request is pending.
- On success, continue Score Reveal → Final Result.
- On timeout/network/server failure:
  - stop loading sequence
  - return to form
  - preserve entered First Name and DOB
  - show form-level error: **Something went wrong. Please try again.**
  - allow retry via Reveal My Luck
  - do not reuse a previous result

## Timezone behavior
Today must correspond to the user’s local calendar day.
Current dev proposal: client sends local date, backend accepts only if within ±1 calendar day of UTC. Alternative: send timezone and derive date server-side.

## Reset CTA
On Final Result, CTA label is **Reset**.
On click:
- return to original Form state
- clear First Name + DOB
- clear previous scores/category/message
- clear field/request errors
- restore initial visual state
- no page reload

## Data returned to front end
- Final Luck Score
- Final Luck Category
- Daily Luck Reading Message
- Zodiac Sign
- Zodiac Lucky Day(s)
- Zodiac Lucky Numbers

---

# BFC-52418 — Calculation Logic & Reference Data

Use `03_CALCULATION_MODEL.md` as the full implementation specification.
Key naming rule: use **Luck Score**, not “Raw Luck Score”.
