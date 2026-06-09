export type Vendor = {
  id: string;
  name: string;
  storeName: string;
  email: string;
  logo: string;
  rating: number;
  joinedAt: string;
  userId?: string;
};

export type Product = {
  id: string;
  vendorId: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  storage: string;
  ram: string;
  rating: number;
  createdAt: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  items: { productId: string; quantity: number; price: number; vendorId: string }[];
  total: number;
  platformFee: number;
  buyerName: string;
  createdAt: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
};

export type Role = 'buyer' | 'vendor' | 'admin';

export type AuthUser = {
  id: string;
  email: string;
  role: Role;
};
