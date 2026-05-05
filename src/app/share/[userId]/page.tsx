import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import DashboardNav from '@/components/DashboardNav'
import GwaSummaryCard from '@/components/GwaSummaryCard'
import TermCard from '@/components/TermCard'
import { getPublicProfile } from '@/lib/data'
import {
  calculateCumulativeGwa,
  evaluateAcademicStanding,
  evaluateLatinHonors,
} from '@/lib/calculateGwa'
import { GraduationCap, Lock } from 'lucide-react'
import type { PageProps } from 'next/types'

export async function generateMetadata(
  props: PageProps<'/share/[userId]'>
): Promise<Metadata> {
  const { userId } = await props.params
  const result = await getPublicProfile(userId)
  if (!result || !result.profile.is_public) {
    return { title: 'Profile Not Found | Binkz' }
  }
  return {
    title: `${result.profile.display_name ?? 'Student'}'s GWA | Binkz`,
    description: `View the academic record and GWA for ${result.profile.display_name ?? 'a PUP student'}.`,
  }
}

export default async function PublicProfilePage(
  props: PageProps<'/share/[userId]'>
) {
  const { userId } = await props.params

  // In demo mode (no Supabase env configured), the share page is not functional
  const supabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL'

  if (!supabaseConfigured) {
    notFound()
  }

  const result = await getPublicProfile(userId)

  // If not found or profile is private, show 404
  if (!result || !result.profile.is_public) {
    notFound()
  }

  const { profile, terms } = result

  // Compute GWA stats (same logic as dashboard)
  const allSubjects = terms.flatMap((t) => t.subjects)
  const { gwa, totalUnits, validUnits, failedUnits } = calculateCumulativeGwa(
    terms.map((t) => t.subjects)
  )
  const latinHonor = evaluateLatinHonors(gwa, allSubjects)
  const academicStanding = evaluateAcademicStanding(totalUnits, failedUnits)

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Nav in read-only mode: no public toggle, just branding */}
      <DashboardNav
        displayName={profile.display_name}
        isPublic={profile.is_public}
        readOnly
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Read-only banner */}
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          <Lock className="h-5 w-5 shrink-0 text-sky-500" />
          <span>
            This is a <strong>read-only</strong> public profile shared by{' '}
            <strong>{profile.display_name ?? 'a PUP student'}</strong>.
          </span>
        </div>

        {/* Header row */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {profile.display_name ?? 'Student'}&apos;s Academic Record
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {terms.length} semester{terms.length !== 1 ? 's' : ''} tracked
          </p>
        </div>

        {/* GWA Summary */}
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

        {/* Term cards — read-only (no add/delete buttons via prop) */}
        {terms.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-semibold text-foreground">No semesters recorded yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {terms.map((term) => (
              <TermCard key={term.id} term={term} readOnly />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 py-6 text-center text-xs text-muted-foreground">
        <p>
          PUP GWA Calculator &mdash; Based on the PUP Student Handbook grading guidelines.
        </p>
      </footer>
    </div>
  )
}
