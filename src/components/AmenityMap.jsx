import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { aiAPI } from '../services/api';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const AmenityMap = ({ location }) => {
  const [amenities, setAmenities] = useState([]);
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!location) return;

      try {
        // 1. Geocode location to get coordinates
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
        const geoData = await geoResponse.json();
        if (geoData.length === 0) {
          throw new Error("Could not find coordinates for the location.");
        }
        const lat = parseFloat(geoData[0].lat);
        const lon = parseFloat(geoData[0].lon);
        setCoords([lat, lon]);

        // 2. Fetch amenities from Overpass API
        const overpassQuery = `
          [out:json];
          (
            node["amenity"~"school|hospital|restaurant|cafe|bar|pub|pharmacy|bank|atm|post_office|cinema|theatre|park|playground|gym|supermarket|convenience"](around:1000, ${lat}, ${lon});
            way["amenity"~"school|hospital|restaurant|cafe|bar|pub|pharmacy|bank|atm|post_office|cinema|theatre|park|playground|gym|supermarket|convenience"](around:1000, ${lat}, ${lon});
            relation["amenity"~"school|hospital|restaurant|cafe|bar|pub|pharmacy|bank|atm|post_office|cinema|theatre|park|playground|gym|supermarket|convenience"](around:1000, ${lat}, ${lon});
          );
          out center;
        `;
        const overpassResponse = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
        const overpassData = await overpassResponse.json();

        const amenityList = overpassData.elements.map(el => el.tags.amenity);
        setAmenities(overpassData.elements);

        // 3. Get AI lifestyle scores
        if (amenityList.length > 0) {
          const scoreResponse = await aiAPI.getLifestyleScore(amenityList.join(', '));
          setScores(scoreResponse);
        }
      } catch (error) {
        console.error("Failed to fetch amenity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  const getHeatmapColor = () => {
    if (!amenities) return '#ffffff00';
    const density = amenities.length;
    if (density > 50) return '#ff000099'; // Red for very high density
    if (density > 30) return '#ff450099'; // OrangeRed
    if (density > 15) return '#ffa50099'; // Orange
    if (density > 5) return '#ffff0099';  // Yellow
    return '#00800099'; // Green for low density
  };

  if (loading) return <div className="loading">Loading Amenity Map...</div>;
  if (!coords) return <div className="error">Could not display map for this location.</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        AI-Powered Amenity Heatmap
      </h3>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1, height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
          <MapContainer center={coords} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={coords}>
              <Popup>{location}</Popup>
            </Marker>
            <Circle center={coords} radius={1000} pathOptions={{ color: getHeatmapColor(), fillColor: getHeatmapColor() }} />
          </MapContainer>
        </div>
        <div style={{ flex: 1 }}>
          <h4>Lifestyle Scores:</h4>
          {scores ? (
            <div>
              <p><strong>Family Friendly:</strong> {scores.familyFriendlyScore}/10</p>
              <p><strong>Young Professional:</strong> {scores.youngProfessionalScore}/10</p>
            </div>
          ) : (
            <p>No scores available.</p>
          )}
          <h4 style={{ marginTop: '1rem' }}>Top 5 Nearby Amenities ({amenities.length} total):</h4>
          <ul style={{ maxHeight: '280px', overflowY: 'auto', paddingLeft: '20px' }}>
            {amenities.slice(0, 5).map(amenity => (
              <li key={amenity.id}>{amenity.tags.name || amenity.tags.amenity}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AmenityMap;
