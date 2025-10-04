'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Printer, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Order, Product, Customer, Waiter, Sale } from '@/lib/types';
import { products as initialProducts, orders as initialOrders, customers as initialCustomers, waiters as initialWaiters, sales as initialSales } from '@/lib/data';
import { format } from 'date-fns';
import { CreateOrderForm } from '@/components/orders/create-order-form';
import { SettleOrderForm } from '@/components/orders/settle-order-form';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [products] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [waiters] = useState<Waiter[]>(initialWaiters);
  const [sales, setSales] = useState<Sale[]>(initialSales);

  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isSettleOrderOpen, setIsSettleOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleCreateOrder = (newOrderData: Omit<Order, 'id' | 'date' | 'status' | 'total' | 'amountPaid'>) => {
    const total = newOrderData.items.reduce((sum, item) => sum + item.price, 0);
    const newOrder: Order = {
      ...newOrderData,
      id: `order_${orders.length + 1}`,
      date: new Date().toISOString(),
      status: 'pending',
      total: total,
      amountPaid: 0,
    };
    setOrders(prev => [newOrder, ...prev]);
    setIsCreateOrderOpen(false);
  };

  const handleSettleOrder = (orderId: string, amountPaid: number) => {
     setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === orderId) {
          const newAmountPaid = order.amountPaid + amountPaid;
          const remainingDebt = order.total - newAmountPaid;
          let newStatus: 'pending' | 'partial' | 'paid' = 'paid';
          if (remainingDebt > 0) newStatus = 'partial';

          // Update customer debt
          const debtIncurred = amountPaid < (order.total - order.amountPaid) ? (order.total - order.amountPaid) - amountPaid : 0;
           setCustomers(prevCustomers => prevCustomers.map(c => 
            c.id === order.customerId ? { ...c, debt: c.debt + debtIncurred } : c
           ));

          // Create sale record
          const newSale: Sale = {
            id: `sale_${sales.length + 1}`,
            items: order.items,
            total: order.total,
            amountPaid: newAmountPaid,
            customerName: order.customerName,
            date: new Date().toISOString(),
            waiterName: order.waiterName,
          };
          setSales(prev => [newSale, ...prev]);
          
          if(newStatus === 'paid') return null; // this will filter it out

          return { ...order, amountPaid: newAmountPaid, status: newStatus };
        }
        return order;
      }).filter(Boolean) as Order[];
    });
    setIsSettleOrderOpen(false);
  };
  
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="destructive">Pending</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500 text-black">Partial</Badge>;
      case 'paid':
        return <Badge className="bg-green-500 text-white">Paid</Badge>;
    }
  };

  const openSettleDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsSettleOrderOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Order Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and settle customer orders.
          </p>
        </div>
        <Dialog open={isCreateOrderOpen} onOpenChange={setIsCreateOrderOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Select the waiter, customer, and products for this order.
              </DialogDescription>
            </DialogHeader>
            <CreateOrderForm 
                products={products}
                customers={customers}
                waiters={waiters}
                onCreateOrder={handleCreateOrder}
             />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Pending & Partial Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Waiter</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {format(new Date(order.date), 'dd MMM, hh:mm a')}
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                   <TableCell>{order.waiterName}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                     {order.items.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        return <div key={item.productId}>{item.quantity}x {product?.name}</div>
                    })}
                  </TableCell>
                  <TableCell className="font-bold">RWF {order.total.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-accent">RWF {order.amountPaid.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" onClick={() => openSettleDialog(order)}>Settle</Button>
                    <Button size="sm" variant="outline"><Printer className="h-4 w-4 mr-2"/> Print</Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        No pending orders.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {selectedOrder && (
        <Dialog open={isSettleOrderOpen} onOpenChange={setIsSettleOrderOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settle Order for {selectedOrder.customerName}</DialogTitle>
                    <DialogDescription>
                        Order Total: RWF {selectedOrder.total.toLocaleString()} | Paid: RWF {selectedOrder.amountPaid.toLocaleString()}
                    </DialogDescription>
                </DialogHeader>
                <SettleOrderForm
                    order={selectedOrder}
                    onSettle={handleSettleOrder}
                />
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
