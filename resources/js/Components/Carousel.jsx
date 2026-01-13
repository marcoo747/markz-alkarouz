import React from "react";

const Carousel = ({ images, interval = 3000 }) => {
  return (
    <div
      id="carouselExampleAutoplay"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval={interval}
    >
      <div className="carousel-inner">
        {images.map((src, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={src}
              className="d-block w-100"
              alt={`Slide ${index + 1}`}
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* The arrows (keep if you want them visible) */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleAutoplay"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleAutoplay"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousel;
