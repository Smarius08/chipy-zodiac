# UI / UX / State Model

## State machine
### Success
`Initial Form → Validate → Loading → Score Reveal → Final Result`

### Field validation failure
`Initial Form → Validate → Form + Field Error(s)`

### Backend request failure
`Valid Form → Loading → Form + Request Error`

### Reset
`Final Result → Reset → Initial Form`

## Initial form
- First Name
- Date of Birth
- Reveal My Luck CTA
- CTA active by default
- No errors before first submit attempt

## Field validation
On Reveal My Luck click:
- validate both fields
- show errors independently
- if both invalid, show both
- do not call backend while invalid

### Current error copy
- Empty/invalid First Name: **Please enter a valid name**
- Unsupported name characters: **Use A-Z letters only for your first name.**
- Empty/invalid DOB: **Please enter a valid date**

## DOB picker UX
Use Material Design 3 Modal Date Picker.

Keep both interaction modes:
1. Calendar selection
2. Manual entry via pen/input-mode icon

Behavior:
- Opening DOB launches calendar mode.
- User can navigate month/year and select a date.
- Pen icon switches modal to manual entry.
- Manual date uses explicit displayed date format appropriate to site locale.
- Calendar icon/control can switch back without closing modal.
- OK applies a valid date.
- Cancel closes without applying change.
- Clear removes selected/entered date.
- Future dates invalid.
- Under-minimum-age dates invalid.
- Same restrictions apply in both modes.

Rationale discussed: manual entry is valuable for DOB because users may need to navigate decades into the past. Do not remove it unless product intentionally chooses a calendar-only experience.

## Backend request failure
Use a distinct **form-level request error**, not a field error.

On timeout/network/server error:
- stop loading
- restore form
- preserve valid First Name and DOB
- error appears beneath Reveal My Luck
- copy: **Something went wrong. Please try again.**
- retry by pressing Reveal My Luck again
- no separate Retry CTA
- prevent duplicate submit while request is pending

## Final result visual categories
One result layout; category-specific visual treatment changes.

| Category | Visual family |
|---|---|
| Jackpot | teal/cyan + purple/pink |
| Good | blue/electric blue + purple/pink |
| Some | purple/magenta + pink |
| Low | red/burgundy + pink/purple |

## Final result data
- Final Luck Score `/10`
- Final Luck Category
- Daily Luck Reading Message
- Reset CTA
- Zodiac
- Lucky Day(s)
- Lucky Numbers
- Disclaimer

## Reset behavior
Reset clears all user/result/error state and restores initial form without page reload.

## Responsive composition
| Viewport | Composition |
|---|---|
| Desktop | crystal ball centered, one hand each side, supporting data horizontal |
| Tablet 768 portrait | side-hand composition retained/rebalanced |
| Tablet 600 portrait | vertical: one hand above, one below |
| Mobile | vertical top/bottom hand composition, supporting data stacked |

## Figma role
Figma is source of truth for tool visuals and state presentation. The new Zodiac-specific expansion requires new page/interface designs while preserving the same engine/mechanics.
