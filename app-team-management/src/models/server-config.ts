import axios, { type AxiosError } from 'axios';
import Constants from 'expo-constants';

interface ErrorEnvelope {
  error?: { message?: string };
}

const resolveBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  const host = Constants.expoConfig?.hostUri?.split(':')[0];

  return host ? `http://${host}:3000` : 'http://localhost:3000';
};

export const API_BASE_URL = resolveBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorEnvelope>) => {
    const message = error.response?.data?.error?.message;

    return Promise.reject(
      new Error(message ?? `Não foi possível conectar ao servidor (${API_BASE_URL}).`),
    );
  },
);
