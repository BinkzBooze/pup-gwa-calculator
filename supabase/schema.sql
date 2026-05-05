-- Schema for PUPSIS GWA Calculator

-- 1. Create Tables

CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  is_public BOOLEAN DEFAULT false
);

CREATE TABLE terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  term_id UUID REFERENCES terms(id) ON DELETE CASCADE NOT NULL,
  code TEXT NOT NULL,
  units NUMERIC NOT NULL,
  grade TEXT NOT NULL
);

-- 2. Enable Row Level Security (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile."
  ON profiles FOR SELECT
  USING (auth.uid() = id OR is_public = true);

CREATE POLICY "Users can update their own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4. Terms Policies

CREATE POLICY "Users can perform CRUD on their own terms."
  ON terms FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Public can view terms if profile is public."
  ON terms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = terms.user_id AND profiles.is_public = true
    )
  );

-- 5. Subjects Policies

CREATE POLICY "Users can perform CRUD on their own subjects."
  ON subjects FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM terms
      WHERE terms.id = subjects.term_id AND terms.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view subjects if profile is public."
  ON subjects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM terms
      JOIN profiles ON profiles.id = terms.user_id
      WHERE terms.id = subjects.term_id AND profiles.is_public = true
    )
  );
