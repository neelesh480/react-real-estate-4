import React, { useState } from "react";

const PropertyCarousel = ({ images = [], altPrefix = "Property image" }) => {
  const [current, setCurrent] = useState(0);

  if (!images.length) {
    return <div>No images available.</div>;
  }

  const goToPrev = () => {
    setCurrent(current === 0 ? images.length - 1 : current - 1);
  };

  const goToNext = () => {
    setCurrent(current === images.length - 1 ? 0 : current + 1);
  };

  return (
    <div
      className="property-carousel"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 500,
        margin: "auto",
      }}>
      <img
        src={images[current]}
        alt={`${altPrefix} ${current + 1}`}
        style={{
          width: "100%",
          height: 300,
          objectFit: "cover",
          borderRadius: 8,
        }}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
            aria-label="Previous">
            ‹
          </button>
          <button
            onClick={goToNext}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
            aria-label="Next">
            ›
          </button>
        </>
      )}

      <div style={{ textAlign: "center", marginTop: 8 }}>
        {images.map((_, idx) => (
          <span
            key={idx}
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              margin: "0 3px",
              borderRadius: "50%",
              background: idx === current ? "#4299e1" : "#cfd8dc",
              cursor: "pointer",
            }}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyCarousel;
