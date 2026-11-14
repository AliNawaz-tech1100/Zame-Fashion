import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Gem, Heart, Sparkles, Users } from "lucide-react";

export const metadata = {
  title: "About ZAMÉ Fashion | Our Story & Philosophy",
  description: "Discover the story behind ZAMÉ Fashion — a Lahore-based brand curating premium imported accessories for the modern woman.",
};

const values = [
  {
    icon: Sparkles,
    title: "Style First",
    description: "We believe accessories should do more than complete an outfit — they should express who you are. Every piece is chosen to help you feel confident, beautiful, and uniquely yourself.",
  },
  {
    icon: Gem,
    title: "Quality Always",
    description: "We never compromise on quality. Each product is carefully inspected and tested to ensure it meets our standards for durability, finish, and overall excellence.",
  },
  {
    icon: Heart,
    title: "Made with Care",
    description: "From handmade crochet keychains to pearl-embellished headbands, every item in our collection is crafted with attention to detail and a genuine love for beautiful things.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "ZAMÉ Fashion exists because of you — our community of style-loving women. Your feedback, your photos, and your support shape everything we do.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative bg-charcoal overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-transparent z-10" />
        <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600&q=80" alt="About Zame Fashion" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-32">
          <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-4 block">Our Story</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-2xl mb-6">
            About ZAMÉ Fashion
          </h1>
          <p className="font-body text-lg text-white/70 max-w-xl leading-relaxed">
            Fashion that reflects who you are. Born in Lahore, made for women who believe the details matter.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-card overflow-hidden shadow-card">
                <img src="https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=800&q=80" alt="Zame Fashion Story" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gold text-white rounded-card p-6 shadow-hover">
                <p className="font-display text-4xl font-bold">2024</p>
                <p className="font-body text-sm">Founded in Lahore</p>
              </div>
            </div>
            <div>
              <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-3 block">How It Started</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-6">Our Story</h2>
              <div className="space-y-4">
                <p className="font-body text-warm-gray leading-relaxed">
                  ZAMÉ Fashion was born from a simple belief: that the right accessory can transform not just your look, but how you feel. Founded in Lahore, we set out to curate a collection of premium imported accessories that bring joy, confidence, and a touch of elegance to everyday moments.
                </p>
                <p className="font-body text-warm-gray leading-relaxed">
                  What started as a passion project — sourcing beautiful hair clips, bows, and keychains from artisans around the world — has grown into a community of women who believe that style is personal and details matter.
                </p>
                <p className="font-body text-warm-gray leading-relaxed">
                  Every piece in our collection is thoughtfully selected for its quality, design, and ability to make you smile. From handmade crochet keychains to pearl-embellished headbands, we believe in accessories that tell a story — your story.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-3 block">What We Believe</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-3">Our Philosophy</h2>
            <p className="font-body text-warm-gray max-w-2xl mx-auto">
              At ZAMÉ Fashion, we believe that style is not about following trends — it&apos;s about expressing who you are. Our philosophy is built on four core pillars.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-cream rounded-card p-8 hover:shadow-hover transition-shadow duration-300">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-5 text-gold">
                  <value.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-semibold text-charcoal mb-3">{value.title}</h3>
                <p className="font-body text-sm text-warm-gray leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality & Craftsmanship */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="font-body text-xs font-semibold tracking-widest uppercase text-gold mb-3 block">The Details</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-charcoal mb-6">Quality & Craftsmanship</h2>
              <div className="space-y-4">
                <p className="font-body text-warm-gray leading-relaxed">
                  We work directly with trusted artisans and suppliers to bring you pieces that are both beautiful and built to last. Our commitment to quality means you can shop with confidence, knowing that every ZAMÉ Fashion piece has been chosen with care.
                </p>
                <p className="font-body text-warm-gray leading-relaxed">
                  From the softness of our satin bows to the precision of our pearl placements, we obsess over the details so you don&apos;t have to. Every product undergoes a quality check before it reaches your hands.
                </p>
                <p className="font-body text-warm-gray leading-relaxed">
                  We source materials responsibly and prioritize durability. Our crochet pieces use 100% imported cotton yarn. Our metal hardware is rust-resistant and hair-friendly. Because accessories should last, not just look good on day one.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-square rounded-card overflow-hidden shadow-card">
                <img src="https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80" alt="Craftsmanship" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-charcoal relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Discover the Collection
          </h2>
          <p className="font-body text-white/60 max-w-md mx-auto mb-8">
            Explore our curated selection of premium imported accessories designed for the modern woman.
          </p>
          <Link href="/shop/">
            <Button size="lg" className="bg-gold hover:bg-gold-dark text-white">
              Shop Now <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
