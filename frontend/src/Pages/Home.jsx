//import Navbar from "../components/Navbar";
import CategorySection from "../components/CategorySection";
import FeaturedProducts from "../components/FeaturedProducts";
import Cart from "../components/Cart";

function Home() {
  return (
    <div>
      <section className="hero bg_color">
          <div className="hero-content">
  
            <h1>
              Discover Products
              <br />
              You'll Love
            </h1>
  
            <p>
              Find amazing products at great prices.
            </p>
  
            <a href="/products">Shop Now</a>
          </div>
  
          <div className="hero-image">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPC1fwuX3YXwZ4_VnEymJKK6JtcM5E93yejniAThOLQ&s=10"
              alt="Shopping"
            />
          </div>
        </section>

      <CategorySection />

      <FeaturedProducts/>

      <Cart />
      
    </div>
  );
}

export default Home;