import React from "react";
import CategoryCard from "./CategoryCard";

const Category = ({ id, title, description, image, isSelected, selectable, onEdit, onDelete }) => {

  return (
    <div
      style={{
        cursor: "pointer",
        border: selectable ? (isSelected ? "2px solid #0d6efd" : "2px dashed transparent") : "none",
        borderRadius: 8,
        padding: selectable ? 4 : 0,
      }}
    >
      <CategoryCard
        id={id}
        image={image}
        title={title}
        description={description}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default Category;
