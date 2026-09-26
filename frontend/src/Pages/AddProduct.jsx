import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import MessageModal from "../components/MessageModal.jsx";

function AddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  const [messageModal, setMessageModal] = useState({
    show: false,
    type: "info",
    title: "",
    message: "",
    redirectTo: null,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function showMessage(
    type,
    title,
    message,
    redirectTo = null
  ) {
    setMessageModal({
      show: true,
      type,
      title,
      message,
      redirectTo,
    });
  }function showMessage(
    type,
    title,
    message,
    redirectTo = null
  ) {
    setMessageModal({
      show: true,
      type,
      title,
      message,
      redirectTo,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
            ...formData,
          }),
      });

      const data = await response.json();
      console.log("ADD PRODUCT RESPONSE:", data);
      if (!response.ok) {
        showMessage(
          "error",
          "Something went wrong",
          data.message
        );
        return;
      }

      showMessage(
        "success",
        "Product Added",
        "This product Added updated successfully.",
        "/admin/products"
      );

    } catch (error) {
      console.error("Add product error:", error);
      showMessage(
        "error",
        "Update Failed",
        "Something went wrong while updating the product."
      );
    }
  }

  if (!user || !user.isAdmin) {
    return <h2>Access denied.</h2>;
  }

  return (
    <div className="addproduct-page">
      <h1>Add Product</h1>

      <form className="addproduct-form" onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Price</label>
        <input className="btm-padding"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <label>Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
        />

        <button  className="addproduct-btn" type="submit">
          Add Product
        </button>
      </form>

      <MessageModal
          show={messageModal.show}
          type={messageModal.type}
          title={messageModal.title}
          message={messageModal.message}
          onClose={() => {
            const redirectTo = messageModal.redirectTo;
          
            setMessageModal({
              ...messageModal,
              show: false,
            });
          
            if (redirectTo) {
              navigate(redirectTo);
            }
          }}
        />
    </div>
  );
}

export default AddProduct;