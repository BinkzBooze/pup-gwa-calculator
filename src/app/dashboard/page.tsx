import AddTermButton from '@/components/AddTermButton'
import DashboardNav from '@/components/DashboardNav'
import ExportMenu from '@/components/ExportMenu'
import GwaSummaryCard from '@/components/GwaSummaryCard'
import PublicProfileToggle from '@/components/PublicProfileToggle'
import TermCard from '@/components/TermCard'
import {
  calculateCumulativeGwa,
  evaluateAcademicStanding,
  evaluateLatinHonors,
} from '@/lib/calculateGwa'
import { getProfile, getTermsWithSubjects } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'
import { GraduationCap } from 'lucide-react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import ProfileSetupScreen from '@/components/ProfileSetupScreen'

export const metadata: Metadata = {
  description:
    'Track your academic progress, calculate your GWA, and check your Latin Honors eligibility.',
}

export default async function DashboardPage() {
  // Step 1: Check whether the user is authenticated at all.
  // If not, redirect to /auth. This is the ONLY redirect to /auth from this page.
  // The middleware already enforces this, but we double-check defensively.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Step 2: Fetch the profile row. This may return null if the DB trigger
  // hasn't finished inserting the row yet (race condition on first sign-up).
  const profile = await getProfile()

  // Step 3: If the user IS authenticated but the profile row isn't ready yet,
  // show a holding screen with an auto-refresh — NOT a redirect to /auth.
  // Redirecting to /auth when authenticated would cause the middleware to
  // immediately bounce the user back to /dashboard, creating an infinite loop.
  if (!profile) {
    return <ProfileSetupScreen />
  }

  const terms = await getTermsWithSubjects()

  // Compute cumulative GWA across all terms
  const allSubjects = terms.flatMap((t) => t.subjects)
  const { gwa, totalUnits, validUnits, failedUnits } = calculateCumulativeGwa(
    terms.map((t) => t.subjects)
  )
  const latinHonor = evaluateLatinHonors(gwa, allSubjects)
  const academicStanding = evaluateAcademicStanding(totalUnits, failedUnits)

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <DashboardNav
        displayName={profile.display_name}
        email={user.email}
        isPublic={profile.is_public}
        userId={profile.id}
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">

        {/* Top header row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              My Academic Record
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {terms.length} semester{terms.length !== 1 ? 's' : ''} tracked
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PublicProfileToggle isPublic={profile.is_public} />
            <ExportMenu terms={terms} profile={profile} cumulativeGwa={gwa} />
            <AddTermButton />
          </div>
        </div>

        {/* GWA Summary hero card */}
        <div className="mb-8">
          <GwaSummaryCard
            cumulativeGwa={gwa}
            latinHonor={latinHonor}
            academicStanding={academicStanding}
            totalUnits={totalUnits}
            validUnits={validUnits}
            failedUnits={failedUnits}
          />
        </div>

        {/* Term cards */}
        {terms.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No semesters yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first semester to start tracking your grades.
              </p>
            </div>
            <AddTermButton />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {terms.map((term) => (
              <TermCard key={term.id} term={term} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 py-8">
        {/* Disclaimer banner */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4 text-center text-xs text-amber-800">
            <p className="font-semibold">⚠️ Unofficial Application — Not affiliated with PUP or PUPSIS</p>
            <p className="mt-1 text-amber-700/80">
              BINKZ was independently created by a PUP Computer Engineering Student
              and is provided for convenience only.
            </p>
            <p className="mt-2 text-amber-700/80">
              For feedback, bug reports, or suggestions, contact the developer:{' '}
              <strong className="font-semibold text-amber-900">Adolf Cedric F. Tiangco</strong>
              {' '}—{' '}
              <a
                href="mailto:adolftiangcox24@gmail.com"
                className="underline underline-offset-2 hover:text-amber-900"
              >
                adolftiangcox24@gmail.com
              </a>
            </p>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            PUP GWA Calculator &mdash; Based on the PUP Student Handbook grading guidelines.
          </p>
        </div>
      </footer>
    </div>
  )
}
