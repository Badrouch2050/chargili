export interface User {
  id: number;
  nom: string;
  email: string;
  role: 'USER' | 'ADMIN';
  statut: string;
  methodeAuthentification: string;
  dateInscription: string;
  actif: boolean;
}

export interface Transaction {
  id: number;
  user: User;
  operateur: string;
  numeroCible: string;
  montant: number;
  devisePaiement: string;
  statut: string;
  stripeSessionId: string;
  dateDemande: string;
  dateTraitement: string;
  codeRecharge: string;
  agent: User;
  montantCarte: number;
  deviseCarte: string;
  tauxDeChange: number;
  fraisConversion: number;
  pays: string;
  commission: number;
  typeCommission: string;
  commissionBase: number;
  typeTraitement: 'AUTOMATIQUE' | 'MANUEL';
  typeRecharge: 'CARTE' | 'SOLDE';
}

export interface StockCard {
  id: number;
  operateur: string;
  montant: number;
  code: string;
  statut: 'DISPONIBLE' | 'UTILISE';
  dateAjout: string;
  dateUtilisation: string | null;
  utilisePourTransaction: Transaction | null;
  pays: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface StockCardResponse {
  content: StockCard[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  empty: boolean;
} 