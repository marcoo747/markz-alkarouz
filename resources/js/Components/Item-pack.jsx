import React from "react";
import ProductCard from "./Card";

const ItemPack = ({
    category_name,
    products = [],
    onEdit,
    onDelete,
    setAlertMessage,
}) => {
    return (
        <div className="py-12 w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-3 border-b border-gray-200">{category_name}</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, idx) => (
                    <ProductCard
                        key={product.product_id || idx}
                        {...product}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        setAlertMessage={setAlertMessage}
                    />
                ))}
            </div>
        </div>
    );
};

export default ItemPack;
