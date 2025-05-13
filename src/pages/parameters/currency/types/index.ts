export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  active: boolean;
  region: string;
  priority: number;
}

export interface CreateCurrencyDto {
  code: string;
  name: string;
  symbol: string;
  active: boolean;
  region: string;
  priority: number;
}

export interface UpdateCurrencyDto extends CreateCurrencyDto {} 