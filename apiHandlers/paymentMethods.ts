import axios from 'axios';
// You might want to export this from your '@/types' file later
// import { OrderPaymentMethod } from '@/types'; 

// Adjust the base URL path based on where your router is mounted (e.g., /api)
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/method/payment-methods`;

// Configure axios defaults for this file
const paymentMethodsClient = axios.create({
  baseURL: API_BASE_URL,
});

// Based on your Prisma model `OrderPaymentMethod`
export interface CreatePaymentMethod {
  name: string;
  description?: string;
  provider: string;
  receiverFields: Record<string, any> | any[]; // Typed as Json in Prisma
  fields: Record<string, any> | any[]; // Typed as Json in Prisma
  companyId: number;
  askForPaymentProofImage: boolean
}

// Based on your PUT route (it doesn't seem to update companyId)
export interface UpdatePaymentMethod {
  name?: string;
  description?: string;
  provider?: string;
  receiverFields?: Record<string, any> | any[];
  fields?: Record<string, any> | any[];
  askForPaymentProofImage?: boolean
}

export const getPaymentMethods = async (companyId: number, filters?: { id?: number }) => {
  // Construct query string based on provided filters
  const queryParams = new URLSearchParams();
  queryParams.append('companyId', companyId.toString());
  if (filters?.id) queryParams.append('id', filters.id.toString());
  
  const queryString = `?${queryParams.toString()}`;

  const response = await paymentMethodsClient.get(`/${queryString}`, getAuthHeader());
  return response.data;
};

export const createPaymentMethod = async (params: CreatePaymentMethod) => {
  const response = await paymentMethodsClient.post(`/`, params, getAuthHeader());
  return response.data;
};

export const updatePaymentMethod = async (id: number, params: UpdatePaymentMethod) => {
  const response = await paymentMethodsClient.put(`/?id=${id}`, params, getAuthHeader());
  return response.data;
};

export const deletePaymentMethod = async (id: number) => {
  const response = await paymentMethodsClient.delete(`/?id=${id}`, getAuthHeader());
  return response.data;
};

///////////////////
///////////////////
function getAuthHeader() {
  // Note: Depending on whether you are calling this from a Client Component or Server Component 
  // in Next.js, localStorage might not be available. If this runs purely client-side, this is fine.
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;
  
  if(!token) {
    console.log("error"); // @todo make this function an utility
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
}