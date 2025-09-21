import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import AuthModal from "../pages/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    "login" | "signup" | "forgotPassword"
  >("login");
  const { user, logout, isAdmin } = useAuth(); // Added isAdmin
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
      ? "text-purple-600 underline"
      : "hover:text-purple-600 transition-colors";

  const buttonClass =
    "bg-purple-600 text-white px-3 py-1.5 rounded-full hover:bg-purple-700 transition-colors shadow-sm text-sm";

  const adminButtonClass =
    "bg-orange-600 text-white px-3 py-1.5 rounded-full hover:bg-red-700 transition-colors shadow-sm text-sm flex items-center gap-1";

  const openModal = (mode: "login" | "signup") => {
    setModalMode(mode);
    setModalOpen(true);
    setMenuOpen(false);
  };

  const handleLoginSuccess = () => {
    setModalOpen(false);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 bg-clip-text text-transparent"
          >
            Artistic Vicky
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 items-center">
            <Link to="/courses" className={linkClass("/courses")}>
              Courses
            </Link>          
            <Link to="/#about" className={linkClass("/#about")}>
              About Us
            </Link>
            <Link to="/#contact" className={linkClass("/#contact")}>
              Contact Us
            </Link>
            
            {user ? (
              <>
                <div
                  onClick={() => navigate("/profile")}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 text-white flex items-center justify-center font-bold text-lg cursor-pointer"
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                {/* Admin Panel Link - Only visible to admins */}
                {isAdmin() && (
                  <Link to="/admin" className={adminButtonClass}>
                    <Settings className="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}
                <button onClick={logout} className={buttonClass}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openModal("login")}
                  className={buttonClass}
                >
                  Login
                </button>
                <button
                  onClick={() => openModal("signup")}
                  className={buttonClass}
                >
                  Signup
                </button>
              </>
            )}
          </nav>

          {/* Mobile Buttons and Menu Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            {user ? (
              <>
                <div
                  onClick={() => navigate("/profile")}
                  className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg"
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                {/* Admin Panel Link for Mobile - Only visible to admins */}
                {isAdmin() && (
                  <Link to="/admin" className={adminButtonClass}>
                    <Settings className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button onClick={logout} className={buttonClass}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openModal("login")}
                  className={buttonClass}
                >
                  Login
                </button>
                <button
                  onClick={() => openModal("signup")}
                  className={buttonClass}
                >
                  Signup
                </button>
              </>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-purple-600"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown (Navigation Links Only) */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 bg-purple-50">
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
              <Link
                to="/links"
                onClick={() => setMenuOpen(false)}
                className={linkClass("/links")}
              >
                Links
              </Link>
              {/* Admin Panel Link in Mobile Menu - Only visible to admins */}
              {user && isAdmin() && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
      {modalOpen && (
        <AuthModal
          mode={modalMode}
          onClose={() => setModalOpen(false)}
          onSwitchMode={(newMode) => setModalMode(newMode)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}
