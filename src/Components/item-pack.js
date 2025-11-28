import React from "react";
import ProductCard from "./card";

const ItemPack = ({ category_name }) => {
  return (
    <div className="item-pack">
      <h1 className="category_name">{category_name}</h1>
      <div className="cards-row">
        <ProductCard
          title="Samsung Galaxy S22 Ultra"
          description="12GB RAM, 256GB Storage, Blush Gold"
          image="/imgs/shopping.webp"
          price="59500.00"
          rating={4}
        />
        <ProductCard
          title="Samsung Galaxy S22 Ultra"
          description="12GB RAM, 256GB Storage, Blush Gold"
          image="/imgs/shopping.webp"
          price="59500.00"
          rating={4}
        />
        <ProductCard
          title="Samsung Galaxy S22 Ultra"
          description="12GB RAM, 256GB Storage, Blush Gold"
          image="/imgs/shopping.webp"
          price="59500.00"
          rating={4}
        />
        <ProductCard
          title="Samsung Galaxy S22 Ultra"
          description="12GB RAM, 256GB Storage, Blush Gold"
          image="/imgs/shopping.webp"
          price="59500.00"
          rating={4}
        />
                <ProductCard
          title="Samsung Galaxy S22 Ultra"
          description="12GB RAM, 256GB Storage, Blush Gold"
          image="/imgs/shopping.webp"
          price="59500.00"
          rating={4}
        />
      </div>
    </div>
  );
};

export default ItemPack;
