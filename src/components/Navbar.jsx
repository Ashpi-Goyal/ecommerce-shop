import { Link } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {

  const [pincode, setPincode] = useState(
    localStorage.getItem("pincode") || ""
  );
  
  function handlePincode() {
    const value = prompt("Enter your pincode");
  
    if (value) {
      setPincode(value);
      localStorage.setItem("pincode", value);
    }
  }

    const { cartCount } = useCart();
    return (
      <nav className="navbar nav_color">
        <div className="logo">Maanya Traders</div>
  
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/products">Products</a>
          <a href="/categories">Categories</a>
          <button
          type="button"
          className="pincode-button"
          onClick={handlePincode}
        >
          📍 {pincode ? pincode : "Enter Pincode"}
        </button>
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