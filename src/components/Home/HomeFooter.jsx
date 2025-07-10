import React from "react";
import { BiLogoFacebookCircle } from "react-icons/bi";
import { FaXTwitter, FaInstagram, FaRegCopyright } from "react-icons/fa6";

const HomeFooter = () => {
  return (
    <section className="w-full bg-[#604FD4] flex flex-col items-center text-white py-4 gap-4">
      <div className="flex gap-6">
        <h4>Home</h4>
        <h4>About</h4>
        <h4>Shop</h4>
        <h4>Contact</h4>
      </div>

      <div className="flex gap-4 text-xl">
        <BiLogoFacebookCircle />
        <FaXTwitter />
        <FaInstagram />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <FaRegCopyright />
        <h3>2024 Shoppit</h3>
      </div>
    </section>
  );
};

export default HomeFooter;
