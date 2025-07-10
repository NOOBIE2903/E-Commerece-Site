import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const navigate = useNavigate();

  const handleForm = (e) => {
    api
      .post("api/add_user/", {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
      })
      .then((res) => {
        console.log(res.data);
        navigate("/login/");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const misMatch = confirmPassword && password != confirmPassword;

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100">
      <div className="w-[400px] shadow-2xl rounded-xl mt-[50px] pb-6">
        <h1 className="font-semibold text-3xl tracking-tight text-center mt-[20px]">
          Create an Account
        </h1>
        <h1 className="font-normal text-[#77798D] tracking-tight text-center mt-[10px]">
          Become a valued member of Shoppit
        </h1>
        <div className="mt-[20px] mx-[50px]">
          <h1 className="font-semibold tracking-tight">Username</h1>
          <input
            className="border border-[#77798D] rounded-lg w-[300px] mt-[5px] h-[35px] block mx-auto px-2 focus: outline-none focus:ring-5 focus:ring-[#C2DBFE] focus:border-no"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mt-[20px] mx-[50px]">
          <h1 className="font-semibold tracking-tight">First Name</h1>
          <input
            className="border border-[#77798D] rounded-lg w-[300px] mt-[5px] h-[35px] block mx-auto px-2 focus: outline-none focus:ring-5 focus:ring-[#C2DBFE] focus:border-no"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="mt-[20px] mx-[50px]">
          <h1 className="font-semibold tracking-tight">Last Name</h1>
          <input
            className="border border-[#77798D] rounded-lg w-[300px] mt-[5px] h-[35px] block mx-auto px-2 focus: outline-none focus:ring-5 focus:ring-[#C2DBFE] focus:border-no"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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

        <div className="mt-[20px] mx-[50px]">
          <h1 className="font-semibold tracking-tight">Confirm Password</h1>
          <input
            className={`border ${
              misMatch ? "border-red-500" : "border-[#77798D]"
            } rounded-lg w-[300px] mt-[5px] h-[35px] block mx-auto px-2 focus: outline-none focus:ring-5 focus:ring-[#C2DBFE] focus:border-no`}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {misMatch && (
            <p className="text-red-500 text-sm mt-1 text-center">
              Password do not match
            </p>
          )}
        </div>

        <button
          disabled={misMatch}
          onClick={handleForm}
          className="bg-[#0c6dff] text-white h-[45px] mx-auto block mt-[20px] w-[300px] rounded-lg tracking-tight font-semibold cursor-pointer hover:bg-[#0c4dff] transition-colors duration-300 ease-in-out"
        >
          Create an Account
        </button>

        <p className="text-center mt-[10px] tracking-tight">
          Already have an account?{" "}
          <span
            className="text-[#606EE6] hover:underline tracking-tight cursor-pointer"
            onClick={() => navigate(`/login/`)}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
