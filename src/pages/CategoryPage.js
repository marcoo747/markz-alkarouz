import React from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../Components/card";
import "../styles/categoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();

  return (
    <div className="category-page">
      <h2>{categoryName.toUpperCase()} Products</h2>
      <div className="product-grid">
        <ProductCard
          title="Samsung Galaxy S22 Ultra"
          description="12GB RAM, 256GB Storage, Blush Gold"
          image="/imgs/shopping.webp"
          price="59990"
          rating={4}
        />
        <ProductCard
          title="iPhone 14 Pro Max Case"
          description="Clear case with card holder"
          image="/imgs/shopping.webp"
          price="425"
          rating={3}
        />
        <ProductCard
          title="Bluetooth Speaker"
          description="Portable speaker with mic"
          image="/imgs/shopping.webp"
          price="1200"
          rating={5}
        />
        <ProductCard
          title="Noise Cancelling Headphones"
          description="Over-ear wireless headphones"
          image="/imgs/shopping.webp"
          price="2500"
          rating={4}
        />
        <ProductCard
          title="Smart Watch"
          description="Fitness tracker with heart rate monitor"
          image="/imgs/shopping.webp"
          price="1500"
          rating={4}
        />
        <ProductCard
          title="Smart Watch"
          description="Fitness tracker with heart rate monitor"
          image="/imgs/shopping.webp"
          price="1500"
          rating={4}
        />
        <ProductCard
          title="Smart Watch"
          description="Fitness tracker with heart rate monitor"
          image="/imgs/shopping.webp"
          price="1500"
          rating={4}
        />
        <ProductCard
          title="Smart Watch"
          description="Fitness tracker with heart rate monitor"
          image="/imgs/shopping.webp"
          price="1500"
          rating={4}
        />
        <ProductCard
          title="Smart Watch"
          description="Fitness tracker with heart rate monitor"
          image="/imgs/shopping.webp"
          price="1500"
          rating={4}
        />
        <ProductCard
          title="Smart Watch"
          description="Fitness tracker with heart rate monitor"
          image="/imgs/shopping.webp"
          price="1500"
          rating={4}
        />
        <ProductCard
          title="Smart Watch"
          description="Fitness tracker with heart rate monitor"
          image="/imgs/shopping.webp"
          price="1500"
          rating={4}
        />
        <ProductCard
          title="Smart Watch"
          description="Fitness tracker with heart rate monitor"
          image="/imgs/shopping.webp"
          price="1500"
          rating={4}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
