'use client';

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import NumberFlow from '@number-flow/react';

interface Stats {
  totalCodes: number;
  avgScore: number;
}

export function StatsDisplay() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.stats.getStats.queryOptions());

  return (
    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <NumberFlow
          value={data.totalCodes}
          format={{ notation: 'compact', maximumFractionDigits: 0 }}
          className="font-mono"
        />
        <span>codes roasted</span>
      </div>
      <span>·</span>
      <div className="flex items-center gap-2">
        <span>avg score:</span>
        <NumberFlow
          value={data.avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
          className="font-mono"
        />
        <span>/10</span>
      </div>
    </div>
  );
}
