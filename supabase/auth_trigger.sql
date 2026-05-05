-- =============================================================================
-- PUPSIS GWA Calculator — Auto-Profile Trigger
-- =============================================================================
-- PURPOSE:
--   Automatically insert a row into `public.profiles` whenever a new user
--   signs up via Supabase Auth (`auth.users`). This eliminates the race
--   condition where a user is authenticated but `getProfile()` returns null
--   because no profile row exists yet.
--
-- HOW TO APPLY:
--   1. Open your Supabase project dashboard.
--   2. Navigate to "SQL Editor".
--   3. Paste this entire script and click "Run".
--
-- SAFE TO RE-RUN:
--   Uses CREATE OR REPLACE and DROP IF EXISTS, so running it multiple times
--   will not create duplicate functions or triggers.
-- =============================================================================


-- Step 1: Create (or replace) the trigger function.
--
-- This function runs with SECURITY DEFINER so it has the privileges needed
-- to INSERT into public.profiles even though it is invoked by the auth schema.
-- The `search_path` is locked down to `public` to prevent search-path
-- injection attacks.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  extracted_name TEXT;
BEGIN
  -- Derive a display name: prefer the `full_name` or `name` metadata field
  -- that Supabase social providers populate, then fall back to the local-part
  -- of the email address (everything before the "@").
  extracted_name := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data ->> 'full_name'), ''),
    NULLIF(TRIM(new.raw_user_meta_data ->> 'name'), ''),
    SPLIT_PART(new.email, '@', 1)
  );

  INSERT INTO public.profiles (id, display_name, is_public)
  VALUES (
    new.id,
    extracted_name,
    false          -- profiles are private by default
  )
  ON CONFLICT (id) DO NOTHING;
  -- ON CONFLICT DO NOTHING is a safety net: if the application code already
  -- inserted the profile row (e.g. via the signUp Server Action), the trigger
  -- will not overwrite it.

  RETURN new;
END;
$$;


-- Step 2: Drop the old trigger if it exists, then recreate it.
--
-- Dropping first avoids "trigger already exists" errors on re-runs.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- Step 3 (OPTIONAL — run separately if needed):
-- Back-fill profiles for any existing auth users who don't have a profile row.
-- Uncomment and run this block if you already have users in auth.users with
-- no matching row in public.profiles.

/*
INSERT INTO public.profiles (id, display_name, is_public)
SELECT
  u.id,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data ->> 'full_name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data ->> 'name'), ''),
    SPLIT_PART(u.email, '@', 1)
  ) AS display_name,
  false
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = u.id
);
*/
