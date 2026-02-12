import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyAPI } from '../services/api';
import { indianLocations } from '../data/locations';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState({
    title: '',
    description: '',
    state: '',
    district: '',
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

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await propertyAPI.getProperty(id);
        const [district, state] = data.location.split(', ');
        setProperty({ ...data, state, district });
      } catch (err) {
        setError('Failed to load property data.');
      }
    };
    fetchProperty();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const propertyData = {
        ...property,
        location: `${property.district}, ${property.state}`
      };
      await propertyAPI.updateProperty(id, propertyData);
      setSuccess('Property updated successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'state') {
        newState.district = ''; // Reset district when state changes
      }
      return newState;
    });
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="card-header">
          <h1>Edit Property</h1>
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
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <select name="state" value={property.state} onChange={handleChange} required className="form-input">
                <option value="">Select State</option>
                {Object.keys(indianLocations).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">District</label>
              <select name="district" value={property.district} onChange={handleChange} required className="form-input" disabled={!property.state}>
                <option value="">Select District</option>
                {property.state && indianLocations[property.state]?.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (INR)</label>
              <input
                type="number"
                name="price"
                value={property.price}
                onChange={handleChange}
                required
                className="form-input"
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
                <option value="FLAT">Flat</option>
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
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Updating Property...' : 'Update Property'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;