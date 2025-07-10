import React from "react";

const Banner = () => {
  return (
    <section className="w-full bg-[#604FD4] pt-[5.5vw] pb-[6vw] text-white text-center">
      <h1 className="font-bold text-5xl">Welcome to Your Favorite Store</h1>
      <h2 className="text-xl mt-[1.5vw]">
        Discover the latest trends with our modern collection
      </h2>
      <button
        className="mt-[1.5vw] rounded-full w-[150px] h-[49px] text-xl bg-white text-black border-[#604FD4]
        hover:bg-gray-400 transition duration-500 ease-in-out"
      >
        Shop Now
      </button>
    </section>
  );
};

export default Banner;
