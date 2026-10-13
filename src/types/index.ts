export type UserRole = 'FARMER' | 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  address: string;
  active: boolean;
  createdAt: string;
}

export type ProductCategory = 
  | 'Seeds'
  | 'Fertilizers'
  | 'Pesticides'
  | 'Farm Equipment'
  | 'Vegetables'
  | 'Fruits'
  | 'Grains'
  | 'Organic Products';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  unit: string;
  stockQuantity: number;
  imageUrl: string;
  location: string;
  farmerId: string;
  farmerName: string;
  active: boolean;
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
}

export type OrderStatus = 
  | 'PLACED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  imageUrl?: string;
  farmerId?: string;
  farmerName?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  deliveryAddress: string;
  contactPhone: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface Feedback {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  userId?: string;
  question: string;
  response: string;
  category?: string;
  recommendedProductIds?: string[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
