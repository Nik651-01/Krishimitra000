
'use client';
import { Check, Clipboard } from "lucide-react";
import React from "react";

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-muted text-foreground rounded-lg overflow-hidden relative font-code">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-card text-card-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Copy code"
            >
                {copied ? <Check className="w-4 h-4" /> : <Clipboard className="w-4 h-4" />}
            </button>
            <pre className="p-4 text-sm overflow-x-auto"><code className={`language-${lang}`}>{code}</code></pre>
        </div>
    );
}
