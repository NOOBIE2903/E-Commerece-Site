import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import Spinner from "../universal-imports/Spinner";
import { isTokenValid } from "../../authUtils";
import { useNavigate } from "react-router-dom";

const Cart = ({ refreshCartCount }) => {
  const cart_code = localStorage.getItem("cart_code");

  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleCheckout = () => {
    if (isTokenValid()) {
      navigate("/checkout/");
    } else {
      navigate("/login/", { state: { from: "/cart" } });
    }
  };

   const fetchCart = () => {
    setLoading(true);
    api.get(`api/get_cart/?cart_code=${cart_code}`)
      .then((res) => {
        setCartItems(res.data.items);
        setCartData(res.data);
      })
      .catch((err) => {
        console.log("Fetch cart error:", err);
        if (err.response?.status === 404) {
          // Create new empty cart if not found
          setCartItems([]);
          setCartData({ items: [], sum_total: 0 });
        } else {
          toast.error("Failed to load cart");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (cart_code) {
      fetchCart();
    } else {
      // If no cart_code exists, treat as empty cart
      setCartItems([]);
      setCartData({ items: [], sum_total: 0 });
    }
  }, [cart_code]);

  const updateItemQuantity = (item_id, quantity) => {
    api
      .patch(`api/update_quantity/`, {
        item_id: item_id,
        quantity: quantity,
      })
      .then((res) => {
        toast.success("Cart Item Updated Successfully!");
        fetchCart();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const removeCartItem = (item_id) => {
    setIsRemoving(true);
    api
      .delete(`api/delete_cart_item/`, {
        data: { item_id: item_id },
      })
      .then((res) => {
        toast.success("Item Removed Successfully!");
        fetchCart();
        refreshCartCount();
      })
      .catch((err) => {
        console.log(err.message);
        toast.error("Failed to remove item.");
      })
      .finally(() => {
        setIsRemoving(false);
        setShowConfirm(false);
      });
  };

   if (loading) {
    return <Spinner />;
  }

  if (cartItems.length < 1) {
    return (
      <div className="alert alert-primary mt-10" role="alert">
        Cart is Empty!
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="px-[115px] py-[35px] text-2xl font-semibold tracking-tight">
        Shopping Cart: You have {cartData.items.length} product
        {cartData.items.length > 1 ? "s" : ""} in your cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-y-8 gap-x-10 px-6 lg:px-[115px]">
        {/* Cart Items */}
        <div className="w-full lg:w-[65%] -mt-[25px]">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row justify-between items-center rounded-xl overflow-hidden bg-[#F3F4F6] mt-[10px] lg:mb-4 h-[auto] lg:h-[150px]"
            >
              <div className="flex">
                <img
                  src={`http://localhost:8000${item.product.image}`}
                  alt={item.product.name}
                  className="rounded-xl h-[120px] w-[120px] mt-[16px] ml-[16px] object-cover"
                />
                <div className="mt-[20px] px-[30px] flex-col">
                  <h1 className="text-xl font-semibold">{item.product.name}</h1>
                  <h1>${item.product.price}</h1>
                </div>
              </div>
              <div className="flex gap-4 mr-6">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value);
                    const updatedItems = [...cartItems];
                    updatedItems[index] = {
                      ...updatedItems[index],
                      quantity: newQuantity,
                    };
                    setCartItems(updatedItems);
                  }}
                  min={1}
                  className="w-16 bg-white text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={() => updateItemQuantity(item.id, item.quantity)}
                  className="rounded bg-[#4B3BCB] px-4 py-2 text-white hover:transition"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setItemToDelete(item.id);
                    setShowConfirm(true);
                  }}
                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-800 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Confirmation Modal */}
          {showConfirm && (
            <div
              className="bg-black/50 fixed inset-0 flex items-center justify-center z-50"
              role="dialog"
              aria-modal="true"
            >
              <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
                <h2 className="text-xl font-semibold mb-4">Confirm Removal</h2>
                <p className="mb-6">
                  Are you sure you want to remove this item from the cart?
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => removeCartItem(itemToDelete)}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                    disabled={isRemoving}
                  >
                    {isRemoving ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Box */}
        <div className="w-full lg:w-[30%] lg:sticky lg:top-[130px] -mt-[13px] h-[230px] rounded-xl border border-[#D2D2D2]">
          <h1 className="text-xl font-semibold tracking-tight p-5">
            Cart Summary
          </h1>
          <div className="border-1 border-[#D2D2D2] ml-[15px] mr-[15px]"></div>
          <div className="px-[20px] flex flex-col py-[10px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>
                ${cartData.total ? cartData.total.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>
                $
                {cartData.total
                  ? (cartData.total * 0.004).toFixed(2)
                  : "0.00"}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>
                $
                {cartData.total
                  ? (cartData.total + cartData.total * 0.004).toFixed(2)
                  : "0.00"}
              </span>
            </div>
            <button
              className="mt-[20px] rounded text-white bg-[#6050DC] h-[35px] hover:bg-[#6a50dc]"
              onClick={handleCheckout}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;