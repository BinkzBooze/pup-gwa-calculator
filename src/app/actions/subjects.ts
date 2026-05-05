'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createSubject(termId: string, code: string, units: number, grade: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // RLS will ensure that the user can only insert a subject if they own the term
  const { data, error } = await supabase
    .from('subjects')
    .insert([{ term_id: termId, code, units, grade }])
    .select()
    .single();

  if (error) {
    console.error('Error creating subject:', error);
    throw new Error('Failed to create subject');
  }

  revalidatePath('/dashboard');
  return data;
}

export async function updateSubject(id: string, code: string, units: number, grade: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('subjects')
    .update({ code, units, grade })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating subject:', error);
    throw new Error('Failed to update subject');
  }

  revalidatePath('/dashboard');
  return data;
}

export async function deleteSubject(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subject:', error);
    throw new Error('Failed to delete subject');
  }

  revalidatePath('/dashboard');
  return true;
}
