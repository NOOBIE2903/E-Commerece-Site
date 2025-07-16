import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCookie } from "../../authUtils";
// import 'bootstrap/dist/css/bootstrap.min.css';


const ProductDetail = ({refreshCartCount}) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Changed from [] to null since we expect a single product object
  const [product, setProduct] = useState(null); // CHANGED
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timedOut, setTimedOut] = useState(false);
  const [inCart, setInCart] = useState(false)

  const cart_code = localStorage.getItem("cart_code");

  // Original useEffect (commented out)
  // useEffect(function() {
  //   if (product) {
  //     api.get(`api/product_in_cart/?cart_code=${cart_code}&product_id=${product.id}`)
  //     .then(res => {
  //       // console.log(res.data)
  //       setInCart(res.data.product_in_cart)
  //     })

  //     .catch(err => {
  //       console.log(err.message)
  //     })
  //   }
  // }, [cart_code, product])

  // New improved useEffect
  useEffect(() => {
  if (product && cart_code) {
    api.get(`/api/product_in_cart/?cart_code=${cart_code}&product_id=${product.id}`, {
      withCredentials: true,
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        ...(localStorage.getItem("access") && {
          "Authorization": `Bearer ${localStorage.getItem("access")}`
        })
      }
    })
    .then(res => setInCart(res.data.in_cart))
    .catch(err => console.log("Cart check error:", err.message));
  }
}, [cart_code, product]);

  // Original add_item function (commented out)
  // const add_item = () => {
  //   if (!product) return;

  //   const newItem = { cart_code: cart_code, product_id: product.id};
  //   const csrftoken = getCookie("csrftoken"); 
  //   const token = localStorage.getItem("access")
    
  //   api
  //     .post("${BASE_URL}/api/add_item/", newItem, {
  //       headers: {
  //         // Authorization: `Bearer ${token}`,
  //         "X-CSRFToken": getCookie("csrftoken"),
  //       },
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       setInCart(true)
  //       // console.log(res.data);
  //       refreshCartCount(); 
  //       toast.success("Product Added in Cart!");
  //     })

  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // }

  // New improved add_item function
  const add_item = async () => {
    if (!product || !cart_code) return;

    try {
      const response = await api.post("/api/add_item/", {
        cart_code: cart_code,
        product_id: product.id
      }, {
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
          ...(localStorage.getItem("access") && {
            "Authorization": `Bearer ${localStorage.getItem("access")}`
          })
        },
        withCredentials: true
      });

      setInCart(true);
      refreshCartCount();
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add product to cart");
      
      // If unauthorized, prompt login
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: `/products/${slug}` } });
      }
    }
  };

  // Original fetchProducts function (commented out)
  // const fetchProducts = (slug) => {
  //   setLoading(true);
  //   setError("");
  //   setTimedOut(false);

  //   api
  //     .get(`api/products/${slug}`)
  //     .then((res) => {
  //       setLoading(false);
  //       setProduct(res.data);
  //     })
  //     .catch((err) => {
  //       setLoading(false);
  //       setError(err.message || "Failed to fetch Products");
  //     });
  // };

  // New fetchProducts implementation
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      setTimedOut(false);

      try {
        const response = await api.get(`/api/products/${slug}`, {
          withCredentials: true
        });
        setProduct(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProducts();
  }, [slug]);

  // Original useEffect for loading timeout (commented out)
  // useEffect(() => {
  //   if (loading) {
  //     const timer = setTimeout(() => {
  //       setTimedOut(true);
  //     }, 6000); // 6 seconds

  //     return () => clearTimeout(timer);
  //   }
  // }, [loading]);

  // New useEffect for loading timeout
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setTimedOut(true), 6000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading && !timedOut) {
    return (
      <div className="w-full flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (loading && timedOut) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <p className="text-lg text-orange-600 font-semibold mb-4">
          Loading is taking too long.
        </p>
        <button
          onClick={() => fetchProducts(slug)}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <p className="text-lg text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={() => fetchProducts(slug)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // Added product existence check before rendering
  if (!product) return null; // NEW

  return (
    <div className="w-full">
      <div className="py-[60px] px-[150px] flex gap-10">
        {/* Changed width from 380vw to 380px */}
        <div className="w-[3800px] h-[50vh] rounded-4xl overflow-hidden">
          {" "}
          {/* CHANGED */}
          <img
            src={`${BASE_URL}${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover" // Added object-cover
            onError={(e) => {
              e.target.onerror = null; // Fixed typo (onError → onerror)
              e.target.src = "/path/to/fallback/image.jpg"; // Added fallback
            }}
          />
        </div>

        <div className="DESC">
          <h1 className="text-6xl font-bold tracking-tight">{product.name}</h1>
          <h1 className="text-2xl text-black py-[2vh]">${product.price}</h1>

          <p className="font-light">{product.description}</p>

          <button
            onClick={add_item}
            disabled={inCart}
            type="button"
            className={`w-auto h-[5.5vh] px-4 py-2 border rounded-xl mt-[3vh] transition ${
              inCart 
                ? "bg-green-500 text-white border-green-500 cursor-not-allowed"
                : "border-black hover:scale-105 hover:shadow-lg"
            }`}
          >
            {inCart ? "Product Added" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Changed p-13 to p-12 */}
      <div className="bg-gray-100 p-12">
        {" "}
        {/* CHANGED */}
        <h1 className="text-4xl font-bold text-center">Related Products</h1>
        {product.similar_products && product.similar_products.length > 0 ? (
          <div className="mt-[3vw] flex flex-wrap justify-center gap-6 max-w-7xl mx-auto pb-[60px]">
            {product.similar_products.map((similarProd) => (
              <div
                key={similarProd.id}
                className="rounded-lg shadow-md hover:shadow-lg overflow-hidden flex flex-col justify-between w-[250px] cursor-pointer" // Added cursor-pointer
                onClick={() => navigate(`/products/${similarProd.slug}`)}
              >
                <img
                  src={`${BASE_URL}${similarProd.image}`}
                  alt={similarProd.name}
                  className="w-full h-48 object-cover" // Added fixed height
                />
                <div className="p-4 text-center font-semibold">
                  <h3 className="">{similarProd.name}</h3>
                  <p>${similarProd.price}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-black font-bold text-4xl px-[150px]">
            No Similar Product Found
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;