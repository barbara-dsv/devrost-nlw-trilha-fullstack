export function StatsSkeleton() {
  return (
    <div className="flex items-center justify-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        <span className="text-muted-foreground">codes roasted</span>
      </div>
      <span className="text-muted-foreground">·</span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">avg score:</span>
        <div className="h-4 w-12 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
