import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-blush flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-10 h-10 text-gold" />
        </div>
        <h1 className="font-display text-6xl font-bold text-charcoal mb-2">404</h1>
        <h2 className="font-display text-2xl font-semibold text-charcoal mb-3">Page Not Found</h2>
        <p className="font-body text-warm-gray mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to shopping.
        </p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
