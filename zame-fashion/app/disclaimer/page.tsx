import type { Metadata } from "next";
import { disclaimerSections } from "@/data/legal";
import { LegalHero, LegalSections } from "@/components/content/LegalSections";

export const metadata: Metadata = {
  title: "Disclaimer | ZAMÉ Fashion",
  description:
    "Important information about the content, prices, product information, and external links on the ZAMÉ Fashion website and blog.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-cream">
      <LegalHero
        title="Disclaimer"
        subtitle="Important information about the content, prices, and external links on this website and blog."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <LegalSections sections={disclaimerSections} />
      </div>
    </div>
  );
}
