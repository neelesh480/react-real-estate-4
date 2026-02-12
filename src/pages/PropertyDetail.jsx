import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyAPI } from '../services/api';

const getDefaultImage = (bedrooms) => {
  switch (String(bedrooms)) {
    case '1':
      return "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=800";
    case '2':
      return "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800";
    case '3':
      return "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800";
    default:
      return "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800";
  }
};

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyAPI.getProperty(id);
        setProperty(data);
      } catch (err) {
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <div className="loading">Loading property details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!property) return <div className="error">Property not found</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <Link to="/properties" style={{ marginBottom: '1rem', display: 'inline-block' }}>
        ← Back to Properties
      </Link>
      
      <div className="card">
        <img 
          src={property.imageUrl || getDefaultImage(property.bedrooms)}
          alt={property.title}
          style={{ width: '100%', height: '400px', objectFit: 'cover' }}
        />
        
        <div className="card-body">
          <h1>{property.title}</h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>
            {property.location}
          </p>
          
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '2rem' }}>
            {formatPrice(property.price)}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div>
              <strong>Property Type:</strong> {property.propertyType || 'N/A'}
            </div>
            <div>
              <strong>Bedrooms:</strong> {property.bedrooms || 'N/A'}
            </div>
            <div>
              <strong>Bathrooms:</strong> {property.bathrooms || 'N/A'}
            </div>
            <div>
              <strong>Area:</strong> {property.area ? `${property.area} sq ft` : 'N/A'}
            </div>
          </div>
          
          {property.description && (
            <div>
              <h3>Description</h3>
              <p style={{ lineHeight: '1.6', marginTop: '0.5rem' }}>
                {property.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;