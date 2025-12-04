import React from "react";
import "../styles/categoryCard.css";

const CategoryCard = ({ title, description, image, onEdit, onDelete }) => {
  return (
    <div className="category-card-item">
      <img src={image} className="category-card-img" alt={title} />
      <div className="category-card-body">
        <h5 className="category-card-title">{title}</h5>
        <p className="category-card-text">{description}</p>
        <div className="category-card-actions" style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
          <button
            className="btn btn-secondary btn-sm"
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
      </div>
    </div>
  );
};

export default CategoryCard;
