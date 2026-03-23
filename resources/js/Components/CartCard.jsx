import React from "react";
import { router } from "@inertiajs/react";
import namer from "color-namer";
import { useTranslation } from "react-i18next";

const ProductCard = ({
  id,
  title,
  brand,
  description,
  image,
  onRemove,
  color,
  size,
  quantity
}) => {
  const { t } = useTranslation();

  const handleOpen = () => {
    router.get(route("items.show", id));
  };

  return (
    <article
      className="card product-card h-100 p-1 cursor-pointer"
    >
      {image && (
        <img
          src={image}
          alt={title}
          loading="lazy"
          onClick={handleOpen}
          className="rounded w-full h-48 object-cover"
        />
      )}

      <div className="card-body">
        <div onClick={handleOpen}>
          <h3 className="card-title">{title}</h3>
          <h6 className="card-title">{brand}</h6>
          <p className="card-desc">{description}</p>

          {/* Show Color */}
          {color && (
            <p className="d-flex align-items-center mb-1">
              <span
                style={{
                  display: "inline-block",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: color.color,
                  marginRight: 8,
                  border: "1px solid #ccc",
                }}
              ></span>
              <span>{namer(color).basic[0].name}</span>
            </p>
          )}

          {/* Show Size */}
          {size && <p className="mb-1">{t("cart.size")} <strong>{size.size}</strong></p>}

          {/* Show Quantity */}
          {quantity !== undefined && (
            <p className="mb-2">
              {t("cart.quantity")} <span className="badge bg-primary">{quantity}</span>
            </p>
          )}
        </div>

        <button
          className="btn btn-danger w-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          {t('cart.remove')}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
