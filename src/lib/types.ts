export interface Product {
  id: string;
  name: string;
  category: 'Beers' | 'Spirits' | 'Soft Drinks' | 'Wines';
  retailPrice: number;
  wholesalePrice: number;
  unitsPerCase: number;
  stock: number;
  lowStockThreshold: number;
  expiryDate: string;
}

export interface Sale {
  id: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  customerName: string;
  date: string;
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
