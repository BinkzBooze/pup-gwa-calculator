# Product Requirements Document (PRD)

## Objective
Develop a web-based grade calculator tailored to the Polytechnic University of the Philippines (PUP) grading system. The application will allow students to track their academic progress, calculate their General Weighted Average (GWA), and determine their eligibility for Latin Honors or academic standing.

## Core Features
* User authentication and persistent cloud storage.
* Dynamic creation of academic years and semesters (including summer terms).
* Input fields for course code, units, and grades.
* Automatic calculation of term GWA and cumulative GWA.
* Real-time evaluation of academic standing and Latin Honors eligibility.
* Read-only public shareable links for verifying GWA summaries.

## Business Logic (PUP Standards)
The application must strictly adhere to the grading and scholastic delinquency guidelines outlined in the PUP Student Handbook.

### Grading Scale
* **Passing Grades:** 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0.
* **Failing Grade:** 5.0 (Must be included in the GWA calculation).
* **Non-numerical Marks:** "Inc" (Incomplete) and "W" (Withdrawn). These must be strictly excluded from all GWA calculations. An "Inc" mark that is not completed within one year automatically becomes a 5.0.

### Latin Honors Thresholds
* **Summa Cum Laude:** 1.0000 to 1.1500
* **Magna Cum Laude:** 1.1501 to 1.3500
* **Cum Laude:** 1.3501 to 1.6000

### Disqualifiers for Latin Honors
A student is automatically disqualified from Latin Honors if their academic record contains any of the following:
* Any final grade lower than 2.5 in any academic or non-academic subject.
* An "Inc" (Incomplete) mark.
* A "W" (Withdrawn) mark.
* A failing grade of 5.0.

### Scholastic Delinquency Rules
* **Warning:** Failing 15% or less of the total registered academic units.
* **Dismissal from College:** Failing 51% to 75% of the total registered academic units.
* **Dismissal from University:** Failing more than 75% of the total registered academic units.