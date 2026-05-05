import DashboardSkeleton from '@/components/DashboardSkeleton';
import DashboardNav from '@/components/DashboardNav';

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <DashboardNav displayName={null} isPublic={false} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <DashboardSkeleton />
      </main>
    </div>
  );
}
