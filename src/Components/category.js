import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";

const Category = ({ title, description, image, onClick, isSelected, selectable, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick({ title, description, image });
    } else {
      navigate(`/category/${title.toLowerCase()}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: "pointer",
        border: selectable ? (isSelected ? "2px solid #0d6efd" : "2px dashed transparent") : "none",
        borderRadius: 8,
        padding: selectable ? 4 : 0,
      }}
    >
      <CategoryCard image={image} title={title} description={description} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default Category;
