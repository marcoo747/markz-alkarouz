import React from "react";
import "../styles/product.css";

const ProductCard = ({ title, description, image, price, rating }) => {
  return (
    <div className="card product-card">
      <img src={image} className="card-img-top" alt={title} />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <p className="price">₹{price}</p>
        <p className="rating">{"⭐".repeat(rating)} ({rating})</p>
        <button className="btn btn-success w-100">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
