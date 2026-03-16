'use client';

import { Button } from "@/components/ui";
import { Toggle } from "@/components/ui/toggle";
import { CodeEditor } from "@/components/ui/code-editor";
import { submitCode } from "@/server/actions/code";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function HomeClient() {
  const router = useRouter();
  const [roastMode, setRoastMode] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOverLimit, setIsOverLimit] = useState(false);

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
      if (result.success && result.snippetId) {
        router.push(`/result/${result.snippetId}`);
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
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-3xl w-full text-center space-y-6">
        {/* Title and Subtitle */}
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Drop your code below and we&apos;ll rate it
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
            onLimitChange={setIsOverLimit}
            maxLength={2000}
            theme="dark-plus"
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
              disabled={submitting || isOverLimit}
              className={isOverLimit ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isOverLimit ? "Code too long" : submitting ? "Submitting..." : "$ roast_my_code"}
            </Button.Lg>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 max-w-2xl mx-auto">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
