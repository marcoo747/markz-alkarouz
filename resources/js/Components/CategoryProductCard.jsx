import React, { useState, useEffect } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import TopAlert from "./TopAlert";
import namer from "color-namer";
import { useTranslation } from "react-i18next";

const ProductCard = ({
  id,
  title,
  brand,
  description,
  image,
  price,
  color_id,
  color,
  size_id,
  size,
  onEdit,
  inventory_quantity,
  onDelete,
  children,
}) => {
  const { t } = useTranslation();
  const { auth, flash, cartItems = [] } = usePage().props || {};
  const user = auth?.user;
  const manager = user?.user_type === "manager";

  const [alertMessage, setAlertMessage] = useState("");
  const [inCart, setInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (cartItems?.includes(id)) {
      setInCart(true);
    }
  }, [cartItems, id]);

  useEffect(() => {
    if (flash?.success) {
      setAlertMessage(flash.success);
    }
  }, [flash]);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    router.post(
      route("cart.add"),
      {
        product_id: id,
        color_id: color_id || null,
        size_id: size_id || null,
        quantity,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setInCart(true);
          setAlertMessage(`"${title}" added to cart!`);
          setTimeout(() => setAlertMessage(""), 3000);
        },
      }
    );
  };
    
  // Determine stock limit or default to 5 if undefined. If 0, out of stock.
  const stockLimit = inventory_quantity !== undefined ? inventory_quantity : 5;
  const isOutOfStock = stockLimit == 0 || stockLimit == null || stockLimit == "";
  return (
    <>
      <article
        className="card product-card h-100 cursor-pointer"
        aria-label={title}
      >
        <Link
          href={route("items.show", id)}
          className="text-decoration-none text-dark flex-grow-1"
        >
          {image && !image.includes('shopping.webp') ? (
            <img
              src={image.startsWith('http') || image.startsWith('/') ? image : `/${image}`}
              alt={title}
              loading="lazy"
              className="product-image"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full aspect-square bg-gray-50 flex flex-col items-center justify-center text-gray-300 border-b border-gray-100 rounded-t-[14px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">No Image</span>
            </div>
          )}
        </Link>

        <div className="card-body d-flex flex-column">
          <Link
            href={route("items.show", id)}
            className="text-decoration-none text-dark flex-grow-1"
          >
            <h3>{title}</h3>
            <h6>{brand}</h6>
            <p className="text-muted">{description}</p>
            <p className="price fw-bold mt-auto">EGP {price}</p>

            {color && (
              <p className="d-flex align-items-center">
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: color,
                    marginLeft: 8,
                    border: "1px solid #ccc",
                  }}
                ></span>
                <span className="ms-2">{namer(color).basic[0].name}, etc...</span>
              </p>
            )}

            {size && <p>{size}, etc...</p>}
          </Link>

          {user &&
            (!inCart ? (
              <>
                <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                  <label className="form-label fw-bold">Quantity</label>
                  <div className="d-flex align-items-center justify-content-center gap-2 qty-controls">
                    <button
                      type="button"
                      className="btn btn-outline-secondary qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      –
                    </button>

                    <span className="qty-display border rounded bg-light fw-bold">
                      {isOutOfStock ? 0 : quantity}
                    </span>

                    <button
                      type="button"
                      className="btn btn-outline-secondary qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= stockLimit}>
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-success w-100"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                >
                  {t('cart.add_to_cart')}
                </button>
              </>
            ) : (
              <div className="w-full h-10 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100 flex justify-center items-center gap-1 cursor-default transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {t('cart.in_cart')}
              </div>
            ))}

          {manager && (onEdit || onDelete) && (
            <div
              className="flex gap-2 mt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {onEdit && (
                <button
                  className="btn btn-primary flex-grow-1"
                  onClick={onEdit}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  className="btn btn-danger flex-grow-1"
                  onClick={onDelete}
                >
                  Delete
                </button>
              )}
            </div>
          )}

          {children && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              {children}
            </div>
          )}
        </div>
      </article>

      <TopAlert message={alertMessage} onClose={() => setAlertMessage("")} />
    </>
  );
};

export default ProductCard;
