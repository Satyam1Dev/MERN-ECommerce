import API from './api';

export const cartService = {
  getCart: async () => {
    const response = await API.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await API.post('/cart/add', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await API.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await API.delete(`/cart/remove/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await API.delete('/cart/clear');
    return response.data;
  }
};

export const orderService = {
  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await API.get('/orders/my-orders');
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await API.get(`/orders/${orderId}`);
    return response.data;
  },

  updateOrderToPaid: async (orderId) => {
    const response = await API.put(`/orders/${orderId}/pay`);
    return response.data;
  }
};