import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/product.css";

const ProductCard = ({ id, title, description, image, price, rating }) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    navigate(`/product/${id || encodeURIComponent(title)}`, {
      state: {
        product: {
          id,
          title,
          description,
          images: [image, image, image], // Multiple images for gallery
          price,
          rating,
          specs: {
            brand: "Brand Name",
            material: "Quality Material",
            color: "Default Color",
            dimensions: "Standard Size",
          },
        },
      },
    });
  };

  return (
    <article
      className="card product-card"
      aria-label={title}
      onClick={handleOpen}
      style={{ cursor: "pointer" }}
    >
      {image && <img src={image} alt={title} loading="lazy" />}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-desc">{description}</p>
        <p className="price">EGP {price}</p>
        <p className="rating">{"⭐".repeat(rating)} ({rating})</p>
        <button className="btn btn-primary w-100">Add to Cart</button>
      </div>
    </article>
  );
};

export default ProductCard;
