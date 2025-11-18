import React from "react";
import "../styles/product.css";

const ProductCard = ({ title, description, image, price, rating }) => {
  return (
    <article className="card product-card" aria-label={title}>
      {image && <img src={image} alt={title} loading="lazy" />}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
        <p className="price">₹{price}</p>
        <p className="rating">
          {"⭐".repeat(rating)} ({rating})
        </p>
        <button className="btn btn-primary w-100">Add to Cart</button>
      </div>
    </article>
  );
};

export default ProductCard;
