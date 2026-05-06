import DeleteSubjectButton from '@/components/DeleteSubjectButton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Subject } from '@/types/database'
import { cn } from '@/lib/utils'

const GRADE_COLORS: Record<string, string> = {
  '1.0': 'text-emerald-600 font-bold',
  '1.25': 'text-emerald-600 font-semibold',
  '1.5': 'text-green-600 font-semibold',
  '1.75': 'text-green-600',
  '2.0': 'text-sky-600',
  '2.25': 'text-sky-600',
  '2.5': 'text-blue-600',
  '2.75': 'text-violet-600',
  '3.0': 'text-orange-600',
  '5.0': 'text-destructive font-bold',
  'Inc': 'text-amber-600 italic font-semibold',
  'W': 'text-muted-foreground italic',
}

export default function SubjectTable({
  subjects,
  readOnly = false,
}: {
  subjects: Subject[]
  readOnly?: boolean
}) {
  if (subjects.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground italic">
        No subjects yet. Add a subject below.
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border/50">
          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground w-auto">Course Code</TableHead>
          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground w-20 text-center">Units</TableHead>
          <TableHead className="text-xs uppercase tracking-wider text-muted-foreground w-24 text-center">Grade</TableHead>
          {!readOnly && <TableHead className="w-10" />}
        </TableRow>
      </TableHeader>
      <TableBody>
        {subjects.map((subject) => (
          <TableRow
            key={subject.id}
            className="group/row border-border/40 hover:bg-muted/40 transition-colors duration-100"
          >
            <TableCell className="font-mono text-sm font-medium">{subject.code}</TableCell>
            <TableCell className="text-center text-sm tabular-nums">{subject.units}</TableCell>
            <TableCell className="text-center">
              <span
                className={cn(
                  'inline-block rounded-md px-2 py-0.5 text-sm tabular-nums',
                  GRADE_COLORS[subject.grade] ?? 'text-foreground'
                )}
              >
                {subject.grade}
              </span>
            </TableCell>
            {!readOnly && (
              <TableCell className="text-right pr-2">
                <DeleteSubjectButton subjectId={subject.id} subjectCode={subject.code} />
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
