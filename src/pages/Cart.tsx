import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';

export const Cart = () => {
  const { items, total, itemCount, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const estimatedTax = total * 0.08;
  const shipping = total > 50 ? 0 : 9.99;
  const finalTotal = total + estimatedTax + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
              <p className="text-muted-foreground">
                Looks like you haven't added anything to your cart yet.
              </p>
            </div>
            
            <Link to="/">
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-2xl font-bold">Shopping Cart ({itemCount})</h1>
          </div>
          
          {items.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
            >
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <Link to={`/products/${item.id}`} className="flex-shrink-0">
                      <div className="w-20 h-20 bg-muted rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        to={`/products/${item.id}`}
                        className="block hover:text-primary transition-colors"
                      >
                        <h3 className="font-medium text-sm leading-tight line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive h-8 w-8 p-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-xs text-muted-foreground">
                              {formatPrice(item.price)} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Estimated Tax</span>
                    <span>{formatPrice(estimatedTax)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  
                  {total < 50 && (
                    <div className="text-xs text-muted-foreground">
                      Add {formatPrice(50 - total)} more for free shipping
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground h-12"
                  size="lg"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Secure checkout with SSL encryption
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardContent className="p-4">
                <div className="text-sm space-y-2">
                  <div className="font-medium">Shipping Information</div>
                  <div className="text-muted-foreground">
                    • Free shipping on orders over $50
                  </div>
                  <div className="text-muted-foreground">
                    • Standard delivery: 3-5 business days
                  </div>
                  <div className="text-muted-foreground">
                    • Express delivery available at checkout
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};