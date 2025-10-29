import { Hero } from "./Hero";
import { FeaturedProducts } from "./FeaturedProducts";
import { Categories } from "./Categories";
import { Heritage } from "./Heritage";
import { Newsletter } from "./Newsletter";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <>
      <Hero onNavigate={onNavigate as any} />
      <FeaturedProducts onNavigate={onNavigate} />
      <Categories onNavigate={onNavigate} />
      <Heritage />
      <Newsletter />
    </>
  );
}
