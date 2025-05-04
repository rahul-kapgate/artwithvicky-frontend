import { Link, NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-pink-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo or Brand Name */}
        <Link to="/" className="text-2xl font-bold text-pink-600">
          Artistic Vicky
        </Link>

        {/* Navigation Links */}
        <nav className="space-x-6 text-sm font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-pink-600 underline" : "hover:text-pink-500"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="#"
            className={({ isActive }) =>
              isActive ? "text-pink-600 underline" : "hover:text-pink-500"
            }
          >
            Gallery
          </NavLink>
          <NavLink
            to="#"
            className={({ isActive }) =>
              isActive ? "text-pink-600 underline" : "hover:text-pink-500"
            }
          >
            About
          </NavLink>
          <NavLink
            to="#"
            className={({ isActive }) =>
              isActive ? "text-pink-600 underline" : "hover:text-pink-500"
            }
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
