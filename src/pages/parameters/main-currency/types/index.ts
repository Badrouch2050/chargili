export interface MainCurrency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  active: boolean;
}

export interface CreateMainCurrencyDto {
  code: string;
  name: string;
  symbol: string;
}

export interface UpdateMainCurrencyDto {
  code?: string;
  name?: string;
  symbol?: string;
} 