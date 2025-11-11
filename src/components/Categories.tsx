import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { ArrowRight } from "lucide-react";
import type { Category as BackendCategory } from "../types/product";

interface DisplayCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  count?: number;
}

const FALLBACK_CATEGORY_CONTENT: Record<string, Omit<DisplayCategory, "id">> = {
  "woodwork": {
    name: "Woodwork",
    description: "Intricately carved furniture and home accents",
    image: "https://images.unsplash.com/photo-1759773596844-8d350a558966?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    count: 95,
  },
  "leather goods": {
    name: "Leather Goods",
    description: "Handcrafted premium leather accessories",
    image: "https://images.unsplash.com/photo-1600189028467-8b7a9b7d7f72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    count: 60,
  },
  "carpets": {
    name: "Carpets",
    description: "Hand-knotted masterpieces from local artisans",
    image: "https://images.unsplash.com/photo-1758887263106-48f9934c1cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    count: 80,
  },
  "home decor": {
    name: "Home Decor",
    description: "Thoughtful pieces to elevate your living spaces",
    image: "https://images.unsplash.com/photo-1720982892111-5e78b01b3ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    count: 110,
  },
  "jewelry": {
    name: "Jewelry",
    description: "Artisan-made jewelry inspired by heritage",
    image: "https://images.unsplash.com/photo-1758995116288-278d7387cbb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    count: 120,
  },
  "pottery": {
    name: "Pottery",
    description: "Hand-painted ceramics and statement pottery",
    image: "https://images.unsplash.com/photo-1695740639466-7baecca4224d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    count: 65,
  },
  "handicrafts": {
    name: "Handicrafts",
    description: "Decorative crafts celebrating local artistry",
    image: "https://images.unsplash.com/photo-1657639274417-84c49ea8140c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    count: 90,
  },
  "textiles": {
    name: "Textiles",
    description: "Handwoven fabrics and embroidered collections",
    image: "https://images.unsplash.com/photo-1671576401630-2ae9536524db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
    count: 150,
  },
};

const CATEGORY_DISPLAY_ORDER = [
  "Woodwork",
  "Leather Goods",
  "Carpets",
  "Home Decor",
  "Jewelry",
  "Pottery",
  "Handicrafts",
  "Textiles",
];

interface CategoriesProps {
  onNavigate?: (page: "products") => void;
  categories?: BackendCategory[];
  onCategorySelect?: (categoryId: number) => void;
}

export function Categories({ onNavigate, categories, onCategorySelect }: CategoriesProps) {
  const fallbackList: DisplayCategory[] = CATEGORY_DISPLAY_ORDER.map((name, index) => {
    const fallback = FALLBACK_CATEGORY_CONTENT[name.toLowerCase()];
    return {
      id: index + 1,
      name: fallback?.name ?? name,
      description: fallback?.description ?? "Explore artisan creations",
      image: fallback?.image ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
      count: fallback?.count,
    };
  });

  const displayedCategories: DisplayCategory[] = categories && categories.length > 0
    ? categories
        .filter((category) => CATEGORY_DISPLAY_ORDER.includes(category.name))
        .sort((a, b) => CATEGORY_DISPLAY_ORDER.indexOf(a.name) - CATEGORY_DISPLAY_ORDER.indexOf(b.name))
        .map((category) => {
          const fallback = FALLBACK_CATEGORY_CONTENT[category.name.toLowerCase()];
          return {
            id: category.id,
            name: category.name,
            description: category.description || fallback?.description || "Discover handcrafted pieces",
            image: fallback?.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
            count: fallback?.count,
          };
        })
    : fallbackList;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse collection of authentic Pakistani crafts, organized by traditional art forms
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedCategories.map((category) => (
            <Card
              key={category.id}
              onClick={() => {
                if (onCategorySelect) {
                  onCategorySelect(category.id);
                } else {
                  onNavigate?.("products");
                }
              }}
              className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200 mb-3">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      {typeof category.count === "number" ? `${category.count} Products` : "Explore Collection"}
                    </span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
