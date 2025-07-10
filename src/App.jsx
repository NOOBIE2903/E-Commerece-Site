import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./layout/Home";
import NotFound from "./components/universal-imports/NotFound";
import ProductDetail from "./components/Products/ProductDetail";
import Navbar from "./components/universal-imports/Navbar";
import HomeFooter from "./components/Home/HomeFooter";
import ScrollToTop from "./components/universal-imports/ScrollToTop";
import { useEffect, useState } from "react";
import api from "./api";
import Cart from "./components/NavbarComp/Cart";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckoutItems from "./components/Checkout/CheckoutItems";
import Register from "./components/Account/Register";
import Login from "./components/Account/Login";
import Spinner from "./components/universal-imports/Spinner";

const App = () => {
  const [numCartItems, setNumCartItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  //   const cart_code = localStorage.getItem("cart_code");

  //   const refreshCartCount = () => {
  //     const cart_code = localStorage.getItem("cart_code");

  //     if (cart_code) {
  //       api
  //         .get(`/api/get_cart_state/?cart_code=${cart_code}`)
  //         .then((res) => {
  //           console.log("From App: ", res.data);
  //           setNumCartItems(res.data.items.length);
  //         })
  //         .catch((err) => {
  //           // Check if it's a 404 - cart not found
  //           if (err.response && err.response.status === 404) {
  //             console.log("Cart not found. Creating a new cart...");

  //             api
  //               .get("/api/get_or_create_user_cart/")
  //               .then((res) => {
  //                 localStorage.setItem("cart_code", res.data.cart_code);
  //                 refreshCartCount(); // Retry with new cart
  //               })
  //               .catch((err) => console.log("Cart creation error:", err.message));
  //           } else {
  //             console.log("Other error: ", err.message);
  //           }
  //         });
  //     }
  //   };

  //   useEffect(() => {
  //     refreshCartCount();
  //   }, [cart_code]);

  //   useEffect(() => {
  //   const existingCart = localStorage.getItem("cart_code");
  //   if (!existingCart) {
  //     api
  //       .get("/api/get_or_create_user_cart/") // ✅ Leading slash added here
  //       .then((res) => {
  //         localStorage.setItem("cart_code", res.data.cart_code);
  //         refreshCartCount();
  //       })
  //       .catch((err) => console.log("Cart creation error:", err.message));
  //   }
  // }, []);

  const initializeCart = async () => {
    try {
      const existingCartCode = localStorage.getItem("cart_code");

      // Try to get existing cart state
      if (existingCartCode) {
        try {
          const response = await api.get(
            `/api/get_cart_state/?cart_code=${existingCartCode}`
          );
          setNumCartItems(response.data.items.length);
          setIsLoading(false);
          return;
        } catch (error) {
          if (error.response?.status === 404) {
            console.log("Existing cart not found, creating new one");
          }
        }
      }

      // Create new cart
      const response = await api.get("/api/get_or_create_user_cart/", {
        params: { cart_code: existingCartCode },
      });

      const newCartCode = response.data.cart_code || generateRandomCartCode();
      localStorage.setItem("cart_code", newCartCode);

      // Get the new cart's state
      const cartState = await api.get(
        `/api/get_cart_state/?cart_code=${newCartCode}`
      );
      setNumCartItems(cartState.data.items.length);
    } catch (error) {
      console.error("Cart initialization failed:", error);
      // Fallback - generate client-side cart code
      const fallbackCode = generateRandomCartCode();
      localStorage.setItem("cart_code", fallbackCode);
      setNumCartItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCartCount = async () => {
    const cart_code = localStorage.getItem("cart_code");
    if (!cart_code) return;

    try {
      const response = await api.get(
        `/api/get_cart_state/?cart_code=${cart_code}`
      );
      setNumCartItems(response.data.items.length);
    } catch (error) {
      console.error("Error refreshing cart:", error);
      if (error.response?.status === 404) {
        // Cart not found - initialize a new one
        await initializeCart();
      }
    }
  };

  useEffect(() => {
    initializeCart();
  }, []);

  if (isLoading) {
    return <div><Spinner/></div>; // Replace with your loading component
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar numCartItems={numCartItems} />
        <ToastContainer />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/products/:slug"
              element={<ProductDetail refreshCartCount={refreshCartCount} />}
            />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/cart/"
              element={<Cart refreshCartCount={refreshCartCount} />}
            />
            <Route path="/checkout/" element={<CheckoutItems />} />
            <Route path="/signup/" element={<Register />} />
            <Route path="/login/" element={<Login />} />
          </Routes>
        </main>

        <HomeFooter />
      </div>
    </BrowserRouter>
  );
};

export default App;
