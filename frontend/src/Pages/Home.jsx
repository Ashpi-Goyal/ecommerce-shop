import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../AuthContext.jsx";
import AuthRequiredModal from "../components/AuthRequiredModal.jsx";
import FeaturedProducts from "../components/FeaturedProducts.jsx";

function Home() {

  const { user } = useAuth();
  const { addToCart } = useCart();

  const [showAuthModal, setShowAuthModal] = useState(false);

  function handleAddToCart(product) {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
  
    addToCart(product);
  }

  return (
    <div>
      <section className="hero bg_color">
        {/* <div className="container">
          <div className="column">
            <div className="banner-img-sec">
            
            </div>
          </div>
        </div> */}
          <div className="hero-content">
  
            <h1>
              Discover Products
              <br />
              You'll Love
            </h1>
  
            <p>
              Find amazing products at great prices.
            </p>
          </div>
  
          <div className="hero-image">
            <img src="/images/Banners Image/banner-img.jfif" alt="home page" 
            />
          </div>
        </section>

      <FeaturedProducts
        handleAddToCart={handleAddToCart}
      />
      {showAuthModal && (
        <AuthRequiredModal
          onClose={() => setShowAuthModal(false)}
        />
      )}
      
    </div>
  );
}

export default Home;