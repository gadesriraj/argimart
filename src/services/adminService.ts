import { apiClient } from './apiClient';
import { User, Order } from '../types';

export interface AdminDashboardStats {
  totalUsers: number;
  totalFarmers: number;
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  recentOrders: Order[];
}

export const adminService = {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const res = await apiClient.get<AdminDashboardStats>('/admin/dashboard');
    return res.data;
  },

  async getAllUsers(): Promise<User[]> {
    const res = await apiClient.get<User[]>('/admin/users');
    return res.data;
  },

  async toggleUserStatus(userId: string, active: boolean): Promise<User> {
    const res = await apiClient.patch<User>(`/admin/users/${userId}/status`, { active });
    return res.data;
  },

  async getAllOrders(): Promise<Order[]> {
    const res = await apiClient.get<Order[]>('/admin/orders');
    return res.data;
  },

  async getReports(): Promise<{ monthlySales: { month: string; amount: number }[]; topCategories: { category: string; count: number }[] }> {
    const res = await apiClient.get('/admin/reports');
    return res.data;
  }
};
