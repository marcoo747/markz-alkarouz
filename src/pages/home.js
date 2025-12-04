import React from "react";
import NavBar from "../Components/NavBar";
import Carousel from "../Components/Carousel";
import ItemPack from "../Components/item-pack";
import Container from "../Components/Container";
import Button from "../Components/Button";
import "../styles/home.css";

const dummyProducts = [
  {
    title: "Sample Product 1",
    description: "Description for sample product 1",
    image: "/imgs/shopping.webp",
    price: "100",
    rating: 4,
  },
  {
    title: "Sample Product 2",
    description: "Description for sample product 2",
    image: "/imgs/shopping.webp",
    price: "200",
    rating: 5,
  },
  {
    title: "Sample Product 2",
    description: "Description for sample product 2",
    image: "/imgs/shopping.webp",
    price: "200",
    rating: 5,
  },
  {
    title: "Sample Product 2",
    description: "Description for sample product 2",
    image: "/imgs/shopping.webp",
    price: "200",
    rating: 5,
  },
  {
    title: "Sample Product 2",
    description: "Description for sample product 2",
    image: "/imgs/shopping.webp",
    price: "200",
    rating: 5,
  },
];

const Home = () => {
  return (
    <div>
      <NavBar />

      <section className="hero">
        <Container>
          <div className="hero-inner">
            <p className="hero-eyebrow">مرحباً بكم</p>
            <h1>مركز وسائل الإيضاح - كنيسة مار مرقس الرسول</h1>
            <p>
              منصة تعرض الموارد والمنتجات الخاصة بالمركز. اكتشف الإضافات الأخيرة
              وتصفح التصنيفات بسهولة.
            </p>
            <div className="hero-cta">
              <Button
                variant="primary"
                onClick={() => (window.location = "/categories")}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  window.scrollTo({ top: 600, behavior: "smooth" })
                }
              >
                Learn More
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <div className="mt-8">
          <Carousel
            images={["/imgs/img1.jpg", "/imgs/img1.jpg", "/imgs/img1.jpg"]}
          />
        </div>

        <div className="mt-8">
          <ItemPack
            category_name={"recent added >"}
            products={dummyProducts}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>

        <div className="mt-8">
          <ItemPack
            category_name={"speackers >"}
            products={dummyProducts}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </div>
      </Container>
    </div>
  );
};

export default Home;
