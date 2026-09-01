import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";


function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h1>Your Cart</h1>

        <p>Your cart is empty.</p>

        <Link to="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>

      <div className="cart-layout">

        {/* Cart Products */}
        <div className="cart-products flex-container">

          {cart.map((item) => (
            <div className="cart-item" key={item.id}>

              <img
                src={item.image}
                alt={item.name}
                className="img-cart"
              />

              <div className="cart-item-info">

                <h2>{item.name}</h2>

                <p className="cart-category"> Category - 
                  {item.category}
                </p>

                <p className="cart-price">Price - 
                  ₹{item.price}
                </p>

                <div className="cart-actions">
                  <div className="quantity-controls">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                    >
                      +
                    </button>

                  </div>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

              <div className="item-total"> Total Amount : 
                ₹{item.price * item.quantity}
              </div>

            </div>
          ))}

        </div>

        {/* Order Summary */}
        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal </span>
            <span>₹{cartTotal}</span>
          </div>

          <div className="summary-row">
            <span>Delivery </span>
            <span>FREE</span>
          </div>

          <div className="cart-summary">

            <div>
                <h2>
                Cart Total: ₹{cartTotal}
                </h2>

                <Link to="/checkout" className="checkout-button">
                    Proceed to Checkout
                </Link>
            </div>

            </div>
            <div className="cont-shopping-area">
                <Link to="/" className="continue-shopping">
                Continue Shopping
                </Link>
            </div> 
        </div>

      </div>
    </div>
  );
}

export default Cart;