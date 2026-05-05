-- =============================================================================
-- PUPSIS GWA Calculator — Delete Account RPC Function
-- =============================================================================
-- PURPOSE:
--   Provides a secure, callable function `delete_own_account()` that allows
--   an authenticated user to permanently delete their own account from
--   auth.users (which cascades to public.profiles via ON DELETE CASCADE).
--
-- WHY NOT service_role KEY IN THE APP:
--   Exposing the service_role key to the Next.js server would be a security
--   risk. Instead, this SECURITY DEFINER function runs with superuser-level
--   privileges only when invoked by the currently authenticated user,
--   keeping the privilege escalation tightly scoped.
--
-- HOW TO APPLY:
--   1. Open your Supabase project dashboard.
--   2. Navigate to "SQL Editor".
--   3. Paste this entire script and click "Run".
-- =============================================================================

CREATE OR REPLACE FUNCTION public.delete_own_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Ensure only the currently authenticated user can invoke this.
  -- auth.uid() is set by Supabase for every authenticated RPC call.
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated.';
  END IF;

  -- Delete from auth.users. The ON DELETE CASCADE on public.profiles
  -- (id UUID REFERENCES auth.users(id) ON DELETE CASCADE) ensures the
  -- profile row, all terms, and all subjects are removed automatically.
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;

-- Grant execute to authenticated users only (not anon).
REVOKE EXECUTE ON FUNCTION public.delete_own_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;

-- Tell PostgREST to reload its schema cache immediately so the function
-- is visible to supabase.rpc() without waiting for a server restart.
NOTIFY pgrst, 'reload schema';
