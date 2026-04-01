import { Button } from "@autonoma/blacklight";
import { CheckIcon } from "@phosphor-icons/react/Check";
import { CopyIcon } from "@phosphor-icons/react/Copy";
import { toastManager } from "lib/toast-manager";
import { useState } from "react";

interface CodeBlockProps {
  children: string;
  copyValue?: string;
}

export function CodeBlock({ children, copyValue }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copyValue ?? children);
      toastManager.add({ type: "success", title: "Copied", description: "Command copied to clipboard." });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastManager.add({
        type: "critical",
        title: "Copy failed",
        description: "Could not write to clipboard. Try selecting the text manually.",
      });
    }
  }

  return (
    <div className="group overflow-hidden border border-border-dim bg-surface-base transition-colors hover:border-primary/30">
      <div className="flex items-center justify-between p-4">
        <pre className="flex-1 overflow-x-auto font-mono text-sm tracking-tight whitespace-pre text-text-secondary">
          {children}
        </pre>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          className="ml-4 shrink-0 self-start"
          title="Copy command"
        >
          {copied ? <CheckIcon size={16} className="text-status-success" /> : <CopyIcon size={16} />}
        </Button>
      </div>
    </div>
  );
}
