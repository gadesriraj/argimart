import { apiClient } from './apiClient';
import { Order, OrderStatus } from '../types';

export interface CreateOrderPayload {
  deliveryAddress: string;
  contactPhone: string;
  paymentMethod: string;
  notes?: string;
}

export const orderService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const res = await apiClient.post<Order>('/orders', payload);
    return res.data;
  },

  async getMyOrders(): Promise<Order[]> {
    const res = await apiClient.get<Order[]>('/orders/my');
    return res.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res = await apiClient.get<Order>(`/orders/${id}`);
    return res.data;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
    return res.data;
  }
};
