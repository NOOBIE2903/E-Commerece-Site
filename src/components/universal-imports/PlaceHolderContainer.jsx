import React from "react";
import PlaceHolder from "./PlaceHolder";

const PlaceHolderContainer = () => {
    const placeNumbers = [...Array(11).keys()].slice(0);

  return (
    <section className="py-5" id="shop">
      <h4 style={{ textAlign: "center" }}>Our Product</h4>

      <div className="container px-4 px-lg-5 mt-5">
        <div className="row justify-content-center">
            {placeNumbers.map(num => <PlaceHolder key={num} />)}
        </div>
      </div>
    </section>
  );
};

export default PlaceHolderContainer;
