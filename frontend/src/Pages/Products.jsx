import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useSearchParams } from "react-router-dom";


function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "All"
  );
  
  useEffect(() => {
    setSelectedCategory(categoryFromUrl || "All");
  }, [categoryFromUrl]);

  useEffect(() => {
    setLoading(true);
    setError("");
  
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
  
        return response.json();
      })
      .then((data) => {
        console.log("Products:", data);
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Unable to load products. Please try again.");
        setLoading(false);
      });
  }, []);

    const categories = [
        "All",
        ...new Set(products.map((product) => product.category)),
    ];

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      
    const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
    }); 

    const sortedProducts = [...filteredProducts].sort(
        (a, b) => {
        if (sortOption === "price-low") {
        return a.price - b.price;
        }
    
        if (sortOption === "price-high") {
        return b.price - a.price;
        }
    
        if (sortOption === "name-az") {
        return a.name.localeCompare(b.name);
        }
    
        if (sortOption === "name-za") {
        return b.name.localeCompare(a.name);
        }
    
        return 0;
    }
    );
    

      <div className="sort-filter">

            <label htmlFor="sort">
                Sort By:
            </label>
            <select
                id="sort"
                value={sortOption}
                onChange={(event) =>
                setSortOption(event.target.value)
                }
            >
                <option value="default">
                Default
                </option>

                <option value="price-low">
                Price: Low to High
                </option>

                <option value="price-high">
                Price: High to Low
                </option>

                <option value="name-az">
                Name: A to Z
                </option>

                <option value="name-za">
                Name: Z to A
                </option>
            </select>
        </div>

return (
    <div className="products-page">
  
      <h1>All Products</h1>
            {loading && (
        <p className="loading-message">
            Loading products...
        </p>
        )}
         {error && (
            <div className="error-message">
                <p>{error}</p>

                <button
                onClick={() => window.location.reload()}
                >
                Try Again
                </button>
            </div>
            )}
  
      {/* SEARCH */}
  
      <div className="products-controls">
  
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />
      </div>
  
            {/* NEW SORT CODE */}
        <div className="sort-filter">

            <label htmlFor="sort">
                Sort By:
            </label>

            <select
                id="sort"
                value={sortOption}
                onChange={(event) =>
                setSortOption(event.target.value)
                }
            >

                <option value="default">
                Default
                </option>

                <option value="price-low">
                Price: Low to High
                </option>

                <option value="price-high">
                Price: High to Low
                </option>

                <option value="name-az">
                Name: A to Z
                </option>

                <option value="name-za">
                Name: Z to A
                </option>

            </select>
        </div>
  
      {/* CATEGORY FILTER */}
  
      <div className="category-filter">
  
        <h3>Category</h3>
  
        <div className="category-buttons">
  
          {categories.map((category) => (
  
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "active-category"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>
  
          ))}
  
        </div>
  
      </div>
  
  
      {/* PRODUCTS */}
  
      <div className="product-grid">
  
        {sortedProducts.map((product) => (
  
          <div
            className="product-card"
            key={product.id}
          >
  
            <img
              src={product.image}
              alt={product.name}
            />
  
            <h3>
              {product.name}
            </h3>
  
            <p>
              ₹{product.price}
            </p>
  
            <p>
              {product.category}
            </p>
  
            <div className="product-buttons">
  
              <Link
                to={`/products/${product.id}`}
              >
                View Details
              </Link>
  
            <button
                onClick={() => addToCart(product)}
                >
                Add to Cart
            </button>  
            </div> 
          </div> 
        ))} 
      </div>  
  
      {/* NO RESULTS */}
  
      {filteredProducts.length === 0 && (
        <p className="no-products">
          No products found.
        </p>
      )}
  
    </div>
  );
}

export default Products;