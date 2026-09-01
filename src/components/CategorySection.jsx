function CategorySection() {
    const categories = [
      {
        name: "Mobile",
        icon: "📱",
      },
      {
        name: "Laptop",
        icon: "💻",
      },
      {
        name: "Fashion",
        icon: "👟",
      },
      {
        name: "Audio",
        icon: "🎧",
      },
    ];
  
    return (
      <section className="categories">
        <h2>Shop By Category</h2>
  
        <div className="category-list">
          {categories.map((category) => (
            <div
              className="category-card"
              key={category.name}
            >
              <div className="category-icon">
                {category.icon}
              </div>
  
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default CategorySection;