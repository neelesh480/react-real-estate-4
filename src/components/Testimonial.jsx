import React from "react";

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      name: "Jane Doe",
      feedback:
        "This platform helped me find the perfect home quickly and easily!",
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

  return (
    <section
      className="testimonial-section"
      style={{
        padding: "2rem",
      }}>
      <h2>What Our Users Say</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginTop: "1rem",
        }}>
        {testimonials.map(({ id, name, feedback }) => (
          <blockquote
            key={id}
            style={{
              margin: 0,
              padding: "1rem",
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              fontStyle: "normal",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}>
            <p style={{ fontStyle: "italic", flexGrow: 1 }}>"{feedback}"</p>
            <footer
              style={{
                marginTop: "1rem",
                fontWeight: "600",
                textAlign: "right",
                color: "#333",
              }}>
              — {name}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
