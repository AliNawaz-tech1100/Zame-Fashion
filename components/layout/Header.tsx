"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop/", label: "Shop" },
  { href: "/shop/?category=hair-clips", label: "Hair Clips" },
  { href: "/shop/?category=bows", label: "Bows" },
  { href: "/shop/?category=keychains", label: "Keychains" },
  { href: "/shop/?new=true", label: "New Arrivals" },
  { href: "/about/", label: "About" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const cartCount = useCart((s) => s.getTotalItems());
  const wishlistCount = useWishlist((s) => s.items.length);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/shop/?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-champagne/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <button className="lg:hidden p-2 -ml-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5 text-charcoal" /> : <Menu className="w-5 h-5 text-charcoal" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border-2 border-gold flex items-center justify-center bg-white">
              <span className="font-display font-bold text-gold text-sm leading-none">ZM</span>
            </div>
            <span className="font-display text-xl sm:text-2xl font-semibold text-charcoal tracking-tight">
              ZAM<span className="text-gold">É</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="font-body text-sm text-warm-gray hover:text-charcoal transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:bg-blush rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5 text-charcoal" />
            </button>
            <Link href="/account/" className="hidden sm:flex p-2 hover:bg-blush rounded-full transition-colors" aria-label="Account">
              <User className="w-5 h-5 text-charcoal" />
            </Link>
            <Link href="/account/?tab=wishlist" className="relative p-2 hover:bg-blush rounded-full transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5 text-charcoal" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>
            <Link href="/cart/" className="relative p-2 hover:bg-blush rounded-full transition-colors" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 text-charcoal" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>

        <div className={cn("overflow-hidden transition-all duration-300", searchOpen ? "max-h-16 pb-3" : "max-h-0")}>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
            <input type="text" placeholder="Search accessories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-champagne rounded-input font-body text-sm focus:outline-none focus:border-gold transition-colors" />
          </form>
        </div>
      </div>

      <div className={cn("lg:hidden overflow-hidden transition-all duration-300 border-t border-champagne/50 bg-cream", mobileOpen ? "max-h-96" : "max-h-0")}>
        <nav className="px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 font-body text-sm text-warm-gray hover:text-charcoal hover:bg-blush rounded-lg transition-colors">{link.label}</Link>
          ))}
          <Link href="/account/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-2.5 px-3 font-body text-sm text-warm-gray hover:text-charcoal hover:bg-blush rounded-lg transition-colors">
            <User className="w-4 h-4" /> My Account
          </Link>
        </nav>
      </div>
    </header>
  );
}
