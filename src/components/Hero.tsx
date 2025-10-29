import { useEffect, useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroProps {
  onNavigate?: (page: "products" | "heritage") => void;
}

const carouselImages = [
  {
    src: "https://images.unsplash.com/photo-1715615990733-5e43c7dd5511?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbiUyMGFyY2hpdGVjdHVyZSUyMGhlcml0YWdlfGVufDF8fHx8MTc2MDg3NTYxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Pakistani Heritage Architecture"
  },
  {
    src: "https://images.unsplash.com/photo-1700139471555-3e969be1ffe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbmklMjBjcmFmdCUyMGFydGlzYW4lMjB3b3JraW5nfGVufDF8fHx8MTc2MDg3NzQ4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Pakistani Artisan at Work"
  },
  {
    src: "https://images.unsplash.com/photo-1612541299807-e17e315de0fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGVtYnJvaWRlcnklMjBoYW5kc3xlbnwxfHx8fDE3NjA4Nzc0ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Traditional Embroidery"
  },
  {
    src: "https://images.unsplash.com/photo-1611574557351-00889b20a36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbG9vbSUyMHdlYXZpbmclMjB0ZXh0aWxlfGVufDF8fHx8MTc2MDg3NzQ4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Handloom Weaving"
  }
];

export function Hero({ onNavigate }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <section className="relative bg-gradient-to-r from-emerald-50 to-teal-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Top Section - Badge and Carousel */}
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-3 bg-emerald-100 text-emerald-800 rounded-full mb-8">
            Celebrating Pakistani Craftsmanship
          </div>
          
          {/* Carousel */}
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              {/* Images */}
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <ImageWithFallback
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "bg-white w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl hidden lg:block z-10">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-900">Authentic</div>
                  <div className="text-sm text-gray-600">100% Handmade</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Discover Rich Heritage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-16">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-gray-900">
              Discover the Rich Heritage of Pakistan
            </h1>
            <p className="text-gray-600">
              Explore our curated collection of authentic Pakistani handcrafted products. 
              From intricate textiles to traditional pottery, each piece tells a story of 
              centuries-old craftsmanship and cultural pride.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-emerald-700 hover:bg-emerald-800"
                onClick={() => onNavigate?.("products")}
              >
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                onClick={() => onNavigate?.("heritage")}
              >
                Explore Heritage
              </Button>
            </div>
          </div>

          {/* Right Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-emerald-700">500+</div>
              <div className="text-sm text-gray-600 mt-2">Products</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-emerald-700">200+</div>
              <div className="text-sm text-gray-600 mt-2">Artisans</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-emerald-700">50+</div>
              <div className="text-sm text-gray-600 mt-2">Cities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
