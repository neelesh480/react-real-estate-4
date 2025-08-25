import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from '../services/api';

const AddProperty = () => {
  const [property, setProperty] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await propertyAPI.createProperty(property);
      setSuccess('Property added successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProperty({
      ...property,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-header">
          <h1>Add New Property</h1>
        </div>
        
        <div className="card-body">
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={property.title}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Beautiful 3BR House"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={property.description}
                onChange={handleChange}
                className="form-input"
                rows="4"
                placeholder="Describe the property..."
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                value={property.location}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="New York, NY"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                name="price"
                value={property.price}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="500000"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Property Type</label>
              <select
                name="propertyType"
                value={property.propertyType}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Select Type</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="CONDO">Condo</option>
                <option value="TOWNHOUSE">Townhouse</option>
              </select>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={property.bedrooms}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="3"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={property.bathrooms}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="2"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Area (sq ft)</label>
                <input
                  type="number"
                  name="area"
                  value={property.area}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="1500"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Image URL (optional)</label>
              <input
                type="url"
                name="imageUrl"
                value={property.imageUrl}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Adding Property...' : 'Add Property'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;