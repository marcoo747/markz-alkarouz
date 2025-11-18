import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/card";
import Container from "../Components/Container";
import "../styles/categoryPage.css";
import NavBar from "../Components/NavBar";

const products = [
  {
    title: "Samsung Galaxy S22 Ultra",
    description: "12GB RAM, 256GB Storage, Blush Gold",
    image: "/imgs/shopping.webp",
    price: "59990",
    rating: 4,
  },
  {
    title: "iPhone 14 Pro Max Case",
    description: "Clear case with card holder",
    image: "/imgs/shopping.webp",
    price: "425",
    rating: 3,
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable speaker with mic",
    image: "/imgs/shopping.webp",
    price: "1200",
    rating: 5,
  },
  {
    title: "Noise Cancelling Headphones",
    description: "Over-ear wireless headphones",
    image: "/imgs/shopping.webp",
    price: "2500",
    rating: 4,
  },
];

const CategoryPage = () => {
  const { categoryName } = useParams();

  return (
    <div>
      <NavBar />
      <Container>
        <h2 style={{ marginTop: 24 }}>
          {categoryName ? categoryName.toUpperCase() : "Category"} Products
        </h2>
        <div className="grid grid-cols-3 mt-8">
          {products.map((p, idx) => (
            <ProductCard key={idx} {...p} />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
