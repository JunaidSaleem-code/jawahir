'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface CartItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('gg-cart') : null;
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('gg-cart', JSON.stringify(items));
      }
    } catch {}
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const incrementBy = Math.max(1, newItem.quantity ?? 1);
    setItems(current => {
      const existingItem = current.find(item => item.id === newItem.id && item.size === newItem.size);
      if (existingItem) {
        return current.map(item =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + incrementBy }
            : item
        );
      }
      return [...current, { ...newItem, quantity: incrementBy }];
    });
  };

  const removeItem = (id: number, size: string) => {
    setItems(current => current.filter(item => !(item.id === id && item.size === size)));
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.id === id && item.size === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}