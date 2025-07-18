import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id!);
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();
  const { toast } = useToast();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (product && isInCart(product.id)) {
      setSelectedQuantity(getItemQuantity(product.id));
    }
  }, [product, isInCart, getItemQuantity]);

  const handleAddToCart = () => {
    if (!product) return;

    if (isInCart(product.id)) {
      updateQuantity(product.id, selectedQuantity);
      toast({
        title: "Cart updated",
        description: `${product.title} quantity updated to ${selectedQuantity}.`,
      });
    } else {
      addToCart(product, selectedQuantity);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const discountPrice = product?.discount 
    ? product.price * (1 - product.discount / 100) 
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-4 w-4 bg-muted rounded" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive mb-2">Product not found</div>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square relative bg-muted/30">
                {imageLoading && (
                  <div className="absolute inset-0 bg-muted animate-pulse" />
                )}
                <img
                  src={product.image}
                  alt={product.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                />
                
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 text-sm font-medium rounded-md">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="space-y-2">
              {product.category && (
                <Badge variant="secondary" className="text-xs uppercase tracking-wide">
                  {product.category}
                </Badge>
              )}
              
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {product.title}
              </h1>
              
              {product.brand && (
                <div className="text-muted-foreground">
                  by <span className="font-medium">{product.brand}</span>
                </div>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating.rate.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground text-sm">
                  ({product.rating.count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {discountPrice ? formatPrice(discountPrice) : formatPrice(product.price)}
                </span>
                {discountPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              {discountPrice && (
                <div className="text-success text-sm font-medium">
                  You save {formatPrice(product.price - discountPrice)}
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {selectedQuantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground h-12"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {isInCart(product.id) ? 'Update Cart' : 'Add to Cart'}
                </Button>
                <Button variant="outline" size="lg" className="w-12 h-12 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>2-year warranty included</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-4 w-4 text-muted-foreground" />
                  <span>30-day return policy</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};