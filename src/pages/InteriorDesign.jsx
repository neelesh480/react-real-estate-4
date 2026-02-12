import React, { useState } from 'react';
import { aiAPI } from '../services/api';

const InteriorDesign = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [style, setStyle] = useState('Modern');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAdvice('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setLoading(true);
    try {
      const response = await aiAPI.generateInteriorDesign(selectedImage, style);
      setAdvice(response.advice);
    } catch (error) {
      console.error("Failed to generate design advice:", error);
      alert("Failed to generate advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 className="text-center" style={{ marginBottom: '2rem' }}>AI Interior Design Consultant</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Upload Your Room</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select an Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-input"
              />
            </div>

            {previewUrl && (
              <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
                <img
                  src={previewUrl}
                  alt="Room Preview"
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Choose a Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="form-input"
              >
                <option value="Modern">Modern</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Bohemian">Bohemian</option>
                <option value="Industrial">Industrial</option>
                <option value="Scandinavian">Scandinavian</option>
                <option value="Traditional">Traditional</option>
                <option value="Rustic">Rustic</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={!selectedImage || loading}
            >
              {loading ? 'Generating Design Plan...' : 'Get Design Advice'}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: '2rem', minHeight: '400px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Your Design Plan</h3>

          {loading ? (
            <div className="text-center" style={{ marginTop: '4rem' }}>
              <div className="loading">Analyzing your room...</div>
              <p>Our AI designer is crafting a custom plan for you.</p>
            </div>
          ) : advice ? (
            <div style={{ lineHeight: '1.6' }}>
              <div dangerouslySetInnerHTML={{ __html: advice.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/# (.*?)(<br\/>|$)/g, '<h3>$1</h3>') }} />
            </div>
          ) : (
            <div className="text-center" style={{ marginTop: '4rem', color: '#6b7280' }}>
              <p>Upload an image and select a style to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteriorDesign;
