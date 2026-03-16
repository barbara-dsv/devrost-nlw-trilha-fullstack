"use client";

import { Button } from "@/components/ui";
import { Toggle } from "@/components/ui/toggle";
import { CodeEditor } from "@/components/ui/code-editor";
import { submitCode } from "@/server/actions/code";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [roastMode, setRoastMode] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [stats, setStats] = useState({ totalCodes: 0, avgScore: 0 });
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

  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchLeaderboard();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard?limit=3");
      const data = await res.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("code", code);
      formData.append("language", language);
      formData.append("roastMode", roastMode.toString());

      const result = await submitCode(formData);
      if (result.success) {
        // Optionally show a toast or just refetch
        await fetchStats();
        await fetchLeaderboard();
        // Reset the form? We'll keep the code for now.
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      console.error("Failed to submit code:", err);
      setError("Failed to submit code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="max-w-3xl w-full text-center space-y-6">
          {/* Title and Subtitle */}
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Drop your code below and we'll rate it
            </h1>
            <p className="text-lg text-muted-foreground">
              Brutally honest or full roast mode - the choice is yours
            </p>
          </div>

          {/* Code Input Area */}
          <form onSubmit={handleSubmit} className="bg-muted rounded-lg border border-border p-1 max-w-2xl mx-auto shadow-lg">
            <div className="mb-4">
              <label htmlFor="language" className="mb-2 block text-sm font-medium text-muted-foreground">
                Language
              </label>
              <div className="relative">
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="block w-full p-2 pl-10 border border-border rounded-md bg-background text-foreground appearance-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="php">PHP</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="sql">SQL</option>
                  <option value="plaintext">Plain Text</option>
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
            <CodeEditor
              defaultValue={code}
              onChange={setCode}
              language={language}
              onLanguageChange={setLanguage}
              theme="dark-plus"
              className="min-h-[200px]"
            />
            
            {/* Actions Bar */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <Toggle.Root checked={roastMode} onCheckedChange={setRoastMode}>
                  <Toggle.Switch />
                  <Toggle.Text>
                    <Toggle.Label>roast mode</Toggle.Label>
                    <Toggle.Description>maximum sarcasm enabled</Toggle.Description>
                  </Toggle.Text>
                </Toggle.Root>
              </div>
              <Button.Lg
                type="submit"
                disabled={submitting}
                className="{submitting ? 'opacity-50' : ''}"
              >
                {submitting ? "Submitting..." : "$ roast_my_code"}
              </Button.Lg>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 max-w-2xl mx-auto">
              {error}
            </div>
          )}

          {/* Stats */}
          {!loading && (
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span>{stats.totalCodes.toLocaleString()} codes roasted</span>
              <span>·</span>
              <span>avg score: {(typeof stats.avgScore === 'number' ? stats.avgScore.toFixed(1) : 0)}/10</span>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Preview Section */}
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
              className="text-secondary text-sm font-mono px-3 py-1.5 border border-border hover:bg-muted transition-colors"
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
              showing top {leaderboard.length} of {stats.totalCodes.toLocaleString()} ·{" "}
              <a href="/leaderboard" className="hover:underline">
                view full leaderboard {">>"}
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 DevRoast. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}