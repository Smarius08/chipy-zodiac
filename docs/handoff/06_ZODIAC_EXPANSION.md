# Zodiac-Specific Page Expansion

## New product direction
Create a dedicated luck-tool page for **each of the 12 Zodiac signs** while reusing the existing Luck Tool calculation engine and interaction mechanics.

Signs:
1. Aries
2. Taurus
3. Gemini
4. Cancer
5. Leo
6. Virgo
7. Libra
8. Scorpio
9. Sagittarius
10. Capricorn
11. Aquarius
12. Pisces

## Core reuse rule
Do **not** create 12 independent calculation engines.
The existing backend engine/mechanics remain shared.

The expansion should mainly introduce:
- Zodiac-specific page/interface designs
- Zodiac-specific visual identity/assets/content as defined in future Figma/design work
- Zodiac-specific routing/SEO/content as separate requirements when defined

## Figma reference
Read-only reference provided:
`https://www.figma.com/design/mRGsMU76MmiKMnzQkwYKgG/Tools---Calculators?node-id=11458-19975&p=f&t=t7bKFH0AUnaUKxpj-0`

Inspected read-only in the original account:
- File key: `mRGsMU76MmiKMnzQkwYKgG`
- Node: `11458:19975`
- Canvas name reported by Figma metadata: **Lucky Day to Gamble V2**
- It is a large multi-frame design canvas.

No edits were made.

## Architecture recommendation for the expansion
Treat each Zodiac page as a presentation/configuration layer on top of the shared engine.

Recommended conceptual model:
`Zodiac Page Config + Shared Tool UI/State Machine + Shared Backend Luck Engine`

A page config can eventually contain:
- sign slug/name
- sign-specific title/H1/SEO copy
- visual assets/theme
- sign icon/symbol
- sign-specific explanatory content
- any default/filter behavior if product defines it

Avoid copying calculation code per sign.

## Important ambiguity to resolve before implementation
The current generic tool derives the user’s Zodiac from DOB.
For a Zodiac-specific page, product must define whether:
1. the page is simply a themed entry point but still accepts users of any sign, or
2. the page is intended only for users whose DOB matches that sign, or
3. the page preselects/restricts Zodiac context in some other way.

Do not assume one of these behaviors without product confirmation.

## Design tasks likely needed
- desktop design for each sign
- tablet 768 portrait behavior
- tablet 600 portrait behavior
- mobile behavior
- initial form state
- validation state
- request error state
- loading/score reveal
- all four luck-category result states, unless design intentionally changes category treatment per Zodiac
- Reset state

## Content/SEO tasks likely needed later
Not yet defined in the conversation:
- URL pattern for 12 pages
- H1/meta title/meta descriptions
- canonical strategy
- internal linking between Zodiac pages
- index/search/sitemap rules
- duplicate-content strategy

Treat these as future work, not settled requirements.
