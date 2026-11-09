# Project Handoff — Is It My Lucky Day to Gamble?

## 1. Product summary
Chipy is building an entertainment-only personalized daily luck tool called **“Is It My Lucky Day to Gamble?”**.

The user provides:
- First Name
- Date of Birth

The tool combines numerology and Zodiac reference data with **today’s date**, calculates a **Luck Score**, compares today with every other date in the same calendar year for that user, then returns:
- Final Luck Score (1.00–10.00)
- Final Luck Category: Low Luck / Some Luck / Good Luck / Jackpot Luck
- Daily Luck Reading Message
- Zodiac sign
- Zodiac Lucky Day(s)
- Zodiac Lucky Numbers

The result is explicitly entertainment-only and must not imply that it changes gambling odds.

## 2. Current architecture decision
The luck engine/scoring logic is moving **out of the browser and into the backend** so competitors cannot read the formula, lookup/reference data, and ranking logic from page source.

### Front-end/backend interaction
- Front end validates the form.
- On valid submit, front end starts the loading animation and sends an AJAX request to the backend.
- Backend performs the calculation and returns the result payload.
- Front end reveals score/result state.
- A backend/network failure must return to the form with a tool-level request error.

### Request failure behavior
If the backend request fails or times out:
- Stop the loading/result sequence.
- Return to the Form state.
- Preserve the entered First Name and DOB.
- Show a **form-level request error below the Reveal My Luck CTA**.
- Copy: **“Something went wrong. Please try again.”**
- Retry uses the existing **Reveal My Luck** CTA. Do not add a separate Retry button.
- Prevent duplicate submissions while a request is already in progress.
- Do not show/reuse a stale previous result.

This error is not a field-validation error; it is a request/tool error.

## 3. “Today” and timezone
Product requirement: **today must mean the user’s own local calendar day**, not server/site time.

Developer proposal discussed:
- Client sends its local date.
- Backend bounds it to ±1 calendar day of UTC.

This was considered acceptable. A slightly cleaner alternative discussed was sending the user’s timezone (e.g. `Europe/Bucharest`) and deriving today on the backend. Either approach must preserve the user’s local calendar date around midnight/timezone boundaries.

## 4. Jira ownership model
The project deliberately separates concerns:

### BFC-52416 — Tool Layout
Owns:
- Visual states
- Figma implementation
- Error presentation
- Loading/result transition presentation
- Category visual treatments
- Responsive desktop/tablet/mobile composition
- Placement of result content

Does not own calculation rules or validation conditions.

### BFC-52417 — Tool Functionality
Owns:
- Input behavior
- Validation behavior
- Date picker behavior/restrictions
- Form submit behavior
- Request failure behavior
- Result/reset behavior
- Daily Luck Reading Message selection logic
- Data returned to front end

### BFC-52418 — Calculation Logic & Reference Data
Owns:
- Exact numerology calculations
- Scoring rules
- Full-year calculation
- Annual ranking
- Tie-break priority
- Annual Luck Position
- Final Luck Category and Final Luck Score formulas
- Life Path/Zodiac reference data
- End-to-end validation example

## 5. Source design rules
For the interactive tool, **Figma is the source of truth** for:
- layout and positioning
- spacing
- typography
- colours
- images/assets
- form/loading/result states
- responsive presentation

For surrounding site sections, reuse existing Chipy site components/styles.

## 6. Result CTA
The final-result CTA is **Reset**.

When clicked:
- Return to original Form state.
- Clear First Name and DOB.
- Clear prior Luck Score, Final Luck Score, Final Luck Category and Daily Luck Reading Message.
- Clear validation/request error states.
- Restore original purple form-state visual treatment.
- Do not reload the page.

Flow: `Final Result → Reset → Original Form`.

## 7. Future expansion
The product will be expanded to **12 dedicated Zodiac-sign pages**, one for each sign. These pages will use the **same calculation engine and mechanics**, but require new page/interface designs specific to each Zodiac sign.

The current Figma expansion reference is:
`https://www.figma.com/design/mRGsMU76MmiKMnzQkwYKgG/Tools---Calculators?node-id=11458-19975&p=f&t=t7bKFH0AUnaUKxpj-0`

This Figma node was inspected read-only in the source account. The canvas/node is named **“Lucky Day to Gamble V2”** and contains a large multi-frame design area. Do not edit it during migration/review.
