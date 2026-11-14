import { Hero } from "@/components/sections/Hero";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { NewArrivals } from "@/components/sections/NewArrivals";
import { BestSellers } from "@/components/sections/BestSellers";
import { PromoBanners } from "@/components/sections/PromoBanner";
import { CollectionsGrid } from "@/components/sections/CollectionsGrid";
import { BrandStory } from "@/components/sections/BrandStory";
import { WhyZame } from "@/components/sections/WhyZame";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { Reviews } from "@/components/sections/Reviews";
import { Newsletter } from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <PromoBanners />
      <NewArrivals />
      <CollectionsGrid />
      <BestSellers />
      <BrandStory />
      <WhyZame />
      <InstagramFeed />
      <Reviews />
      <Newsletter />
    </>
  );
}
