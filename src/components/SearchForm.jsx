import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="search-section">
      <div className="container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={searchParams.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={searchParams.minPrice}
              onChange={handleChange}
              placeholder="Min price"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={searchParams.maxPrice}
              onChange={handleChange}
              placeholder="Max price"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Property Type</label>
            <select
              name="propertyType"
              value={searchParams.propertyType}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">All Types</option>
              <option value="HOUSE">House</option>
              <option value="APARTMENT">Apartment</option>
              <option value="CONDO">Condo</option>
              <option value="TOWNHOUSE">Townhouse</option>
            </select>
          </div>
          
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;