import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";

function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) return;

    async function fetchOrders() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/orders/user/${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message);
          return;
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }

    fetchOrders();
  }, [user]);

  if (!user) {
    return <h2>Please login to view your orders.</h2>;
  }

  return (
    <div className="my-orders-page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order._id}</h3>

            <p>Status: {order.status}</p>

            <p>Total: ₹{order.total}</p>

            <p>
              Date:{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <h4>Products</h4>

            {order.products.map((product) => (
              <div key={product.id}>
                {product.name} × {product.quantity}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;