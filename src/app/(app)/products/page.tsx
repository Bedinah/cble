'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products as initialProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import { AddProductForm } from '@/components/products/add-product-form';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const productWithId: Product = {
      ...newProduct,
      id: `prod_${products.length + 1}`,
    };
    setProducts(prevProducts => [...prevProducts, productWithId]);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-headline">Product Management</h1>
            <p className="text-muted-foreground">
              Manage your product categories, prices, and unit conversions.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new product to your inventory.
                </DialogDescription>
              </DialogHeader>
              <AddProductForm onAddProduct={handleAddProduct} />
            </DialogContent>
          </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-lg">{product.name}</CardTitle>
              <CardDescription>
                <Badge variant="outline">{product.category}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Retail Price:</span>
                    <span className="font-medium">RWF {product.retailPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Wholesale Price:</span>
                    <span className="font-medium">RWF {product.wholesalePrice.toLocaleString()}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Units/Case:</span>
                    <span className="font-medium">{product.unitsPerCase}</span>
                </div>
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
    </div>
  );
}
