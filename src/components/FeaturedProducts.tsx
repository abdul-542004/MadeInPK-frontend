import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Handwoven Pashmina Shawl",
    price: "$89.99",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1671576401630-2ae9536524db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjB0ZXh0aWxlcyUyMGZhYnJpY3xlbnwxfHx8fDE3NjA4NzU2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Textiles"
  },
  {
    id: 2,
    name: "Traditional Ceramic Pottery Set",
    price: "$64.99",
    rating: 4.9,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1695740639466-7baecca4224d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBjZXJhbWljfGVufDF8fHx8MTc2MDgwMTk4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Pottery"
  },
  {
    id: 3,
    name: "Artisan Wooden Handicrafts",
    price: "$45.99",
    rating: 4.7,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1628924172947-113fb23621b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGhhbmRpY3JhZnRzfGVufDF8fHx8MTc2MDg3NTYxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Handicrafts"
  },
  {
    id: 4,
    name: "Embroidered Cushion Covers",
    price: "$32.99",
    rating: 4.6,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1720982892111-5e78b01b3ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyb2lkZXJ5JTIwdGV4dGlsZSUyMGRldGFpbHxlbnwxfHx8fDE3NjA4NzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Home Decor"
  }
];

interface FeaturedProductsProps {
  onNavigate?: (page: "products") => void;
}

export function FeaturedProducts({ onNavigate }: FeaturedProductsProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Handpicked treasures from skilled Pakistani artisans, each piece a testament to traditional craftsmanship
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="relative overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-3 right-3 bg-white hover:bg-white hover:text-red-500"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <div className="absolute top-3 left-3 bg-emerald-700 text-white px-3 py-1 rounded-full text-sm">
                  {product.category}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-700">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700">{product.price}</span>
                  <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
            onClick={() => onNavigate?.("products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
