import { Hero } from "./Hero";
import { FeaturedProducts } from "./FeaturedProducts";
import { ActiveAuctions } from "./ActiveAuctions";
import { Categories } from "./Categories";
import { Heritage } from "./Heritage";
import { Newsletter } from "./Newsletter";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onAuctionClick?: (auctionId: string) => void;
  onViewAllAuctions?: () => void;
}

export function HomePage({ onNavigate, onAuctionClick, onViewAllAuctions }: HomePageProps) {
  return (
    <>
      <Hero />
      <FeaturedProducts onNavigate={onNavigate} />
      <ActiveAuctions onAuctionClick={onAuctionClick} onViewAllAuctions={onViewAllAuctions} />
      <Categories onNavigate={onNavigate} />
      <Heritage />
      <Newsletter />
    </>
  );
}
