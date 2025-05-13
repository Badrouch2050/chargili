import { api } from '../../../../common/services/api';
import { Operator, CreateOperatorDto, UpdateOperatorDto, OperatorFilter } from '../types';
import axios from 'axios';

class OperatorServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'OperatorServiceError';
  }
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Une erreur est survenue';
    throw new OperatorServiceError(message, status);
  }
  throw new OperatorServiceError('Une erreur inattendue est survenue');
};

export const getOperators = async (filters?: OperatorFilter): Promise<Operator[]> => {
  try {
    const response = await api.get('/api/backoffice/operators', { params: filters });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getAllOperators = async (): Promise<Operator[]> => {
  try {
    const response = await api.get('/api/backoffice/operators/all');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getOperator = async (id: number): Promise<Operator> => {
  try {
    const response = await api.get(`/api/backoffice/operators/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createOperator = async (data: CreateOperatorDto): Promise<Operator> => {
  try {
    const response = await api.post('/api/backoffice/operators', data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateOperator = async (id: number, data: UpdateOperatorDto): Promise<Operator> => {
  try {
    const response = await api.put(`/api/backoffice/operators/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const toggleOperator = async (id: number, actif: boolean): Promise<Operator> => {
  try {
    const response = await api.put(`/api/backoffice/operators/${id}/activation`, { actif });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteOperator = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/backoffice/operators/${id}`);
  } catch (error) {
    throw handleError(error);
  }
}; 