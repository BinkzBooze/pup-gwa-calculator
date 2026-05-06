import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  AcademicStanding,
  LatinHonor,
} from '@/lib/calculateGwa';
import { Award, BookOpen, TrendingUp } from 'lucide-react';

interface GwaSummaryCardProps {
  cumulativeGwa: number | null;
  latinHonor: LatinHonor;
  academicStanding: AcademicStanding;
  totalUnits: number;
  validUnits: number;
  failedUnits: number;
}

const HONOR_COLORS: Record<LatinHonor, string> = {
  'Summa Cum Laude': 'bg-indigo-600/20 text-indigo-700 border-indigo-300 ring-indigo-200',
  'Magna Cum Laude': 'bg-yellow-500/20 text-yellow-700 border-yellow-300 ring-yellow-200',
  'Cum Laude': 'bg-emerald-500/20 text-emerald-700 border-emerald-300 ring-emerald-200',
  'None': 'bg-muted text-muted-foreground border-border',
};

const STANDING_COLORS: Record<AcademicStanding, string> = {
  'Good Standing': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Warning': 'bg-yellow-50 text-yellow-700 border-yellow-300',
  'Probation': 'bg-orange-50 text-orange-700 border-orange-300',
  'Dismissal from College': 'bg-red-50 text-red-700 border-red-300',
  'Dismissal from University': 'bg-red-100 text-red-800 border-red-400',
};

const GWA_GRADIENT = (gwa: number | null): string => {
  if (gwa === null) return 'from-slate-400 to-slate-600';
  if (gwa <= 1.15) return 'from-indigo-600 to-violet-700'; // Summa
  if (gwa <= 1.35) return 'from-yellow-400 to-amber-600'; // Magna
  if (gwa <= 1.5) return 'from-emerald-400 to-teal-600';  // Cum Laude
  if (gwa <= 3.0) return 'from-slate-500 to-slate-700';   // Passing
  return 'from-red-500 to-red-700';                      // Failing
};

export default function GwaSummaryCard({
  cumulativeGwa,
  latinHonor,
  academicStanding,
  totalUnits,
  validUnits,
  failedUnits,
}: GwaSummaryCardProps) {
  const formattedGwa = cumulativeGwa !== null
    ? cumulativeGwa.toFixed(4)
    : 'N/A';

  const gradient = GWA_GRADIENT(cumulativeGwa);

  return (
    <Card className="overflow-hidden border-none shadow-xl ring-1 ring-foreground/10">
      {/* Hero gradient strip */}
      <div className={`bg-gradient-to-r ${gradient} px-6 py-8`}>
        <div className="flex flex-col items-center gap-3 text-center text-white">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-white/80">
            <TrendingUp className="h-4 w-4" />
            Cumulative GWA
          </div>
          <div className="text-6xl font-black tabular-nums tracking-tight drop-shadow-md">
            {formattedGwa}
          </div>
          {latinHonor !== 'None' && (
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold text-white ring-1 ring-white/30 backdrop-blur-sm">
              <Award className="h-4 w-4" />
              {latinHonor}
            </div>
          )}
        </div>
      </div>

      {/* Stats row */}
      <CardContent className="pt-0">
        <div className="grid grid-cols-3 divide-x divide-border py-4 text-center text-sm">
          <div className="flex flex-col gap-0.5 px-4">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Units</span>
            <span className="text-2xl font-bold tabular-nums text-foreground">{totalUnits}</span>
          </div>
          <div className="flex flex-col gap-0.5 px-4">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Units Counted</span>
            <span className="text-2xl font-bold tabular-nums text-foreground">{validUnits}</span>
          </div>
          <div className="flex flex-col gap-0.5 px-4">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Failed Units</span>
            <span className={`text-2xl font-bold tabular-nums ${failedUnits > 0 ? 'text-destructive' : 'text-foreground'}`}>
              {failedUnits}
            </span>
          </div>
        </div>

        <Separator className="mb-4" />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground font-medium">Academic Standing:</span>
          </div>
          <Badge
            variant="outline"
            className={`px-3 py-1 text-xs font-semibold ${STANDING_COLORS[academicStanding]}`}
          >
            {academicStanding}
          </Badge>
        </div>

        {latinHonor === 'None' && cumulativeGwa !== null && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Achieve a GWA ≤ 1.6000 with no grades &gt; 2.5, Inc, W, or 5.0 to qualify for Latin Honors.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
