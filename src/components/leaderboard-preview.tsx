'use client';

import { useState, useEffect } from "react";

interface LeaderboardItem {
  id: string;
  code: string;
  language: string;
  score: number;
  scoreCategory: string;
  roastText: string;
  createdAt: Date;
  analysisItems: number;
}

export function LeaderboardPreview() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard?limit=3");
        const data = await res.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="border-t border-border bg-muted/30">
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-bold font-mono text-sm">
              {"//"}
            </span>
            <span className="text-foreground font-bold font-mono text-sm">
              shame_leaderboard
            </span>
          </div>
          <a
            href="/leaderboard"
            className="text-foreground text-sm font-mono px-3 py-1.5 border border-border bg-muted hover:bg-muted/80 transition-colors"
          >
            $ view_all {">>"}
          </a>
        </div>

        <p className="text-muted-foreground text-sm mb-6 font-mono">
          {"//"} the worst code on the internet, ranked by shame
        </p>

        {/* Leaderboard Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center h-10 px-5 bg-muted/50 border-b border-border">
            <span className="w-12 text-xs font-medium text-muted-foreground">
              #
            </span>
            <span className="flex-1 text-xs font-medium text-muted-foreground">
              Code Snippet
            </span>
            <span className="w-16 text-xs font-medium text-muted-foreground">
              Score
            </span>
            <span className="w-16 text-xs font-medium text-muted-foreground">
              Lang
            </span>
          </div>

          {/* Rows */}
          {!loading && leaderboard.length > 0 ? (
            leaderboard.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center h-16 px-5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <span className="w-12 text-muted-foreground">{index + 1}</span>
                <code className="flex-1 text-sm font-mono text-foreground truncate mx-4">
                  {String(item.code).length > 50 ? String(item.code).substring(0, 50) + "..." : String(item.code)}
                </code>
                <span className="w-16 text-sm font-mono text-foreground">
                  {String(item.score)}
                </span>
                <span className="w-16 text-xs text-muted-foreground font-mono">
                  {String(item.language)}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-center h-16 px-5 text-muted-foreground">
              No codes submitted yet. Be the first!
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-center mt-4 py-2">
          <span className="text-xs text-muted-foreground font-mono">
            showing top {leaderboard.length} ·{" "}
            <a href="/leaderboard" className="hover:underline">
              view full leaderboard {">>"}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
