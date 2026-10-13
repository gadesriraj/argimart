import { apiClient } from './apiClient';
import { CartItem } from '../types';

export const cartService = {
  async getCart(): Promise<{ items: CartItem[]; total: number }> {
    const res = await apiClient.get('/cart');
    return res.data;
  },

  async addToCart(productId: string, quantity: number): Promise<CartItem> {
    const res = await apiClient.post<CartItem>('/cart/items', { productId, quantity });
    return res.data;
  },

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
    const res = await apiClient.put<CartItem>(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  async removeItem(itemId: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete<{ success: boolean }>(`/cart/items/${itemId}`);
    return res.data;
  }
};
