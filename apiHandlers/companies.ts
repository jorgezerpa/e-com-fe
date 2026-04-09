import axios from 'axios';
import { Product } from '@/types';

// http://localhost:3001/api...
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/company`;

// Configure axios defaults for this file
const companiesClient = axios.create({
  baseURL: API_BASE_URL,
});


export interface CreateCompany {
  name: string
  currency: "USD"|"VES"
  showOutOfStockProducts: boolean
}

export interface UpdateCompany {
  name?: string
  currency?: "USD"|"VES"
  showOutOfStockProducts?: boolean
}


export const getCompanies = async (companyId?: number) => {
  const response = await companiesClient.get(`${companyId ? `?id=${companyId}` : ``}`,getAuthHeader());
  return response.data;
};

export const createCompany = async (params: CreateCompany) => {
  const response = await companiesClient.post(`/`, params, getAuthHeader());
  return response.data;
};

export const updateProduct = async (companyId: number, params: UpdateCompany) => {
  const response = await companiesClient.put(`?id=${companyId}`, params, getAuthHeader());
  return response.data;
};

export const deleteCompany = async (companyId: number) => {
  const response = await companiesClient.delete(`?id=${companyId}`, getAuthHeader());
  return response.data;
};





///////////////////
///////////////////
function getAuthHeader() {
  const token = localStorage.getItem('jwt');
  if(!token) {
    console.log("error") // @todo make this function an utility
    // throw new Error("Unauthorized")
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }, 
    paramsSerializer: {
      indexes: null
    }
  };
};