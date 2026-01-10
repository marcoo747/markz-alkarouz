import React, { useState, useEffect } from "react";
import { usePage, router, Link } from "@inertiajs/react";
import TopAlert from "./TopAlert";
import namer from "color-namer";

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
  onDelete,
  children,
}) => {
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

  return (
    <>
      <article
        className="card product-card h-100"
        aria-label={title}
        style={{ cursor: "pointer" }}
      >
        <Link
          href={route("items.show", id)}
          className="text-decoration-none text-dark flex-grow-1"
        >
          {image && (
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="product-image"
              onClick={(e) => e.stopPropagation()}
            />
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
                    <button type="button" className="btn btn-outline-secondary qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      –
                    </button>

                    <span className="qty-display border rounded bg-light fw-bold">
                      {quantity}
                    </span>

                    <button type="button" className="btn btn-outline-secondary qty-btn" onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="btn btn-success w-100"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </>
            ) : (
              <div className="alert alert-info mt-2 text-center cursor-text">
                Already in cart
              </div>
            ))}

          {manager && (onEdit || onDelete) && (
            <div
              style={{ display: "flex", gap: "8px", marginTop: "8px" }}
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
