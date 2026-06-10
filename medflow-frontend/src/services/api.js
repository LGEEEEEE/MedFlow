import axios from 'axios';

const PORT = MediaMetadata.env.PORT || 3001

export const api = axios.create({
  baseURL: `http://localhost:${PORT}`,
});

api.interceptors.request.use(async config => {
  const token = localStorage.getItem('@MedFlow:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const viaCep = axios.create({
  baseURL: 'https://viacep.com.br/ws/',
});