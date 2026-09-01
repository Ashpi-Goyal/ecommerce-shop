import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {
    const { cartCount } = useCart();
    return (
      <nav className="navbar nav_color">
        <div className="logo">Maanya Traders</div>
  
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/categories">Categories</a>
          <span>
                <Link to="/cart" className="cartlayout">
                  🛒 Cart ({cartCount})
                </Link>
            </span>
          <span>👤</span>
        </div>
      </nav>
    );
  }
  
export default Navbar;