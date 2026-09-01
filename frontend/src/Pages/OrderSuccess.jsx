import { Link, useParams } from "react-router-dom";

function OrderSuccess() {
  const { orderId } = useParams();

  const savedOrder = localStorage.getItem("lastOrder");

  const order = savedOrder
    ? JSON.parse(savedOrder)
    : null;

  if (!order) {
    return (
      <div className="order-success">
        <h1>Order Not Found</h1>

        <Link to="/">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="order-success">
      <div className="success-icon">     ✓ </div>
      <h1>🎉 Order Placed Successfully!</h1>

      <p> Thank you, {order.customer.name}!</p>

      <p>Your order has been successfully placed.</p>
    <div className="order-details">
    <h2>Order Details</h2>
    <p><strong>Order ID:</strong>{" "}
          {orderId}
    </p>
    <p><strong>Date:</strong>{" "}{order.date}</p>
    <p><strong>Total:</strong>{" "}₹{order.total}</p>
    </div>
    <div className="ordered-products">
    <h2>Products</h2>
        {order.products.map((item) => (
          <div
            className="ordered-product"
            key={item.id}
          >
            <span>
              {item.name} × {item.quantity}
            </span>

            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}
      </div>

      <Link
        to="/"
        className="continue-shopping"
      >
        Continue Shopping
      </Link>

    </div>
  );
}

export default OrderSuccess;