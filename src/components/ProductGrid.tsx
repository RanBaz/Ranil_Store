import { useEffect, useRef, useCallback } from 'react';
import { ProductCard } from './ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  category?: string;
}

export const ProductGrid = ({ category }: ProductGridProps) => {
  const { products, loading, error, hasMore, loadMore } = useProducts(category);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleIntersection]);

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive mb-2">
          Failed to load products
        </div>
        <div className="text-muted-foreground text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product, index) => (
          <div 
            key={`${product.id}-${index}`}
            className="animate-fade-in"
            style={{ animationDelay: `${(index % 8) * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && products.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-muted rounded-lg overflow-hidden">
                <div className="aspect-square bg-muted-foreground/20" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-muted-foreground/20 rounded" />
                  <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
                  <div className="h-8 bg-muted-foreground/20 rounded mt-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Trigger */}
      {hasMore && products.length > 0 && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          {loading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading more products...</span>
            </div>
          )}
        </div>
      )}

      {/* No More Products */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          You've reached the end of our catalog
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No products found in this category
          </div>
        </div>
      )}
    </div>
  );
};