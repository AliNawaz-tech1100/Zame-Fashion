import type { Metadata } from "next";
import { termsSections } from "@/data/legal";
import { LegalHero, LegalSections } from "@/components/content/LegalSections";

export const metadata: Metadata = {
  title: "Terms & Conditions | ZAMÉ Fashion",
  description:
    "Terms for shopping at ZAMÉ Fashion Pakistan — orders, Cash on Delivery, nationwide delivery, pricing, and our 7-day exchange policy.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <LegalHero
        title="Terms & Conditions"
        subtitle="The terms that govern your use of zamefashion.com and every order you place with us."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <LegalSections sections={termsSections} />
      </div>
    </div>
  );
}
