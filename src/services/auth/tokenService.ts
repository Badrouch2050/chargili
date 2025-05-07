import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
  roles: string[];
}

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded: TokenPayload = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getTokenPayload = (token: string): TokenPayload | null => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}; 