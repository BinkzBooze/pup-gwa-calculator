import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

function TermCardSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-7 w-28 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-3 px-4">
        <div className="flex flex-col gap-2 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <Skeleton className="h-9 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary card skeleton */}
      <Card className="overflow-hidden border-none shadow-xl">
        <Skeleton className="h-40 w-full rounded-none" />
        <CardContent className="py-4 px-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
            ))}
          </div>
          <Skeleton className="h-px w-full mb-4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-6 w-28 rounded-full" />
          </div>
        </CardContent>
      </Card>

      {/* Term card skeletons */}
      <div className="space-y-4">
        <TermCardSkeleton />
        <TermCardSkeleton />
      </div>
    </div>
  );
}
