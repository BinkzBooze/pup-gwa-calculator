import { Profile, TermWithSubjects } from '@/types/database';

export const DEMO_PROFILE: Profile = {
  id: 'demo-user-id',
  display_name: 'Juan dela Cruz',
  is_public: false,
};

export const DEMO_TERMS: TermWithSubjects[] = [
  {
    id: 'term-1',
    user_id: 'demo-user-id',
    title: '1st Semester, AY 2022-2023',
    created_at: '2022-06-01T00:00:00Z',
    subjects: [
      { id: 's1', term_id: 'term-1', code: 'MATH 111', units: 3, grade: '1.25' },
      { id: 's2', term_id: 'term-1', code: 'ENG 111', units: 3, grade: '1.5' },
      { id: 's3', term_id: 'term-1', code: 'FIL 111', units: 3, grade: '1.75' },
      { id: 's4', term_id: 'term-1', code: 'NSTP 111', units: 3, grade: '1.0' },
      { id: 's5', term_id: 'term-1', code: 'PE 111', units: 2, grade: '1.25' },
    ],
  },
  {
    id: 'term-2',
    user_id: 'demo-user-id',
    title: '2nd Semester, AY 2022-2023',
    created_at: '2022-11-01T00:00:00Z',
    subjects: [
      { id: 's6', term_id: 'term-2', code: 'MATH 112', units: 3, grade: '1.5' },
      { id: 's7', term_id: 'term-2', code: 'ENG 112', units: 3, grade: '1.25' },
      { id: 's8', term_id: 'term-2', code: 'SCI 111', units: 3, grade: '1.75' },
      { id: 's9', term_id: 'term-2', code: 'HUM 111', units: 3, grade: '2.0' },
      { id: 's10', term_id: 'term-2', code: 'PE 112', units: 2, grade: 'Inc' },
    ],
  },
  {
    id: 'term-3',
    user_id: 'demo-user-id',
    title: '1st Semester, AY 2023-2024',
    created_at: '2023-06-01T00:00:00Z',
    subjects: [
      { id: 's11', term_id: 'term-3', code: 'CS 201', units: 3, grade: '1.0' },
      { id: 's12', term_id: 'term-3', code: 'CS 202', units: 3, grade: '1.25' },
      { id: 's13', term_id: 'term-3', code: 'MATH 211', units: 3, grade: '1.5' },
      { id: 's14', term_id: 'term-3', code: 'SOC 111', units: 3, grade: '1.75' },
    ],
  },
];
