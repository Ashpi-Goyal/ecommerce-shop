import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Checkout() {
  const { cart, cartTotal, clearCart  } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  //const [orderPlaced, setOrderPlaced] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
  
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: formData,
          products: cart,
          total: cartTotal,
          userId: savedUser?.id || null,
        }),
      });
  
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
  
      navigate(`/order-success/${data.order.id}`);
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Something went wrong while placing the order.");
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

      <div className="checkout-layout">

        {/* Customer Form */}

        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >
        <h2>Delivery Information</h2>
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <label>Full Name</label>

                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />

                    <label>Phone</label>

                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label>Address</label>

                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        rows="4"
                        required
                    />

                    <label>City</label>

                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        required
                    />

                    <label>Pincode</label>
                </div>
            </div>
        </div>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            required
          />

          <button
            type="submit"
            className="place-order-button"
          >
            Place Order
          </button>
        </form>


        {/* Order Summary */}

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
  );
}

export default Checkout;