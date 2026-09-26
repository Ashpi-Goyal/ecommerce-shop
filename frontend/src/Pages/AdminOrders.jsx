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
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong");
    }
  }

  if (!user || !user.isAdmin) {
    return <h2>Access denied.</h2>;
  }

  if (loading) {
    return <p>Loading orders...</p>;
  }

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      order.customer?.name?.toLowerCase().includes(search) ||
      order.customer?.email?.toLowerCase().includes(search) ||
      order._id?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-orders-page">

      <div className="admin-orders-header">
        <div>
          <h1>Orders</h1>
          <p>
            Manage customer orders and update delivery status.
          </p>
        </div>

        <div className="orders-count">
          {filteredOrders.length} Orders
        </div>
      </div>

      {/* SEARCH + FILTER - ONLY ONCE */}
      <div className="order-controls">
        <input
          type="text"
          placeholder="Search customer, email or order ID"
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

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          No orders found.
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="admin-order-card"
            >
              {/* ORDER TOP AREA */}
              <div className="order-card-header">
                <div>
                  <span className="order-label">
                    Order ID
                  </span>

                  <h3>{order._id}</h3>
                </div>

                <span
                  className={`order-status status-${(
                    order.status || "Placed"
                  ).toLowerCase()}`}
                >
                  {order.status || "Placed"}
                </span>
              </div>

              {/* CUSTOMER + ORDER INFORMATION */}
              <div className="order-info-grid">
                <div className="order-info-section">
                  <h4>Customer Details</h4>

                  <p>
                    <strong>Name:</strong>{" "}
                    {order.customer?.name}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {order.customer?.email}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.customer?.phone}
                  </p>
                </div>

                <div className="order-info-section">
                  <h4>Delivery Address</h4>

                  <p>
                    {order.customer?.address}
                  </p>

                  <p>
                    {order.customer?.city} -{" "}
                    {order.customer?.pincode}
                  </p>
                </div>

                <div className="order-info-section">
                  <h4>Order Summary</h4>

                  <p>
                    <strong>Total:</strong>{" "}
                    ₹{order.total}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      order.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="order-products">
                <h4>Products</h4>

                {order.products?.map(
                  (product, index) => (
                    <div
                      className="order-product-row"
                      key={
                        product.id ||
                        product._id ||
                        index
                      }
                    >
                      <span>
                        {product.name}
                      </span>

                      <span>
                        Qty: {product.quantity}
                      </span>

                      {product.price && (
                        <span>
                          ₹
                          {product.price *
                            product.quantity}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>

              {/* STATUS UPDATE */}
              <div className="order-actions">
                <label>
                  Update Status
                </label>

                <select
                  value={order.status || "Placed"}
                  onChange={(event) =>
                    handleStatusChange(
                      order._id,
                      event.target.value
                    )
                  }
                >
                  <option value="Placed">
                    Placed
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;