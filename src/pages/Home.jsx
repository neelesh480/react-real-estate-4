import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import SearchForm from '../components/SearchForm';
import { propertyAPI } from '../services/api';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        const properties = await propertyAPI.getProperties();
        // Show only first 6 properties as featured
        setFeaturedProperties(properties.slice(0, 6));
      } catch (err) {
        setError('Failed to load featured properties');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const handleSearch = (searchParams) => {
    // Redirect to properties page with search params
    const params = new URLSearchParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key]) {
        params.append(key, searchParams[key]);
      }
    });
    window.location.href = `/properties?${params.toString()}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Find Your Dream Home</h1>
          <p>Discover the perfect property for you and your family</p>
          <Link to="/properties" className="btn btn-primary">
            Browse Properties
          </Link>
        </div>
      </section>

      {/* Search Section */}
      <SearchForm onSearch={handleSearch} />

      {/* Featured Properties */}
      <section style={{ padding: '2rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Featured Properties
          </h2>
          
          {loading && <div className="loading">Loading properties...</div>}
          {error && <div className="error">{error}</div>}
          
          {!loading && !error && (
            <div className="property-grid">
              {featuredProperties.map(property => (
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
    </div>
  );
};

export default Home;