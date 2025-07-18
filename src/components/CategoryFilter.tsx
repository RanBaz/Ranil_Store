import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/useCategories';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="h-9 bg-muted animate-pulse rounded-full px-4 min-w-[80px]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category.slug}
            variant={selectedCategory === category.slug ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.slug)}
            className={`
              whitespace-nowrap min-w-fit transition-all duration-200
              ${selectedCategory === category.slug 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-background hover:bg-muted border-border hover:border-primary/50'
              }
            `}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};