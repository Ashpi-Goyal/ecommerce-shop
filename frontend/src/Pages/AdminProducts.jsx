import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";

function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        alert(data.message || "Delete failed");
        return;
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => String(product.id) !== String(id)
        )
      );

      alert("Product deleted successfully");
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Something went wrong");
    }
  }

  if (!user || !user.isAdmin) {
    return <h2>Access denied.</h2>;
  }

  return (
    <div>
      <h1>Admin Products</h1>

      <Link to="/admin/products/add">
        Add Product
      </Link>

      {products.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>

          <p>₹{product.price}</p>

          <p>{product.category}</p>

          <Link to={`/admin/products/edit/${product.id}`}>
            Edit
          </Link>

          <button onClick={() => handleDelete(product.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminProducts;