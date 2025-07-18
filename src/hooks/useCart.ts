import { useState, useEffect, useCallback } from 'react';
import { Product } from './useProducts';

export interface CartItem {
  id: number;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface UseCartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'ecommerce-cart';

export const useCart = () => {
  const [state, setState] = useState<UseCartState>({
    items: [],
    total: 0,
    itemCount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const items: CartItem[] = JSON.parse(saved);
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        setState({ items, total, itemCount });
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  const saveCart = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      setState({ items, total, itemCount });
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setState(prev => {
      const existingItem = prev.items.find(item => item.id === product.id);
      let newItems: CartItem[];

      if (existingItem) {
        newItems = prev.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          image: product.image,
          price: product.price,
          quantity,
        };
        newItems = [...prev.items, newItem];
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }

      return { items: newItems, total, itemCount };
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setState(prev => {
      const newItems = prev.items.filter(item => item.id !== productId);
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }

      return { items: newItems, total, itemCount };
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setState(prev => {
      const newItems = prev.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }

      return { items: newItems, total, itemCount };
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setState({ items: [], total: 0, itemCount: 0 });
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Failed to clear cart from localStorage:', error);
    }
  }, []);

  const isInCart = useCallback((productId: number) => {
    return state.items.some(item => item.id === productId);
  }, [state.items]);

  const getItemQuantity = useCallback((productId: number) => {
    const item = state.items.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [state.items]);

  return {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };
};