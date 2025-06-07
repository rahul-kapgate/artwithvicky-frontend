import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AuthModal from "../pages/AuthModal";

interface User {
  userId: string;
  fullName: string;
  email: string;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  // Check for token and fetch user data on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Assuming the loginHandler in AuthModal sets the token
      // You might want to verify the token or fetch user data
      // For now, we'll use a simplified approach
      // In a real app, you might want to make an API call to verify the token
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

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
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // Update AuthModal to store user data after login
  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setModalOpen(false);
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
            {user ? (
              <>
                <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-lg">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className={buttonClass}>
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
                  className={`${buttonClass} hidden`}
                >
                  Signup
                </button>
              </>
            )}
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
              {user ? (
                <>
                  <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-lg">
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                  {/* <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className={`text-left ${buttonClass}`}
                  >
                    Logout
                  </button> */}
                </>
              ) : (
                <>
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
                </>
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
