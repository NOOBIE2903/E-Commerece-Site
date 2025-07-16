import React, { useEffect, useState } from "react";
import { FaCcPaypal } from "react-icons/fa6";
import { SiPhonepe } from "react-icons/si";
import api from "../../api";
import { CiDeliveryTruck } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const CheckoutItems = () => {
  const navigate = useNavigate()
  const cart_code = localStorage.getItem("cart_code");

  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState([]); 

  const fetchCart = () => {
    api
      .get(`api/get_cart/?cart_code=${cart_code}`)
      .then((res) => {
        setCartItems(res.data.items);
        setCartData(res.data);
        console.log(res.data);
      })

      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="w-full mb-[40px] flex">
      <div className="order-summary w-[60%] mx-[90px] py-[25px] rounded-lg shadow-xl bg-white">
        <h1 className="bg-[#604FD4] px-[16px] text-white rounded-t-lg text-2xl h-[50px] font-semibold py-[8px]">
          Cart summary
        </h1>

        <div className="max-h-[400px] overflow-y-auto">
          {cartItems.map((item, index) => (
            <div key={index} className="px-4 py-2">
              <div className="flex justify-between items-center">
                <div className="flex gap-5 items-center">
                  <img
                    src={`${BASE_URL}${item.product.image}`}
                    alt={item.product.name}
                    className="ml-[13px] mt-[10px] w-[70px] h-[70px] rounded-lg"
                  />
                  <div className="flex flex-col">
                    <h1 className="tracking-tight font-semibold">
                      {item.product.name}
                    </h1>
                    <h1 className="font-light tracking-tight">
                      Quantity: {item.quantity}
                    </h1>
                  </div>
                </div>
                <div className="text-right font-medium tracking-tight">
                  ${item.total.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-1 border-[#E3E4E4] mx-[18px]"></div>
        <div className="flex justify-between mx-[18px] mt-[20px]">
          <h1 className="font-semibold tracking-tight">Total (Including Tax):</h1> 
          <h1 className="tracking-tight font-semibold">${(cartData.total + cartData.total * 0.004).toFixed(2)}</h1>
        </div>
      </div>

      <div className="payment w-[27%] -mx-[55px] py-[25px] rounded-lg shadow-xl bg-white h-[250px]">
        <h1 className="bg-[#604FD4] px-[16px] text-white rounded-t-lg text-2xl h-[50px] font-semibold py-[8px]">
          Payment Option
        </h1>
        <div className="flex flex-col mt-[20px]">
          <button onClick={() => navigate("/checkout-confirm/")} className="bg-[#5F259F] rounded mt-[10px] mx-[20px] h-[45px] text-[17px] text-white flex items-center justify-center gap-[8px] tracking-tight cursor-pointer hover:bg-[#52259f]">
            <SiPhonepe className="text-[30px]"/>
            <h1>Pay With PhonPe</h1>
          </button>
          <button onClick={() => navigate("/checkout-confirm/")} className="bg-[#c1bfbf] rounded mt-[10px] mx-[20px] h-[45px] text-[17px] text-black flex items-center justify-center gap-[8px] tracking-tight cursor-pointer hover:bg-[#808082]">
            <CiDeliveryTruck className="text-[30px]"/>
            <h1>Cash On Delivery</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutItems;
