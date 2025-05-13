import axios from 'axios';
import { StockCardResponse, StockCard } from '../types/stockCard';
import { getToken } from '../../../services/auth/tokenService';
import { StockCardFormData } from '../components/StockCardForm';

const API_URL = 'http://localhost:8080/api/backoffice';

interface StockCardFilters {
  pays?: string;
  statut?: string;
  operateur?: string;
}

export const getStockCards = async (
  page: number = 0,
  size: number = 10,
  filters: StockCardFilters = {}
): Promise<StockCardResponse> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    // Ne pas inclure les filtres vides dans la requête
    const queryParams = {
      page,
      size,
      ...(filters.pays && { pays: filters.pays }),
      ...(filters.statut && { statut: filters.statut }),
      ...(filters.operateur && { operateur: filters.operateur })
    };

    const response = await axios.get(`${API_URL}/stock-cartes`, {
      params: queryParams,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
    throw error;
  }
};

export const getStockCardDetails = async (id: number): Promise<StockCard> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await axios.get(`${API_URL}/stock-cartes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la carte:', error);
    throw error;
  }
};

export const createStockCard = async (data: StockCardFormData): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    await axios.post(`${API_URL}/stock-cartes`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la carte:', error);
    throw error;
  }
};

export const updateStockCard = async (id: number, data: StockCardFormData): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    await axios.put(`${API_URL}/stock-cartes/${id}`, data, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Erreur lors de la modification de la carte:', error);
    throw error;
  }
};

export const deleteStockCard = async (id: number): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    await axios.delete(`${API_URL}/stock-cartes/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la carte:', error);
    throw error;
  }
}; 