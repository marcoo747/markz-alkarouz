import React, { useState, useEffect } from "react";

const Carousel = ({ images, interval = 3000 }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Autoplay logic
  useEffect(() => {
    if (!isPlaying || !images || images.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, images, interval]);

  // Handlers
  const goToSlide = (index) => {
    setActiveIndex(index);
    setIsPlaying(true); // Resume autoplay after manual navigation
  };

  const goToPrevious = () => {
    goToSlide((activeIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    goToSlide((activeIndex + 1) % images.length);
  };

  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-gray-200 h-96 flex items-center justify-center text-gray-600">
        No images available
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-full max-h-96 overflow-hidden rounded-lg shadow-lg bg-gray-100 group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Image carousel"
    >
      {/* Slides Container */}
      <div className="relative w-full h-96">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            role="img"
            aria-label={`Slide ${index + 1} of ${images.length}`}
          >
            <img
              src={src}
              alt={`Carousel slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
        type="button"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
        type="button"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === activeIndex
                ? "bg-white w-6"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            type="button"
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
        {activeIndex + 1} / {images.length}
      </div>
    </div>
  );
};

export default Carousel;
