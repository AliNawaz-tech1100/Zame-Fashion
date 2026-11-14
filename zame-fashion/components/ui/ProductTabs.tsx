"use client";

import { useState } from "react";
import { Product } from "@/types";
import { SizeGuide } from "@/components/ui/SizeGuide";
import { cn } from "@/lib/utils";
import { FileText, List, Ruler, Droplets, Truck, RotateCcw, ChevronDown } from "lucide-react";

interface ProductTabsProps {
  product: Product;
}

const tabIcons = {
  description: FileText,
  details: List,
  size: Ruler,
  care: Droplets,
  shipping: Truck,
  returns: RotateCcw,
};

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Description", content: product.description },
    ...(product.specifications && product.specifications.length > 0 ? [{ id: "details", label: "Details & Specs" }] : []),
    ...(product.sizeGuide ? [{ id: "size", label: "Size & Fit" }] : []),
    ...(product.careInstructions && product.careInstructions.length > 0 ? [{ id: "care", label: "Care Instructions" }] : []),
    ...(product.shippingInfo ? [{ id: "shipping", label: "Shipping & Delivery" }] : []),
    ...(product.returnPolicy ? [{ id: "returns", label: "Returns & Exchanges" }] : []),
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-4">
            {product.description.split("\n\n").map((para, i) => (
              <p key={i} className="font-body text-sm text-warm-gray leading-relaxed">{para}</p>
            ))}
            {product.materials && (
              <div className="mt-4 pt-4 border-t border-champagne/50">
                <h4 className="font-body text-sm font-semibold text-charcoal mb-2">Materials</h4>
                <p className="font-body text-sm text-warm-gray leading-relaxed">{product.materials}</p>
              </div>
            )}
          </div>
        );
      case "details":
        return (
          <div className="overflow-hidden rounded-input border border-champagne">
            <table className="w-full">
              <tbody>
                {product.specifications?.map((spec, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-cream" : "bg-white"}>
                    <td className="font-body text-sm font-medium text-charcoal px-4 py-3 w-1/3">{spec.label}</td>
                    <td className="font-body text-sm text-warm-gray px-4 py-3">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "size":
        return <SizeGuide product={product} />;
      case "care":
        return (
          <div className="bg-cream rounded-card p-6">
            <h3 className="font-display text-lg font-semibold text-charcoal mb-4">How to Care for Your {product.name}</h3>
            <ul className="space-y-3">
              {product.careInstructions?.map((instruction, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-body text-xs font-bold text-gold">{i + 1}</span>
                  </span>
                  <span className="font-body text-sm text-warm-gray">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case "shipping":
        return (
          <div className="bg-cream rounded-card p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-charcoal">Shipping & Delivery</h3>
            <p className="font-body text-sm text-warm-gray leading-relaxed">{product.shippingInfo}</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="bg-white rounded-input p-4">
                <p className="font-body text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">Processing Time</p>
                <p className="font-body text-sm text-warm-gray">1–2 business days</p>
              </div>
              <div className="bg-white rounded-input p-4">
                <p className="font-body text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">Delivery Time</p>
                <p className="font-body text-sm text-warm-gray">3–5 business days</p>
              </div>
              <div className="bg-white rounded-input p-4">
                <p className="font-body text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">Free Shipping</p>
                <p className="font-body text-sm text-warm-gray">On orders over PKR 2,000</p>
              </div>
              <div className="bg-white rounded-input p-4">
                <p className="font-body text-xs font-semibold text-charcoal uppercase tracking-wider mb-1">COD</p>
                <p className="font-body text-sm text-warm-gray">Available nationwide</p>
              </div>
            </div>
          </div>
        );
      case "returns":
        return (
          <div className="bg-cream rounded-card p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-charcoal">Returns & Exchanges</h3>
            <p className="font-body text-sm text-warm-gray leading-relaxed">{product.returnPolicy}</p>
            <div className="bg-white rounded-input p-4 mt-4">
              <p className="font-body text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">Return Window</p>
              <p className="font-body text-sm text-warm-gray">7 days from delivery date</p>
            </div>
            <div className="bg-white rounded-input p-4">
              <p className="font-body text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">Condition</p>
              <p className="font-body text-sm text-warm-gray">Items must be unused with original packaging intact</p>
            </div>
            <div className="bg-white rounded-input p-4">
              <p className="font-body text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">Exchanges</p>
              <p className="font-body text-sm text-warm-gray">Available for defective or incorrect items. Contact us within 48 hours of delivery.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-12">
      {/* Desktop Tabs */}
      <div className="hidden md:block">
        <div className="flex items-center gap-1 border-b border-champagne/50 mb-6">
          {tabs.map((tab) => {
            const Icon = tabIcons[tab.id as keyof typeof tabIcons];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 font-body text-sm font-medium transition-colors relative",
                  activeTab === tab.id ? "text-charcoal" : "text-warm-gray hover:text-charcoal"
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            );
          })}
        </div>
        <div className="min-h-[200px]">{renderContent()}</div>
      </div>

      {/* Mobile Accordions */}
      <div className="md:hidden space-y-2">
        {tabs.map((tab) => {
          const Icon = tabIcons[tab.id as keyof typeof tabIcons];
          const isOpen = activeTab === tab.id;
          return (
            <div key={tab.id} className="bg-white rounded-card shadow-card overflow-hidden">
              <button
                onClick={() => setActiveTab(isOpen ? "" : tab.id)}
                className="w-full flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="w-4 h-4 text-gold" />}
                  <span className="font-body text-sm font-medium text-charcoal">{tab.label}</span>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-warm-gray transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && <div className="px-5 pb-5">{renderContent()}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
