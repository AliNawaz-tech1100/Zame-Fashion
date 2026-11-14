"use client";

import { Ruler } from "lucide-react";
import { Product } from "@/types";

interface SizeGuideProps {
  product: Product;
}

export function SizeGuide({ product }: SizeGuideProps) {
  if (!product.sizeGuide || product.sizeGuide.length === 0) {
    return (
      <div className="bg-cream rounded-card p-6">
        <div className="flex items-center gap-2 mb-3">
          <Ruler className="w-5 h-5 text-gold" />
          <h3 className="font-display text-lg font-semibold text-charcoal">Size Information</h3>
        </div>
        <p className="font-body text-sm text-warm-gray">
          This item is one-size-fits-all. Dimensions are provided in the product specifications above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-cream rounded-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="w-5 h-5 text-gold" />
        <h3 className="font-display text-lg font-semibold text-charcoal">Size & Measurements</h3>
      </div>
      {product.modelInfo && (
        <p className="font-body text-sm text-warm-gray mb-4 italic">{product.modelInfo}</p>
      )}
      <div className="overflow-hidden rounded-input border border-champagne">
        <table className="w-full">
          <thead>
            <tr className="bg-white">
              <th className="text-left font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Measurement</th>
              <th className="text-left font-body text-xs font-semibold text-charcoal uppercase tracking-wider px-4 py-3">Value</th>
            </tr>
          </thead>
          <tbody>
            {product.sizeGuide.map((item, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-cream" : "bg-white"}>
                <td className="font-body text-sm text-charcoal px-4 py-3">{item.label}</td>
                <td className="font-body text-sm text-warm-gray px-4 py-3">{item.measurements}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
