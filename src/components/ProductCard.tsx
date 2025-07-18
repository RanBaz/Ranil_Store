import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
      duration: 2000,
    });
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const discountPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : null;

  return (
    <Card className="group relative overflow-hidden bg-gradient-card border-border/50 hover:shadow-elegant-lg transition-all duration-300 hover:-translate-y-1">
      <Link to={`/products/${product.id}`}>
        <div className="relative overflow-hidden bg-muted/30">
          {/* Image Container */}
          <div className="aspect-square relative overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            
            {!imageError ? (
              <img
                src={product.image}
                alt={product.title}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-muted-foreground text-sm">Image not available</div>
              </div>
            )}

            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            
            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                size="sm" 
                variant="secondary" 
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>

            {/* Discount Badge */}
            {product.discount && (
              <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-medium rounded-md">
                -{product.discount}%
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Product Info */}
          <div className="space-y-2">
            {/* Category */}
            {product.category && (
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                {product.category}
              </div>
            )}

            {/* Title */}
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground ml-1">
                    {product.rating.rate.toFixed(1)} ({product.rating.count})
                  </span>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">
                {discountPrice ? formatPrice(discountPrice) : formatPrice(product.price)}
              </span>
              {discountPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full mt-3 bg-primary hover:bg-primary-hover text-primary-foreground"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInCart(product.id) ? 'Added' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
};