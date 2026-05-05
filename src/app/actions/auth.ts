'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // Pass display_name via user metadata so the DB trigger (handle_new_user)
  // can pick it up from raw_user_meta_data when it creates the profile row.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName.trim() || email.split('@')[0],
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  // scope:'global' invalidates ALL active sessions for this user across every
  // device and browser tab. This is critical to prevent stale router-cache
  // bleed where a previous user's data briefly appears to a newly signed-in
  // user sharing the same browser.
  await supabase.auth.signOut({ scope: 'global' })
  revalidatePath('/', 'layout')
  redirect('/auth')
}

/**
 * Ensures a profile row exists for the currently authenticated user.
 * Called as a fallback for users who registered before the DB trigger was
 * deployed, or in any other edge case where the trigger didn't fire.
 * Uses upsert so it is fully idempotent — safe to call multiple times.
 */
export async function ensureProfile(): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated.' }
  }

  const displayName =
    (user.user_metadata?.full_name as string | undefined)?.trim() ||
    (user.user_metadata?.name as string | undefined)?.trim() ||
    user.email?.split('@')[0] ||
    'Student'

  const { error } = await supabase
    .from('profiles')
    .upsert(
      { id: user.id, display_name: displayName, is_public: false },
      { onConflict: 'id', ignoreDuplicates: true }
    )

  if (error) {
    console.error('ensureProfile upsert error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { error: null }
}

export async function updateDisplayName(
  name: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const trimmed = name.trim()
  if (!trimmed) return { error: 'Display name cannot be empty.' }

  const { error } = await supabase
    .from('profiles')
    .update({ display_name: trimmed })
    .eq('id', user.id)

  if (error) return { error: 'Failed to update display name.' }

  revalidatePath('/dashboard')
  return { error: null }
}

export async function updatePassword(
  newPassword: string,
  confirmPassword: string
): Promise<{ error: string | null }> {
  if (newPassword !== confirmPassword) return { error: 'Passwords do not match.' }
  if (newPassword.length < 6) return { error: 'Password must be at least 6 characters.' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }

  return { error: null }
}

/**
 * Permanently deletes the currently authenticated user's account and all
 * associated data (profiles, terms, subjects) via the `delete_own_account`
 * SQL RPC function.
 *
 * The RPC runs as SECURITY DEFINER (superuser privileges scoped to the
 * caller's own UID), so no service_role key is needed in the app environment.
 * Cascade deletes on the schema handle subjects → terms → profiles → auth.users.
 */
export async function deleteAccount(): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated.' }
  }

  // Call the SECURITY DEFINER RPC that deletes from auth.users.
  const { error: rpcError } = await supabase.rpc('delete_own_account')

  if (rpcError) {
    console.error('deleteAccount RPC error:', rpcError)
    return { error: rpcError.message }
  }

  // Sign out globally to clear all active sessions after account deletion.
  await supabase.auth.signOut({ scope: 'global' })

  // Bust the entire Next.js route cache so no stale data lingers.
  revalidatePath('/', 'layout')
  redirect('/auth')
}
