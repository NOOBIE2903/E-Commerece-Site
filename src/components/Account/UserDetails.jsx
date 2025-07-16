import React, { useEffect, useState } from "react";
import api from "../../api";
import { jwtDecode } from "jwt-decode";

const UserDetails = () => {
  const [userData, setUserData] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const userId = decoded.user_id;

        console.log(decoded);

        api
          .get(`http://localhost:8000/api/user/${userId}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            console.log("User API response:", res.data);
            setUserData(res.data);
          })
          .catch((err) => {
            console.log("Fetch user error:", err.response?.data || err.message);
          });
      } catch (err) {
        console.error("Invalid Token", err);
      }
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("access");

    if (accessToken) {
      api
        .get("http://localhost:8000/api/get_user_orders/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res) => {
          console.log("Orders: ", res.data);
          setOrders(res.data);
        })
        .catch((err) => {
          console.error("Error: ", err.message);
        });
    }
  }, []);

  return (
    <div className="w-full lg:flex lg:flex-col px-4 sm:px-8 lg:px-[90px]">
      <div className="Upper-Part flex flex-col lg:flex-row justify-between gap-6 lg:gap-10 py-6 lg:py-[40px]">
        {/* User Profile Card */}
        <div className="User-Image-Name flex flex-col items-center w-full lg:w-[450px] h-auto lg:h-[300px] border border-[#E8E8E8] rounded-2xl shadow-sm p-4">
          <div className="image bg-amber-300 w-[120px] h-[120px] lg:w-[150px] lg:h-[150px] rounded-full mt-2"></div>
          <h1 className="text-2xl lg:text-3xl font-semibold mt-2 text-center">
            {userData.first_name} {userData.last_name}
          </h1>
          <h2 className="text-[#9b9797] text-[15px] lg:text-[17px] text-center">
            {userData.email}
          </h2>
          <button className="bg-[#6050DC] hover:bg-[#4a3ec6] transition-all rounded-lg text-white h-[33px] w-full lg:w-[240px] mt-2 font-semibold text-lg">
            Edit Profile
          </button>
        </div>

        {/* Account Overview */}
        <div className="User-Info w-full h-auto lg:h-[300px] rounded-lg border border-[#E8E8E8]">
          <h1 className="bg-[#6050DC] text-white rounded-t-lg h-[50px] flex items-center font-semibold text-xl pl-[10px]">
            Account Overview
          </h1>
          <div className="mt-4 px-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
            <div className="flex flex-col">
              <span className="font-semibold">Full Name:</span>
              <span>
                {userData.first_name} {userData.last_name}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Username:</span>
              <span>{userData.username}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Email:</span>
              <span>{userData.email}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Phone:</span>
              <span>{userData.phone || "Not Provided"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">City:</span>
              <span>{userData.city || "Not Provided"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Country:</span>
              <span>{userData.country || "Not Provided"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="Lower-Part mb-8 lg:mb-[65px]">
        <div className="border border-[#E8E8E8] rounded-lg w-full h-auto min-h-[300px]">
          <h1 className="bg-[#6050DC] text-white rounded-t-lg h-[50px] flex items-center font-semibold text-xl pl-[10px]">
            Order History
          </h1>
          <div className="p-4 space-y-4">
            {orders.length === 0 ? (
              <p className="text-gray-500">No orders found.</p>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-300 rounded-md p-4 shadow-sm"
                >
                  <h2 className="text-lg font-semibold mb-1">
                    Order #{order.id} - {order.status}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Placed on: {new Date(order.created_at).toLocaleString()}
                  </p>
                  <ul className="list-disc list-inside ml-2">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.product_name} x {item.quantity} - ₹{item.price}
                      </li>
                    ))}
                  </ul>
                  <p className="font-semibold mt-2">
                    Total: ₹{order.total_price}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;