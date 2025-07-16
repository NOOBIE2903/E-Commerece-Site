import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CheckoutDelivery = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("access_token");
  const cartCode = localStorage.getItem("cart_code");

  useEffect(() => {
    const token = localStorage.getItem("access");

    const fetchData = async () => {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;
        // Get user details
        const userRes = await axios.get(
          `${BASE_URL}/api/user/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDetails(userRes.data);

        // Get cart state
        const cartRes = await axios.get(
          `${BASE_URL}/api/get_cart_state?cart_code=${cartCode}`
        );
        setCartItems(cartRes.data.items);
        setTotal(cartRes.data.sum_total);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, cartCode]);

  const handleConfirmOrder = async () => {
    try {
      const token = localStorage.getItem("access");
      const cart_code = localStorage.getItem("cart_code");
      const res = await axios.post(
        `${BASE_URL}/api/checkout_cart/`,
        { cart_code: cartCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); 
      console.log("cart_code")

      alert("Order placed successfully! Order ID: " + res.data.order_id);
      localStorage.removeItem("cart_code"); 
      return true;
    } catch (error) {
      console.error(error);
      alert("Error placing order");
      return false;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Confirm Delivery Details</h2>

      {/* User Details */}
      {userDetails && (
        <div className="mb-6 border p-4 rounded-lg shadow">
          <p>
            <strong>Name:</strong> {userDetails.first_name}{" "}
            {userDetails.last_name}
          </p>
          <p>
            <strong>Email:</strong> {userDetails.email}
          </p>
          <p>
            <strong>Phone:</strong> {userDetails.phone}
          </p>
          <p>
            <strong>Address:</strong> {userDetails.address}, {userDetails.city},{" "}
            {userDetails.state}
          </p>
        </div>
      )}

      {/* Cart Items */}
      <div className="mb-6">
        <h3 className="text-xl font-medium mb-2">Cart Items</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between border-b py-2">
            <div>
              {item.product.name} (x{item.quantity})
            </div>
            <div>₹{item.product.price * item.quantity}</div>
          </div>
        ))}
        <div className="text-right mt-2 font-bold">Total: ₹{total}</div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={async () => {
          const result = await handleConfirmOrder();
          if (result) {
            setSuccess(true);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        }}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {success ? "Order Placed" : "Confirm & Place Order"}
      </button>
    </div>
  );
};

export default CheckoutDelivery;
