import React from "react";
import CategoryCard from "./CategoryCard";

const Category = ({ id, title, description, image, isSelected, selectable, onEdit, onDelete }) => {

  return (
    <div
      className={`cursor-pointer rounded ${selectable ? (isSelected ? "border-2 border-blue-600" : "border-2 border-dashed border-transparent") : "border-none"} ${selectable ? "p-1" : ""}`}
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
