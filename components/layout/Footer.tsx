import Link from "next/link";
import { Instagram, Mail, Phone, MapPin, CreditCard, Truck, Shield, RotateCcw } from "lucide-react";

const footerLinks = {
  shop: [
    { href: "/shop/", label: "All Products" },
    { href: "/shop/?new=true", label: "New Arrivals" },
    { href: "/shop/?bestseller=true", label: "Best Sellers" },
    { href: "/shop/?category=hair-clips", label: "Hair Clips" },
    { href: "/shop/?category=bows", label: "Bows" },
    { href: "/shop/?category=keychains", label: "Keychains" },
    { href: "/shop/?sale=true", label: "Sale" },
  ],
  help: [
    { href: "/shipping-returns/", label: "Shipping & Delivery" },
    { href: "/shipping-returns/", label: "Returns & Exchanges" },
    { href: "#", label: "Size Guide" },
    { href: "#", label: "FAQs" },
    { href: "#", label: "Contact Us" },
  ],
  company: [
    { href: "/about/", label: "About Zame Fashion" },
    { href: "/about/", label: "Our Story" },
    { href: "#", label: "Careers" },
    { href: "#", label: "Press" },
  ],
  account: [
    { href: "/account/", label: "My Account" },
    { href: "/account/?tab=orders", label: "My Orders" },
    { href: "/account/?tab=wishlist", label: "My Wishlist" },
    { href: "/cart/", label: "Shopping Cart" },
  ],
};

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com/zame_fashion" },
  { label: "Facebook", href: "#" },
  { label: "TikTok", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Trust Bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over PKR 2,000" },
              { icon: CreditCard, title: "Cash on Delivery", desc: "Pay safely when your order arrives" },
              { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free policy" },
              { icon: Shield, title: "Quality Guaranteed", desc: "100% imported accessories" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="font-body text-sm font-medium text-white">{item.title}</p>
                  <p className="font-body text-xs text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center bg-white">
                <span className="font-display font-bold text-gold text-sm">ZM</span>
              </div>
              <span className="font-display text-2xl font-semibold tracking-tight">
                ZAM<span className="text-gold">É</span>
              </span>
            </Link>
            <p className="font-body text-sm text-gray-400 leading-relaxed mb-6 max-w-xs">
              Premium imported fashion accessories. Hair clips, bows, keychains & more —
              designed for the cute, confident you. Based in Lahore, Pakistan.
            </p>
            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs text-gray-400 hover:text-gold transition-colors"
                >
                  {social.label}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com/zame_fashion" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="mailto:hello@zamefashion.com" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display text-base font-semibold mb-4">Shop</h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="font-body text-sm text-gray-400 hover:text-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-display text-base font-semibold mb-4">Customer Care</h3>
            <ul className="space-y-2.5">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-body text-sm text-gray-400 hover:text-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-display text-base font-semibold mb-4">About</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-body text-sm text-gray-400 hover:text-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-display text-base font-semibold mb-4">Account</h3>
            <ul className="space-y-2.5">
              {footerLinks.account.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="font-body text-sm text-gray-400 hover:text-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-gray-500">
            © 2024 ZAMÉ Fashion. All rights reserved. Lahore, Pakistan.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="font-body text-xs text-gray-500 hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="#" className="font-body text-xs text-gray-500 hover:text-gold transition-colors">Terms & Conditions</Link>
            <Link href="#" className="font-body text-xs text-gray-500 hover:text-gold transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
