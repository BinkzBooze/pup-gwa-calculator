'use client'

import { ensureProfile } from '@/app/actions/auth'
import { GraduationCap, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * Shown when an authenticated user has no profile row yet.
 *
 * On mount, this component calls the `ensureProfile` Server Action which
 * upserts the missing profile row (idempotent). Once the action resolves,
 * `router.refresh()` re-runs the Server Component on the server and the
 * dashboard renders with real data.
 *
 * This is the correct pattern: mutations belong in Server Actions, not in
 * data-fetching functions. The data fetch (getProfile) stays strictly read-only.
 */
export default function ProfileSetupScreen() {
  const router = useRouter()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function setup() {
      const result = await ensureProfile()

      if (cancelled) return

      if (result.error) {
        setErrorMsg(result.error)
        return
      }

      // Profile row now exists — re-fetch server data.
      router.refresh()
    }

    setup()

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (errorMsg) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <GraduationCap className="h-8 w-8 text-destructive" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            We couldn&apos;t set up your profile. Please try signing out and signing back in.
          </p>
          <p className="text-xs text-destructive/70 font-mono mt-1">{errorMsg}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#800000]">
        <GraduationCap className="h-8 w-8 text-[#FFD700]" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold text-foreground">Setting up your account…</h1>
        <p className="text-sm text-muted-foreground">
          Just a moment while we prepare your dashboard.
        </p>
      </div>
      <Loader2 className="h-6 w-6 animate-spin text-[#800000]" />
    </div>
  )
}
