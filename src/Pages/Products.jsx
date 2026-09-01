import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Products:", data);
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
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