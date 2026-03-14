"use client";

import { Button } from "@/components/ui";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";

export default function Home() {
  const [roastMode, setRoastMode] = useState(true);

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
          <div className="bg-muted rounded-lg border border-border p-1 max-w-2xl mx-auto shadow-lg">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/50 rounded-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs text-muted-foreground">code.js</span>
            </div>
            <textarea
              className="w-full h-64 bg-transparent p-4 text-foreground font-mono text-sm resize-none focus:outline-none"
              placeholder="Paste your code here..."
              defaultValue={`function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}`}
            />
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-4">
              <Toggle.Root checked={roastMode} onCheckedChange={setRoastMode}>
                <Toggle.Switch />
                <Toggle.Text>
                  <Toggle.Label>roast mode</Toggle.Label>
                  <Toggle.Description>maximum sarcasm enabled</Toggle.Description>
                </Toggle.Text>
              </Toggle.Root>
            </div>
            <Button.Lg>
              $ roast_my_code
            </Button.Lg>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>2,847 codes roasted</span>
            <span>·</span>
            <span>avg score: 4.2/10</span>
          </div>
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
            {[
              { rank: 1, code: "const x = y + z;", score: "2.1", lang: "js" },
              {
                rank: 2,
                code: "if (true) { return false; }",
                score: "3.4",
                lang: "js",
              },
              {
                rank: 3,
                code: "function foo() { return foo(); }",
                score: "4.2",
                lang: "js",
              },
            ].map((item) => (
              <div
                key={item.rank}
                className="flex items-center h-16 px-5 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <span className="w-12 text-muted-foreground">{item.rank}</span>
                <code className="flex-1 text-sm font-mono text-foreground truncate mx-4">
                  {item.code}
                </code>
                <span className="w-16 text-sm font-mono text-foreground">
                  {item.score}
                </span>
                <span className="w-16 text-xs text-muted-foreground font-mono">
                  {item.lang}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Hint */}
          <div className="flex items-center justify-center mt-4 py-2">
            <span className="text-xs text-muted-foreground font-mono">
              showing top 3 of 2,847 ·{" "}
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
