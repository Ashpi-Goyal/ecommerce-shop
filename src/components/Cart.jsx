import { useCart } from "../context/CartContext.jsx";

function Cart() {
  const { cart } = useCart();

  console.log("CART DATA:", cart);

  return (
    <div className="bg-cart-area">
      <h2>My Cart 🛒</h2>

      <p>Cart items: {cart.length}</p>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="cart-outline">
            <h3>{item.name}</h3>

            <p>₹{item.price}</p>

            <p>Quantity: {item.quantity}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;