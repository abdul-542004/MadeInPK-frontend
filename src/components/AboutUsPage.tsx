import { Heart, Users, Sparkles, Globe } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState, useEffect, useRef } from "react";

interface AboutUsPageProps {
  onNavigate?: (page: string) => void;
}

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            
            const startTime = Date.now();
            const startValue = 0;
            
            const animate = () => {
              const now = Date.now();
              const progress = Math.min((now - startTime) / duration, 1);
              
              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              const currentCount = Math.floor(easeOutQuart * (end - startValue) + startValue);
              
              setCount(currentCount);
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };
            
            requestAnimationFrame(animate);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return (
    <div ref={counterRef} className="text-4xl text-emerald-700 mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export function AboutUsPage({ onNavigate }: AboutUsPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-emerald-700 text-white py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-600 opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-6">About MadeInPK</h1>
          <p className="text-xl max-w-3xl mx-auto text-emerald-50">
            Celebrating Pakistani craftsmanship and connecting authentic artisans with the world
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                MadeInPK was born from a passion to showcase the incredible artistry and heritage of Pakistani craftsmen to the global market. We believe that every handcrafted piece tells a story of tradition, skill, and cultural pride.
              </p>
              <p>
                Pakistan has a rich legacy of craftsmanship spanning centuries - from the intricate embroidery of Sindh to the vibrant truck art of Punjab, from the delicate pottery of Multan to the exquisite carpets of Lahore. Our mission is to preserve these traditions while empowering artisans with sustainable livelihoods.
              </p>
              <p>
                We work directly with skilled artisans across Pakistan, ensuring fair wages and authentic products. Each item in our collection is carefully curated to represent the finest in Pakistani craftsmanship.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1554532831-7e998a0bf556?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYWtpc3RhbmklMjBhcnRpc2FuJTIwY3JhZnRpbmd8ZW58MXx8fHwxNzYxMDQ5MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Pakistani artisan at work"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative border element inspired by truck art */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-4 border-emerald-500 rounded-lg -z-10" />
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at MadeInPK
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Authenticity */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <Sparkles className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Authenticity</h3>
              <p className="text-gray-600 text-sm">
                Every product is genuinely handcrafted by Pakistani artisans using traditional techniques passed down through generations.
              </p>
            </div>

            {/* Fair Trade */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <Heart className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Fair Trade</h3>
              <p className="text-gray-600 text-sm">
                We ensure artisans receive fair compensation for their work, supporting sustainable livelihoods and communities.
              </p>
            </div>

            {/* Community */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <Users className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Community</h3>
              <p className="text-gray-600 text-sm">
                We build lasting partnerships with artisan communities, investing in their growth and preserving cultural heritage.
              </p>
            </div>

            {/* Global Reach */}
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                <Globe className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Global Reach</h3>
              <p className="text-gray-600 text-sm">
                Connecting Pakistani craftsmanship with customers worldwide, sharing our rich cultural heritage globally.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4">Our Impact</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Together, we're making a difference in artisan communities across Pakistan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <AnimatedCounter end={500} suffix="+" />
            <p className="text-gray-600">Artisans Supported</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={50} suffix="+" />
            <p className="text-gray-600">Villages Reached</p>
          </div>
          <div className="text-center">
            <AnimatedCounter end={10000} suffix="+" />
            <p className="text-gray-600">Products Sold</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1760287364328-e30221615f2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMFBha2lzdGFuaSUyMHRleHRpbGV8ZW58MXx8fHwxNzYxMDQ5MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Traditional Pakistani textiles"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1678791673777-57274271e434?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHBvdHRlcnklMjBjcmFmdHN8ZW58MXx8fHwxNzYxMDQ5MDcyfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Handmade pottery crafts"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-emerald-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl mb-4">Join Our Journey</h2>
          <p className="text-xl text-emerald-50 mb-8">
            Every purchase supports Pakistani artisans and helps preserve centuries of cultural heritage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate && onNavigate("products")}
              className="px-8 py-3 bg-white text-emerald-700 rounded-md hover:bg-emerald-50 transition-colors"
            >
              Shop Now
            </button>
            <button 
              onClick={() => onNavigate && onNavigate("heritage")}
              className="px-8 py-3 border-2 border-white text-white rounded-md hover:bg-emerald-600 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}