import axios from 'axios';

// http://localhost:3001/api...
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/catalog`;

// Configure axios defaults for this file
const productsClient = axios.create({
  baseURL: API_BASE_URL,
});



export interface CreateProduct {
  name: string
  description: string
  price: string | number
  sku: string
  stock: number
  companyId: number
  categoryIds: number[],
  images: { url: string }[]
}

export interface UpdateProduct {
  name?: string
  description?: string
  price?: string | number
  sku?: string
  stock?: number
  disabled?: boolean
  images?: { id: number|null, url: string }[]
  deletedImageIds?: number[] // Added this field
}


export const getProducts = async (companyId: number, { productId, searchString, categories }:{ productId?: number, searchString?: string, categories?:number[] }) => {
  const response = await productsClient.get(`/products`, {
    ...getAuthHeader(),
    params: {
      companyId,
      id: productId,
      searchString,
      categories
    }
  });
  return response.data;
};

export const createProduct = async (params: CreateProduct) => {
  const response = await productsClient.post(`/products`, params, getAuthHeader());
  return response.data;
};

export const updateProduct = async (productId: number, params: UpdateProduct) => {
  const response = await productsClient.put(`/products?id=${productId}`, params, getAuthHeader());
  return response.data;
};

export const deleteProduct = async (productId: number) => {
  const response = await productsClient.delete(`/products?id=${productId}`, getAuthHeader());
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