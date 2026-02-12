import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { aiAPI } from '../services/api';

// Fix for default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const PropertyMap = ({ location }) => {
  const [position, setPosition] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [lifestyleScore, setLifestyleScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Geocode location to get lat/lon using a free service like Nominatim
        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`);
        const geoData = await geoResponse.json();

        if (geoData && geoData.length > 0) {
          const { lat, lon } = geoData[0];
          const pos = [parseFloat(lat), parseFloat(lon)];
          setPosition(pos);

          // 2. Fetch nearby amenities using Overpass API
          const overpassQuery = `
            [out:json];
            (
              node["amenity"~"school|cafe|restaurant|hospital|park"](around:1000, ${lat}, ${lon});
              way["amenity"~"school|cafe|restaurant|hospital|park"](around:1000, ${lat}, ${lon});
              relation["amenity"~"school|cafe|restaurant|hospital|park"](around:1000, ${lat}, ${lon});
            );
            out center;
          `;
          const overpassResponse = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
          const amenityData = await overpassResponse.json();
          setAmenities(amenityData.elements);

          // 3. Get AI Lifestyle Score
          const amenityList = amenityData.elements.map(a => a.tags.amenity).join(', ');
          const analysis = await aiAPI.getLifestyleScore(amenityList);
          setLifestyleScore(analysis);
        }
      } catch (error) {
        console.error("Failed to fetch map data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  if (loading) return <div className="loading">Loading Map & Amenities...</div>;
  if (!position) return <div className="error">Could not find location on map.</div>;

  const getHeatmapColor = () => {
    if (!lifestyleScore) return 'rgba(0, 0, 255, 0.2)';
    const score = lifestyleScore.familyFriendlyScore + lifestyleScore.youngProfessionalScore;
    if (score > 15) return 'rgba(0, 255, 0, 0.4)'; // Green
    if (score > 10) return 'rgba(255, 255, 0, 0.4)'; // Yellow
    return 'rgba(255, 0, 0, 0.4)'; // Red
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        📍 Location & Lifestyle
      </h3>

      {lifestyleScore && (
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', justifyContent: 'center' }}>
          <div><strong>Family Friendly Score:</strong> {lifestyleScore.familyFriendlyScore}/10</div>
          <div><strong>Young Professional Score:</strong> {lifestyleScore.youngProfessionalScore}/10</div>
        </div>
      )}

      <MapContainer center={position} zoom={15} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>This is the property location.</Popup>
        </Marker>

        {amenities.map(amenity => (
          <Marker
            key={amenity.id}
            position={[amenity.lat || amenity.center.lat, amenity.lon || amenity.center.lon]}
            icon={L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/992/992700.png', iconSize: [25, 25] })}
          >
            <Popup>{amenity.tags.name || amenity.tags.amenity}</Popup>
          </Marker>
        ))}

        <Circle center={position} radius={1000} pathOptions={{ color: getHeatmapColor(), fillColor: getHeatmapColor() }} />
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
