import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();


  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("Product ID from URL:", id);

  useEffect(() => {
    console.log("Fetching product:", id);

    fetch(`http://localhost:5000/api/products/${id}`)
      .then((response) => {
        console.log("Response status:", response.status);

        return response.json();
      })
      .then((data) => {
        console.log("Product data:", data);

        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h2>Loading product...</h2>;
  }

  if (!product) {
    return <h2>Product not found</h2>;
  }

  function handleAddToCart() {
    console.log("Adding product to cart:", product);
  
    addToCart(product);
  
    alert(`${product.name} added to cart!`);
  }

  return (
    <div className="product-details">
      <h1>About "{product.name}"</h1>
      <img
        src={product.image}
        alt={product.name}
      />

      <div>
        <h2>Model Name - {product.name}</h2>

        <h3>Price - ₹{product.price}</h3>

        <h3>Type - {product.category}</h3>

        <button onClick={handleAddToCart} className="addcart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;