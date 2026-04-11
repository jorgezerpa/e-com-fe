import { OrderState } from '@/types';
import axios from 'axios';

// http://localhost:3001/api...
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/order`;

// Configure axios defaults for this file
const categoriesClient = axios.create({
  baseURL: API_BASE_URL,
});

export interface CreateOrder {
  companyId: number 
  requestedItems: { productId: number, quantity: number }[]
  paymentMethodId: number 
  shippingMethodId: number
  customer_firstName: string
  customer_lastName: string 
  customer_whatsapp_number: string
  customer_identification_number: string 
  customer_email: string 
  customer_address: string
  shipping_country: string 
  shipping_city: string 
  shipping_zipCode: string
  // shipping_fields_response: {[any as Key]:string}
  // payment_fields_response: {[any as Key]:string}
  // originFields?: {[any as Key]:string}
  shipping_fields_response: any
  payment_fields_response: any
  originFields?: any
}

export interface UpdateOrder {
  state: OrderState
  notes: string
}

export const getOrders = async (companyId: number, filters?: { state?: string, from?: string, to?: string }) => {
  const params:any = {}
  params.companyId = companyId
  if(filters?.state) params.state = filters.state
  if(filters?.from) params.from = new Date(filters?.from+"T00:00:00.000").toISOString()
  if(filters?.to) params.to = new Date(filters?.to+"T23:59:59.999").toISOString()
  
  const response = await categoriesClient.get(`/`, {
    ...getAuthHeader(),
    params
  });
  return response.data;
};

export const createOrder = async (params: CreateOrder) => {
  const response = await categoriesClient.post(`/`, params, getAuthHeader());
  return response.data;
};

export const updateOrder = async (orderId: number, params: UpdateOrder) => {
  const response = await categoriesClient.put(`?id=${orderId}`, params, getAuthHeader());
  return response.data;
};

export const deleteOrder = async (orderId: number) => {
  const response = await categoriesClient.delete(`?id=${orderId}`, getAuthHeader());
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