export type Product = {
  id: number;
  title: string;
  artist: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isFavorited?: boolean;
};

export type Order = {
  id: string;
  customerEmail: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  createdAt: string;
  items: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  createdAt: string;
};


