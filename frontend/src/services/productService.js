import API from './api';

export const productService = {
  getAllProducts: async (params = {}) => {
    const response = await API.get('/products', { params }); // Remove /api from here
    return response.data;
  },

  getProduct: async (id) => {
    const response = await API.get(`/products/${id}`); // Remove /api from here
    return response.data;
  },

  getCategories: async () => {
    const response = await API.get('/products/categories/all'); // Remove /api from here
    return response.data;
  }
};