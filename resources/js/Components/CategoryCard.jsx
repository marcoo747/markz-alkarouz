import React from "react";
import { usePage, router } from "@inertiajs/react";
import "../../css/categoryCard.css";

const CategoryCard = ({ id, title, description, image, onEdit, onDelete }) => {
  const { auth } = usePage().props;
  const user = auth.user;
  const manager = user?.user_type === "manager";
  const handleClick = () => {
    router.visit(route("categories.show", id));
  };

  return (
    <div className="category-card-item">
      <img src={image} className="category-card-img" alt={title} onClick={handleClick}/>
      <div className="category-card-body">
        <div onClick={handleClick}>
          <h5 className="category-card-title">{title}</h5>
          <p className="category-card-text">{description}</p>
        </div>
        {manager ? (
          <div className="category-card-actions" style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CategoryCard;
