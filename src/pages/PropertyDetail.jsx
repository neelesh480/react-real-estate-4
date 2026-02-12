import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyAPI, aiAPI } from '../services/api';
import { jsPDF } from "jspdf";
import AmenityMap from '../components/AmenityMap';

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
  const [neighborhoodInsights, setNeighborhoodInsights] = useState('');
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [investmentAnalysis, setInvestmentAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [showAmenityMap, setShowAmenityMap] = useState(false);

  // Offer Letter State
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerConditions, setOfferConditions] = useState('');
  const [offerLetter, setOfferLetter] = useState('');
  const [loadingLetter, setLoadingLetter] = useState(false);

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

  const handleGetInsights = async () => {
    if (!property || !property.location) return;
    setLoadingInsights(true);
    try {
      const insights = await aiAPI.getNeighborhoodInsights(property.location);
      setNeighborhoodInsights(insights.report);
    } catch (aiError) {
      console.error("Failed to load neighborhood insights", aiError);
      alert("Failed to load insights. Please try again.");
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleAnalyzeInvestment = async () => {
    if (!property) return;
    setLoadingAnalysis(true);
    try {
      const details = `Price: ${property.price}, Location: ${property.location}, Type: ${property.propertyType}, Bedrooms: ${property.bedrooms}, Bathrooms: ${property.bathrooms}, Area: ${property.area}`;
      const analysis = await aiAPI.generateInvestmentAnalysis(details);
      setInvestmentAnalysis(analysis);
    } catch (error) {
      console.error("Failed to generate investment analysis", error);
      alert("Failed to generate analysis. Please try again.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleGenerateOffer = async (e) => {
    e.preventDefault();
    if (!property) return;

    setLoadingLetter(true);
    try {
      const details = `Address: ${property.location}, Type: ${property.propertyType}, Asking Price: ${property.price}`;
      const response = await aiAPI.generateOfferLetter(details, offerAmount, offerConditions);
      setOfferLetter(response.letter);
    } catch (error) {
      console.error("Failed to generate offer letter", error);
      alert("Failed to generate offer letter. Please try again.");
    } finally {
      setLoadingLetter(false);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Offer Letter", 105, 20, null, null, "center");

    // Add content
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(offerLetter, 180);
    doc.text(splitText, 15, 40);

    // Save the PDF
    doc.save("Offer_Letter.pdf");
  };

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
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link to="/properties" style={{ marginBottom: '1rem', display: 'inline-block', color: '#2563eb', textDecoration: 'none' }}>
        ← Back to Properties
      </Link>
      
      <div className="card">
        <div style={{ height: '400px', overflow: 'hidden' }}>
          <img
            src={property.imageUrl || getDefaultImage(property.bedrooms)}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{property.title}</h1>
              <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
                📍 {property.location}
              </p>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
              {formatPrice(property.price)}
            </div>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div className="text-center">
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Type</div>
              <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{property.propertyType || 'House'}</div>
            </div>
            <div className="text-center">
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Bedrooms</div>
              <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{property.bedrooms || '-'}</div>
            </div>
            <div className="text-center">
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Bathrooms</div>
              <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{property.bathrooms || '-'}</div>
            </div>
            <div className="text-center">
              <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Area</div>
              <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{property.area ? `${property.area} sq ft` : '-'}</div>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🗺️</span> AI-Powered Amenity Heatmap
            </h3>
            {!showAmenityMap ? (
              <button
                onClick={() => setShowAmenityMap(true)}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Load Amenity Map
              </button>
            ) : (
              <AmenityMap location={property.location} />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>Description</h3>
              <p style={{ lineHeight: '1.8', color: '#374151' }}>
                {property.description || 'No description available.'}
              </p>

              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📈</span> AI Investment Analysis
                </h3>
                {!investmentAnalysis ? (
                  <button
                    onClick={handleAnalyzeInvestment}
                    className="btn btn-primary"
                    disabled={loadingAnalysis}
                  >
                    {loadingAnalysis ? 'Analyzing...' : 'Analyze Investment Potential'}
                  </button>
                ) : (
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0',
                    color: '#166534'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <strong>Rental Yield:</strong> {investmentAnalysis.rentalYield}
                      </div>
                      <div>
                        <strong>Cash Flow:</strong> {investmentAnalysis.cashFlow}
                      </div>
                      <div style={{ gridColumn: 'span 2' }}>
                        <strong>Appreciation Forecast:</strong> {investmentAnalysis.appreciationForecast}
                      </div>
                    </div>
                    <p><strong>Risk Assessment:</strong> {investmentAnalysis.riskAssessment}</p>
                    <div style={{ marginTop: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Investment Rating: <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: investmentAnalysis.investmentRating === 'Buy' ? '#22c55e' : '#eab308',
                        color: 'white'
                      }}>{investmentAnalysis.investmentRating}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🤖</span> AI Neighborhood Insights
              </h3>

              {!neighborhoodInsights ? (
                <button
                  onClick={handleGetInsights}
                  className="btn btn-secondary"
                  style={{ width: '100%', marginBottom: '2rem' }}
                  disabled={loadingInsights}
                >
                  {loadingInsights ? 'Generating Insights...' : 'Get Neighborhood Insights'}
                </button>
              ) : (
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#eff6ff',
                  borderRadius: '8px',
                  border: '1px solid #dbeafe',
                  lineHeight: '1.7',
                  color: '#1e40af',
                  marginBottom: '2rem'
                }}>
                  <div dangerouslySetInnerHTML={{ __html: neighborhoodInsights.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic' }}>
                    * Insights generated by AI based on location data.
                  </div>
                </div>
              )}

              <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📝</span> Smart Negotiation Assistant
              </h3>

              {!showOfferForm ? (
                <button
                  onClick={() => setShowOfferForm(true)}
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  Draft Offer Letter
                </button>
              ) : (
                <div style={{ padding: '1.5rem', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #fed7aa' }}>
                  <form onSubmit={handleGenerateOffer}>
                    <div className="form-group">
                      <label className="form-label">Your Offer Amount</label>
                      <input
                        type="text"
                        className="form-input"
                        value={offerAmount}
                        onChange={(e) => setOfferAmount(e.target.value)}
                        placeholder="e.g. 1.5 Crores"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Conditions / Notes</label>
                      <textarea
                        className="form-input"
                        value={offerConditions}
                        onChange={(e) => setOfferConditions(e.target.value)}
                        placeholder="e.g. Subject to inspection, flexible closing date..."
                        rows="3"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', marginBottom: '1rem' }}
                      disabled={loadingLetter}
                    >
                      {loadingLetter ? 'Drafting Letter...' : 'Generate Letter'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ width: '100%' }}
                      onClick={() => setShowOfferForm(false)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              )}

              {offerLetter && (
                <div style={{
                  marginTop: '1.5rem',
                  padding: '1.5rem',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                }}>
                  <h4 style={{ marginBottom: '1rem' }}>Generated Offer Letter:</h4>
                  <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'serif', lineHeight: '1.6' }}>
                    {offerLetter}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      className="btn btn-outline"
                      style={{ flex: 1 }}
                      onClick={() => {navigator.clipboard.writeText(offerLetter); alert('Copied to clipboard!');}}
                    >
                      Copy to Clipboard
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      onClick={handleDownloadPDF}
                    >
                      Download PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
