import React from "react";
import NavBar from "../Components/NavBar";
import Carousel from "../Components/Carousel";
import "../styles/home.css";
import ItemPack from "../Components/item-pack";

const images = ["/imgs/img1.jpg", "/imgs/img1.jpg", "/imgs/img1.jpg"];

const Home = () => {
  return (
    <div>
      <NavBar />

      {/* الحاوية اللي فيها النص فوق الكاروسل */}
      <div className="carousel-wrapper">
        <div className="fixed-overlay-text">
          <h1>
            مرحبا بكم في موقع مركز وسائل الايضاح <br /> الخاص بكنيسة مارمرقس
            الرسول شبرا الخيمه
          </h1>
        </div>

        {/* الكاروسل نفسه */}
        <Carousel images={images} />
      </div>
      <ItemPack category_name={"recent added >"}/>
      <ItemPack category_name={"speackers >"}/>

    </div>
  );
};

export default Home;
