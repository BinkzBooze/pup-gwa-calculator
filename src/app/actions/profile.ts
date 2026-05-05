'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleProfileVisibility(isPublic: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ is_public: isPublic })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile visibility:', error);
    throw new Error('Failed to update profile visibility');
  }

  revalidatePath('/dashboard');
  return data;
}
