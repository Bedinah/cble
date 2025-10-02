'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products as initialProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { AddStockForm } from '@/components/stock/add-stock-form';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddStock = (productId: string, quantity: number, quantityType: 'units' | 'cases') => {
    setProducts(prevProducts =>
      prevProducts.map(p => {
        if (p.id === productId) {
          const quantityInUnits = quantityType === 'cases' ? quantity * p.unitsPerCase : quantity;
          return { ...p, stock: p.stock + quantityInUnits };
        }
        return p;
      })
    );
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline">Stock Management</h1>
            <p className="text-muted-foreground">
              Track your inventory levels, add new stock, and monitor expiry dates.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Stock</DialogTitle>
                <DialogDescription>
                  Select a product and enter the quantity to add.
                </DialogDescription>
              </DialogHeader>
              <AddStockForm products={products} onAddStock={handleAddStock} />
            </DialogContent>
          </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Stock on Hand</TableHead>
                <TableHead className="text-center">Stock Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {product.stock} units
                  </TableCell>
                  <TableCell className="text-center">
                    {product.stock <= 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : product.stock <= product.lowStockThreshold ? (
                      <Badge variant="destructive" className="bg-yellow-500 text-black hover:bg-yellow-600">Low Stock</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">In Stock</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
