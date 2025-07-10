import React, { use, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";

const Login = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleForm = (e) => {
    e.preventDefault();
    setLoading(true);

    api
      .post("api/token/", {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        setLoading(false);
        setError("");

        // const cart_code = localStorage.getItem("cart_code");
        // if (cart_code) {
        //   api
        //     .get("api/associate_cart/", { cart_code })
        //     .then((res) => {
        //       console.log("Cart associated with logged-in user");
        //     })
        //     .catch((err) => {
        //       console.log("Cart association failed", err.message);
        //     });
        // }

        const token = localStorage.getItem("access");
        api
          .get("/api/get_or_create_cart/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            const newCartCode = res.data.cart_code;
            localStorage.setItem("cart_code", newCartCode);
          })
          .catch((err) => console.log(err));

        navigate(from.replace(/\/$/, "") === "/cart" ? "/checkout" : from);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err.message);
        setError(err.message);
        setLoading(false);
      });
  };


  const misMatch = confirmPassword && password != confirmPassword;

  return (
    <div className="bg-gray-100 h-[536px]">
      <div className="flex justify-center">
        <div className="w-[400px] shadow-2xl rounded-xl mt-[50px] pb-6">
          <h1 className="font-semibold text-3xl tracking-tight text-center mt-[20px]">
            Welcome Back
          </h1>
          <h1 className="font-normal text-[#77798D] tracking-tight text-center mt-[10px]">
            Please login to your account
          </h1>
          <div className="mt-[20px] mx-[50px]">
            <h1 className="font-semibold tracking-tight">Username</h1>
            <input
              className="border border-[#77798D] rounded-lg w-[300px] mt-[5px] h-[35px] block mx-auto px-2 focus: outline-none focus:ring-5 focus:ring-[#C2DBFE] focus:border-no"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mt-[20px] mx-[50px]">
            <h1 className="font-semibold tracking-tight">Password</h1>
            <input
              className="border border-[#77798D] rounded-lg w-[300px] mt-[5px] h-[35px] block mx-auto px-2 focus: outline-none focus:ring-5 focus:ring-[#C2DBFE] focus:border-no"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleForm}
            disabled={loading}
            className="bg-[#0c6dff] text-white h-[40px] mx-auto block mt-[20px] w-[300px] rounded-lg tracking-tight font-semibold cursor-pointer hover:bg-[#0c4dff] transition-colors duration-300 ease-in-out"
          >
            Login
          </button>

          <p className="text-center mt-[10px] tracking-tight">
            Do not have an account?{" "}
            <span
              disabled={loading}
              className="text-[#606EE6] hover:underline tracking-tight cursor-pointer"
              onClick={() => navigate(`/signup/`)}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;