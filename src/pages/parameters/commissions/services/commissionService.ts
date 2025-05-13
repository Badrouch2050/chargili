import { api } from '../../../../common/services/api';
import { Commission, CreateCommissionDto, UpdateCommissionDto, CommissionFilter } from '../types';
import axios from 'axios';

class CommissionServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'CommissionServiceError';
  }
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Une erreur est survenue';
    throw new CommissionServiceError(message, status);
  }
  throw new CommissionServiceError('Une erreur inattendue est survenue');
};

export const getCommissions = async (filters?: CommissionFilter): Promise<Commission[]> => {
  try {
    const response = await api.get('/api/backoffice/commissions', { params: filters });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getCommission = async (id: number): Promise<Commission> => {
  try {
    const response = await api.get(`/api/backoffice/commissions/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createCommission = async (data: CreateCommissionDto): Promise<Commission> => {
  try {
    const response = await api.post('/api/backoffice/commissions', data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCommission = async (id: number, data: UpdateCommissionDto): Promise<Commission> => {
  try {
    const response = await api.put(`/api/backoffice/commissions/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteCommission = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/backoffice/commissions/${id}`);
  } catch (error) {
    throw handleError(error);
  }
}; 