'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { sales, customers, products } from '@/lib/data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default function ReportsPage() {
  const customersWithDebt = customers.filter(c => c.debt > 0);

  // We need to determine if a sale was on credit.
  // In our current data, we can assume a sale to a named customer might be on credit,
  // especially if that customer has debt. A real implementation would store payment method on the sale.
  const getSaleStatus = (sale: (typeof sales)[0]) => {
     const customer = customers.find(c => c.name === sale.customerName);
     if (sale.customerName === 'Walk-in') return { text: 'Paid', variant: 'secondary' as const, className: 'bg-green-100 text-green-800' };
     // This is a simplification. A real app would store the payment method with the sale.
     // We assume if a customer has debt, some of their sales might be on credit.
     // For this mock, let's mark the most recent sale of a customer with debt as 'On Credit'.
     const lastSaleForCustomer = sales.find(s => s.customerName === customer?.name);
     if (customer && customer.debt > 0 && lastSaleForCustomer?.id === sale.id) {
       return { text: 'On Credit', variant: 'destructive' as const, className: 'bg-yellow-500 text-black hover:bg-yellow-600' };
     }
     return { text: 'Paid', variant: 'secondary' as const, className: 'bg-green-100 text-green-800' };
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Reports &amp; Analytics</h1>

      <Tabs defaultValue="sales">
        <TabsList className="grid w-full grid-cols-2 sm:w-[400px]">
          <TabsTrigger value="sales">Sales Report</TabsTrigger>
          <TabsTrigger value="debts">Debt Report</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Sales Transaction Log</CardTitle>
              <CardDescription>A detailed history of all sales.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map(sale => {
                    const status = getSaleStatus(sale);
                    return (
                        <TableRow key={sale.id}>
                        <TableCell className="font-medium">{format(new Date(sale.date), 'dd MMM, yyyy')}</TableCell>
                        <TableCell>{sale.customerName}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                           {sale.items.map(item => {
                               const product = products.find(p => p.id === item.productId);
                               return <div key={item.productId}>{item.quantity}x {product?.name || 'Unknown'}</div>
                           })}
                        </TableCell>
                        <TableCell className="font-bold">RWF {sale.total.toLocaleString()}</TableCell>
                        <TableCell>
                            <Badge variant={status.variant} className={status.className}>{status.text}</Badge>
                        </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="debts">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Outstanding Customer Debts</CardTitle>
              <CardDescription>A list of all customers with a running tab.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Outstanding Debt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customersWithDebt.length > 0 ? customersWithDebt.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={customer.avatarUrl} alt={customer.name} />
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{customer.contact}</TableCell>
                      <TableCell className="text-right font-bold text-destructive">
                        RWF {customer.debt.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                            No outstanding debts.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
