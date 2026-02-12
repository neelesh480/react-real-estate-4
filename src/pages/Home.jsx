import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import SearchForm from "../components/SearchForm";
import PropertyCarousel from "../components/PropertyCarousel";
import { propertyAPI } from "../services/api";
import AIChatbot from '../components/AIChatbot';

import About from "../components/About";
import Testimonial from "../components/Testimonial";

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const response = await propertyAPI.getProperties();
        // Handle paginated response
        const properties = response.content || response;
        setFeaturedProperties(properties.slice(0, 6));
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load featured properties");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProperties();
  }, []);

  const handleSearch = (searchParams) => {
    const params = new URLSearchParams();
    Object.keys(searchParams).forEach((key) => {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    });
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div>
      <section className="carousel-section" style={{ padding: "2rem 0" }}>
        <div className="container">
          <PropertyCarousel
            images={[
              "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1", // 1BHK
              "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1", // 2BHK
              "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&dpr=1", // 3BHK
            ]}
            altPrefix="Featured property"
          />
        </div>
      </section>

      <SearchForm onSearch={handleSearch} />

      <section style={{ padding: "2rem 0" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            Featured Properties
          </h2>

          {loading && <div className="loading">Loading properties...</div>}
          {error && <div className="error">{error}</div>}

          {!loading && !error && (
            <div className="property-grid">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {!loading && !error && featuredProperties.length === 0 && (
            <div className="text-center">
              <p>No properties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <About />

      <Testimonial />

      <AIChatbot />
    </div>
  );
};

export default Home;
