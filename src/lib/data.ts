import type { Product, Sale, Customer, Expense } from './types';
import { subDays, subHours } from 'date-fns';

export const products: Product[] = [
  { id: 'prod_1', name: 'Heineken 330ml', category: 'Beers', retailPrice: 2000, wholesalePrice: 40000, unitsPerCase: 24, stock: 43, lowStockThreshold: 24, expiryDate: '2025-12-31' },
  { id: 'prod_2', name: 'Jameson Irish Whiskey', category: 'Spirits', retailPrice: 5000, wholesalePrice: 55000, unitsPerCase: 12, stock: 10, lowStockThreshold: 6, expiryDate: '2028-10-20' },
  { id: 'prod_3', name: 'Coca-Cola 500ml', category: 'Soft Drinks', retailPrice: 500, wholesalePrice: 10000, unitsPerCase: 24, stock: 150, lowStockThreshold: 50, expiryDate: '2025-06-30' },
  { id: 'prod_4', name: 'Four Cousins Red Wine', category: 'Wines', retailPrice: 15000, wholesalePrice: 80000, unitsPerCase: 6, stock: 5, lowStockThreshold: 3, expiryDate: '2026-01-15' },
  { id: 'prod_5', name: 'Mützig 500ml', category: 'Beers', retailPrice: 1500, wholesalePrice: 32000, unitsPerCase: 24, stock: 80, lowStockThreshold: 48, expiryDate: '2025-11-01' },
  { id: 'prod_6', name: 'Fanta Orange 500ml', category: 'Soft Drinks', retailPrice: 500, wholesalePrice: 10000, unitsPerCase: 24, stock: 20, lowStockThreshold: 24, expiryDate: '2025-07-22' },
];

export const customers: Customer[] = [
  { id: 'cust_1', name: 'John Doe', contact: '+250788123456', debt: 15000, avatarUrl: 'https://picsum.photos/seed/1/40/40' },
  { id: 'cust_2', name: 'Jane Smith', contact: '+250788654321', debt: 0, avatarUrl: 'https://picsum.photos/seed/2/40/40' },
  { id: 'cust_3', name: 'Peter Jones', contact: '+250788987654', debt: 5000, avatarUrl: 'https://picsum.photos/seed/3/40/40' },
  { id: 'cust_4', name: 'Maryanne Wanjiru', contact: '+250722112233', debt: 22500, avatarUrl: 'https://picsum.photos/seed/4/40/40' },
];

export const sales: Sale[] = [
  { id: 'sale_1', items: [{ productId: 'prod_1', quantity: 2, price: 4000 }, { productId: 'prod_3', quantity: 1, price: 500 }], total: 4500, customerName: 'Jane Smith', date: subHours(new Date(), 2).toISOString() },
  { id: 'sale_2', items: [{ productId: 'prod_2', quantity: 1, price: 5000 }], total: 5000, customerName: 'Peter Jones', date: subHours(new Date(), 5).toISOString() },
  { id: 'sale_3', items: [{ productId: 'prod_5', quantity: 6, price: 9000 }], total: 9000, customerName: 'Walk-in', date: subDays(new Date(), 1).toISOString() },
  { id: 'sale_4', items: [{ productId: 'prod_1', quantity: 12, price: 24000 }], total: 24000, customerName: 'John Doe', date: subDays(new Date(), 2).toISOString() },
  { id: 'sale_5', items: [{ productId: 'prod_4', quantity: 1, price: 15000 }], total: 15000, customerName: 'Maryanne Wanjiru', date: subDays(new Date(), 3).toISOString() },
];

export const expenses: Expense[] = [
  { id: 'exp_1', category: 'Purchases', amount: 80000, description: 'Restocked Heineken &amp; Mützig', date: subDays(new Date(), 1).toISOString() },
  { id: 'exp_2', category: 'Salaries', amount: 150000, description: 'Staff salaries for May', date: subDays(new Date(), 2).toISOString() },
  { id: 'exp_3', category: 'Utilities', amount: 25000, description: 'Electricity bill', date: subDays(new Date(), 4).toISOString() },
  { id: 'exp_4', category: 'Rent', amount: 200000, description: 'June Rent', date: subDays(new Date(), 5).toISOString() },
];
