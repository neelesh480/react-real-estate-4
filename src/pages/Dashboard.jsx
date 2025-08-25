import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { propertyAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const properties = await propertyAPI.getUserProperties();
        setUserProperties(properties);
      } catch (err) {
        setError('Failed to load your properties');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyAPI.deleteProperty(propertyId);
        setUserProperties(userProperties.filter(p => p.id !== propertyId));
      } catch (err) {
        setError('Failed to delete property');
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <Link to="/add-property" className="btn btn-primary">
          Add New Property
        </Link>
      </div>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-body">
          <h2>Welcome, {user?.firstName} {user?.lastName}!</h2>
          <p>Manage your property listings below.</p>
        </div>
      </div>

      <h2>Your Properties</h2>
      
      {loading && <div className="loading">Loading your properties...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && !error && userProperties.length === 0 && (
        <div className="card">
          <div className="card-body text-center">
            <p>You haven't listed any properties yet.</p>
            <Link to="/add-property" className="btn btn-primary mt-2">
              Add Your First Property
            </Link>
          </div>
        </div>
      )}
      
      {!loading && !error && userProperties.length > 0 && (
        <div className="property-grid">
          {userProperties.map(property => (
            <div key={property.id} className="card">
              <img 
                src={property.imageUrl || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                alt={property.title}
                className="property-image"
              />
              <div className="card-body">
                <h3>{property.title}</h3>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                  {property.location}
                </p>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem' }}>
                  {formatPrice(property.price)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link 
                    to={`/properties/${property.id}`} 
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => handleDelete(property.id)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;