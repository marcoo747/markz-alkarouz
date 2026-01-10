import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import PropTypes from "prop-types";
import ImageUploadModal from "./ImageUploadModal";
import AddOptionModal from "./AddOptionModal";
import TopAlert from "./TopAlert";
import "../../css/product-detail.css";

export default function ProductDetail({ product }) {
  const { auth, flash, cartItems = [] } = usePage().props || {};
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState({ show: false, type: "" });
  const user = auth.user;

  const manager = user?.user_type === "manager";
    
  const [alertMessage, setAlertMessage] = useState("");
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
      if (cartItems?.includes(product.product_id)) {
          setInCart(true);
      }
  }, [cartItems, product.product_id]);

  useEffect(() => {
    if (flash?.success) {
      setAlertMessage(flash.success);
    }
  }, [flash]);

  const images =
    product?.images?.length > 0
      ? product.images
          .sort((a, b) => a.photo_id - b.photo_id)
          .map((p) => `/markaz_alkarouz/public/storage/${p.photo}`)
      : ["/markaz_alkarouz/public/imgs/shopping.webp"];

const handleAddToCart = () => {
  if (inCart) return;

  const colorObj = product.colors?.find(c => c.color === selectedColor);
  const sizeObj = product.sizes?.find(s => s.size === selectedSize);

  if (!selectedColor || !selectedSize) {
    setAlertMessage("Please select color and size before adding to cart.");
    return;
  }

  router.post(
    route("cart.add"),
    {
      product_id: product.product_id,
      quantity,
      color_id: colorObj?.color_id || null,
      size_id: sizeObj?.size_id || null,
    },
    {
      preserveScroll: true,
      onSuccess: () => {
        setAlertMessage(`"${product.pr_name}" has been added to your cart!`);
        setInCart(true);
        setTimeout(() => setAlertMessage(""), 3000);
      },
    }
  );
};

  return (
    <>
      <div className="product-page">
        {/* LEFT: Gallery */}
        <div className="product-gallery">
          {manager ? (
            <div className="add-photo-section">
              <button className="btn btn-success btn-sm" onClick={() => setShowUploadModal(true)}>Add Photo</button>
              <button className="btn btn-success btn-sm" onClick={() => setShowOptionModal({ show: true, type: "material" })}>Add Material</button>
              <button className="btn btn-success btn-sm" onClick={() => setShowOptionModal({ show: true, type: "color" })}>Add Color</button>
              <button className="btn btn-success btn-sm" onClick={() => setShowOptionModal({ show: true, type: "size" })}>Add Size</button>
            </div>  
          ) : null}

          {showOptionModal.show && (
            <AddOptionModal
              type={showOptionModal.type}
              productId={product.product_id}
              onClose={() => setShowOptionModal({ show: false, type: "" })}
              onAdded={() => window.location.reload()}
            />
          )}

          {showUploadModal && (
            <ImageUploadModal
              product={product}
              onClose={() => setShowUploadModal(false)}
              onUploaded={() => window.location.reload()}
            />
          )}

          <div className="main-image">
            <img src={images[selectedImage]} alt={product?.title} className="rounded" />
          </div>

          <div className="thumbs">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`thumb-btn ${selectedImage === idx ? "active" : ""}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`thumb-${idx}`} />
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: Details */}
        <div className="product-details">
          <h1 className="product-title">{product?.pr_name}</h1>
          <hr className="divider" />
          <div className="product-price-section">
            <span className="currency">EGP</span>
            <span>{Math.floor(Number(product?.pr_price || 0))}</span>
            <span className="superscript">{String(product?.price || "0.00").split(".")[1] || "00"}</span>
          </div>

          {product?.brand && <div className="product-description"><h6>{product.brand}</h6></div>}
          {product?.pr_description && <div className="product-description"><p>{product.pr_description}</p></div>}

          <div className="materials">
            <strong>Materials:</strong>{" "}
            {product.materials?.map((mat, idx) => (
              <span
                key={mat.material_id}
                className={`material-option ${selectedMaterial === mat.material_name ? "selected" : ""}`}
                onClick={() => setSelectedMaterial(mat.material_name)}
              >
                {mat.material_name}{idx < product.materials.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>

          <div className="product-actions">
            {/* Conditionally show Add to Cart button or "already in cart" message */}
            {user && (
              !inCart ? (
                <>
                  {/* Quantity selector */}
                  <div className="quantity-selector">
                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>
                      -
                    </button>
                    <span className="qty-display-box">{quantity}</span>
                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(prev => prev + 1)}>
                      +
                    </button>
                  </div>
                  <button className="btn btn-success w-100" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </>
              ) : (
                <div className="alert alert-info mt-2 text-center cursor-text">
                  Already in cart
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT: Colors */}
        <div className="product-info-box">
          <span className="section-title">Discover the Colors:</span>

          <div className="colors">
            {product.colors?.map((color) => (
              <span
                key={color.color_id}
                className={`color-circle ${
                  selectedColor === color.color ? "selected" : ""
                }`}
                onClick={() => setSelectedColor(color.color)}
                style={{ backgroundColor: color.color }}
              />
            ))}
          </div>

          {/* Sizes */}
          <div className="sizes">
            <span className="section-title">Discover the Sizes:</span>
            <div className="size-options">
              {product.sizes?.map((size) => (
                <span
                  key={size.size_id}
                  className={`size-option ${
                    selectedSize === size.size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top modal alert */}
      <TopAlert message={alertMessage} onClose={() => setAlertMessage("")} />
    </>
  );
}

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
};