# V2 Calculation Model — Source of Truth

## 1. Engine choice
Use the **V2 Percentile Calibrated Simulator** logic.
Do not use the discarded Profile Reference/precomputed-profile approach.

## 2. Personal values
### Name Number
Convert A–Z letters to alphabetical position (`A=1 ... Z=26`), sum, reduce repeatedly to 1–9.

Example: `Marius = 13+1+18+9+21+19 = 81 → 8+1 = 9`.

### Life Path Number
Add all digits in DOB and reduce to 1–9.
Example `08/01/1986 → 0+8+0+1+1+9+8+6 = 33 → 6`.

### Zodiac
Determine sign from DOB month/day. Retrieve sign’s Lucky Day(s) and Lucky Numbers from Reference Data below.

## 3. Today’s date values
### Date Number Total
Sum every digit in today’s numeric date before reduction.
Example `22/02/2025 → 15`.

### Date Numerology Number
Reduce Date Number Total to 1–9.
Example `15 → 6`.

### Day of Week
Determine today’s weekday.

## 4. Scoring rules
### Name Score — max 2
Compare Name Number vs Date Numerology Number on straight numeric scale 1–9.

| Difference | Score |
|---|---:|
| Exact | 2 |
| 1 apart | 1.5 |
| 2 apart | 1 |
| 3+ apart | 0.5 |

### Life Path Score — max 3
Use Life Path compatibility reference data.

| Relationship | Score |
|---|---:|
| Compatible | 3 |
| Neutral | 2 |
| Unfavourable | 1 |

### Lucky Day Score — max 3
Week is circular.

| Distance from Zodiac Lucky Day | Score |
|---|---:|
| Exact | 3 |
| 1 day away | 2 |
| 2 days away | 1 |
| 3+ days away | 0 |

If the sign has two Lucky Days, compare both and use the closer one.

### Lucky Number Score — max 2
Compare using:
- Date Numerology Number
- Date Number Total
- Reduced forms of Zodiac Lucky Numbers

| Result | Score |
|---|---:|
| Exact match | 2 |
| Date Numerology Number is one away from a reduced Zodiac Lucky Number | 1 |
| No match | 0 |

## 5. Luck Score
`Luck Score = Name Score + Life Path Score + Lucky Day Score + Lucky Number Score`

Maximum = 10.

## 6. Full-year calculation
For the same user calculate Luck Score for every date in the year:
- 365 normal year
- 366 leap year

Fixed across the year:
- Name Number
- Life Path Number
- Zodiac
- Zodiac Lucky Day(s)
- Zodiac Lucky Numbers

Recomputed for each date:
- Date Number Total
- Date Numerology Number
- Day of Week
- all four scores
- Luck Score

## 7. Annual ranking
Sort strongest to weakest.

Primary rule: **higher Luck Score = stronger date**.

Tie-break order:
1. Higher Lucky Day Score
2. Higher Lucky Number Score
3. Higher Life Path Score
4. Higher Name Score
5. Earlier calendar date

Each rule is used only if all prior values are equal.
The tie-break affects ordering only; it does not change Luck Score.

Implementation method is flexible. The original Google Sheet used a weighted numeric ranking key, but the developer does not need to replicate that exact formula as long as the resulting ordering is identical.

## 8. Annual Luck Position
`Annual Luck Position = (Number of Days - Annual Rank) / (Number of Days - 1)`

- Rank 1 = 100%
- Last rank = 0%

## 9. Final Luck Category
Exact position ranges:

| Annual Luck Position | Category | Score range |
|---|---|---:|
| 85%–100% | Jackpot Luck | 7.01–10.00 |
| 50%–<85% | Good Luck | 5.01–7.00 |
| 15%–<50% | Some Luck | 3.01–5.00 |
| 0%–<15% | Low Luck | 1.00–3.00 |

For a 365-day year, intended ranks are:
- 1–55 Jackpot
- 56–183 Good
- 184–310 Some
- 311–365 Low

