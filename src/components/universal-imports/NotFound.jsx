import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="py-16 text-center bg-[#6050DC] text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">Page Not Found!</h1>
      <p className="text-lg mb-6">
        The page you tried accessing does not exist
      </p>

      <Link
        to="/"
        className="bg-white text-[#6050DC] font-semibold px-6 py-3 rounded-full hover:bg-[#4b3ab1] hover:text-white transition duration-300"
      >
        Back Home
      </Link>
    </section>
  );
};

export default NotFound;
