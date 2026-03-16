import { getLeaderboard, getStats } from "@/server/actions/leaderboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | DevRoast",
  description: "The worst code on the internet, ranked by shame",
};

export default async function Leaderboard() {
  const [leaderboardData, stats] = await Promise.all([
    getLeaderboard(10),
    getStats(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-bold font-mono text-sm">
              {"//"}
            </span>
            <span className="text-foreground font-bold font-mono text-sm">
              full_shame_leaderboard
            </span>
          </div>
          <div className="flex items-center gap-2 text-secondary text-sm font-mono">
            <span>top 10 roasted codes</span>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6 font-mono">
          {"//"} the worst code on the internet, ranked by shame
        </p>

        {/* Leaderboard Table */}
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center h-12 px-5 bg-muted/50 border-b border-border">
            <span className="w-12 text-xs font-medium text-muted-foreground">
              #
            </span>
            <span className="w-16 text-xs font-medium text-muted-foreground">
              Score
            </span>
            <span className="flex-1 text-xs font-medium text-muted-foreground">
              Code
            </span>
            <span className="w-24 text-xs font-medium text-muted-foreground">
              Lang
            </span>
          </div>

          {/* Rows */}
          {leaderboardData.map((item) => (
            <div
              key={item.id}
              className="flex items-start h-auto px-5 py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              <span className="w-12 text-muted-foreground font-mono pt-1">
                {item.scoreCategory}
              </span>
              <span className="w-16 text-sm font-mono text-accent-red font-bold pt-1">
                {Number(item.score).toFixed(1)}
              </span>
              <div className="flex-1 mx-4 flex flex-col gap-1">
                {item.code.split("\n").slice(0, 3).map((line, index) => (
                  <code
                    key={item.id + "-" + index}
                    className="text-sm font-mono text-foreground"
                  >
                    {line}
                  </code>
                ))}
              </div>
              <span className="w-24 text-xs text-muted-foreground font-mono pt-1">
                {item.language}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination hint */}
        <div className="flex items-center justify-center mt-6 py-2">
          <span className="text-xs text-muted-foreground font-mono">
            showing top 10 of {stats.totalCodes.toLocaleString()} · end of list
          </span>
        </div>
      </div>
    </div>
  );
}
