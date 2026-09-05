import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext.jsx";

function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (!user || !user.isAdmin) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/orders",
          {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message);
          return;
        }

        setOrders(data);
      } catch (error) {
        console.error("Error fetching admin orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [user]);

  if (!user || !user.isAdmin) {
    return <h2>Access denied.</h2>;
  }

  if (loading) {
    return <p>Loading orders...</p>;
  }
  async function handleStatusChange(orderId, newStatus) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          }
        );
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message);
        return;
      }
  
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
  
      alert("Order status updated");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong");
    }
  }
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.customer?.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order._id
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
  
    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;
  
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-orders-page">
      <h1>Admin Orders</h1>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order._id} className="admin-order-card">
            <h3>Order ID: {order._id}</h3>

            <p>
              Customer: {order.customer?.name}
            </p>

            <p>
              Email: {order.customer?.email}
            </p>

            <p>
              Phone: {order.customer?.phone}
            </p>

            <p>
            Address: {order.customer?.address}, {order.customer?.city} - {order.customer?.pincode}
            </p>

            <div>
                <input
                    type="text"
                    placeholder="Search by customer, email, or order ID"
                    value={searchTerm}
                    onChange={(event) =>
                    setSearchTerm(event.target.value)
                    }
                />

                <select
                    value={statusFilter}
                    onChange={(event) =>
                    setStatusFilter(event.target.value)
                    }
                >
                    <option value="All">All Orders</option>
                    <option value="Placed">Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                </div>
                {
            /* <p>
            Status:
            <select
                value={order.status}
                onChange={(event) =>
                handleStatusChange(
                    order._id,
                    event.target.value
                )
                }
            >
                <option value="Placed">Placed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
            </select>
            </p> */}

            <p>
              Total: ₹{order.total}
            </p>

            <p>
              Date:{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <h4>Products</h4>

            {order.products?.map((product) => (
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

export default AdminOrders;