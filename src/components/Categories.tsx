import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card } from "./ui/card";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Textiles & Fabrics",
    description: "Exquisite handwoven fabrics and embroidered textiles",
    image: "https://images.unsplash.com/photo-1671576401630-2ae9536524db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjB0ZXh0aWxlcyUyMGZhYnJpY3xlbnwxfHx8fDE3NjA4NzU2MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: 150
  },
  {
    id: 2,
    name: "Carpets & Rugs",
    description: "Traditional hand-knotted carpets and rugs",
    image: "https://images.unsplash.com/photo-1758887263106-48f9934c1cdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvcmllbnRhbCUyMHJ1Z3xlbnwxfHx8fDE3NjA4NzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: 85
  },
  {
    id: 3,
    name: "Jewelry & Accessories",
    description: "Handcrafted ornamental jewelry and accessories",
    image: "https://images.unsplash.com/photo-1758995116288-278d7387cbb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kY3JhZnRlZCUyMGpld2VscnklMjBvcm5hdGV8ZW58MXx8fHwxNzYwODc1NjE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: 120
  },
  {
    id: 4,
    name: "Metalwork",
    description: "Traditional copper and brass handicrafts",
    image: "https://images.unsplash.com/photo-1657639274417-84c49ea8140c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNvcHBlciUyMG1ldGFsd29ya3xlbnwxfHx8fDE3NjA4NzU2MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: 95
  },
  {
    id: 5,
    name: "Pottery & Ceramics",
    description: "Handmade pottery with traditional designs",
    image: "https://images.unsplash.com/photo-1695740639466-7baecca4224d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBjZXJhbWljfGVufDF8fHx8MTc2MDgwMTk4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: 65
  },
  {
    id: 6,
    name: "Home Decor",
    description: "Unique decorative pieces for your home",
    image: "https://images.unsplash.com/photo-1720982892111-5e78b01b3ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWJyb2lkZXJ5JTIwdGV4dGlsZSUyMGRldGFpbHxlbnwxfHx8fDE3NjA4NzU2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    count: 110
  }
];

interface CategoriesProps {
  onNavigate?: (page: "products") => void;
}

export function Categories({ onNavigate }: CategoriesProps) {
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
          {categories.map((category) => (
            <Card
              key={category.id}
              onClick={() => onNavigate?.("products")}
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
                    <span className="text-sm">{category.count} Products</span>
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
