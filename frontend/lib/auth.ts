import Cookies from 'js-cookie';
import api from './api';

export interface User {
  id: string;
  email: string;
}

export const login = async (email: string, password: string) => {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await api.post('/api/auth/login', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  if (response.data.access_token) {
    Cookies.set('token', response.data.access_token, { expires: 7 });
  }
  
  return response.data;
};

export const register = async (email: string, password: string) => {
  const response = await api.post('/api/auth/register', {
    email,
    password,
  });
  return response.data;
};

export const logout = () => {
  Cookies.remove('token');
  window.location.href = '/login';
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get('token');
};

