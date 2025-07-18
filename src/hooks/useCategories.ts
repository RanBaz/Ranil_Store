import { useState, useEffect } from 'react';

export interface Category {
  name: string;
  slug: string;
  count?: number;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        // Since FakeStoreAPI doesn't have a dedicated categories endpoint,
        // we'll use a predefined list based on the API documentation
        const predefinedCategories: Category[] = [
          { name: 'All Products', slug: 'all' },
          { name: 'Mobile', slug: 'mobile' },
          { name: 'TV', slug: 'tv' },
          { name: 'Audio', slug: 'audio' },
          { name: 'Laptop', slug: 'laptop' },
          { name: 'Gaming', slug: 'gaming' },
          { name: 'Appliances', slug: 'appliances' },
        ];
        
        setCategories(predefinedCategories);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};