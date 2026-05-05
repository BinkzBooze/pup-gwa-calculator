# Agent Rules & Guidelines

## PUP Grading Scale and Logic
Agents must strictly adhere to the Polytechnic University of the Philippines (PUP) grading rules when developing this application:

### Valid Grades
- Passing Grades: 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0
- Failing Grade: 5.0
- Special Marks: "Inc" (Incomplete), "W" (Withdrawn)

### GWA Calculation
- Multiply the numeric grade of each subject by its corresponding units.
- Sum the totals.
- Divide by the total number of valid units.
- **CRITICAL**: Strictly ignore and exclude subjects with "Inc" or "W" marks from the calculation entirely.

### Latin Honors Eligibility
- **Summa Cum Laude**: 1.0000 to 1.1500
- **Magna Cum Laude**: 1.1501 to 1.3500
- **Cum Laude**: 1.3501 to 1.6000
- **Disqualifications**: Automatically disqualify any user from Latin Honors if their record contains ANY of the following:
  - A grade lower than 2.5 (e.g., 2.75, 3.0)
  - An "Inc" mark
  - A "W" mark
  - A failing grade of 5.0
