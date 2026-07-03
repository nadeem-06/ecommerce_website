import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-primary sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
          <span className="text-2xl">🛍️</span> ShopHub
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {user ? (
            <>
              <Link
                to="/cart"
                className={`transition font-medium flex items-center gap-1 ${isActive("/cart") ? "text-white" : "text-purple-100 hover:text-white"}`}
              >
                <span>🛒</span> Cart
              </Link>
              <Link
                to="/orders"
                className={`transition font-medium flex items-center gap-1 ${isActive("/orders") ? "text-white" : "text-purple-100 hover:text-white"}`}
              >
                <span>📦</span> Orders
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className={`transition font-medium flex items-center gap-1 ${isActive("/admin") ? "text-white" : "text-purple-100 hover:text-white"}`}
                >
                  <span>⚙️</span> Admin
                </Link>
              )}
              <span className="text-white bg-white/20 backdrop-blur rounded-full px-3 py-1.5 text-xs font-medium">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500/80 hover:bg-red-600 px-3 py-1.5 rounded-lg text-sm transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-purple-100 hover:text-white transition font-medium">Login</Link>
              <Link
                to="/register"
                className="bg-white text-primary px-4 py-2 rounded-lg text-sm hover:bg-purple-50 transition font-semibold shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-gradient-primary px-6 py-4 flex flex-col gap-3 text-sm">
          {user ? (
            <>
              <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-white font-medium hover:text-purple-100">🛒 Cart</Link>
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-white font-medium hover:text-purple-100">📦 Orders</Link>
              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-white font-medium hover:text-purple-100">⚙️ Admin</Link>
              )}
              <p className="text-purple-100 text-xs font-medium">{user.name}</p>
              <button onClick={handleLogout} className="text-white text-left font-medium hover:text-red-200">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="text-white font-medium hover:text-purple-100">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="text-white font-medium hover:text-purple-100">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;