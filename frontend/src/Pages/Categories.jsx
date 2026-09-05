import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Categories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/products"
        );

        const products = await response.json();

        const categoryMap = {};

        products.forEach((product) => {
          const category = product.category;

          if (categoryMap[category]) {
            categoryMap[category] += 1;
          } else {
            categoryMap[category] = 1;
          }
        });

        const categoryList = Object.entries(categoryMap).map(
          ([name, count]) => ({
            name,
            count,
          })
        );

        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="categories-page">
      <h1>Shop by Category</h1>

      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="categories-grid container">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(
                category.name
              )}`}
              className="category-card"
            >
            <div className="row">
                <div className="col-md-6">
                    <h2>{category.name}</h2>

                    <p>
                    {category.count}{" "}
                    {category.count === 1
                        ? "Product"
                        : "Products"}
                    </p>
                </div>
            </div>
              
              <span>View Products →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;