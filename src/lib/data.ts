import type { Product, Sale, Customer, Expense, Waiter, Order } from './types';
import { subDays, subHours } from 'date-fns';

export const waiters: Waiter[] = [
  { id: 'waiter_1', name: 'Alice' },
  { id: 'waiter_2', name: 'Bob' },
  { id: 'waiter_3', name: 'Charlie' },
];

export const products: Product[] = [
  { id: 'prod_1', name: 'Heineken 330ml', category: 'Beers', retailPrice: 2000, wholesalePrice: 40000, unitsPerCase: 24, stock: 43, lowStockThreshold: 24 },
  { id: 'prod_2', name: 'Jameson Irish Whiskey', category: 'Spirits', retailPrice: 5000, wholesalePrice: 55000, unitsPerCase: 12, stock: 10, lowStockThreshold: 6 },
  { id: 'prod_3', name: 'Coca-Cola 500ml', category: 'Soft Drinks', retailPrice: 500, wholesalePrice: 10000, unitsPerCase: 24, stock: 150, lowStockThreshold: 50 },
  { id: 'prod_4', name: 'Four Cousins Red Wine', category: 'Wines', retailPrice: 15000, wholesalePrice: 80000, unitsPerCase: 6, stock: 5, lowStockThreshold: 3 },
  { id: 'prod_5', name: 'Mützig 500ml', category: 'Beers', retailPrice: 1500, wholesalePrice: 32000, unitsPerCase: 24, stock: 80, lowStockThreshold: 48 },
  { id: 'prod_6', name: 'Fanta Orange 500ml', category: 'Soft Drinks', retailPrice: 500, wholesalePrice: 10000, unitsPerCase: 24, stock: 20, lowStockThreshold: 24 },
];

export const customers: Customer[] = [
  { id: 'cust_1', name: 'John Doe', contact: '+250788123456', debt: 15000, avatarUrl: 'https://picsum.photos/seed/1/40/40' },
  { id: 'cust_2', name: 'Jane Smith', contact: '+250788654321', debt: 0, avatarUrl: 'https://picsum.photos/seed/2/40/40' },
  { id: 'cust_3', name: 'Peter Jones', contact: '+250788987654', debt: 5000, avatarUrl: 'https://picsum.photos/seed/3/40/40' },
  { id: 'cust_4', name: 'Maryanne Wanjiru', contact: '+250722112233', debt: 22500, avatarUrl: 'https://picsum.photos/seed/4/40/40' },
  { id: 'walk-in', name: 'Walk-in Customer', contact: '', debt: 0, avatarUrl: ''},
];

const now = new Date();

export const sales: Sale[] = [
  { id: 'sale_1', items: [{ productId: 'prod_1', quantity: 2, price: 4000 }, { productId: 'prod_3', quantity: 1, price: 500 }], total: 4500, amountPaid: 4500, customerName: 'Jane Smith', date: new Date(2024, 5, 4, 18, 30).toISOString(), waiterName: 'Alice' },
  { id: 'sale_2', items: [{ productId: 'prod_2', quantity: 1, price: 5000 }], total: 5000, amountPaid: 0, customerName: 'Peter Jones', date: new Date(2024, 5, 4, 15, 0).toISOString(), waiterName: 'Bob' },
  { id: 'sale_3', items: [{ productId: 'prod_5', quantity: 6, price: 9000 }], total: 9000, amountPaid: 9000, customerName: 'Walk-in', date: new Date(2024, 5, 3, 12, 0).toISOString(), waiterName: 'Charlie' },
  { id: 'sale_4', items: [{ productId: 'prod_1', quantity: 12, price: 24000 }], total: 24000, amountPaid: 10000, customerName: 'John Doe', date: new Date(2024, 5, 2, 10, 0).toISOString(), waiterName: 'Alice' },
  { id: 'sale_5', items: [{ productId: 'prod_4', quantity: 1, price: 15000 }], total: 15000, amountPaid: 7500, customerName: 'Maryanne Wanjiru', date: new Date(2024, 5, 1, 14, 0).toISOString(), waiterName: 'Bob' },
];

export const expenses: Expense[] = [
  { id: 'exp_1', category: 'Purchases', amount: 80000, description: 'Restocked Heineken & Mützig', date: new Date(2024, 5, 3, 9, 0).toISOString() },
  { id: 'exp_2', category: 'Salaries', amount: 150000, description: 'Staff salaries for May', date: new Date(2024, 5, 2, 11, 0).toISOString() },
  { id: 'exp_3', category: 'Utilities', amount: 25000, description: 'Electricity bill', date: new Date(2024, 5, 0, 16, 0).toISOString() },
  { id: 'exp_4', category: 'Rent', amount: 200000, description: 'June Rent', date: new Date(2024, 4, 29, 13, 0).toISOString() },
];


export const orders: Order[] = [
    {
        id: 'order_1',
        items: [{ productId: 'prod_1', quantity: 5, price: 10000 }],
        total: 10000,
        amountPaid: 0,
        customerName: 'John Doe',
        customerId: 'cust_1',
        waiterName: 'Alice',
        waiterId: 'waiter_1',
        date: new Date(2024, 5, 4, 19, 0).toISOString(),
        status: 'pending'
    },
    {
        id: 'order_2',
        items: [{ productId: 'prod_5', quantity: 2, price: 3000 }, { productId: 'prod_3', quantity: 2, price: 1000 }],
        total: 4000,
        amountPaid: 2000,
        customerName: 'Maryanne Wanjiru',
        customerId: 'cust_4',
        waiterName: 'Bob',
        waiterId: 'waiter_2',
        date: new Date(2024, 5, 4, 17, 0).toISOString(),
        status: 'partial'
    }
]
