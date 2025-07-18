import { useState } from 'react';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductGrid } from '@/components/ProductGrid';
import heroImage from '@/assets/hero-banner.jpg';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative container mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                Discover
                <span className="text-primary block">Amazing Products</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-lg">
                Shop the latest tech, electronics, and lifestyle products from our carefully curated collection of premium brands.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  Free shipping over $50
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  30-day returns
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  2-year warranty
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Premium tech products showcase" 
                className="w-full h-auto rounded-2xl shadow-elegant-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-6">

        {/* Category Filter */}
        <div className="mb-8">
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Products Grid */}
        <ProductGrid category={selectedCategory === 'all' ? undefined : selectedCategory} />
      </main>
    </div>
  );
};

export default Index;
