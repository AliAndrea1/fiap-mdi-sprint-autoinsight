import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://SEU_IP:8080/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface SpecificationRequest {
  attributeName: string;
  attributeValue: string;
  unit?: string;
}

export interface SpecificationResponse {
  id: number;
  attributeName: string;
  attributeValue: string;
  unit?: string;
}

export interface VehicleRequest {
  brand: string;
  model: string;
  version: string;
  year: number;
  specifications: SpecificationRequest[];
}

export interface VehicleResponse {
  id: number;
  brand: string;
  model: string;
  version: string;
  year: number;
  specifications: SpecificationResponse[];
  createdAt: string;
}

export interface SearchHistoryResponse {
  id: number;
  brand: string;
  model: string;
  version: string;
  searchedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const vehicleService = {
  getAll: async (): Promise<VehicleResponse[]> => {
    const response = await api.get<ApiResponse<VehicleResponse[]>>('/vehicles');
    return response.data.data;
  },

  getById: async (id: number): Promise<VehicleResponse> => {
    const response = await api.get<ApiResponse<VehicleResponse>>(`/vehicles/${id}`);
    return response.data.data;
  },

  search: async (brand: string, model: string, version: string): Promise<VehicleResponse> => {
    const response = await api.get<ApiResponse<VehicleResponse>>('/vehicles/search', {
      params: { brand, model, version },
    });
    return response.data.data;
  },

  getByBrand: async (brand: string): Promise<VehicleResponse[]> => {
    const response = await api.get<ApiResponse<VehicleResponse[]>>(`/vehicles/brand/${brand}`);
    return response.data.data;
  },

  create: async (vehicle: VehicleRequest): Promise<VehicleResponse> => {
    const response = await api.post<ApiResponse<VehicleResponse>>('/vehicles', vehicle);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
};

export const historyService = {
  getRecent: async (): Promise<SearchHistoryResponse[]> => {
    const response = await api.get<ApiResponse<SearchHistoryResponse[]>>('/history');
    return response.data.data;
  },

  clearAll: async (): Promise<void> => {
    await api.delete('/history');
  },
};