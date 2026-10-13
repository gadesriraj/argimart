import React from 'react';
import { ProductCategory } from '../types';
import { CATEGORIES_LIST } from '../data/sampleData';

interface CategoryFilterProps {
  selectedCategory: ProductCategory | 'All';
  onSelectCategory: (cat: ProductCategory | 'All') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory('All')}
        className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          selectedCategory === 'All'
            ? 'bg-emerald-800 text-white shadow-xs'
            : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-300 hover:bg-emerald-50/50'
        }`}
      >
        All Categories
      </button>

      {CATEGORIES_LIST.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelectCategory(cat.name as ProductCategory)}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === cat.name
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-300 hover:bg-emerald-50/50'
          }`}
        >
          <span>{cat.name}</span>
        </button>
      ))}
    </div>
  );
};
