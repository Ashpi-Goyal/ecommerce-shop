import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { useLanguage } from "../LanguageContext.jsx";
import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";

function Navbar() {
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");

  const countries = [
    {
      name: "India",
      code: "IN",
      flag: "https://flagcdn.com/w40/in.png",
    },
    {
      name: "USA",
      code: "US",
      flag: "https://flagcdn.com/w40/us.png",
    },
    {
      name: "UK",
      code: "GB",
      flag: "https://flagcdn.com/w40/gb.png",
    },
    {
      name: "Canada",
      code: "CA",
      flag: "https://flagcdn.com/w40/ca.png",
    },
    {
      name: "Australia",
      code: "AU",
      flag: "https://flagcdn.com/w40/au.png",
    },
  ]; 

  const [country, setCountry] = useState(
    localStorage.getItem("country") || "India"
  );

  const selectedCountry =
  countries.find((item) => item.name === country) ||
  countries[0];

  const [location, setLocation] = useState(() => {
  const savedLocation = localStorage.getItem("location");

  
    return savedLocation
      ? JSON.parse(savedLocation)
      : {
          city: "",
          pincode: "",
        };
  });
  
  function saveLocation() {
    if (!cityInput.trim()) {
      alert("Please enter your city.");
      return;
    }
  
    if (!/^\d{6}$/.test(pincodeInput)) {
      alert("Pincode must be exactly 6 digits.");
      return;
    }
  
    const newLocation = {
      city: cityInput.trim(),
      pincode: pincodeInput,
    };
  
    setLocation(newLocation);
  
    localStorage.setItem(
      "location",
      JSON.stringify(newLocation)
    );
  
    setShowLocationForm(false);
  }
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { language, setLanguage } = useLanguage();
  

  return (
    <nav className="navbar nav_color">
      <div className="logo">Maanya Traders</div>

      <div className="location-dropdown">
          <button
            type="button"
            className="location-button"
            onClick={() => setShowLocationForm(!showLocationForm)}
          >
            <FaMapMarkerAlt /> &nbsp;
            {location.city && location.pincode
              ? `Delivering to ${location.city} ${location.pincode}`
              : "Select Location"}
              <br/>
              <p className="update-location">Update Location</p>
              
          </button>

          {showLocationForm && (
              <div className="location-form">
                <button
                  type="button"
                  className="location-close-button"
                  onClick={() => setShowLocationForm(false)}
                >
                  <FaTimes />
                </button>

                <input
                  type="text"
                  placeholder="Enter city"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  value={pincodeInput}
                  onChange={(e) =>
                    setPincodeInput(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  maxLength="6"
                  inputMode="numeric"
                />

                <button className="locationsavebtn"
                  type="button"
                  onClick={saveLocation}
                >
                  Save
                </button>
              </div>
            )}
        </div>
      {/* <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select> */}
        <div className="country-dropdown">
  <button
    type="button"
    className="country-button"
    onClick={() =>
      setShowCountryDropdown(!showCountryDropdown)
    }
  >
    <img
      src={selectedCountry.flag}
      alt={selectedCountry.name}
    />

    {selectedCountry.name}
  </button>

  {showCountryDropdown && (
    <div className="country-menu">
      {countries.map((item) => (
        <button
          type="button"
          key={item.code}
          onClick={() => {
            setCountry(item.name);

            localStorage.setItem(
              "country",
              item.name
            );

            setShowCountryDropdown(false);
          }}
        >
          <img
            src={item.flag}
            alt={item.name}
          />

          <span>{item.name}</span>
        </button>
      ))}
    </div>
  )}
</div>
      <div className="nav-links">

        <Link to="/">Home</Link>

        <Link to="/products">Products</Link>

        <Link to="/categories">Categories</Link> 

        {user?.isAdmin ? (
  <div className="admin-dropdown">
    <button className="admin-dropdown-button">
      <FaUser /> Welcome, {user.name}
    </button>

    <div className="admin-dropdown-menu">
      <Link to="/adminpage">Admin</Link>
      <Link to="/admin/products">Admin Products</Link>
      <Link to="/admin/orders">Admin Orders</Link>

      <Link to="/cart">
        <FaShoppingCart /> Cart ({cartCount})
      </Link>

      <Link to="/my-orders">
        My Orders
      </Link>

      <button className="logout-button"
        type="button"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  </div>
) : user ? (
  <div className="user-dropdown">
    <button className="user-dropdown-button">
      <FaUser /> Hi, {user.name}
    </button>

    <div className="user-dropdown-menu">
      <div className="user-profile-info">
        <strong>{user.name}</strong>
        <span>{user.email}</span>
      </div>

      <Link to="/cart">
        <FaShoppingCart /> Cart ({cartCount})
      </Link>

      <Link to="/my-orders">
        My Orders
      </Link>

      <button
        type="button"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  </div>
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