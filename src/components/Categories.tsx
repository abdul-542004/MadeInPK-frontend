import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { ArrowRight } from "lucide-react";
import type { Category as BackendCategory } from "../types/product";
import { useState, useEffect } from "react";

interface DisplayCategory {
  id: number;
  name: string;
  description: string;
  image: string;
  count?: number;
}

// Pexels API configuration
const PEXELS_API_KEY = "O9dOBAGApdKLjYtmCz4OHtU4VclrrVXvhMODFglIuz0CDxSj7o3EjjMn";

const CATEGORY_SEARCH_QUERIES: Record<string, string> = {
  "woodwork": "wooden table",
  "leather goods": "leather bags",
  "carpets": "carpet and rugs",
  "home decor": "sofa",
  "jewelry": "gold jewelry",
  "pottery": "pottery",
  "handicrafts": "handicrafts",
  "textiles": "fabric",
};

const CATEGORY_CONTENT: Record<string, {
  name: string;
  description: string;
  count?: number;
}> = {
  "woodwork": {
    name: "Woodwork",
    description: "Intricately carved furniture and home accents",
    count: 95,
  },
  "leather goods": {
    name: "Leather Goods",
    description: "Handcrafted premium leather accessories",
    count: 60,
  },
  "carpets": {
    name: "Carpets",
    description: "Hand-knotted masterpieces from local artisans",
    count: 80,
  },
  "home decor": {
    name: "Home Decor",
    description: "Thoughtful pieces to elevate your living spaces",
    count: 110,
  },
  "jewelry": {
    name: "Jewelry",
    description: "Artisan-made jewelry inspired by heritage",
    count: 120,
  },
  "pottery": {
    name: "Pottery",
    description: "Hand-painted ceramics and statement pottery",
    count: 65,
  },
  "handicrafts": {
    name: "Handicrafts",
    description: "Decorative crafts celebrating local artistry",
    count: 90,
  },
  "textiles": {
    name: "Textiles",
    description: "Handwoven fabrics and embroidered collections",
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
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      const imageMap: Record<string, string> = {};
      for (const categoryName of CATEGORY_DISPLAY_ORDER) {
        const query = CATEGORY_SEARCH_QUERIES[categoryName.toLowerCase()];
        if (query) {
          try {
            const response = await fetch(
              `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`,
              {
                headers: {
                  Authorization: PEXELS_API_KEY,
                },
              }
            );
            const data = await response.json();
            console.log(`Fetched image for ${categoryName}:`, data.photos?.[0]?.src?.large);
            if (data.photos && data.photos.length > 0) {
              imageMap[categoryName.toLowerCase()] = data.photos[0].src.large;
            }
          } catch (error) {
            console.error(`Failed to fetch image for ${categoryName}:`, error);
          }
        }
      }

      console.log('All fetched images:', imageMap);
      setCategoryImages(imageMap);
      setIsLoading(false);
    };

    fetchCategoryImages();
  }, []);

  console.log('Current categoryImages state:', categoryImages);

  const fallbackList: DisplayCategory[] = CATEGORY_DISPLAY_ORDER.map((name, index) => {
    const content = CATEGORY_CONTENT[name.toLowerCase()];
    const dynamicImage = categoryImages[name.toLowerCase()];
    console.log(`Mapping ${name}: dynamicImage =`, dynamicImage);
    return {
      id: index + 1,
      name: content?.name ?? name,
      description: content?.description ?? "Explore artisan creations",
      image: dynamicImage || "https://via.placeholder.com/800x600.png?text=Loading...",
      count: content?.count,
    };
  });

  const displayedCategories: DisplayCategory[] = categories && categories.length > 0
    ? categories
        .filter((category) => CATEGORY_DISPLAY_ORDER.includes(category.name))
        .sort((a, b) => CATEGORY_DISPLAY_ORDER.indexOf(a.name) - CATEGORY_DISPLAY_ORDER.indexOf(b.name))
        .map((category) => {
          const content = CATEGORY_CONTENT[category.name.toLowerCase()];
          const dynamicImage = categoryImages[category.name.toLowerCase()];
          return {
            id: category.id,
            name: category.name,
            description: category.description || content?.description || "Discover handcrafted pieces",
            image: dynamicImage || "https://via.placeholder.com/800x600.png?text=Loading...",
            count: content?.count,
          };
        })
    : fallbackList;

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Loading categories...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full mb-4 text-xs font-semibold uppercase tracking-wide">
            Traditional Crafts
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
                  <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200 leading-relaxed">{category.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
