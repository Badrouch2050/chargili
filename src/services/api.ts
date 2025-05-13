import axios from 'axios';
import { getToken } from './auth/tokenService';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erreur avec réponse du serveur
      const { status, data } = error.response;
      
      if (status === 401) {
        // Token expiré ou invalide
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(data.message || 'Une erreur est survenue'));
    }
    
    // Erreur sans réponse du serveur
    return Promise.reject(new Error('Erreur de connexion au serveur'));
  }
);

export default api; 