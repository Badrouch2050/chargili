import axios from 'axios';
import {
  Transaction,
  TransactionDetails,
  TransactionFilter,
  TransactionResponse,
  TransactionStatusUpdate
} from '../types';
import { getToken } from '../../../services/auth/tokenService';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/backoffice';

// Création d'une instance axios avec intercepteur
const api = axios.create({
  baseURL: API_BASE_URL,
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

// Classe d'erreur personnalisée
class TransactionServiceError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'TransactionServiceError';
  }
}

const transactionService = {
  /**
   * Récupère la liste des transactions avec pagination et filtres
   */
  async getTransactions(filter: TransactionFilter): Promise<TransactionResponse> {
    const response = await api.post<TransactionResponse>(
      '/transactions/filter',
      {
        statut: filter.statut,
        typeTraitement: filter.typeTraitement,
        operateur: filter.operateur,
        pays: filter.pays,
        agentId: filter.agentId,
        dateDebut: filter.dateDebut,
        dateFin: filter.dateFin,
        montantMin: filter.montantMin,
        montantMax: filter.montantMax,
        page: filter.page,
        size: filter.size
      }
    );
    return response.data;
  },

  /**
   * Récupère les transactions d'un agent spécifique
   */
  async getAgentTransactions(agentId: number, filter: TransactionFilter): Promise<TransactionResponse> {
    const response = await api.post<TransactionResponse>(
      `/transactions/agent/${agentId}/filter`,
      {
        page: filter.page,
        size: filter.size
      }
    );
    return response.data;
  },

  /**
   * Récupère les transactions automatiques
   */
  async getAutomaticTransactions(filter: TransactionFilter): Promise<TransactionResponse> {
    const response = await api.post<TransactionResponse>(
      '/transactions/automatic/filter',
      {
        page: filter.page,
        size: filter.size
      }
    );
    return response.data;
  },

  /**
   * Récupère les détails d'une transaction
   */
  async getTransactionDetails(id: number): Promise<TransactionDetails> {
    const response = await api.get<TransactionDetails>(
      `/transactions/${id}`
    );
    return response.data;
  },

  /**
   * Met à jour le statut d'une transaction
   */
  async updateTransactionStatus(
    id: number,
    statusUpdate: TransactionStatusUpdate
  ): Promise<TransactionDetails> {
    const response = await api.put<TransactionDetails>(
      `/transactions/${id}/status`,
      statusUpdate
    );
    return response.data;
  },

  /**
   * Assign une transaction à un agent
   */
  async assignTransactionToAgent(
    id: number,
    agentId: number
  ): Promise<TransactionDetails> {
    const response = await api.put<TransactionDetails>(
      `/transactions/${id}/assign`,
      { agentId }
    );
    return response.data;
  },

  /**
   * Exporte les transactions selon les filtres
   */
  async exportTransactions(filter: TransactionFilter): Promise<Blob> {
    const response = await api.post(
      '/transactions/export',
      {
        statut: filter.statut,
        typeTraitement: filter.typeTraitement,
        operateur: filter.operateur,
        pays: filter.pays,
        agentId: filter.agentId,
        dateDebut: filter.dateDebut,
        dateFin: filter.dateFin,
        montantMin: filter.montantMin,
        montantMax: filter.montantMax,
        format: filter.format,
        nomFichier: filter.nomFichier
      },
      {
        responseType: 'blob'
      }
    );

    // Création du blob et téléchargement
    const blob = new Blob([response.data], {
      type: response.headers['content-type']
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filter.nomFichier || 'transactions_export';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return blob;
  }
};

export default transactionService; 