'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createTerm(title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('terms')
    .insert([{ user_id: user.id, title }])
    .select()
    .single();

  if (error) {
    console.error('Error creating term:', error);
    throw new Error('Failed to create term');
  }

  revalidatePath('/dashboard');
  return data;
}

export async function updateTerm(id: string, title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('terms')
    .update({ title })
    .eq('id', id)
    // RLS ensures they can only update their own terms, but we can also explicitly check user_id if we want
    .select()
    .single();

  if (error) {
    console.error('Error updating term:', error);
    throw new Error('Failed to update term');
  }

  revalidatePath('/dashboard');
  return data;
}

export async function deleteTerm(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('terms')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting term:', error);
    throw new Error('Failed to delete term');
  }

  revalidatePath('/dashboard');
  return true;
}
