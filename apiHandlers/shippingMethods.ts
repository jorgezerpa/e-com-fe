import axios from 'axios';

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/method/shipping-methods`;

const shippingMethodsClient = axios.create({
  baseURL: API_BASE_URL,
});

export interface CreateShippingMethod {
  name: string;
  description?: string;
  provider: string;
  fields: Record<string, string>;
  companyId: number;
}

export interface UpdateShippingMethod {
  name?: string;
  description?: string;
  provider?: string;
  fields?: Record<string, string>;
}

export const getShippingMethods = async (companyId: number) => {
  const response = await shippingMethodsClient.get(`?companyId=${companyId}`, getAuthHeader());
  return response.data;
};

export const createShippingMethod = async (params: CreateShippingMethod) => {
  const response = await shippingMethodsClient.post(`/`, params, getAuthHeader());
  return response.data;
};

export const updateShippingMethod = async (id: number, params: UpdateShippingMethod) => {
  const response = await shippingMethodsClient.put(`?id=${id}`, params, getAuthHeader());
  return response.data;
};

export const deleteShippingMethod = async (id: number) => {
  const response = await shippingMethodsClient.delete(`?id=${id}`, getAuthHeader());
  return response.data;
};

function getAuthHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  return { headers: { Authorization: `Bearer ${token}` } };
}