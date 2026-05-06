import AddSubjectForm from '@/components/AddSubjectForm'
import DeleteTermButton from '@/components/DeleteTermButton'
import SubjectTable from '@/components/SubjectTable'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { calculateTermGwa } from '@/lib/calculateGwa'
import { TermWithSubjects } from '@/types/database'
import { CalendarDays } from 'lucide-react'

function TermGwaBadge({ gwa }: { gwa: number | null }) {
  if (gwa === null) {
    return (
      <Badge variant="outline" className="text-muted-foreground border-border">
        No grades yet
      </Badge>
    )
  }

  const formatted = gwa.toFixed(4)
  const color =
    gwa <= 1.15
      ? 'bg-indigo-600 text-white border-indigo-700'
      : gwa <= 1.35
      ? 'bg-yellow-500 text-white border-yellow-600'
      : gwa <= 1.5
      ? 'bg-emerald-500 text-white border-emerald-600'
      : gwa <= 3.0
      ? 'bg-slate-100 text-slate-700 border-slate-300'
      : 'bg-red-600 text-white border-red-700'

  return (
    <Badge variant="outline" className={`font-mono text-sm font-bold tabular-nums px-3 py-1 ${color}`}>
      GWA {formatted}
    </Badge>
  )
}

export default function TermCard({
  term,
  readOnly = false,
}: {
  term: TermWithSubjects
  readOnly?: boolean
}) {
  const { gwa, totalUnits } = calculateTermGwa(term.subjects)

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#800000]/10">
              <CalendarDays className="h-4 w-4 text-[#800000]" />
            </div>
            <div className="min-w-0">
              <CardTitle className="truncate text-base font-semibold leading-snug">
                {term.title}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalUnits} unit{totalUnits !== 1 ? 's' : ''} enrolled
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0 self-end sm:self-auto">
            <TermGwaBadge gwa={gwa} />
            {!readOnly && <DeleteTermButton termId={term.id} termTitle={term.title} />}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-3 px-4">
        {/* Subject list */}
        <SubjectTable subjects={term.subjects} readOnly={readOnly} />

        {!readOnly && (
          <>
            <Separator className="my-3" />
            {/* Add subject form */}
            <AddSubjectForm termId={term.id} />
          </>
        )}
      </CardContent>
    </Card>
  )
}
