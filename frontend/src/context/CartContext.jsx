import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "../AuthContext.jsx";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();

  // Separate cart for every user
  const cartKey = user
    ? `cart_${user.id}`
    : "cart_guest";

  const [cart, setCart] = useState([]);

  // Load the correct cart whenever user changes
  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Cart parse error:", error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [cartKey]);

  // Update React state + localStorage together
  function updateCart(updateFunction) {
    setCart((currentCart) => {
      const newCart =
        typeof updateFunction === "function"
          ? updateFunction(currentCart)
          : updateFunction;

      localStorage.setItem(
        cartKey,
        JSON.stringify(newCart)
      );

      return newCart;
    });
  }

  function addToCart(product) {
    updateCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function increaseQuantity(id) {
    updateCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id) {
    updateCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    updateCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== id
      )
    );
  }

  function clearCart() {
    updateCart([]);
  }

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  function placeOrder(customerDetails) {
    const order = {
      id: "ORD-" + Date.now(),
      customer: customerDetails,
      products: cart,
      total: cartTotal,
      date: new Date().toLocaleString(),
    };

    localStorage.setItem(
      "lastOrder",
      JSON.stringify(order)
    );

    clearCart();

    return order;
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        cartTotal,
        cartCount,
        clearCart,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}