import React from "react";
import ProductCard from "./card";

const ItemPack = ({ category_name, products = [], onEdit, onDelete }) => {
  return (
    <div className="item-pack">
      <h1 className="category_name">{category_name}</h1>
      <div className="cards-row">
        {products.map((product, idx) => (
          <div key={idx} className="product-card-wrapper">
            <ProductCard {...product} />
            <div className="item-actions">
              <button className="btn btn-sm btn-info" onClick={() => onEdit(product)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => onDelete(product)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemPack;
