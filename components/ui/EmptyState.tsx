"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center px-4 py-16", className)}>
      <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-gold" />
      </div>
      <h2 className="font-display text-2xl font-semibold text-charcoal mb-2">{title}</h2>
      <p className="font-body text-warm-gray max-w-sm mb-6">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button size="lg">{action.label}</Button>
        </Link>
      )}
    </div>
  );
}
