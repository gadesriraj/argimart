import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, OrderItem } from '../types';
import { useCart } from './CartContext';
import { useProducts } from './ProductContext';
import { useAuth } from './AuthContext';

interface CheckoutDetails {
  customerName: string;
  deliveryAddress: string;
  contactPhone: string;
  paymentMethod: 'CASH_ON_DELIVERY' | 'SIMULATED_UPI' | 'SIMULATED_CARD';
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  placeOrder: (details: CheckoutDetails) => Promise<{ success: boolean; orderId?: string; message?: string }>;
  getOrderById: (orderId: string) => Order | undefined;
  getCustomerOrders: (customerId: string) => Order[];
  getFarmerOrders: (farmerId: string) => { order: Order; itemsForFarmer: OrderItem[] }[];
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => boolean;
  cancelOrder: (orderId: string) => { success: boolean; message: string };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const ORDERS_STORAGE_KEY = 'harvesthub_orders';

const INITIAL_SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-7821',
    customerId: 'user-customer-1',
    customerName: 'Priya Sundaram',
    totalAmount: 1475,
    orderStatus: 'DELIVERED',
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'PAID',
    deliveryAddress: 'Flat 304, Palm Meadows, Whitefield, Bengaluru',
    contactPhone: '+91 97654 32109',
    createdAt: '2026-03-01T10:15:00Z',
    items: [
      {
        id: 'ord-item-1',
        orderId: 'ORD-7821',
        productId: 'prod-8',
        productNameSnapshot: 'Organic Farm Assortment Vegetable Basket',
        unitPrice: 299,
        quantity: 2,
        subtotal: 598,
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
        farmerId: 'user-farmer-1',
        farmerName: 'GreenField Farms',
      },
      {
        id: 'ord-item-2',
        orderId: 'ORD-7821',
        productId: 'prod-11',
        productNameSnapshot: 'Organic Alphonso / Ratnagiri Mangoes (Hand-Picked)',
        unitPrice: 650,
        quantity: 1,
        subtotal: 650,
        imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
        farmerId: 'user-farmer-1',
        farmerName: 'GreenField Farms',
      }
    ]
  },
  {
    id: 'ORD-9042',
    customerId: 'user-customer-1',
    customerName: 'Priya Sundaram',
    totalAmount: 2540,
    orderStatus: 'SHIPPED',
    paymentMethod: 'SIMULATED_UPI',
    paymentStatus: 'PAID',
    deliveryAddress: 'Flat 304, Palm Meadows, Whitefield, Bengaluru',
    contactPhone: '+91 97654 32109',
    createdAt: '2026-03-08T14:20:00Z',
    items: [
      {
        id: 'ord-item-3',
        orderId: 'ORD-9042',
        productId: 'prod-5',
        productNameSnapshot: '16L Battery Operated Agricultural Sprayer',
        unitPrice: 2450,
        quantity: 1,
        subtotal: 2450,
        imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
        farmerId: 'user-farmer-1',
        farmerName: 'GreenField Farms',
      }
    ]
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items, subtotal, shippingFee, taxAmount, totalAmount, clearCart } = useCart();
  const { updateStock, products } = useProducts();
  const { currentUser } = useAuth();

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SAMPLE_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = async (details: CheckoutDetails): Promise<{ success: boolean; orderId?: string; message?: string }> => {
    if (items.length === 0) {
      return { success: false, message: 'Your cart is empty.' };
    }

    // Step 1: Pre-validate inventory for every single cart item
    for (const item of items) {
      const liveProduct = products.find(p => p.id === item.productId);
      if (!liveProduct || !liveProduct.active) {
        return { success: false, message: `"${item.product.name}" is no longer available.` };
      }
      if (liveProduct.stockQuantity < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for "${liveProduct.name}". Only ${liveProduct.stockQuantity} ${liveProduct.unit} remaining.`
        };
      }
    }

    // Step 2: Atomic-style stock deductions
    for (const item of items) {
      const stockSuccess = updateStock(item.productId, item.quantity);
      if (!stockSuccess) {
        return { success: false, message: `Could not reserve inventory for ${item.product.name}.` };
      }
    }

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems: OrderItem[] = items.map(item => ({
      id: `ord-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      orderId,
      productId: item.productId,
      productNameSnapshot: item.product.name,
      unitPrice: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity,
      imageUrl: item.product.imageUrl,
      farmerId: item.product.farmerId,
      farmerName: item.product.farmerName,
    }));

    const newOrder: Order = {
      id: orderId,
      customerId: currentUser ? currentUser.id : `guest-${Date.now()}`,
      customerName: details.customerName || currentUser?.fullName || 'Customer',
      totalAmount,
      orderStatus: 'PLACED',
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      deliveryAddress: details.deliveryAddress,
      contactPhone: details.contactPhone,
      items: orderItems,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    return { success: true, orderId, message: 'Order successfully placed!' };
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  const getCustomerOrders = (customerId: string) => {
    return orders.filter(o => o.customerId === customerId);
  };

  const getFarmerOrders = (farmerId: string) => {
    return orders
      .filter(order => order.items.some(item => item.farmerId === farmerId))
      .map(order => ({
        order,
        itemsForFarmer: order.items.filter(item => item.farmerId === farmerId),
      }));
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus): boolean => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const paymentStatus = (newStatus === 'DELIVERED' && order.paymentMethod === 'CASH_ON_DELIVERY')
          ? 'PAID'
          : order.paymentStatus;
        return {
          ...order,
          orderStatus: newStatus,
          paymentStatus: paymentStatus as 'PENDING' | 'PAID' | 'REFUNDED',
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    }));
    return true;
  };

  const cancelOrder = (orderId: string): { success: boolean; message: string } => {
    const target = orders.find(o => o.id === orderId);
    if (!target) return { success: false, message: 'Order not found.' };

    if (target.orderStatus === 'SHIPPED' || target.orderStatus === 'DELIVERED') {
      return { success: false, message: 'Cannot cancel an order that has already shipped or been delivered.' };
    }

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          orderStatus: 'CANCELLED',
          paymentStatus: order.paymentStatus === 'PAID' ? 'REFUNDED' : order.paymentStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    }));

    return { success: true, message: 'Order has been cancelled.' };
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
        getCustomerOrders,
        getFarmerOrders,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
