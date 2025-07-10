import React, { useEffect } from "react";
import Navbar from "../components/universal-imports/Navbar";
import Banner from "../components/Home/Banner";
import CardContainer from "../components/Home/CardContainer";
import HomeFooter from "../components/Home/HomeFooter";
import { randomValue } from "../GenerateCartCode";

const Home = () => {
  useEffect(() => {
    if (localStorage.getItem("cart_code") == null) {
      localStorage.setItem("cart_code", randomValue)
    }
  })
  
  return (
    <div>
      <Banner />
      <CardContainer />
    </div>
  );
};

export default Home;
