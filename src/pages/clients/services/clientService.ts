import axios from 'axios';
import { 
  ClientListResponse, 
  ClientDetails, 
  ClientSearchParams
} from '../types';
import { getToken } from '../../../services/auth/tokenService';

const API_URL = 'http://localhost:8080/api/backoffice/clients';

// Création d'une instance axios avec intercepteur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token à chaque requête
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

class ClientServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ClientServiceError';
    this.status = status;
  }
}

export const clientService = {
  // Récupérer la liste des clients avec pagination
  getClients: async (page: number = 0, size: number = 10): Promise<ClientListResponse> => {
    try {
      const response = await api.get<ClientListResponse>(`?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ClientServiceError(
          error.response?.data?.message || 'Erreur lors de la récupération des clients',
          error.response?.status || 500
        );
      }
      throw new ClientServiceError('Une erreur est survenue', 500);
    }
  },

  // Récupérer les détails d'un client
  getClientDetails: async (id: number): Promise<ClientDetails> => {
    try {
      const response = await api.get<ClientDetails>(`/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ClientServiceError(
          error.response?.data?.message || 'Erreur lors de la récupération des détails du client',
          error.response?.status || 500
        );
      }
      throw new ClientServiceError('Une erreur est survenue', 500);
    }
  },

  // Rechercher des clients avec filtres
  searchClients: async (params: ClientSearchParams): Promise<ClientListResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      // Ajout des paramètres de recherche
      if (params.nom) queryParams.append('nom', params.nom);
      if (params.email) queryParams.append('email', params.email);
      if (params.statut) queryParams.append('statut', params.statut);
      if (params.dateDebut) queryParams.append('dateDebut', params.dateDebut);
      if (params.dateFin) queryParams.append('dateFin', params.dateFin);
      
      // Paramètres de pagination
      queryParams.append('page', String(params.page || 0));
      queryParams.append('size', String(params.size || 10));
      if (params.sort) queryParams.append('sort', params.sort);

      const response = await api.get<ClientListResponse>(`/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ClientServiceError(
          error.response?.data?.message || 'Erreur lors de la recherche des clients',
          error.response?.status || 500
        );
      }
      throw new ClientServiceError('Une erreur est survenue', 500);
    }
  }
}; 