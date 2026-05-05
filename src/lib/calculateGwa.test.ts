import { describe, it, expect } from 'vitest';
import {
  calculateTermGwa,
  calculateCumulativeGwa,
  evaluateLatinHonors,
  evaluateAcademicStanding,
  SubjectGrade
} from './calculateGwa';

describe('GWA Calculation', () => {
  it('calculates term GWA correctly with standard passing grades', () => {
    const subjects: SubjectGrade[] = [
      { units: 3, grade: '1.0' },
      { units: 3, grade: '1.5' },
    ];
    const result = calculateTermGwa(subjects);
    expect(result.gwa).toBe(1.25);
    expect(result.totalUnits).toBe(6);
    expect(result.validUnits).toBe(6);
    expect(result.failedUnits).toBe(0);
  });

  it('excludes Inc and W grades entirely from calculation', () => {
    const subjects: SubjectGrade[] = [
      { units: 3, grade: '1.0' },
      { units: 3, grade: 'Inc' },
      { units: 3, grade: 'W' },
    ];
    const result = calculateTermGwa(subjects);
    expect(result.gwa).toBe(1.0);
    expect(result.totalUnits).toBe(9);
    expect(result.validUnits).toBe(3);
    expect(result.failedUnits).toBe(0);
  });

  it('includes 5.0 grade in GWA calculation normally', () => {
    const subjects: SubjectGrade[] = [
      { units: 3, grade: '1.0' },
      { units: 3, grade: '5.0' },
    ];
    const result = calculateTermGwa(subjects);
    expect(result.gwa).toBe(3.0); // (3*1 + 3*5) / 6 = 18 / 6 = 3.0
    expect(result.totalUnits).toBe(6);
    expect(result.validUnits).toBe(6);
    expect(result.failedUnits).toBe(3);
  });

  it('returns null GWA if no valid numerical grades are present', () => {
    const subjects: SubjectGrade[] = [
      { units: 3, grade: 'Inc' },
      { units: 3, grade: 'W' },
    ];
    const result = calculateTermGwa(subjects);
    expect(result.gwa).toBeNull();
  });
});

describe('Cumulative GWA Calculation', () => {
  it('calculates cumulative GWA accurately across multiple terms', () => {
    const term1: SubjectGrade[] = [
      { units: 3, grade: '1.0' },
    ];
    const term2: SubjectGrade[] = [
      { units: 3, grade: '2.0' },
    ];
    const result = calculateCumulativeGwa([term1, term2]);
    expect(result.gwa).toBe(1.5);
    expect(result.totalUnits).toBe(6);
  });
});

describe('Latin Honors Evaluation', () => {
  it('evaluates Summa Cum Laude correctly', () => {
    expect(evaluateLatinHonors(1.0, [{ units: 3, grade: '1.0' }])).toBe('Summa Cum Laude');
    expect(evaluateLatinHonors(1.15, [{ units: 3, grade: '1.15' }])).toBe('Summa Cum Laude');
  });

  it('evaluates Magna Cum Laude correctly', () => {
    expect(evaluateLatinHonors(1.16, [{ units: 3, grade: '1.16' }])).toBe('Magna Cum Laude');
    expect(evaluateLatinHonors(1.35, [{ units: 3, grade: '1.35' }])).toBe('Magna Cum Laude');
  });

  it('evaluates Cum Laude correctly', () => {
    expect(evaluateLatinHonors(1.36, [{ units: 3, grade: '1.36' }])).toBe('Cum Laude');
    expect(evaluateLatinHonors(1.60, [{ units: 3, grade: '1.60' }])).toBe('Cum Laude');
  });

  it('disqualifies user from Latin Honors if any grade is lower than 2.5 (e.g. 2.75)', () => {
    const subjects: SubjectGrade[] = [{ units: 3, grade: '1.0' }, { units: 3, grade: '2.75' }];
    expect(evaluateLatinHonors(1.2, subjects)).toBe('None');
  });

  it('disqualifies user if an Inc, W, or 5.0 is present', () => {
    expect(evaluateLatinHonors(1.2, [{ units: 3, grade: '1.0' }, { units: 3, grade: 'Inc' }])).toBe('None');
    expect(evaluateLatinHonors(1.2, [{ units: 3, grade: '1.0' }, { units: 3, grade: 'W' }])).toBe('None');
    expect(evaluateLatinHonors(1.2, [{ units: 3, grade: '1.0' }, { units: 3, grade: '5.0' }])).toBe('None');
  });
});

describe('Academic Standing Evaluation', () => {
  it('returns Good Standing if 0 units failed', () => {
    expect(evaluateAcademicStanding(10, 0)).toBe('Good Standing');
  });

  it('returns Warning if 15% or less units failed', () => {
    expect(evaluateAcademicStanding(100, 15)).toBe('Warning');
    expect(evaluateAcademicStanding(100, 1)).toBe('Warning');
  });

  it('returns Probation for > 15% and <= 50%', () => {
    expect(evaluateAcademicStanding(100, 16)).toBe('Probation');
    expect(evaluateAcademicStanding(100, 50)).toBe('Probation');
  });

  it('returns Dismissal from College for > 50% to 75% units failed', () => {
    expect(evaluateAcademicStanding(100, 51)).toBe('Dismissal from College');
    expect(evaluateAcademicStanding(100, 75)).toBe('Dismissal from College');
  });

  it('returns Dismissal from University for > 75% units failed', () => {
    expect(evaluateAcademicStanding(100, 76)).toBe('Dismissal from University');
    expect(evaluateAcademicStanding(100, 100)).toBe('Dismissal from University');
  });
});
