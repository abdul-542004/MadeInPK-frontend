import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Card, CardContent } from "./ui/card";
import { Sparkles, Users, Award, Globe } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Authentic Craftsmanship",
    description: "Every piece is handcrafted by skilled artisans using traditional techniques passed down through generations"
  },
  {
    icon: Users,
    title: "Supporting Local Artisans",
    description: "We work directly with Pakistani craftspeople, ensuring fair wages and preserving cultural heritage"
  },
  {
    icon: Award,
    title: "Quality Assured",
    description: "Each product undergoes rigorous quality checks to ensure you receive only the finest handcrafted items"
  },
  {
    icon: Globe,
    title: "Global Shipping",
    description: "Bringing Pakistani heritage to your doorstep anywhere in the world with secure and reliable shipping"
  }
];

export function Heritage() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heritage Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 lg:order-1">
            <div className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full mb-6">
              Our Heritage
            </div>
            <h2 className="text-gray-900 mb-6">
              Preserving Pakistan's Rich Cultural Legacy
            </h2>
            <p className="text-gray-600 mb-4">
              Pakistan's artistic heritage spans thousands of years, from the ancient Indus Valley civilization 
              to the vibrant crafts of today. Our mission is to celebrate and preserve this rich cultural 
              tapestry by connecting traditional artisans with a global audience.
            </p>
            <p className="text-gray-600 mb-6">
              Each product in our collection represents hours of meticulous handwork, incorporating designs 
              and techniques that have been refined over centuries. From the intricate embroidery of Sindh 
              to the blue pottery of Multan, every piece tells a unique story of Pakistani heritage.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-emerald-700 pl-4">
                <div className="text-emerald-700">1000+</div>
                <div className="text-sm text-gray-600">Years of Heritage</div>
              </div>
              <div className="border-l-4 border-emerald-700 pl-4">
                <div className="text-emerald-700">30+</div>
                <div className="text-sm text-gray-600">Traditional Crafts</div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg transform rotate-3"></div>
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1715615990733-5e43c7dd5511?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWtpc3RhbiUyMGFyY2hpdGVjdHVyZSUyMGhlcml0YWdlfGVufDF8fHx8MTc2MDg3NTYxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Pakistani Heritage"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
