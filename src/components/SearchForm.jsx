import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../services/api';

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;

    setIsLoading(true);
    try {
      const properties = await aiAPI.searchProperties(query);
      navigate('/properties', { state: { searchResults: properties, query } });
    } catch (error) {
      console.error("AI search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setImageAnalysis(null);
    try {
      const analysis = await aiAPI.searchByImage(file);
      setImageAnalysis(analysis);

      // Construct a search query from the analysis
      let newQuery = "";
      if (analysis.style) newQuery += `${analysis.style} style property `;
      if (analysis.features && analysis.features.length > 0) {
        newQuery += `with ${analysis.features.join(', ')}`;
      }
      setQuery(newQuery);

    } catch (error) {
      console.error("Image analysis failed:", error);
      alert("Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-section" style={{ padding: "2rem 0" }}>
      <div className="container">
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          Let AI Find Your Dream Home
        </h2>
        <p style={{ textAlign: "center", marginBottom: "2rem", color: "#666" }}>
          Describe your dream home or upload a photo!
        </p>

        <form onSubmit={handleSearch} className="ai-search-form" style={{ position: 'relative' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe your perfect property..."
            className="ai-search-input"
            disabled={isLoading}
          />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageUpload}
          />

          <button
            type="button"
            className="ai-search-button"
            style={{ backgroundColor: '#6b7280', borderRight: '1px solid #fff' }}
            onClick={() => fileInputRef.current.click()}
            disabled={isLoading}
            title="Search by Image"
          >
            📷
          </button>

          <button type="submit" className="ai-search-button" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {imageAnalysis && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #bae6fd',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <h4 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>Image Analysis Result:</h4>
            <p><strong>Style:</strong> {imageAnalysis.style}</p>
            <p><strong>Features:</strong> {imageAnalysis.features?.join(', ')}</p>
            <p><strong>Est. Price:</strong> {imageAnalysis.estimatedPriceRange}</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
              * Search query has been auto-filled based on this analysis. Click Search to find properties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
