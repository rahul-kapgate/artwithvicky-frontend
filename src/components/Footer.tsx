import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Links */}
        <nav className="flex justify-center mb-4">
          <ul className="flex flex-wrap justify-center space-x-6">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-pink-600 transition-colors duration-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom Text */}
        <div className="border-t border-gray-100 pt-4 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Artistic Vicky. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
