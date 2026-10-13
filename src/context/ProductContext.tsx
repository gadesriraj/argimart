import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductCategory } from '../types';
import { SAMPLE_PRODUCTS } from '../data/sampleData';

interface ProductFilterOptions {
  searchQuery: string;
  category: ProductCategory | 'All';
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  filterOptions: ProductFilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<ProductFilterOptions>>;
  getProductById: (id: string) => Product | undefined;
  getProductsByFarmer: (farmerId: string) => Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  updateStock: (productId: string, quantityDeducted: number) => boolean;
  locationsList: string[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'harvesthub_products';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_PRODUCTS;
  });

  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>({
    searchQuery: '',
    category: 'All',
    sortBy: 'featured',
  });

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const locationsList = Array.from(new Set(products.map(p => p.location.split(',').pop()?.trim() || p.location)));

  const filteredProducts = products.filter(p => {
    // Basic active check (unless admin/farmer looking at their own)
    if (!p.active) return false;

    // Search query
    if (filterOptions.searchQuery.trim()) {
      const q = filterOptions.searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchLoc = p.location.toLowerCase().includes(q);
      const matchFarmer = p.farmerName.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchLoc && !matchFarmer) {
        return false;
      }
    }

    // Category filter
    if (filterOptions.category !== 'All' && p.category !== filterOptions.category) {
      return false;
    }

    // Price range
    if (filterOptions.minPrice !== undefined && p.price < filterOptions.minPrice) {
      return false;
    }
    if (filterOptions.maxPrice !== undefined && filterOptions.maxPrice > 0 && p.price > filterOptions.maxPrice) {
      return false;
    }

    // Location
    if (filterOptions.location && filterOptions.location !== 'All') {
      if (!p.location.toLowerCase().includes(filterOptions.location.toLowerCase())) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    switch (filterOptions.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  const getProductsByFarmer = (farmerId: string) => {
    return products.filter(p => p.farmerId === farmerId);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleProductStatus = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const updateStock = (productId: string, quantityDeducted: number): boolean => {
    const prod = products.find(p => p.id === productId);
    if (!prod || prod.stockQuantity < quantityDeducted) {
      return false;
    }
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          stockQuantity: Math.max(0, p.stockQuantity - quantityDeducted)
        };
      }
      return p;
    }));
    return true;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        filterOptions,
        setFilterOptions,
        getProductById,
        getProductsByFarmer,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductStatus,
        updateStock,
        locationsList,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
