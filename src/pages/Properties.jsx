import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import SearchForm from '../components/SearchForm';
import { propertyAPI } from '../services/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertyAPI.getProperties();
        
        // Apply search filters if any
        let filteredProperties = data;
        
        const location = searchParams.get('location');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const propertyType = searchParams.get('propertyType');
        
        if (location) {
          filteredProperties = filteredProperties.filter(p => 
            p.location.toLowerCase().includes(location.toLowerCase())
          );
        }
        
        if (minPrice) {
          filteredProperties = filteredProperties.filter(p => 
            p.price >= parseInt(minPrice)
          );
        }
        
        if (maxPrice) {
          filteredProperties = filteredProperties.filter(p => 
            p.price <= parseInt(maxPrice)
          );
        }
        
        if (propertyType) {
          filteredProperties = filteredProperties.filter(p => 
            p.propertyType === propertyType
          );
        }
        
        setProperties(filteredProperties);
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams]);

  const handleSearch = (params) => {
    const urlParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key]) {
        urlParams.append(key, params[key]);
      }
    });
    window.location.href = `/properties?${urlParams.toString()}`;
  };

  return (
    <div>
      <div className="container" style={{ paddingTop: '2rem' }}>
        <h1>Properties</h1>
        
        <SearchForm onSearch={handleSearch} />
        
        {loading && <div className="loading">Loading properties...</div>}
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <p>{properties.length} properties found</p>
            </div>
            
            <div className="property-grid">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
        
        {!loading && !error && properties.length === 0 && (
          <div className="text-center">
            <p>No properties found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;