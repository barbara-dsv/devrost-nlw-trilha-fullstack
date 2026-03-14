export default function Leaderboard() {
  const leaderboardData = [
    {
      rank: 1,
      code: [
        'eval(prompt("enter code"))',
        "document.write(response)",
        "// trust the user lol",
      ],
      score: "1.2",
      lang: "javascript",
    },
    {
      rank: 2,
      code: [
        "if (x == true) { return true; }",
        "else if (x == false) { return false; }",
        "else { return !false; }",
      ],
      score: "1.8",
      lang: "typescript",
    },
    {
      rank: 3,
      code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
      score: "2.1",
      lang: "sql",
    },
    { rank: 4, code: ["const x = y + z;"], score: "2.5", lang: "javascript" },
    {
      rank: 5,
      code: [
        "function calculateTotal(items) {",
        "  return items.reduce((total, item) => {",
        "    return total + item.price * item.quantity;",
        "  }, 0);",
        "}",
      ],
      score: "3.0",
      lang: "javascript",
    },
    {
      rank: 6,
      code: ["while (true) { break; }"],
      score: "3.5",
      lang: "javascript",
    },
    { rank: 7, code: ["let a; a = a + 1;"], score: "4.0", lang: "javascript" },
    {
      rank: 8,
      code: ["console.log('Hello World')"],
      score: "4.5",
      lang: "javascript",
    },
    {
      rank: 9,
      code: ["document.write('test')"],
      score: "5.0",
      lang: "javascript",
    },
    { rank: 10, code: ["eval('alert(1)')"], score: "5.5", lang: "javascript" },
  ];

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
              key={item.rank}
              className="flex items-start h-auto px-5 py-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
            >
              <span className="w-12 text-muted-foreground font-mono pt-1">
                {item.rank}
              </span>
              <span className="w-16 text-sm font-mono text-accent-red font-bold pt-1">
                {item.score}
              </span>
              <div className="flex-1 mx-4 flex flex-col gap-1">
                {item.code.map((line, index) => (
                  <code
                    // biome-ignore lint/suspicious/noArrayIndexKey: Code lines are static and unique per snippet
                    key={item.rank + "-" + index}
                    className="text-sm font-mono text-foreground"
                  >
                    {line}
                  </code>
                ))}
              </div>
              <span className="w-24 text-xs text-muted-foreground font-mono pt-1">
                {item.lang}
              </span>
            </div>
          ))}
        </div>

        {/* Pagination hint */}
        <div className="flex items-center justify-center mt-6 py-2">
          <span className="text-xs text-muted-foreground font-mono">
            showing top 10 of 2,847 · end of list
          </span>
        </div>
      </div>
    </div>
  );
}
