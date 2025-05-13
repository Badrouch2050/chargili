import axios from 'axios';
import { RechargeStockResponse, RechargeStock } from '../types/rechargeStock';
import { getToken } from '../../../services/auth/tokenService';
 

const API_URL = 'http://localhost:8080/api/backoffice';

interface RechargeStockFilters {
  pays?: string;
  operateur?: string;
}

export const getRechargeStocks = async (
  page: number = 0,
  size: number = 10,
  filters: RechargeStockFilters = {}
): Promise<RechargeStockResponse> => {
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
      ...(filters.operateur && { operateur: filters.operateur })
    };

    const response = await axios.get(`${API_URL}/recharge-stocks`, {
      params: queryParams,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du stock de recharges:', error);
    throw error;
  }
};

export const getRechargeStockDetails = async (id: number): Promise<RechargeStock> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    const response = await axios.get(`${API_URL}/recharge-stocks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du stock de recharges:', error);
    throw error;
  }
};

export const createRechargeStock = async (data: {
  pays: string;
  operateur: string;
  montant: number;
}): Promise<RechargeStock> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token non trouvé');
  }
  const response = await axios.post(`${API_URL}/recharge-stocks`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateRechargeStock = async (id: number, data: {
  pays: string;
  operateur: string;
  montant: number;
}): Promise<RechargeStock> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token non trouvé');
  }
  const response = await axios.post(`${API_URL}/recharge-stocks/add`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteRechargeStock = async (id: number): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token non trouvé');
    }

    await axios.delete(`${API_URL}/recharge-stocks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du stock de recharges:', error);
    throw error;
  }
};

export const getRechargeStocksPage = async (page: number, size: number): Promise<RechargeStockResponse> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token non trouvé');
  }
  const response = await axios.get(`${API_URL}/recharge-stocks`, {
    params: { page, size },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}; 