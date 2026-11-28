import type { LegalSection } from "@/data/legal";
import { SectionBlocks } from "./SectionBlocks";

export function LegalSections({ sections }: { sections: readonly LegalSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.heading} className="bg-white rounded-card p-6 shadow-card">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-charcoal mb-4">
            {section.heading}
          </h2>
          <SectionBlocks blocks={section.blocks} />
        </section>
      ))}
    </div>
  );
}

export function LegalHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="bg-charcoal py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="font-body text-white/60 max-w-xl mx-auto">{subtitle}</p>
        <p className="font-body text-white/40 text-xs mt-4">Last updated: 28 November 2026</p>
      </div>
    </div>
  );
}
