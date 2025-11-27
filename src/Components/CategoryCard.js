import React from "react";
import "../styles/categoryCard.css";

const CategoryCard = ({ title, description, image }) => {
  return (
    <div className="category-card-item">
      <img src={image} className="category-card-img" alt={title} />
      <div className="category-card-body">
        <h5 className="category-card-title">{title}</h5>
        <p className="category-card-text">{description}</p>
      </div>
    </div>
  );
};

export default CategoryCard;
