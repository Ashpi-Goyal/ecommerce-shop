import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <nav className="navbar nav_color">
      <div className="logo">Maanya Traders</div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/categories">Categories</Link>

        <Link to="/cart" className="cartlayout">
          🛒 Cart ({cartCount})
          
        </Link>
            {user?.isAdmin && (
        <Link to="/admin/products">Admin</Link>
              )}

        {user?.isAdmin && (
          <>
            <Link to="/admin/products">Admin Products</Link>
            <Link to="/admin/orders">Admin Orders</Link>
          </>
        )}

        <Link to="/my-orders">My Orders</Link>

        {user ? (
          <>
            <span>👤 Welcome, {user.name}</span>

            <button onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;