"use client";

import { useState, useEffect } from "react";
import { X, Truck, Banknote, Sparkles } from "lucide-react";
import { homepageContent } from "@/data/products";

const iconMap: Record<string, React.ReactNode> = {
  "🎀": <Truck className="w-3.5 h-3.5" />,
  "💰": <Banknote className="w-3.5 h-3.5" />,
  "✨": <Sparkles className="w-3.5 h-3.5" />,
};

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const messages = homepageContent.announcement.messages;

  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, homepageContent.announcement.intervalMs);
    return () => clearInterval(interval);
  }, [messages.length]);

  if (dismissed) return null;

  const currentMessage = messages[currentIndex];
  const firstEmoji = currentMessage.split(" ")[0];
  const Icon = iconMap[firstEmoji] || <Sparkles className="w-3.5 h-3.5" />;
  const cleanMessage = currentMessage.replace(/^[^\s]+\s/, "");

  return (
    <div className="bg-charcoal text-white py-2.5 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-body tracking-wide text-center transition-opacity duration-500">
          {Icon}
          <span>{cleanMessage}</span>
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss announcement"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
