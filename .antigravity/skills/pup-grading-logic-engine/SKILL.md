---
name: pup-grading-logic-engine
description: Use this skill whenever you need to compute a student's General Weighted Average (GWA), evaluate academic standing, determine Latin Honors eligibility, or process any grading mathematical logic. Make sure to use this skill whenever grades, units, or academic performance are mentioned to enforce the strict PUP grading rules.
---

# PUP Grading Logic Engine

## Domain
Mathematical computation of General Weighted Average (GWA) and evaluation of academic standing based on the Polytechnic University of the Philippines guidelines.

## Directives
You are responsible for executing all mathematical logic regarding grades. 

### GWA Calculation
- **Formula:** Multiply the numeric grade of each subject by its corresponding units, sum the totals, and divide by the total number of valid units.
- **Valid Grades:** Process passing grades (1.0 to 3.0) and the failing grade (5.0).
- **Exclusions:** Strictly ignore and exclude subjects with "Inc" (Incomplete) or "W" (Withdrawn) marks from the calculation entirely. 

### Latin Honors Eligibility
When evaluating a user's eligibility for Latin Honors, check the cumulative GWA against these thresholds:
- **Summa Cum Laude:** 1.0000 to 1.1500
- **Magna Cum Laude:** 1.1501 to 1.3500
- **Cum Laude:** 1.3501 to 1.6000

**Disqualifications:** Automatically disqualify any user from Latin Honors if their record contains ANY of the following:
- A grade lower than 2.5 (e.g., 2.75, 3.0)
- An "Inc" mark
- A "W" mark
- A failing grade of 5.0
