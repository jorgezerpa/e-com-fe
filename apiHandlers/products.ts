import axios from 'axios';
import { Product } from '@/types';

// http://localhost:3001/api...
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/catalog`;

// Configure axios defaults for this file
const adminClient = axios.create({
  baseURL: API_BASE_URL,
});



export interface CreateProduct {
  name: string
  description: string
  price: string | number
  sku: string
  stock: number
  companyId: number
  categoryIds: number[]
}

export interface UpdateProduct {
  name?: string
  description?: string
  price?: string | number
  sku?: string
  stock?: number
  disabled?: boolean
}



export const getProducts = async (companyId: number, productId?: number) => {
  const response = await adminClient.get(`/products?companyId=${companyId}${productId ? `&id=${productId}` : ``}`,getAuthHeader());
  return response.data;
};

export const createProduct = async (params: CreateProduct) => {
  const response = await adminClient.post(`/products`, params, getAuthHeader());
  return response.data;
};

export const updateProduct = async (productId: number, params: UpdateProduct) => {
  const response = await adminClient.put(`/products?id=${productId}`, params, getAuthHeader());
  return response.data;
};

export const deleteProduct = async (productId: number) => {
  const response = await adminClient.delete(`/products?id=${productId}`, getAuthHeader());
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