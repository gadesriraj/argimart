import { apiClient } from './apiClient';
import { Product } from '../types';

export const productService = {
  async getProducts(params?: { category?: string; query?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
    const res = await apiClient.get<Product[]>('/products', { params });
    return res.data;
  },

  async getProductById(id: string): Promise<Product> {
    const res = await apiClient.get<Product>(`/products/${id}`);
    return res.data;
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await apiClient.post<Product>('/products', product);
    return res.data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await apiClient.put<Product>(`/products/${id}`, product);
    return res.data;
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete<{ success: boolean }>(`/products/${id}`);
    return res.data;
  }
};
