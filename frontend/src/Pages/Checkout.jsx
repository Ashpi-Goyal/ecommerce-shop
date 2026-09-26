import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    let newValue = value;

    // Allow only numbers in phone and pincode
    if (name === "phone" || name === "pincode") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: newValue,
    }));

    // Remove error while user corrects the field
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  }

  function validateForm() {
    const newErrors = {};

    // NAME
    const name = formData.name.trim();

    if (!name) {
      newErrors.name = "Full name is required.";
    } else if (name.length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name should contain only letters and spaces.";
    }

    // EMAIL
    const email = formData.email.trim();

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // PHONE - India 10 digits
    if (!formData.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone =
        "Enter a valid 10-digit mobile number.";
    }

    // ADDRESS
    const address = formData.address.trim();

    if (!address) {
      newErrors.address = "Address is required.";
    } else if (address.length < 10) {
      newErrors.address =
        "Please enter a more complete address.";
    }

    // CITY
    const city = formData.city.trim();

    if (!city) {
      newErrors.city = "City is required.";
    } else if (!/^[A-Za-z\s]+$/.test(city)) {
      newErrors.city =
        "City should contain only letters and spaces.";
    }

    // PINCODE - India 6 digits
    if (!formData.pincode) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      const savedUser = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: {
              name: formData.name.trim(),
              email: formData.email.trim(),
              phone: formData.phone,
              address: formData.address.trim(),
              city: formData.city.trim(),
              pincode: formData.pincode,
            },
            products: cart,
            total: cartTotal,
            userId: savedUser?.id || null,
          }),
        }
      );

      const data = await response.json();

      console.log("ORDER RESPONSE:", data);

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem(
        "lastOrder",
        JSON.stringify(data.order)
      );

      clearCart();

      navigate(
        `/order-success/${data.order.id}`
      );
    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      alert(
        "Something went wrong while placing the order."
      );
    }
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page empty-cart">
        <h1>Your Cart is Empty</h1>

        <p>Add some products before checkout.</p>

        <Link to="/">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page checkout-page-layout">
      <h1>Checkout</h1>
      <h2>Delivery Information</h2>

      <div className="checkout-layout">
        <div className="container">

          <div className="column">

            <form
              className="checkout-form"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* FULL NAME */}

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={
                  errors.name ? "input-error" : ""
                }
              />

              {errors.name && (
                <span className="error-message">
                  {errors.name}
                </span>
              )}

              {/* EMAIL */}

              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className={
                  errors.email ? "input-error" : ""
                }
              />

              {errors.email && (
                <span className="error-message">
                  {errors.email}
                </span>
              )}

              {/* PHONE */}

              <label>Phone</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                inputMode="numeric"
                className={
                  errors.phone ? "input-error" : ""
                }
              />

              {errors.phone && (
                <span className="error-message">
                  {errors.phone}
                </span>
              )}

              {/* ADDRESS */}

              <label>Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House no, street, area"
                rows="4"
                className={
                  errors.address ? "input-error" : ""
                }
              />

              {errors.address && (
                <span className="error-message">
                  {errors.address}
                </span>
              )}

              {/* CITY */}

              <label>City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                className={
                  errors.city ? "input-error" : ""
                }
              />

              {errors.city && (
                <span className="error-message">
                  {errors.city}
                </span>
              )}

              {/* PINCODE */}

              <label>Pincode</label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter 6-digit pincode"
                maxLength="6"
                inputMode="numeric"
                className={
                  errors.pincode ? "input-error" : ""
                }
              />

              {errors.pincode && (
                <span className="error-message">
                  {errors.pincode}
                </span>
              )}

              <button
                type="submit"
                className="place-order-button"
              >
                Place Order
              </button>
            </form>
          </div>

          <div className="column">

            <div className="checkout-summary">
              <h2>Order Summary</h2>

              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >
                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}

              <hr />

              <div className="checkout-total">
                <span>Total</span>

                <strong>
                  ₹{cartTotal}
                </strong>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;