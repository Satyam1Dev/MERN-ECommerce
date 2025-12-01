import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartService } from '../services/cartService';

// Create Context
const CartContext = createContext();

// Cart Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false };
    case 'ADD_ITEM':
      return { ...state, cart: action.payload };
    case 'UPDATE_ITEM':
      return { ...state, cart: action.payload };
    case 'REMOVE_ITEM':
      return { ...state, cart: action.payload };
    case 'CLEAR_CART':
      return { ...state, cart: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  cart: null,
  loading: false,
  error: null
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const loadCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cart = await cartService.getCart();
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      // Don't show error for 401 - user just needs to login
      if (error.response?.status !== 401) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      console.log('🔄 CartContext: Adding to cart', { productId, quantity });
      
      const cart = await cartService.addToCart(productId, quantity);
      console.log('✅ CartContext: Add to cart successful', cart);
      
      dispatch({ type: 'ADD_ITEM', payload: cart });
      return cart;
    } catch (error) {
      console.error('❌ CartContext: Add to cart failed', error);
      
      if (error.response?.status === 401) {
        // Clear invalid token but don't redirect automatically
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_ERROR', payload: 'Please login to add items to cart' });
      } else {
        dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || error.message });
      }
      throw error;
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const cart = await cartService.updateCartItem(itemId, quantity);
      dispatch({ type: 'UPDATE_ITEM', payload: cart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const cart = await cartService.removeFromCart(itemId);
      dispatch({ type: 'REMOVE_ITEM', payload: cart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const cart = await cartService.clearCart();
      dispatch({ type: 'CLEAR_CART', payload: cart });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const getCartItemsCount = () => {
    if (!state.cart || !state.cart.items) return 0;
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    if (!state.cart) return 0;
    return state.cart.totalAmount || state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Only load cart if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCart();
    }
  }, []);

  const value = {
    cart: state.cart,
    loading: state.loading,
    error: state.error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    loadCart,
    getCartItemsCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};