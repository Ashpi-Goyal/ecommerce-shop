import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import MessageModal from "../components/MessageModal.jsx";

function EditProduct() {
  const { user } = useAuth();
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/products/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          showMessage(
            "error",
            "Something went wrong",
            data.message
          );
          return;
        }

        setFormData({
          name: data.name,
          price: data.price,
          category: data.category,
          image: data.image,
        });
      } catch (error) {
        console.error("Fetch product error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

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
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(
          "error",
          "Update Failed",
          data.message
        );
      
        return;
      }
      
      showMessage(
        "success",
        "Product Updated",
        "This product was updated successfully."
      );

    } catch (error) {
      console.error("Update product error:", error);
    
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

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <div className="addproduct-page">
      <h1>Edit Product</h1>

      <form className="addproduct-form" 
        onSubmit={handleSubmit}>
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

        <button className="addproduct-btn" type="submit">
          Update Product
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

export default EditProduct;