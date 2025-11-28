import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";

const Category = ({ title, description, image, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(title);
    } else {
      navigate(`/category/${title.toLowerCase()}`);
    }
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <CategoryCard image={image} title={title} description={description} />
    </div>
  );
};

export default Category;
