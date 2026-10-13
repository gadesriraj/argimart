import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  emptyMessage = 'No agricultural products matched your filter criteria.' 
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center max-w-md mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-stone-900 mb-1">No Products Found</h3>
        <p className="text-xs text-stone-500 leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
