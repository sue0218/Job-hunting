"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full rounded-2xl shadow-2xl relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-slate-900">
            ちょっと待って！
          </CardTitle>
          <CardDescription className="text-base text-slate-600 mt-2">
            今ならローンチ記念価格で始められます
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Button className="w-full" size="lg" asChild>
            <Link href="/sign-up">無料で始める</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => setIsOpen(false)}
          >
            閉じる
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
