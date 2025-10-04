export interface Product {
  id: string;
  name: string;
  category: 'Beers' | 'Spirits' | 'Soft Drinks' | 'Wines' | 'Snacks';
  retailPrice: number;
  wholesalePrice: number;
  unitsPerCase: number;
  stock: number;
  lowStockThreshold: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  amountPaid: number;
  customerName: string;
  customerId: string;
  waiterName: string;
  waiterId: string;
  date: string;
  status: 'pending' | 'partial' | 'paid';
}


export interface Sale {
  id: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  amountPaid: number;
  customerName: string;
  date: string;
  waiterName: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  debt: number;
  avatarUrl: string;
}

export interface Expense {
  id: string;
  category: 'Salaries' | 'Rent' | 'Purchases' | 'Utilities' | 'Other';
  amount: number;
  description: string;
  date: string;
}

export interface Waiter {
  id: string;
  name: string;
}
