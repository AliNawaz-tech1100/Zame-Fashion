import Link from "next/link";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin.server";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const showBar = isAdminConfigured() && isAdminAuthenticated();

  return (
    <div className="min-h-screen bg-cream">
      {showBar && (
        <div className="bg-charcoal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-gold" />
              <span className="font-display text-lg font-semibold text-white">
                ZAMÉ <span className="text-gold">Admin</span>
              </span>
              <Link href="/admin/orders/" className="font-body text-sm text-white/70 hover:text-white transition-colors ml-4">
                Orders
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" target="_blank" className="font-body text-sm text-white/70 hover:text-white transition-colors">
                View Store
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
