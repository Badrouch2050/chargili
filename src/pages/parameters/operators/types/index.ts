export type OperatorStatus = 'ACTIF' | 'INACTIF';

export interface Operator {
  id: number;
  nom: string;
  pays: string;
  codeDetection: string;
  statut: OperatorStatus;
  logoUrl: string;
  actif: boolean;
}

export interface CreateOperatorDto {
  nom: string;
  pays: string;
  codeDetection: string;
  statut: OperatorStatus;
  logoUrl: string;
  actif: boolean;
}

export interface UpdateOperatorDto {
  nom?: string;
  pays?: string;
  codeDetection?: string;
  statut?: OperatorStatus;
  logoUrl?: string;
}

export interface OperatorFilter {
  pays?: string;
} 