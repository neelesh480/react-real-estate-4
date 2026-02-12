import React, { useState } from 'react';
import { aiAPI } from '../services/api';

const DocumentSummarizer = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSummary('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setLoading(true);
    try {
      const response = await aiAPI.summarizeDocument(selectedImage);
      setSummary(response.summary);
    } catch (error) {
      console.error("Failed to summarize document:", error);
      alert("Failed to summarize document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 className="text-center" style={{ marginBottom: '2rem' }}>AI Legal Document Summarizer</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Upload Contract/Lease</h3>
          <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
            Upload a photo or scan of a legal document to get a simplified summary and identify potential red flags.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Select Document Image</label>
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
                  alt="Document Preview"
                  style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={!selectedImage || loading}
            >
              {loading ? 'Analyzing Document...' : 'Summarize Document'}
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: '2rem', minHeight: '400px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Document Summary</h3>

          {loading ? (
            <div className="text-center" style={{ marginTop: '4rem' }}>
              <div className="loading">Reading the fine print...</div>
              <p>Our AI lawyer is reviewing your document.</p>
            </div>
          ) : summary ? (
            <div style={{ lineHeight: '1.6' }}>
              <div dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/# (.*?)(<br\/>|$)/g, '<h3>$1</h3>') }} />
            </div>
          ) : (
            <div className="text-center" style={{ marginTop: '4rem', color: '#6b7280' }}>
              <p>Upload a document to see the summary here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSummarizer;
