import { useState, useEffect, useCallback } from 'react';

export interface Product {
  id: number;
  title: string;
  image: string;
  price: number;
  description: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  brand?: string;
  model?: string;
  color?: string;
  discount?: number;
}

export interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

export const useProducts = (category?: string, limit = 8) => {
  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
  });

  const fetchProducts = useCallback(async (pageNum: number, reset = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let url = `https://fakestoreapi.in/api/products?page=${pageNum}&limit=${limit}`;
      
      if (category && category !== 'all') {
        url = `https://fakestoreapi.in/api/products/category?type=${category}&page=${pageNum}&limit=${limit}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different API response formats
      const products = data.products || data || [];
      const hasMore = products.length === limit;

      setState(prev => ({
        ...prev,
        products: reset ? products : [...prev.products, ...products],
        loading: false,
        hasMore,
        page: pageNum,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      }));
    }
  }, [category, limit]);

  const loadMore = useCallback(() => {
    if (!state.loading && state.hasMore) {
      fetchProducts(state.page + 1);
    }
  }, [state.loading, state.hasMore, state.page, fetchProducts]);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      products: [],
      page: 1,
      hasMore: true,
    }));
    fetchProducts(1, true);
  }, [fetchProducts]);

  useEffect(() => {
    reset();
  }, [category]);

  return {
    ...state,
    loadMore,
    reset,
    refetch: () => fetchProducts(1, true),
  };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://fakestoreapi.in/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data.product || data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};