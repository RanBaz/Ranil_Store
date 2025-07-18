import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">R</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">
              Ranil's Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Products
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Search - Desktop */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex text-muted-foreground hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* User Account */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-foreground"
            >
              <User className="h-4 w-4" />
            </Button>

            {/* Cart */}
            <Link to="/cart">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative text-muted-foreground hover:text-foreground"
              >
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95">
            <nav className="flex flex-col space-y-4 py-4">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors font-medium px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <div className="flex items-center space-x-4 px-2 pt-2 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex-1 justify-start text-muted-foreground hover:text-foreground"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};