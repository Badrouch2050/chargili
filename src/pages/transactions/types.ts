export type TransactionStatus = 'VALIDEE' | 'EN_ATTENTE' | 'ECHOUEE';
export type TransactionType = 'AUTOMATIQUE' | 'MANUELLE';
export type ExportFormat = 'CSV' | 'EXCEL' | 'PDF';
export type Currency = 'XOF' | 'EUR' | 'USD';

export interface Client {
  id: number;
  nom: string;
  email: string;
  telephone?: string;
}

export interface Transaction {
  id: number;
  numero: string;
  montant: number;
  frais: number;
  devisePaiement: Currency;
  operateur: string;
  pays: string;
  statut: TransactionStatus;
  typeTraitement: TransactionType;
  dateDemande: string;
  client: Client;
}

export interface TransactionListItem {
  id: number;
  numero: string;
  montant: number;
  devisePaiement: Currency;
  operateur: string;
  pays: string;
  statut: TransactionStatus;
  typeTraitement: TransactionType;
  dateDemande: string;
  clientNom: string;
  clientId: number;
}

export interface TransactionDetails {
  id: number;
  numero?: string;
  operateur: string;
  numeroCible: string;
  montant: number;
  devisePaiement: Currency;
  statut: TransactionStatus;
  dateDemande: string;
  dateTraitement?: string;
  typeTraitement: TransactionType;
  agentNom?: string;
  agentEmail?: string;
  montantCarte: number;
  deviseCarte: Currency;
  tauxDeChange: number;
  fraisConversion: number;
  pays: string;
  commission: number;
  typeCommission: string;
  commissionBase: number;
  clientNom: string;
  clientEmail: string;
  frais: number;
  client: Client;
  historiqueStatuts: Array<{
    statut: TransactionStatus;
    date: string;
    commentaire?: string;
  }>;
}

export interface TransactionFilter {
  statut?: string;
  typeTraitement?: string;
  operateur?: string;
  pays?: string;
  agentId?: number;
  dateDebut?: string;
  dateFin?: string;
  montantMin?: number;
  montantMax?: number;
  page?: number;
  size?: number;
  format?: string;
  nomFichier?: string;
}

export interface TransactionStatusUpdate {
  statut: TransactionStatus;
  commentaire?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface TransactionResponse extends PaginatedResponse<Transaction> {}

export interface TransactionError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}

export interface TransactionListResponse {
  content: TransactionListItem[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  devisePaiement: Currency;
}

export interface TransactionDetailsResponse {
  id: number;
  numero: string;
  montant: number;
  frais: number;
  devisePaiement: Currency;
  operateur: string;
  pays: string;
  statut: TransactionStatus;
  typeTraitement: TransactionType;
  dateDemande: string;
  dateTraitement?: string;
  client: Client;
  historiqueStatuts: Array<{
    statut: TransactionStatus;
    date: string;
    commentaire?: string;
  }>;
}

export interface TransactionStatusUpdate {
  statut: 'VALIDEE' | 'EN_ATTENTE' | 'ECHOUEE';
  commentaire?: string;
}

export interface TransactionExport {
  id: number;
  numero: string;
  montant: number;
  devisePaiement: string;
  statut: string;
  typeTraitement: string;
  operateur: string;
  pays: string;
  dateDemande: string;
  dateTraitement?: string;
  reference?: string;
  frais: number;
  clientNom: string;
  clientEmail: string;
  agentNom?: string;
  agentEmail?: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface TransactionPage {
  content: Transaction[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  empty: boolean;
} 