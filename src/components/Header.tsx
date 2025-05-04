import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-pink-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-pink-600">
          Artistic Vicky
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-pink-600 transition-colors">
            Home
          </Link>
          <Link
            to="/#gallery"
            className="hover:text-pink-600 transition-colors"
          >
            Gallery
          </Link>
          <Link to="/#about" className="hover:text-pink-600 transition-colors">
            About
          </Link>
          <Link
            to="/#contact"
            className="hover:text-pink-600 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-pink-600"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-gray-700">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="hover:text-pink-600"
            >
              Home
            </Link>
            <Link
              to="/#gallery"
              onClick={() => setMenuOpen(false)}
              className="hover:text-pink-600"
            >
              Gallery
            </Link>
            <Link
              to="/#about"
              onClick={() => setMenuOpen(false)}
              className="hover:text-pink-600"
            >
              About
            </Link>
            <Link
              to="/#contact"
              onClick={() => setMenuOpen(false)}
              className="hover:text-pink-600"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
