import { Suspense } from "react";
import { StatsWrapper, StatsSkeleton } from "@/components/metrics";
import { HomeClient } from "@/components/home-client";
import { LeaderboardPreview } from "@/components/leaderboard-preview";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HomeClient />

      {/* Stats */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsWrapper />
      </Suspense>

      {/* Leaderboard Preview */}
      <LeaderboardPreview />

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 DevRoast. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
