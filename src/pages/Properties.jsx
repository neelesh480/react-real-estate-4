import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { propertyAPI } from '../services/api';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('All Properties');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const location = useLocation();
  const isAISearch = location.state && location.state.searchResults;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Check if we have AI search results passed in state
        if (isAISearch) {
          setProperties(location.state.searchResults);
          setTitle(`AI Search Results for: "${location.state.query}"`);
          setTotalPages(1); // AI search currently returns all results at once
          setTotalElements(location.state.searchResults.length);
        } else {
          // Fallback to fetching all properties with pagination
          const data = await propertyAPI.getProperties(page);
          setProperties(data.content);
          setTotalPages(data.totalPages);
          setTotalElements(data.totalElements);
          setTitle('All Properties');
        }
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [location.state, page, isAISearch]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        
        {loading && <div className="loading">Loading properties...</div>}
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && (
          <>
            <h1 style={{ marginBottom: '1rem' }}>{title}</h1>
            <div style={{ marginBottom: '2rem' }}>
              <p>{totalElements} properties found</p>
            </div>
            
            <div className="property-grid">
              {properties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {!isAISearch && totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
        
        {!loading && !error && properties.length === 0 && (
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <h2>No properties found</h2>
            <p>Try a different search or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