## 10. Final Luck Score
Category position ranges:

| Category | Min | Max |
|---|---:|---:|
| Low | 0.00 | 0.15 |
| Some | 0.15 | 0.50 |
| Good | 0.50 | 0.85 |
| Jackpot | 0.85 | 1.00 |

`Position Within Category = (Annual Luck Position - Category Position Minimum) / (Category Position Maximum - Category Position Minimum)`

`Final Luck Score = Score Range Minimum + (Position Within Category × (Score Range Maximum - Score Range Minimum))`

Round to 2 decimals.

## 11. Reference Data
### Life Path compatibility
| Life Path | Compatible (3) | Neutral (2) | Unfavourable (1) |
|---:|---|---|---|
| 1 | 3,5,6 | 2,4,7 | 1,8,9 |
| 2 | 4,6,8 | 1,2,7,9 | 3,5 |
| 3 | 1,5,9 | 4,7 | 2,3,6,8 |
| 4 | 2,7,8 | 1,4,6 | 3,5,9 |
| 5 | 1,3,7 | 5,6,8 | 2,4,9 |
| 6 | 1,2,8,9 | 4,5,6 | 3,7 |
| 7 | 4,5,7 | 1,2,3 | 6,8,9 |
| 8 | 4,6 | 2,8 | 1,3,5,7,9 |
| 9 | 3,6,9 | 2 | 1,4,5,7,8 |

### Zodiac date ranges
| Sign | Range |
|---|---|
| Aries | Mar 21–Apr 19 |
| Taurus | Apr 20–May 20 |
| Gemini | May 21–Jun 20 |
| Cancer | Jun 21–Jul 22 |
| Leo | Jul 23–Aug 22 |
| Virgo | Aug 23–Sep 22 |
| Libra | Sep 23–Oct 22 |
| Scorpio | Oct 23–Nov 21 |
| Sagittarius | Nov 22–Dec 21 |
| Capricorn | Dec 22–Jan 19 |
| Aquarius | Jan 20–Feb 18 |
| Pisces | Feb 19–Mar 20 |

### Zodiac Lucky Days
| Sign | Day(s) |
|---|---|
| Aries | Tuesday |
| Taurus | Monday, Friday |
| Gemini | Wednesday |
| Cancer | Monday, Thursday |
| Leo | Sunday |
| Virgo | Wednesday |
| Libra | Friday |
| Scorpio | Tuesday |
| Sagittarius | Thursday |
| Capricorn | Saturday |
| Aquarius | Saturday |
| Pisces | Thursday |

### Zodiac Lucky Numbers
| Sign | Numbers |
|---|---|
| Aries | 1,8,17 |
| Taurus | 2,6,9,12,24 |
| Gemini | 5,7,14,23 |
| Cancer | 2,3,15,20 |
| Leo | 1,3,10,19 |
| Virgo | 5,14,15,23,32 |
| Libra | 4,6,13,15,24 |
| Scorpio | 8,11,18,22 |
| Sagittarius | 3,7,9,12,21 |
| Capricorn | 4,8,13,22 |
| Aquarius | 4,7,11,22,29 |
| Pisces | 3,9,12,15,18,24 |

## 12. Validation case
Input:
- First Name: Marius
- DOB: 08 Jan 1986
- Checked date: 24 Jan 2025

Expected:
| Step | Expected |
|---|---|
| Name Number | 9 |
| Life Path | 6 |
| Zodiac | Capricorn |
| Lucky Day | Saturday |
| Lucky Numbers | 4,8,13,22 |
| Date Number Total | 16 |
| Date Numerology Number | 7 |
| Day | Friday |
| Name Score | 1 |
| Life Path Score | 1 |
| Lucky Day Score | 2 |
| Lucky Number Score | 1 |
| Luck Score | 5/10 |
| Annual Rank | 179/365 |
| Annual Luck Position | 51.10% |
| Final Luck Category | Good Luck |
| Final Luck Score | 5.07/10 |
