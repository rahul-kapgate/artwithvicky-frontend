import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top section with branding and navigation */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Branding */}
          <div className="flex items-center justify-center md:justify-start mb-4 md:mb-0">
            <Sparkles className="h-8 w-8 text-pink-500 mr-2" />
            <h3 className="text-xl font-bold text-pink-600">Artistic Vicky</h3>
          </div>
          {/* Navigation Links */}
          <nav>
            <ul className="flex flex-wrap justify-center space-x-6">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
        {/* Bottom section with additional details */}
        <div className="mt-6 border-t border-gray-100 pt-4 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Artistic Vicky. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
