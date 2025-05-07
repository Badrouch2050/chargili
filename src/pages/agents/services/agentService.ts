import axios from 'axios';
import { Agent, CreateAgentRequest, UpdateAgentRequest, AgentResponse, ApiError } from '../types';
import { getToken } from '../../../services/auth/tokenService';

const API_URL = 'http://localhost:8080/api/backoffice';

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

class AgentServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AgentServiceError';
    this.status = status;
  }
}

export const agentService = {
  // Récupérer la liste des agents
  getAgents: async (): Promise<Agent[]> => {
    try {
      const response = await api.get<Agent[]>('/agents');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AgentServiceError(
          error.response?.data?.message || 'Erreur lors de la récupération des agents',
          error.response?.status || 500
        );
      }
      throw new AgentServiceError('Une erreur est survenue', 500);
    }
  },

  // Créer un nouvel agent
  createAgent: async (agentData: CreateAgentRequest): Promise<AgentResponse> => {
    try {
      const response = await api.post<AgentResponse>('/agents', agentData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AgentServiceError(
          error.response?.data?.message || 'Erreur lors de la création de l\'agent',
          error.response?.status || 500
        );
      }
      throw new AgentServiceError('Une erreur est survenue', 500);
    }
  },

  // Modifier un agent
  updateAgent: async (id: number, agentData: UpdateAgentRequest): Promise<AgentResponse> => {
    try {
      const response = await api.put<AgentResponse>(`/agents/${id}`, agentData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AgentServiceError(
          error.response?.data?.message || 'Erreur lors de la modification de l\'agent',
          error.response?.status || 500
        );
      }
      throw new AgentServiceError('Une erreur est survenue', 500);
    }
  },

  // Supprimer un agent
  deleteAgent: async (id: number): Promise<void> => {
    try {
      await api.delete(`/agents/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AgentServiceError(
          error.response?.data?.message || 'Erreur lors de la suppression de l\'agent',
          error.response?.status || 500
        );
      }
      throw new AgentServiceError('Une erreur est survenue', 500);
    }
  }
}; 