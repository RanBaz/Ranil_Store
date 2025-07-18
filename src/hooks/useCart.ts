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
    console.log('🔄 Loading cart from localStorage on mount...');
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      console.log('📱 Raw localStorage data:', saved);
      
      if (saved) {
        const items: CartItem[] = JSON.parse(saved);
        console.log('📦 Parsed items from localStorage:', items.map(item => ({ id: item.id, title: item.title, quantity: item.quantity })));
        
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        setState({ items, total, itemCount });
        console.log('✅ Initial state set:', { itemsArrayLength: items.length, total, totalItemCount: itemCount });
      } else {
        console.log('📭 No saved cart found in localStorage');
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Helper function to update state and localStorage together
  const updateCartState = useCallback((items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const newState = { items, total, itemCount };
    setState(newState);
    
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, []);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    console.log('🛒 addToCart called:', { productId: product.id, productTitle: product.title, quantity });
    
    // Get the current cart from localStorage to ensure we have the most recent data
    let currentItems: CartItem[] = [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      currentItems = saved ? JSON.parse(saved) : [];
      console.log('📦 Current items from localStorage:', currentItems.map(item => ({ id: item.id, title: item.title, quantity: item.quantity })));
    } catch (error) {
      console.error('Failed to load current cart from localStorage:', error);
    }

    const existingItem = currentItems.find(item => item.id === product.id);
    let newItems: CartItem[];

    if (existingItem) {
      console.log('✏️ Updating existing item:', { id: existingItem.id, oldQuantity: existingItem.quantity, addingQuantity: quantity });
      newItems = currentItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      console.log('➕ Adding new item to cart');
      const newItem: CartItem = {
        id: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        quantity,
      };
      newItems = [...currentItems, newItem];
    }

    console.log('📋 New items calculated:', {
      itemCount: newItems.length,
      items: newItems.map(item => ({ id: item.id, title: item.title, quantity: item.quantity }))
    });

    // Update localStorage immediately with the new items
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      console.log('💾 Saved to localStorage:', newItems.map(item => ({ id: item.id, title: item.title, quantity: item.quantity })));
      
      // Verify what was actually saved
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = JSON.parse(saved || '[]');
      console.log('✅ Verified localStorage contains:', parsed.map((item: CartItem) => ({ id: item.id, title: item.title, quantity: item.quantity })));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }

    const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

    console.log('🎯 Final state being set:', { itemsArrayLength: newItems.length, total, totalItemCount: itemCount });
    console.log('-------------------');

    // Update the state with the new items
    setState({ items: newItems, total, itemCount });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setState(prev => {
      const newItems = prev.items.filter(item => item.id !== productId);
      
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

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
      
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

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