import React, { useState } from "react";
import PropTypes from "prop-types";
import "../styles/product-detail.css";

export default function ProductDetail({
  product,
  showSeeMore = false,
  onSeeMore,
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const images = product?.images || ["/imgs/shopping.webp"];

  return (
    <div className="product-page">
      {/* LEFT: Gallery */}
      <div className="product-gallery">
        <div className="main-image">
          <img src={images[selectedImage]} alt={product?.title} />
        </div>
        <div className="thumbs">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`thumb-btn ${selectedImage === idx ? "active" : ""}`}
              onClick={() => setSelectedImage(idx)}
            >
              <img src={img} alt={`Thumb ${idx}`} />
            </button>
          ))}
        </div>
      </div>

      {/* CENTER: Details */}
      <div className="product-details">
        <h1 className="product-title">{product?.title}</h1>

        <div className="product-meta">
          <span className="rating">★ {product?.rating ?? 4.5}</span>
          <span className="rating-count">1,250 ratings</span>
          <span className="badge-best-seller">★ Best Seller</span>
        </div>

        <hr className="divider" />

        <div className="product-price-section">
          <span className="currency">EGP</span>
          <span>{Math.floor(Number(product?.price || 0))}</span>
          <span className="superscript">
            {String(product?.price || "0.00").split(".")[1] || "00"}
          </span>
        </div>

        {/* Specs Section */}
        {product?.specs && (
          <div id="specs-more" className="product-specs">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="spec-row">
                <span className="spec-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
                <span className="spec-value">{value}</span>
              </div>
            ))}
          </div>
        )}

        {showSeeMore && (
          <button
            type="button"
            className="see-more btn btn-link"
            onClick={onSeeMore}
          >
            See more
          </button>
        )}

        <div className="quantity-section">
          <label>Quantity:</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="product-actions">
          <button className="btn btn-success">Add to Cart</button>
          <button className="btn btn-warning">Buy Now</button>
        </div>
      </div>

      {/* RIGHT: Info Box */}
      <div className="product-info-box">
        <span>Discover the options</span>
        <div>
          <div className="colors">
            <span
              className={`color ${selectedColor === 'red' ? 'selected' : ''}`}
              onClick={() => setSelectedColor('red')}
            >
              🔴 Red
            </span>
            <span
              className={`color ${selectedColor === 'green' ? 'selected' : ''}`}
              onClick={() => setSelectedColor('green')}
            >
              🟢 Green
            </span>
            <span
              className={`color ${selectedColor === 'blue' ? 'selected' : ''}`}
              onClick={() => setSelectedColor('blue')}
            >
              🔵 Blue
            </span>
          </div>
          <div className="colors">
            <span
              className={`color ${selectedSize === 'large' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('large')}
            >
              Large
            </span>
            <span
              className={`color ${selectedSize === 'X-large' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('X-large')}
            >
              X-Large
            </span>
            <span
              className={`color ${selectedSize === 'small' ? 'selected' : ''}`}
              onClick={() => setSelectedSize('small')}
            >
              Small
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

ProductDetail.propTypes = {
  product: PropTypes.object,
  showSeeMore: PropTypes.bool,
  onSeeMore: PropTypes.func,
};
