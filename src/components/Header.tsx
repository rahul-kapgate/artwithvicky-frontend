import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AuthModal from "../pages/AuthModal";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("login");
  const location = useLocation();

  // Scroll to hash target after navigating
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname + location.hash === path;
  };

  const linkClass = (path: string) =>
    isActive(path)
      ? "text-pink-600 underline"
      : "hover:text-pink-600 transition-colors";

  const buttonClass =
    "bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition-colors shadow-sm";

  const openModal = (mode: "login" | "signup") => {
    setModalMode(mode);
    setModalOpen(true);
    setMenuOpen(false); // Close mobile menu if open
  };

  return (
    <>
      <header className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-pink-600">
            Artistic Vicky
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 items-center">
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
            <Link to="/#gallery" className={linkClass("/#gallery")}>
              Gallery
            </Link>
            <Link to="/#about" className={linkClass("/#about")}>
              About Us
            </Link>
            <Link to="/#contact" className={linkClass("/#contact")}>
              Contact Us
            </Link>
            <Link to="/courses" className={linkClass("/courses")}>
              Courses
            </Link>
            <button onClick={() => openModal("login")} className={buttonClass}>
              Login
            </button>
            <button onClick={() => openModal("signup")} className={`${buttonClass} hidden`}>
              Signup
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-pink-600"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4">
            <nav className="flex flex-col space-y-3 text-sm font-medium text-gray-700">
              <Link
                to="/"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/")}
              >
                Home
              </Link>
              <Link
                to="/#gallery"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/#gallery")}
              >
                Gallery
              </Link>
              <Link
                to="/#about"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/#about")}
              >
                About Us
              </Link>
              <Link
                to="/#contact"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/#contact")}
              >
                Contact Us
              </Link>
              <Link
                to="/courses"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/courses")}
              >
                Courses
              </Link>
              <button
                onClick={() => openModal("login")}
                className={`text-left ${buttonClass}`}
              >
                Login
              </button>
              <button
                onClick={() => openModal("signup")}
                className={`text-left ${buttonClass}`}
              >
                Signup
              </button>
            </nav>
          </div>
        )}
      </header>
      {modalOpen && (
        <AuthModal
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          onSwitchMode={(newMode) => setModalMode(newMode)}
        />
      )}
    </>
  );
}
