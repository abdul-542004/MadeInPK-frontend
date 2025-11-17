import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-700 to-teal-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stay Connected with Our Heritage</h2>
          <p className="text-lg text-emerald-100 mb-8">
            Subscribe to our newsletter for exclusive offers, new product launches, and stories from Pakistani artisans
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white border-0 flex-1 h-12 px-4 text-base"
            />
            <Button className="bg-white text-emerald-700 hover:bg-gray-100 h-12 px-6 font-semibold">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-emerald-100 mt-6 font-medium">
            Join 10,000+ subscribers celebrating Pakistani craftsmanship
          </p>
        </div>
      </div>
    </section>
  );
}
