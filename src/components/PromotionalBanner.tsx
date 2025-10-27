import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Tag, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const promotions = [
  {
    id: 1,
    title: "Winter Collection Sale",
    subtitle: "Up to 40% Off",
    description: "Shop our exclusive winter collection featuring handwoven shawls and warm textiles",
    image: "https://images.unsplash.com/photo-1591624033223-073f8b347b4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW50ZXIlMjBzYWxlJTIwYmFubmVyfGVufDF8fHx8MTc2MDkwMDA3OXww&ixlib=rb-4.1.0&q=80&w=1080",
    bgColor: "bg-gradient-to-r from-emerald-600 to-emerald-800",
    icon: Tag
  },
  {
    id: 2,
    title: "New Artisan Collection",
    subtitle: "Just Arrived",
    description: "Discover fresh handcrafted treasures from skilled artisans across Pakistan",
    image: "https://images.unsplash.com/photo-1759729596015-f297c12c5661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXN0aXZlJTIwc2FsZSUyMHByb21vdGlvbnxlbnwxfHx8fDE3NjA5MDAwNzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    bgColor: "bg-gradient-to-r from-amber-600 to-orange-600",
    icon: Sparkles
  },
  {
    id: 3,
    title: "Festive Season Offers",
    subtitle: "Special Discounts",
    description: "Celebrate with traditional crafts - Limited time deals on jewelry and home decor",
    image: "https://images.unsplash.com/photo-1561069934-eee225952461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFzb25hbCUyMGRpc2NvdW50JTIwc2hvcHBpbmd8ZW58MXx8fHwxNzYwOTAwMDc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    bgColor: "bg-gradient-to-r from-purple-600 to-pink-600",
    icon: TrendingUp
  }
];

export function PromotionalBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
  };

  return (
    <div className="relative w-full bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Container */}
        <div className="relative h-64 sm:h-72 md:h-80">
          {/* Slides */}
          {promotions.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <div
                key={promo.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className={`relative h-full rounded-2xl overflow-hidden ${promo.bgColor}`}>
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0">
                    <ImageWithFallback
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover opacity-30"
                    />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex items-center">
                    <div className="w-full px-8 sm:px-12 md:px-16">
                      <div className="max-w-2xl">
                        {/* Icon */}
                        <div className="mb-4">
                          <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                        </div>

                        {/* Subtitle Badge */}
                        <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-1 mb-4">
                          <span className="text-white text-sm sm:text-base">{promo.subtitle}</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-white text-3xl sm:text-4xl md:text-5xl mb-4">
                          {promo.title}
                        </h2>

                        {/* Description */}
                        <p className="text-white/90 text-base sm:text-lg mb-6 max-w-xl">
                          {promo.description}
                        </p>

                        {/* CTA Button */}
                        <Button className="bg-white text-emerald-700 hover:bg-gray-100">
                          Shop Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm rounded-full p-2 transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {promotions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 w-2 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
