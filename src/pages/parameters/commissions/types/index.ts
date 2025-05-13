export type CommissionType = 'POURCENTAGE' | 'FIXE';

export interface Commission {
  id: number;
  pays: string;
  operateur: string | null;
  typeCommission: CommissionType;
  valeur: number;
  actif: boolean;
}

export interface CreateCommissionDto {
  pays: string;
  operateur?: string;
  typeCommission: CommissionType;
  valeur: number;
  actif: boolean;
}

export interface UpdateCommissionDto {
  pays?: string;
  operateur?: string;
  typeCommission?: CommissionType;
  valeur?: number;
  actif?: boolean;
}

export interface CommissionFilter {
  pays?: string;
  operateur?: string;
  typeCommission?: CommissionType;
} 