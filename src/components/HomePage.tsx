import { useEffect, useState } from "react";
import { Hero } from "./Hero";
import { FeaturedProducts } from "./FeaturedProducts";
import { NewAuctions } from "./NewAuctions";
import { Categories } from "./Categories";
import { Heritage } from "./Heritage";
import { Newsletter } from "./Newsletter";
import type { FixedPriceListing } from "../types/product";
import type { Category } from "../types/product";
import { productService } from "../services/productService";
import { toast } from "sonner";

interface HomePageProps {
  onNavigate: (page: string) => void;
  onListingSelect?: (listing: FixedPriceListing) => void;
  onAuctionSelect?: (auctionId: number | string) => void;
  onCategorySelect?: (categoryId: number) => void;
}

export function HomePage({ onNavigate, onListingSelect, onAuctionSelect, onCategorySelect }: HomePageProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Failed to load categories");
      }
    };

    void loadCategories();
  }, []);

  return (
    <>
      <Hero onNavigate={onNavigate as any} />
      <FeaturedProducts onNavigate={onNavigate} onListingSelect={onListingSelect} />
      <NewAuctions onNavigate={onNavigate} onAuctionSelect={onAuctionSelect} />
      <Categories onNavigate={onNavigate} categories={categories} onCategorySelect={onCategorySelect} />
      <Heritage />
      <Newsletter />
    </>
  );
}
