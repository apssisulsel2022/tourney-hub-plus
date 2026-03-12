import React, { useCallback } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ShareButtonProps = {
  title: string;
  text?: string;
  url: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
};

export function ShareButton({ title, text, url, variant = "outline", size = "default" }: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const onShare = useCallback(async () => {
    const nav = typeof window !== "undefined" ? window.navigator : undefined;
    const shareData: ShareData = { title, text, url };
    try {
      if (nav && "share" in nav) {
        await nav.share(shareData);
        return;
      }
    } catch {
      return;
    }

    try {
      if (!nav?.clipboard) throw new Error("Clipboard unavailable");
      await nav.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
      toast.success("Link copied");
    } catch {
      try {
        window.prompt("Copy this link:", url);
      } catch {
        toast.error("Unable to share this link");
      }
    }
  }, [text, title, url]);

  return (
    <Button variant={variant} size={size} className={size === "icon" ? "h-11 w-11 rounded-2xl" : "h-11 rounded-2xl font-bold gap-2"} onClick={onShare}>
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
      {size !== "icon" ? <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span> : null}
      {size === "icon" ? (copied ? <span className="sr-only">Copied</span> : <span className="sr-only">Share</span>) : null}
      {size === "default" && copied ? <Copy className="h-4 w-4 opacity-0" aria-hidden="true" /> : null}
    </Button>
  );
}
