import { createClient } from '@/lib/supabase/server';
import { Profile, TermWithSubjects } from '@/types/database';

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    // PGRST116 = "no rows returned" — profile row not yet created by the DB trigger.
    // This is not a crash-worthy error; the dashboard page will redirect to /auth.
    if (error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    return null;
  }

  return profile as Profile;
}


export async function getTermsWithSubjects(): Promise<TermWithSubjects[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: terms, error } = await supabase
    .from('terms')
    .select('*, subjects(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching terms:', error);
    return [];
  }

  // Supabase joins can sometimes return arrays of subjects
  return (terms || []) as TermWithSubjects[];
}

export async function getPublicProfile(profileId: string): Promise<{ profile: Profile; terms: TermWithSubjects[] } | null> {
  const supabase = await createClient();

  // The RLS policies handle the `is_public = true` check automatically.
  // If `is_public` is false, this query will return null or empty for anonymous/other users.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (profileError || !profile) {
    console.error('Error fetching public profile:', profileError);
    return null;
  }

  const { data: terms, error: termsError } = await supabase
    .from('terms')
    .select('*, subjects(*)')
    .eq('user_id', profileId)
    .order('created_at', { ascending: false });

  if (termsError) {
    console.error('Error fetching public terms:', termsError);
    return null;
  }

  return {
    profile: profile as Profile,
    terms: (terms || []) as TermWithSubjects[],
  };
}
