import React, { useEffect } from "react";
import api from "../../api";
import { useState } from "react";
import LoadingScreen from "../universal-imports/LoadingScreen";
import Error from "../universal-imports/Error";
import { useNavigate } from "react-router-dom"

const CardContainer = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = () => {
    setLoading(true);
    setError("");
    api
      .get("api/products/")
      .then((res) => {
        setLoading(false);
        setProducts(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err.message || "Failed to fetch products");
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section className="px-10 py-8">
      {error && (
        <Error 
          error={error} 
          onRetry={fetchProducts} // Better than window.location.reload()
        />
      )}
      
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-center mb-6">
            Our Products
          </h2>
          {products.length > 0 ? (
            <div className="mt-[3vw] flex flex-wrap justify-center gap-10 max-w-7xl mx-auto pb-[60px]">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg shadow-md hover:shadow-lg overflow-hidden flex flex-col justify-between w-[250px]"
                  onClick={() => navigate(`/products/${product.slug}`)}
                >
                  <img
                    src={`${BASE_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4 text-center font-semibold">
                    <h3 className="">{product.name}</h3>
                    <p className="text-gray-700">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !error && <p className="text-center">No products available</p>
          )}
        </>
      )}
    </section>
  );
};

export default CardContainer;