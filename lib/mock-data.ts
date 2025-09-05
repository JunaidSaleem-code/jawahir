import type { Product, Order, Customer } from '@/lib/types';

export const MOCK_PRODUCTS: Product[] = [
  // Jewelry Collection
  { id: 1, title: 'Diamond Solitaire Ring', artist: 'Jawahir Collection', price: 45000, originalPrice: 55000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop&crop=center', category: 'Rings', isNew: true },
  { id: 2, title: 'Pearl Drop Earrings', artist: 'Jawahir Collection', price: 18000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop&crop=center', category: 'Earrings' },
  { id: 3, title: 'Emerald Pendant Necklace', artist: 'Jawahir Collection', price: 35000, image: 'https://images.unsplash.com/photo-1596944924616-7b384c9dc7b3?w=600&h=600&fit=crop&crop=center', category: 'Necklaces', isFavorited: true },
  { id: 4, title: 'Gold Bangle Set', artist: 'Jawahir Collection', price: 25000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center', category: 'Bangles', isNew: true },
  { id: 5, title: 'Sapphire Cocktail Ring', artist: 'Jawahir Collection', price: 32000, originalPrice: 38000, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&crop=center', category: 'Rings' },
  { id: 6, title: 'Diamond Tennis Bracelet', artist: 'Jawahir Collection', price: 42000, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&crop=center', category: 'Bracelets' },
  { id: 7, title: 'Ruby Chandelier Earrings', artist: 'Jawahir Collection', price: 28000, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&crop=center', category: 'Earrings' },
  { id: 8, title: 'Pearl Choker Necklace', artist: 'Jawahir Collection', price: 22000, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&crop=center', category: 'Necklaces' },
  
  // Home Decor Collection
  { id: 9, title: 'Crystal Chandelier', artist: 'Decor Collection', price: 15000, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Lighting' },
  { id: 10, title: 'Vintage Mirror Frame', artist: 'Decor Collection', price: 8500, image: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Mirrors' },
  { id: 11, title: 'Ceramic Vase Set', artist: 'Decor Collection', price: 6500, image: 'https://images.pexels.com/photos/1198802/pexels-photo-1198802.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Vases' },
  { id: 12, title: 'Wooden Wall Art', artist: 'Decor Collection', price: 12000, image: 'https://images.pexels.com/photos/1337753/pexels-photo-1337753.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Wall Art' },
  { id: 13, title: 'Decorative Cushions', artist: 'Decor Collection', price: 3500, image: 'https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Cushions' },
  { id: 14, title: 'Candle Holders Set', artist: 'Decor Collection', price: 4500, image: 'https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Candles' },
  { id: 15, title: 'Table Runner', artist: 'Decor Collection', price: 2800, image: 'https://images.pexels.com/photos/1974973/pexels-photo-1974973.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Tableware' },
  { id: 16, title: 'Floor Lamp', artist: 'Decor Collection', price: 18000, image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'Lighting' },
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-1001', customerEmail: 'sarah@example.com', status: 'Delivered', total: 63000, createdAt: '2025-02-12', items: 2 },
  { id: 'ORD-1002', customerEmail: 'ahmed@example.com', status: 'Pending', total: 18000, createdAt: '2025-02-14', items: 1 },
  { id: 'ORD-1003', customerEmail: 'fatima@example.com', status: 'Shipped', total: 87000, createdAt: '2025-02-15', items: 3 },
];

export const MOCK_ORDER_ITEMS: Record<string, Array<{ title: string; qty: number; price: number }>> = {
  'ORD-1001': [
    { title: 'Diamond Solitaire Ring', qty: 1, price: 45000 },
    { title: 'Pearl Drop Earrings', qty: 1, price: 18000 },
  ],
  'ORD-1002': [
    { title: 'Pearl Drop Earrings', qty: 1, price: 18000 },
  ],
  'ORD-1003': [
    { title: 'Emerald Pendant Necklace', qty: 1, price: 35000 },
    { title: 'Crystal Chandelier', qty: 1, price: 15000 },
    { title: 'Diamond Tennis Bracelet', qty: 1, price: 37000 },
  ],
};

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'CUS-2001', name: 'Sarah Khan', email: 'sarah@example.com', orders: 5, totalSpent: 214900, createdAt: '2024-12-01' },
  { id: 'CUS-2002', name: 'Ahmed Ali', email: 'ahmed@example.com', orders: 2, totalSpent: 54000, createdAt: '2025-01-10' },
  { id: 'CUS-2003', name: 'Fatima Sheikh', email: 'fatima@example.com', orders: 3, totalSpent: 127900, createdAt: '2025-02-05' },
];


