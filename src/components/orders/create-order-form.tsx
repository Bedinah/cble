'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { MinusCircle, PlusCircle, X } from 'lucide-react';
import type { Order, Product, Customer, Waiter } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const orderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string(),
  quantity: z.coerce.number().min(1),
  price: z.coerce.number(),
});

const orderSchema = z.object({
  waiterId: z.string().min(1, 'Please select a waiter.'),
  customerId: z.string().min(1, 'Please select a customer.'),
  items: z.array(orderItemSchema).min(1, 'Please add at least one item.'),
});

type CreateOrderFormProps = {
  products: Product[];
  customers: Customer[];
  waiters: Waiter[];
  onCreateOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'total' | 'amountPaid'>) => void;
};

export function CreateOrderForm({ products, customers, waiters, onCreateOrder }: CreateOrderFormProps) {
  const [cart, setCart] = useState<Map<string, { product: Product; quantity: number }>>(new Map());
  const { toast } = useToast();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      waiterId: '',
      customerId: '',
      items: [],
    },
  });
  
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const cartTotal = Array.from(cart.values()).reduce((sum, item) => sum + item.product.retailPrice * item.quantity, 0);

  const addToCart = (product: Product) => {
    const existingItem = cart.get(product.id);
    const newQuantity = (existingItem?.quantity || 0) + 1;
    
    if (newQuantity > product.stock) {
      toast({ title: 'Out of stock', variant: 'destructive' });
      return;
    }

    const updatedCart = new Map(cart);
    updatedCart.set(product.id, { product, quantity: newQuantity });
    setCart(updatedCart);

    const itemIndex = fields.findIndex(field => field.productId === product.id);
    if(itemIndex > -1){
        update(itemIndex, { 
            productId: product.id, 
            productName: product.name,
            quantity: newQuantity, 
            price: product.retailPrice * newQuantity 
        });
    } else {
        append({ 
            productId: product.id, 
            productName: product.name,
            quantity: 1, 
            price: product.retailPrice 
        });
    }
  };

  const updateQuantity = (productId: string, change: 1 | -1) => {
    const existingItem = cart.get(productId);
    if (!existingItem) return;

    const newQuantity = existingItem.quantity + change;
    
    if (newQuantity > existingItem.product.stock) {
        toast({ title: 'Stock limit reached', variant: 'destructive' });
        return;
    }
    
    const updatedCart = new Map(cart);
    if (newQuantity <= 0) {
      updatedCart.delete(productId);
      const itemIndex = fields.findIndex(field => field.productId === productId);
      if(itemIndex > -1) remove(itemIndex);
    } else {
      updatedCart.set(productId, { ...existingItem, quantity: newQuantity });
       const itemIndex = fields.findIndex(field => field.productId === productId);
       if(itemIndex > -1){
           update(itemIndex, { 
               ...fields[itemIndex],
               quantity: newQuantity,
               price: existingItem.product.retailPrice * newQuantity
           })
       }
    }
    setCart(updatedCart);
  };
  
  const removeFromCart = (productId: string) => {
      const updatedCart = new Map(cart);
      updatedCart.delete(productId);
      setCart(updatedCart);
      const itemIndex = fields.findIndex(field => field.productId === productId);
      if(itemIndex > -1) remove(itemIndex);
  }


  function onSubmit(values: z.infer<typeof orderSchema>) {
    const waiter = waiters.find(w => w.id === values.waiterId);
    const customer = customers.find(c => c.id === values.customerId);
    
    if(!waiter || !customer) {
        toast({ title: 'Invalid waiter or customer', variant: 'destructive' });
        return;
    }

    const orderPayload = {
      waiterId: waiter.id,
      waiterName: waiter.name,
      customerId: customer.id,
      customerName: customer.name,
      items: values.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
    };
    onCreateOrder(orderPayload);
    form.reset();
    setCart(new Map());
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="waiterId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Waiter</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a waiter" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {waiters.map(waiter => (
                            <SelectItem key={waiter.id} value={waiter.id}>{waiter.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a customer" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {customers.map(customer => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />

            <Card>
                <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold">Order Summary</h3>
                    <ScrollArea className="h-40">
                    {Array.from(cart.entries()).map(([productId, { product, quantity }]) => (
                         <div key={productId} className="flex items-start justify-between text-sm py-1">
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">RWF {product.retailPrice.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="icon" type="button" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(productId, -1)}>
                                    <MinusCircle className="h-4 w-4" />
                                </Button>
                                <span className="font-bold w-4 text-center">{quantity}</span>
                                <Button size="icon" type="button" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(productId, 1)}>
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                                <Button size="icon" type="button" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(productId)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {cart.size === 0 && <p className="text-sm text-muted-foreground text-center pt-8">No items in order.</p>}
                    </ScrollArea>
                    <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>RWF {cartTotal.toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" className="w-full">Create Order</Button>
        </div>
        <div>
            <FormLabel>Products</FormLabel>
            <ScrollArea className="h-[450px] mt-2">
                <div className="grid grid-cols-3 gap-2 pr-4">
                    {products.map(product => (
                        <Card key={product.id} className="cursor-pointer hover:shadow-lg" onClick={() => addToCart(product)}>
                            <CardContent className="p-2 text-center text-xs">
                                <p className="font-semibold truncate">{product.name}</p>
                                <p className="text-muted-foreground">RWF {product.retailPrice.toLocaleString()}</p>
                                <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'} className="text-xs mt-1 w-full justify-center">
                                    {product.stock > 0 ? `${product.stock} left` : 'Out'}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </ScrollArea>
        </div>
      </form>
    </Form>
  );
}
