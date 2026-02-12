import React, { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    name: "Jane Doe",
    feedback: "This platform helped me find the perfect home quickly and easily!",
  },
  {
    id: 2,
    name: "John Smith",
    feedback: "Great user experience and wonderful customer support.",
  },
  {
    id: 3,
    name: "Mary Johnson",
    feedback: "Highly recommend for anyone looking to buy or sell property.",
  },
  {
    id: 4,
    name: "Alice Brown",
    feedback: "A seamless and enjoyable property search experience.",
  },
];

const Testimonial = ({ interval = 7000 }) => {
  const [current, setCurrent] = useState(0);

  const goToNext = () => {
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const goToPrev = () => {
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    const autoPlay = setInterval(() => {
      goToNext();
    }, interval);
    return () => clearInterval(autoPlay);
  }, [interval]);

  const { name, feedback } = testimonials[current];

  return (
    <section className="testimonial-section" style={{ padding: "2rem 0" }}>
      <div className="container">
        <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
          What Our Users Say
        </h2>
        <div className="testimonial-carousel">
          <div className="testimonial-content">
            <p className="testimonial-text">"{feedback}"</p>
            <footer className="testimonial-author">— {name}</footer>
          </div>
          <div className="testimonial-controls">
            <button onClick={goToPrev} className="testimonial-btn" aria-label="Previous testimonial">
              &#10094;
            </button>
            <button onClick={goToNext} className="testimonial-btn" aria-label="Next testimonial">
              &#10095;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
