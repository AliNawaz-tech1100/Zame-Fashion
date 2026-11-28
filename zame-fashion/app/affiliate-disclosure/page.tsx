import type { Metadata } from "next";
import { affiliateSections } from "@/data/legal";
import { LegalHero, LegalSections } from "@/components/content/LegalSections";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | ZAMÉ Fashion",
  description:
    "How ZAMÉ Fashion earns commissions from affiliate links (Daraz, Amazon Associates) at no extra cost to you, and how we keep recommendations honest.",
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen bg-cream">
      <LegalHero
        title="Affiliate Disclosure"
        subtitle="In plain language: how we earn money from some links on this site, so you always know what happens when you click."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <LegalSections sections={affiliateSections} />
      </div>
    </div>
  );
}
