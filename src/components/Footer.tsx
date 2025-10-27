import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import logo from "figma:asset/5b5a9ccaf2f6b76406aeb93df9f19f90423b3a15.png";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="MadeInPK Logo" className="h-8 w-8 object-contain" />
              <h3 className="text-white">MadeInPK</h3>
            </div>
            <p className="text-sm mb-4">
              Celebrating and preserving Pakistan's rich cultural heritage through authentic handcrafted products.
            </p>
            <div className="flex gap-3">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-emerald-700 transition">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-emerald-700 transition">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-emerald-700 transition">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-emerald-500 transition">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition">Our Artisans</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition">Shop All</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition">Heritage Stories</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition">Contact</a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-emerald-500 transition">Shipping Info</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition">Returns & Exchanges</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition">FAQs</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition">Track Order</a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Karachi, Pakistan</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>+92 (21) 1234-5678</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>hello@madeinpk.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; 2025 MadeInPK. All rights reserved. Made with ❤️ in Pakistan.</p>
        </div>
      </div>
    </footer>
  );
}
