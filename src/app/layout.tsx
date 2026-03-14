import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui";

export const metadata: Metadata = {
  title: "DevRoast - Code Rating Platform",
  description: "Rate and roast code with brutal honesty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <div className="min-h-screen flex flex-col">
          <nav className="flex items-center justify-between h-14 px-6 border-b border-border bg-background">
            <div className="flex items-center gap-2">
              <span className="text-accent-green font-bold text-xl">
                &gt;
              </span>
              <span className="text-foreground font-medium">devroast</span>
            </div>
            <a
              href="/leaderboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              leaderboard
            </a>
          </nav>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
