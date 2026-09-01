import { useCart } from "../context/CartContext.jsx";

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  return (
    <section className="cart-section">
      <h2>My Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={item.image}
                alt={item.name}
                width="100"
              />

              <h3>{item.name}</h3>

              <p>Price: ₹{item.price}</p>

              <div>
                <button
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </button>

                <span> {item.quantity} </span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </button>
              </div>

              <p>
                Item Total: ₹
                {item.price * item.quantity}
              </p>

              <button
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          ))}

          <h2>Cart Total: ₹{cartTotal}</h2>
        </>
      )}
    </section>
  );
}

export default Cart;