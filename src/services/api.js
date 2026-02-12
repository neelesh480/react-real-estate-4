import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Property API
export const propertyAPI = {
  getProperties: async (page = 0, size = 10) => {
    const response = await api.get("/properties", {
      params: { page, size }
    });
    return response.data;
  },

  getProperty: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData) => {
    const response = await api.post("/properties", propertyData);
    return response.data;
  },

  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  getUserProperties: async () => {
    const response = await api.get("/properties/user");
    return response.data;
  },

  searchProperties: async (searchParams, page = 0, size = 10) => {
    const response = await api.get("/properties/search", {
      params: { ...searchParams, page, size },
    });
    return response.data;
  },
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// AI API
export const aiAPI = {
  getChatResponse: async (question) => {
    const response = await api.post('/ai/chat', { question });
    return response.data;
  },
  generateDescription: async (details) => {
    const response = await api.post('/ai/generate-description', { details });
    return response.data;
  },
  searchProperties: async (query) => {
    const response = await api.post('/ai/search', { query });
    return response.data;
  },
  getNeighborhoodInsights: async (location) => {
    const response = await api.post('/ai/neighborhood-insights', { location });
    return response.data;
  },
  searchByImage: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post('/ai/search-by-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  generateInteriorDesign: async (imageFile, style) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('style', style);
    const response = await api.post('/ai/interior-design', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  generateInvestmentAnalysis: async (details) => {
    const response = await api.post('/ai/investment-analysis', { details });
    return response.data;
  },
  generateOfferLetter: async (details, offerAmount, conditions) => {
    const response = await api.post('/ai/generate-offer-letter', { details, offerAmount, conditions });
    return response.data;
  },
  summarizeDocument: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.post('/ai/summarize-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  getLifestyleScore: async (amenityList) => {
    const response = await api.post('/ai/lifestyle-score', { amenityList });
    return response.data;
  }
};


export default api;
