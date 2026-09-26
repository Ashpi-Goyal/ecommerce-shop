import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import MessageModal from "../components/MessageModal.jsx";

function AdminProducts() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);

  const [productToDelete, setProductToDelete] =
    useState(null);

  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    mode: "message",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  function handleDelete(id) {
    setProductToDelete(id);

    setMessageModal({
      show: true,
      type: "warning",
      title: "Delete Product",
      message:
        "Are you sure you want to delete this product? This action cannot be undone.",
      mode: "confirm",
    });
  }

  async function confirmDeleteProduct() {
    if (!productToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessageModal({
          show: true,
          type: "error",
          title: "Delete Failed",
          message:
            data.message || "Unable to delete product.",
          mode: "message",
        });

        return;
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            String(product.id) !==
            String(productToDelete)
        )
      );

      setProductToDelete(null);

      setMessageModal({
        show: true,
        type: "success",
        title: "Product Deleted",
        message:
          "The product was deleted successfully.",
        mode: "message",
      });
    } catch (error) {
      console.error("Delete product error:", error);

      setMessageModal({
        show: true,
        type: "error",
        title: "Delete Failed",
        message:
          "Something went wrong while deleting the product.",
        mode: "message",
      });
    }
  }

  if (!user || !user.isAdmin) {
    return <h2>Access denied.</h2>;
  }

  return (
    <div className="adminproduct-page">
      <h1>Admin Products</h1>

      <Link
        className="addproduct-btn"
        to="/admin/products/add"
      >
        Add New Product
      </Link>

      <div className="product-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product.id}
          >
            <img
              src={product.image}
              alt={product.name}
            />

            <h3>{product.name}</h3>

            <p>₹{product.price}</p>

            <p>{product.category}</p>

            <Link
              className="editproduct-link"
              to={`/admin/products/edit/${product.id}`}
            >
              Edit
            </Link>

            <button
              onClick={() =>
                handleDelete(product.id)
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <MessageModal
        show={messageModal.show}
        type={messageModal.type}
        title={messageModal.title}
        message={messageModal.message}

        showCancel={
          messageModal.mode === "confirm"
        }

        confirmText={
          messageModal.mode === "confirm"
            ? "Yes, Delete"
            : "OK"
        }

        cancelText="Cancel"

        onConfirm={
          messageModal.mode === "confirm"
            ? confirmDeleteProduct
            : null
        }

        onClose={() => {
          setMessageModal({
            show: false,
            type: "info",
            title: "",
            message: "",
            mode: "message",
          });

          setProductToDelete(null);
        }}
      />
    </div>
  );
}

export default AdminProducts;