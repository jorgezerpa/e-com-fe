import axios from 'axios';

// http://localhost:3001/api...
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/catalog`;

// Configure axios defaults for this file
const categoriesClient = axios.create({
  baseURL: API_BASE_URL,
});

export interface CreateCategory {
  name: string
  description: string
  companyId: number
  color: string
}

export interface UpdateCategory {
  name?: string
  description?: string
  color?: string
}

export const getCategories = async (companyId: number) => {
  const response = await categoriesClient.get(`/categories`, {
    ...getAuthHeader(),
    params: {
      companyId,
    }
  });
  return response.data;
};

export const createCategory = async (params: CreateCategory) => {
  const response = await categoriesClient.post(`/categories`, params, getAuthHeader());
  return response.data;
};

export const updateCategory = async (categoryId: number, params: UpdateCategory) => {
  const response = await categoriesClient.put(`/categories?id=${categoryId}`, params, getAuthHeader());
  return response.data;
};

export const deleteCategory = async (categoryId: number) => {
  const response = await categoriesClient.delete(`/categories?id=${categoryId}`, getAuthHeader());
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