import type { Metadata } from "next";
import { privacySections } from "@/data/legal";
import { LegalHero, LegalSections } from "@/components/content/LegalSections";

export const metadata: Metadata = {
  title: "Privacy Policy | ZAMÉ Fashion",
  description:
    "How ZAMÉ Fashion collects, uses, and protects your personal information, including cookies, Google AdSense advertising, and affiliate links.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <LegalHero
        title="Privacy Policy"
        subtitle="What information we collect, how we use it, and the choices you have — including cookies and Google AdSense advertising."
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <LegalSections sections={privacySections} />
      </div>
    </div>
  );
}
