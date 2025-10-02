'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AddCustomerForm } from '@/components/customers/add-customer-form';
import type { Customer } from '@/lib/types';
import { customers as initialCustomers, sales } from '@/lib/data';
import { Badge } from '@/components/ui/badge';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<'table' | 'grid'>('table');

  const handleAddCustomer = (newCustomerData: Omit<Customer, 'id' | 'avatarUrl' | 'debt'>) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: `cust_${customers.length + 1}`,
      debt: 0,
      avatarUrl: `https://picsum.photos/seed/${customers.length + 1}/40/40`,
    };
    setCustomers(prev => [...prev, newCustomer]);
    setIsDialogOpen(false);
  };

  const getCustomerStats = (customerName: string) => {
    const customerSales = sales.filter(s => s.customerName === customerName);
    const totalPurchases = customerSales.reduce((sum, sale) => sum + sale.total, 0);
    return { totalPurchases };
  }

  const customersWithStats = customers.map(customer => {
    const { totalPurchases } = getCustomerStats(customer.name);
    const totalPaid = totalPurchases - customer.debt;
    return {
      ...customer,
      totalPurchases,
      totalPaid,
    }
  });


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Customer & Debt Management</h1>
          <p className="text-muted-foreground">
            Manage customer profiles and track their spending and debts.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setView('table')} disabled={view === 'table'}>
                <List className="h-4 w-4" />
                <span className="sr-only">Table View</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => setView('grid')} disabled={view === 'grid'}>
                <LayoutGrid className="h-4 w-4" />
                <span className="sr-only">Grid View</span>
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2" />
                  Add Customer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Customer</DialogTitle>
                  <DialogDescription>
                    Create a new customer profile.
                  </DialogDescription>
                </DialogHeader>
                <AddCustomerForm onAddCustomer={handleAddCustomer} />
              </DialogContent>
            </Dialog>
        </div>
      </div>

      {view === 'table' ? (
         <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Total Purchases</TableHead>
                  <TableHead className="text-right">Outstanding Debt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customersWithStats.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                          <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-xs text-muted-foreground">{customer.contact}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-accent">RWF {customer.totalPaid.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">RWF {customer.totalPurchases.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-bold">
                       {customer.debt > 0 ? (
                        <span className="text-destructive">RWF {customer.debt.toLocaleString()}</span>
                      ) : (
                        <span className="text-muted-foreground">RWF 0</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {customersWithStats.map(customer => (
                 <Card key={customer.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                                <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="font-headline text-lg">{customer.name}</CardTitle>
                                <CardDescription className="text-xs">{customer.contact}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Paid:</span>
                            <span className="font-medium text-accent">RWF {customer.totalPaid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Purchases:</span>
                            <span className="font-medium">RWF {customer.totalPurchases.toLocaleString()}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <div className="w-full">
                            {customer.debt > 0 ? (
                                <div className="w-full flex justify-between items-center text-sm font-bold p-3 rounded-md bg-destructive/10">
                                    <span className="text-destructive">Outstanding Debt:</span>
                                    <span className="text-destructive">RWF {customer.debt.toLocaleString()}</span>
                                </div>
                            ) : (
                                <div className="w-full text-center text-sm p-3 rounded-md bg-secondary/50">
                                    <span className="text-secondary-foreground font-medium">No outstanding debt</span>
                                </div>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
