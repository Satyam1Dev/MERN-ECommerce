import API from './api';

export const authService = {
  register: async (userData) => {
    try {
      console.log('🔄 Registering user:', userData);
      const response = await API.post('/auth/register', userData);
      console.log('✅ Registration response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('🔐 Token stored in localStorage');
      }
      return response.data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('🔄 Logging in user:', credentials.email);
      const response = await API.post('/auth/login', credentials);
      console.log('✅ Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log('🔐 Token stored in localStorage');
      }
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🔓 User logged out');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};