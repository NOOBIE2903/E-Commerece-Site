import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios"

const Navbar = ({ numCartItems }) => {
  console.log(numCartItems);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const userId = decoded.user_id;
        
        console.log(decoded)

        axios
          .get(`http://localhost:8000/api/user/${userId}/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => {
            console.log("User API response:", res.data);
            setUsername(res.data.username);
            console.log("Username: ", username)
          })
          .catch((err) => {
            console.log("Fetch user error:", err.response?.data || err.message);
          });
      } catch (err) {
        console.error("Invalid Token", err);
      }
    }
  }, []);

  console.log(username)

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("cart_code");
    setUsername("");
    navigate("/login/");
  };

  return (
    <div className="sticky top-0 z-50 bg-white/30 backdrop-blur-md shadow-md px-20 py-6 flex justify-between items-center w-full">
      <button
        className="uppercase text-3xl font-bold tracking-wide hover:shadow-2xl"
        onClick={() => navigate(`/`)}
      >
        Shoppit
      </button>

      <div className="flex gap-8 items-center relative">
        {username ? (
          <>
            <span className="text-md font-semibold text-green-700 capitalize">
              Hi, {username}
            </span>
            <button
              onClick={handleLogout}
              className="text-md font-semibold hover:text-red-600 transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <a
              onClick={() => navigate(`/signup/`)}
              className="text-md font-semibold hover:text-pink-500 transition duration-300 cursor-pointer"
            >
              Register
            </a>
            <a
              onClick={() => navigate(`/login/`)}
              className="text-md font-semibold hover:text-pink-500 transition duration-300 cursor-pointer"
            >
              Login
            </a>
          </>
        )}

        <FaShoppingCart
          className="text-2xl cursor-pointer hover:text-yellow-400 transition duration-300"
          onClick={() => navigate(`/cart/`)}
        />
        {numCartItems > 0 && (
          <span className="absolute -top-[12px] right-[-14px] bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {numCartItems}
          </span>
        )}
      </div>
    </div>
  );
};

export default Navbar;