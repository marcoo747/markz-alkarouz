import React from "react";
import ProductCard from "./Card";

const ItemPack = ({ category_name, products = [], onEdit, onDelete, setAlertMessage }) => {
  return (
    <div className="item-pack">
      <h2 className="category_name">{category_name}</h2>

      <div className="row">
        {products.map((product, idx) => (
          <div className="col-6 col-md-4 col-lg-3 mb-4">
            <ProductCard
              key={idx}
              {...product}
              onEdit={onEdit}
              onDelete={onDelete}
              setAlertMessage={setAlertMessage}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemPack;
