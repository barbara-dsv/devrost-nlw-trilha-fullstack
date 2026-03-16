import { getSnippetById } from "@/server/actions/leaderboard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScoreRing } from "@/components/ui";
import { CodeBlockWithHighlight } from "@/components/ui";
import Link from "next/link";

interface ResultPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { id } = await params;
  const snippet = await getSnippetById(id);
  
  if (!snippet) {
    return {
      title: "Result Not Found | DevRoast",
    };
  }

  return {
    title: `Score ${Number(snippet.score).toFixed(1)}/10 | DevRoast`,
    description: snippet.roastText,
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  const snippet = await getSnippetById(id);

  if (!snippet) {
    notFound();
  }

  const codeLines = snippet.code.split("\n").length;
  const score = Number(snippet.score);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-0 h-14 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-accent-green font-bold font-mono text-xl">
            &gt;
          </span>
          <span className="text-foreground font-mono text-lg">devroast</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/leaderboard"
            className="text-secondary font-mono text-sm hover:text-foreground transition-colors"
          >
            leaderboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-10 py-10 space-y-10">
        {/* Score Hero */}
        <div className="flex items-center gap-12">
          <ScoreRing.Root score={score} maxScore={10} size={180} strokeWidth={4}>
            <div className="relative" style={{ width: 180, height: 180 }}>
              <svg
                width={180}
                height={180}
                className="absolute inset-0 transform -rotate-90"
              >
                <circle
                  cx={90}
                  cy={90}
                  r={88}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={4}
                  className="text-border"
                />
                <circle
                  cx={90}
                  cy={90}
                  r={88}
                  fill="none"
                  stroke="url(#resultGradient)"
                  strokeWidth={4}
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 - (score / 10) * 552.92}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="resultGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="35%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-accent-amber leading-none">
                  {score.toFixed(1)}
                </span>
                <span className="text-base text-muted-foreground">/10</span>
              </div>
            </div>
          </ScoreRing.Root>

          {/* Roast Summary */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-accent-red font-mono text-sm font-medium">
                verdict: {snippet.scoreCategory.replace("_", " ")}
              </span>
            </div>
            <h1 className="text-xl font-normal text-foreground leading-relaxed max-w-xl">
              &ldquo;{snippet.roastText}&rdquo;
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
              <span>lang: {snippet.language}</span>
              <span>·</span>
              <span>{codeLines} lines</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 border border-border text-foreground font-mono text-xs rounded hover:bg-muted transition-colors">
                $ share_roast
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Code Preview Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-bold font-mono text-sm">//</span>
            <span className="text-foreground font-mono text-sm">submitted_code</span>
          </div>
          <div className="border border-border rounded-lg overflow-hidden bg-input">
            <div className="flex h-[424px]">
              {/* Line Numbers */}
              <div className="w-12 bg-muted/50 border-r border-border flex flex-col items-end py-3 px-2 gap-1">
                {Array.from({ length: Math.min(codeLines, 20) }, (_, i) => (
                  <span key={i} className="font-mono text-xs text-muted-foreground">
                    {i + 1}
                  </span>
                ))}
              </div>
              {/* Code Content */}
              <div className="flex-1 overflow-auto p-4">
                <CodeBlockWithHighlight
                  code={snippet.code}
                  language={snippet.language}
                  theme="dark-plus"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Analysis Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-bold font-mono text-sm">//</span>
            <span className="text-foreground font-mono text-sm">analysis</span>
          </div>
          
          {snippet.analysisItems && snippet.analysisItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-5">
              {snippet.analysisItems.map((item, index) => (
                <div
                  key={item.id}
                  className="p-5 border border-border space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.severity === "critical"
                          ? "bg-accent-red"
                          : item.severity === "warning"
                          ? "bg-amber-500"
                          : "bg-accent-green"
                      }`}
                    />
                    <span className="text-foreground font-mono text-sm font-medium">
                      {index + 1}. {item.title}
                    </span>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No analysis items found.
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Diff Section - Placeholder */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-bold font-mono text-sm">//</span>
            <span className="text-foreground font-mono text-sm">improved_version</span>
          </div>
          <div className="border border-border rounded-lg overflow-hidden bg-input">
            <div className="h-40 flex items-center justify-center text-muted-foreground text-sm font-mono">
              Improved code coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
