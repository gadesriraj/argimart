import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { ProductGrid } from '../components/ProductGrid';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCategory } from '../types';
import { Filter, SlidersHorizontal, MapPin, IndianRupee, ArrowDownUp } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { filteredProducts, filterOptions, setFilterOptions, locationsList } = useProducts();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handlePriceRangeChange = (min?: number, max?: number) => {
    setFilterOptions(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  const handleClearFilters = () => {
    setFilterOptions({
      searchQuery: '',
      category: 'All',
      sortBy: 'featured',
      minPrice: undefined,
      maxPrice: undefined,
      location: undefined,
    });
  };

  const hasActiveFilters = 
    filterOptions.searchQuery !== '' || 
    filterOptions.category !== 'All' || 
    filterOptions.minPrice !== undefined || 
    filterOptions.maxPrice !== undefined || 
    (filterOptions.location && filterOptions.location !== 'All');

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Marketplace Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Agricultural Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Browse verified seeds, bio-fertilizers, organic harvests, and precision tools directly from sellers.
          </p>
        </div>

        {/* Search & Mobile Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-center mb-6">
          <div className="flex-1 w-full">
            <SearchBar
              value={filterOptions.searchQuery}
              onChange={(val) => setFilterOptions(prev => ({ ...prev, searchQuery: val }))}
              placeholder="Search by crop, seed variety, equipment, or farm name..."
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs">
              <ArrowDownUp className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={filterOptions.sortBy}
                onChange={(e) => setFilterOptions(prev => ({ ...prev, sortBy: e.target.value as any }))}
                aria-label="Sort products by"
                className="bg-transparent text-xs font-semibold text-stone-800 outline-hidden cursor-pointer"
              >
                <option value="featured">Featured / Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">Latest Arrivals</option>
              </select>
            </div>

            {/* Mobile Filters button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-1.5 bg-white border border-stone-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700"
            >
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Horizontal Bar */}
        <div className="mb-8">
          <CategoryFilter
            selectedCategory={filterOptions.category}
            onSelectCategory={(cat) => setFilterOptions(prev => ({ ...prev, category: cat }))}
          />
        </div>

        {/* Main Content Area: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className={`lg:block ${showMobileFilters ? 'block mb-6' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-6 shadow-2xs sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-stone-900">Filter By</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-stone-400" />
                  <span>Price Range (₹)</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filterOptions.minPrice ?? ''}
                    onChange={(e) => handlePriceRangeChange(e.target.value ? Number(e.target.value) : undefined, filterOptions.maxPrice)}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden focus:border-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filterOptions.maxPrice ?? ''}
                    onChange={(e) => handlePriceRangeChange(filterOptions.minPrice, e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <button
                    onClick={() => handlePriceRangeChange(0, 100)}
                    className="text-[10px] px-2 py-1 bg-stone-100 hover:bg-emerald-50 rounded-md text-stone-700 hover:text-emerald-800"
                  >
                    Under ₹100
                  </button>
                  <button
                    onClick={() => handlePriceRangeChange(100, 500)}
                    className="text-[10px] px-2 py-1 bg-stone-100 hover:bg-emerald-50 rounded-md text-stone-700 hover:text-emerald-800"
                  >
                    ₹100 - ₹500
                  </button>
                  <button
                    onClick={() => handlePriceRangeChange(500, 5000)}
                    className="text-[10px] px-2 py-1 bg-stone-100 hover:bg-emerald-50 rounded-md text-stone-700 hover:text-emerald-800"
                  >
                    ₹500 - ₹5000
                  </button>
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>Farming Region / Hub</span>
                </label>
                <select
                  value={filterOptions.location || 'All'}
                  onChange={(e) => setFilterOptions(prev => ({ ...prev, location: e.target.value === 'All' ? undefined : e.target.value }))}
                  aria-label="Filter by farming region"
                  className="w-full text-xs p-2 bg-stone-50 border border-stone-200 rounded-lg outline-hidden focus:border-emerald-500 font-medium text-stone-700"
                >
                  <option value="All">All Locations</option>
                  {locationsList.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Quality & Certified Checkboxes */}
              <div className="pt-2 border-t border-stone-100 space-y-2">
                <span className="block text-xs font-bold text-stone-800 mb-1">Assurance</span>
                <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />
                  <span>Lab Tested Germination</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-600 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500" />
                  <span>Direct Farmer Harvest</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Listings Grid */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-stone-600">
                Showing <span className="font-bold text-stone-900">{filteredProducts.length}</span> agricultural items
              </p>
            </div>

            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </div>
    </div>
  );
};
