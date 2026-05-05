export interface SubjectGrade {
  code?: string;
  units: number;
  grade: string; // '1.0', '1.25', ..., '3.0', '5.0', 'Inc', 'W'
}

export interface GwaResult {
  gwa: number | null; // null if no valid subjects
  totalUnits: number;
  validUnits: number; // units used for GWA
  failedUnits: number;
}

export function calculateTermGwa(subjects: SubjectGrade[]): GwaResult {
  let totalPoints = 0;
  let validUnits = 0;
  let totalUnits = 0;
  let failedUnits = 0;

  for (const subject of subjects) {
    totalUnits += subject.units;

    if (subject.grade === 'Inc' || subject.grade === 'W') {
      continue; // Exclude entirely
    }

    const numericGrade = parseFloat(subject.grade);
    if (!isNaN(numericGrade)) {
      validUnits += subject.units;
      totalPoints += numericGrade * subject.units;

      if (numericGrade === 5.0) {
        failedUnits += subject.units;
      }
    }
  }

  const gwa = validUnits > 0 ? totalPoints / validUnits : null;

  return {
    gwa,
    totalUnits,
    validUnits,
    failedUnits,
  };
}

export function calculateCumulativeGwa(allTermsSubjects: SubjectGrade[][]): GwaResult {
  const allSubjects = allTermsSubjects.flat();
  return calculateTermGwa(allSubjects);
}

export type LatinHonor = 'Summa Cum Laude' | 'Magna Cum Laude' | 'Cum Laude' | 'None';

export function evaluateLatinHonors(cumulativeGwa: number | null, allSubjects: SubjectGrade[]): LatinHonor {
  if (cumulativeGwa === null) return 'None';

  // Disqualifications check
  for (const subject of allSubjects) {
    if (subject.grade === 'Inc' || subject.grade === 'W' || subject.grade === '5.0') {
      return 'None';
    }
    const numericGrade = parseFloat(subject.grade);
    // Any grade lower than 2.5 (e.g., 2.75, 3.0) where lower in standing means > 2.5 numerically
    if (!isNaN(numericGrade) && numericGrade > 2.5) {
      return 'None';
    }
  }

  // Thresholds evaluation
  // Round to 4 decimal places for accurate comparison
  const roundedGwa = Math.round(cumulativeGwa * 10000) / 10000;

  if (roundedGwa >= 1.0000 && roundedGwa <= 1.1500) return 'Summa Cum Laude';
  if (roundedGwa >= 1.1501 && roundedGwa <= 1.3500) return 'Magna Cum Laude';
  if (roundedGwa >= 1.3501 && roundedGwa <= 1.6000) return 'Cum Laude';

  return 'None';
}

export type AcademicStanding = 'Good Standing' | 'Warning' | 'Probation' | 'Dismissal from College' | 'Dismissal from University';

export function evaluateAcademicStanding(totalUnits: number, failedUnits: number): AcademicStanding {
  if (totalUnits === 0) return 'Good Standing';

  const failedPercentage = (failedUnits / totalUnits) * 100;

  if (failedPercentage > 75) {
    return 'Dismissal from University';
  }
  if (failedPercentage > 50 && failedPercentage <= 75) {
    return 'Dismissal from College';
  }
  if (failedPercentage > 0 && failedPercentage <= 15) {
    return 'Warning';
  }
  
  // Implicit range between Warning (<= 15%) and Dismissal from College (> 50%)
  if (failedPercentage > 15 && failedPercentage <= 50) {
    return 'Probation';
  }

  return 'Good Standing';
}
