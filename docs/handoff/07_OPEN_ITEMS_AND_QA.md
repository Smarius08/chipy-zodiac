# Open Items, QA Checklist, and LLM Guardrails

## Open product decisions
1. **Minimum permitted age** for DOB validation if not inherited from a global Chipy rule/configuration.
2. For Zodiac-specific pages: whether the page restricts/validates the user to that Zodiac sign or is only themed around that sign.
3. Exact URL/SEO/internal-linking model for the 12 Zodiac pages.
4. Whether Zodiac-specific pages keep the same 4 category visual treatments or introduce sign-specific variants.
5. Final implementation choice for user-local “today”: client date with ±1 UTC-day check vs timezone sent to backend.

## QA — form
- CTA active on initial load.
- No initial errors.
- Empty First Name on submit → “Please enter a valid name”.
- Unsupported First Name → “Use A-Z letters only for your first name.”
- Empty/invalid DOB → “Please enter a valid date”.
- Both invalid → both errors simultaneously.
- Corrected field clears its own error.

## QA — date picker
- Opens modal calendar.
- Can navigate year/month.
- Pen/input-mode control opens manual entry.
- Can switch back to calendar mode.
- Clear / Cancel / OK work.
- Future date unavailable/rejected.
- Underage date unavailable/rejected.
- Manual entry enforces same restrictions.

## QA — backend request
- Valid submit makes one request.
- Duplicate clicks while pending do not create duplicate requests.
- Success transitions to result.
- Network/server/timeout error returns to form.
- Valid entered values are preserved on request failure.
- Request error appears below CTA.
- Retry uses Reveal My Luck.
- Previous result is not reused after failure.

## QA — calculation
Use validation case:
Marius / 08 Jan 1986 / 24 Jan 2025 → Luck Score 5 → Rank 179/365 → Annual Luck Position 51.10% → Good Luck → Final Luck Score 5.07/10.

## QA — result
- Correct category visual treatment.
- Daily message belongs to category.
- Same user/date returns same message.
- Zodiac, Lucky Day(s), Lucky Numbers fit layout.
- Reset returns to blank original form without reload.

## QA — timezone
Test near UTC date boundaries with users in far-ahead/far-behind timezones. Result must correspond to user-local calendar day.

## LLM guardrails
When giving this pack to another LLM, tell it:
- Do not invent missing requirements.
- Use V2 calculation model only.
- Do not reintroduce Profile Reference/precomputed-profile model.
- Use “Luck Score” for intermediate four-rule total.
- Use “Final Luck Score” only for annual-position-derived final score.
- “Today” means user-local calendar date.
- Figma is source of truth for visual implementation.
- BFC-52418/Calculation Model is source of truth for math.
- Keep backend engine shared for future Zodiac pages.
