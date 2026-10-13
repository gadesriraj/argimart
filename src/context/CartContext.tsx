import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'harvesthub_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1): { success: boolean; message: string } => {
    if (product.stockQuantity <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    const existingIndex = items.findIndex(item => item.productId === product.id);

    if (existingIndex > -1) {
      const existing = items[existingIndex];
      const newQty = existing.quantity + quantity;
      if (newQty > product.stockQuantity) {
        return {
          success: false,
          message: `Cannot add more. Maximum available stock is ${product.stockQuantity} ${product.unit}.`
        };
      }
      setItems(prev => prev.map((item, i) => i === existingIndex ? { ...item, quantity: newQty, product } : item));
      return { success: true, message: `Updated quantity to ${newQty} in cart!` };
    } else {
      if (quantity > product.stockQuantity) {
        return {
          success: false,
          message: `Only ${product.stockQuantity} ${product.unit} available in stock.`
        };
      }
      setItems(prev => [
        ...prev,
        {
          id: `cart-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: product.id,
          product,
          quantity,
        }
      ]);
      return { success: true, message: `Added ${product.name} to your cart!` };
    }
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message?: string } => {
    const item = items.find(i => i.productId === productId);
    if (!item) return { success: false, message: 'Item not in cart' };

    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true, message: 'Item removed from cart' };
    }

    if (quantity > item.product.stockQuantity) {
      return {
        success: false,
        message: `Exceeds available stock (${item.product.stockQuantity} ${item.product.unit})`
      };
    }

    setItems(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
    return { success: true };
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  // Agricultural products standard nominal logistics / green delivery handling:
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const taxAmount = Math.round(subtotal * 0.05); // 5% GST on farm equipment/packaging
  const totalAmount = subtotal + shippingFee + taxAmount;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingFee,
        taxAmount,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
