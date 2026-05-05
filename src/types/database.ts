export interface Profile {
  id: string;
  display_name: string | null;
  is_public: boolean;
}

export interface Term {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface Subject {
  id: string;
  term_id: string;
  code: string;
  units: number;
  grade: string;
}

export interface TermWithSubjects extends Term {
  subjects: Subject[];
}
