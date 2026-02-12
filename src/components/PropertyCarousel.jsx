import React, { useState, useEffect } from "react";

const PropertyCarousel = ({ images = [], altPrefix = "Property image", interval = 5000 }) => {
  const [current, setCurrent] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const goToNext = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setIsFading(false);
    }, 500); // Match this with CSS transition duration
  };

  const goToPrev = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setIsFading(false);
    }, 500);
  };

  useEffect(() => {
    if (images.length > 1) {
      const autoPlay = setInterval(() => {
        goToNext();
      }, interval);
      return () => clearInterval(autoPlay);
    }
  }, [images.length, interval]);

  if (!images.length) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>No images available.</div>;
  }

  return (
    <div className="property-carousel">
      <div className="carousel-image-container">
        <img
          src={images[current]}
          alt={`${altPrefix} ${current + 1}`}
          className={`carousel-image ${isFading ? 'fade-out' : 'fade-in'}`}
        />
      </div>

      {images.length > 1 && (
        <>
          <button onClick={goToPrev} className="carousel-btn prev" aria-label="Previous">
            &#10094;
          </button>
          <button onClick={goToNext} className="carousel-btn next" aria-label="Next">
            &#10095;
          </button>
        </>
      )}

      <div className="carousel-indicators">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`indicator ${idx === current ? "active" : ""}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyCarousel;
