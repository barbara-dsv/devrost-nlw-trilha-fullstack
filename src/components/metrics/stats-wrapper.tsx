import { Suspense } from 'react';
import { prefetch, trpc } from '@/trpc/server';
import { StatsSkeleton, StatsDisplay } from '@/components/metrics';

export function StatsWrapper() {
  prefetch(trpc.stats.getStats.queryOptions());

  return (
    <Suspense fallback={<StatsSkeleton />}>
      <StatsDisplay />
    </Suspense>
  );
}
