'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products as initialProducts, sales } from '@/lib/data';
import type { Product } from '@/lib/types';
import { AddStockForm } from '@/components/stock/add-stock-form';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle, LayoutGrid, List } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Calculate total sold for each product
const getSoldQuantity = (productId: string) => {
  return sales
    .flatMap(sale => sale.items)
    .filter(item => item.productId === productId)
    .reduce((total, item) => total + item.quantity, 0);
};

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [view, setView] = useState<'table' | 'grid'>('table');

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
  
  const productsWithSales = products.map(product => ({
    ...product,
    sold: getSoldQuantity(product.id),
  }));

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline">Stock Management</h1>
            <p className="text-muted-foreground">
              Track your inventory levels, add new stock, and monitor what's selling.
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
      </div>
      
      {view === 'table' ? (
        <Card>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">In Stock</TableHead>
                    <TableHead className="text-center">Sold</TableHead>
                    <TableHead className="text-center">Stock Status</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {productsWithSales.map(product => (
                    <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold">
                        {product.stock} units
                    </TableCell>
                    <TableCell className="text-center font-medium text-muted-foreground">
                        {product.sold} units
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
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsWithSales.map(product => (
                 <Card key={product.id} className="flex flex-col">
                    <CardContent className="pt-6 flex-grow space-y-4">
                        <div className="space-y-1">
                            <h3 className="font-headline text-lg">{product.name}</h3>
                            <Badge variant="outline">{product.category}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Sold:</span>
                            <span className="font-medium">{product.sold} units</span>
                        </div>
                         {product.stock <= 0 ? (
                            <Badge variant="destructive" className="w-full justify-center">Out of Stock</Badge>
                        ) : product.stock <= product.lowStockThreshold ? (
                            <Badge variant="destructive" className="bg-yellow-500 text-black hover:bg-yellow-600 w-full justify-center">Low Stock</Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 w-full justify-center">In Stock</Badge>
                        )}
                    </CardContent>
                    <CardFooter>
                        <div className="w-full flex justify-between items-center text-sm font-bold p-3 rounded-md bg-secondary/50">
                            <span className="text-secondary-foreground">Stock on hand:</span>
                            <span className="text-primary">{product.stock} units</span>
                        </div>
                    </CardFooter>
                </Card>
            ))}
        </div>
      )}
    </div>
  );
}
