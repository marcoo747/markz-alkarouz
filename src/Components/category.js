import React from "react";
import { useNavigate } from "react-router-dom";
const Category = ({ title, description, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${title.toLowerCase()}`);
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <div className="card text-bg-dark">
        <img src={image} className="card-img" alt={title} />
        <div className="card-img-overlay">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Category;
