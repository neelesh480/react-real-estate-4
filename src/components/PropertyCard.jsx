import React from 'react';
import { Link } from 'react-router-dom';

const getDefaultImage = (bedrooms) => {
  switch (String(bedrooms)) {
    case '1':
      return "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400";
    case '2':
      return "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400";
    case '3':
      return "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=400";
    default:
      return "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400";
  }
};

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="property-card">
      <img 
        src={property.imageUrl || getDefaultImage(property.bedrooms)}
        alt={property.title}
        className="property-image"
      />
      <div className="property-info">
        <h3 className="property-title">{property.title}</h3>
        <p className="property-location">{property.location}</p>
        <div className="property-price">{formatPrice(property.price)}</div>
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/properties/${property.id}`} className="btn btn-primary">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;