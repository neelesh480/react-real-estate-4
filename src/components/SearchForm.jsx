import React, { useState } from 'react';
import { indianLocations } from '../data/locations';

const SearchForm = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    state: '',
    district: '',
    minPrice: '',
    maxPrice: '',
    propertyType: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchData = {
      ...searchParams,
      location: searchParams.district ? `${searchParams.district}, ${searchParams.state}` : searchParams.state
    };
    onSearch(searchData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'state') {
        newState.district = ''; // Reset district when state changes
      }
      return newState;
    });
  };

  return (
    <div className="search-section">
      <div className="container">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="form-group">
            <label className="form-label">State</label>
            <select name="state" value={searchParams.state} onChange={handleChange} className="form-input">
              <option value="">All States</option>
              {Object.keys(indianLocations).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">District</label>
            <select name="district" value={searchParams.district} onChange={handleChange} className="form-input" disabled={!searchParams.state}>
              <option value="">All Districts</option>
              {searchParams.state && indianLocations[searchParams.state].map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
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
              <option value="FLAT">Flat</option>
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