'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  category: z.enum(['Beers', 'Spirits', 'Soft Drinks', 'Wines', 'Snacks']),
  retailPrice: z.coerce.number().min(0, 'Retail price must be a positive number.'),
  wholesalePrice: z.coerce.number().min(0, 'Wholesale price must be a positive number.'),
  unitsPerCase: z.coerce.number().min(1, 'Units per case must be at least 1.'),
  stock: z.coerce.number().min(0, 'Stock cannot be negative.'),
  lowStockThreshold: z.coerce.number().min(0, 'Low stock threshold must be a positive number.'),
  expiryDate: z.date({
    required_error: "An expiry date is required.",
  }),
});

type AddProductFormProps = {
  onAddProduct: (product: Omit<Product, 'id'>) => void;
};

export function AddProductForm({ onAddProduct }: AddProductFormProps) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: 'Beers',
      retailPrice: 0,
      wholesalePrice: 0,
      unitsPerCase: 24,
      stock: 0,
      lowStockThreshold: 10,
    },
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    onAddProduct({ ...values, expiryDate: format(values.expiryDate, 'yyyy-MM-dd') });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Heineken 330ml" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Beers">Beers</SelectItem>
                  <SelectItem value="Spirits">Spirits</SelectItem>
                  <SelectItem value="Soft Drinks">Soft Drinks</SelectItem>
                  <SelectItem value="Wines">Wines</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="retailPrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Retail Price</FormLabel>
                 <FormDescription>Per bottle/shot</FormDescription>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="wholesalePrice"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Wholesale Price</FormLabel>
                <FormDescription>Per case</FormDescription>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="unitsPerCase"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Units Per Case</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                 <FormDescription>e.g. 24 bottles</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Initial Stock</FormLabel>
                <FormControl>
                    <Input type="number" {...field} />
                </FormControl>
                 <FormDescription>In units</FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="lowStockThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Low Stock Threshold</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
               <FormDescription>Alert when stock falls to this level</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Expiry Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Product</Button>
      </form>
    </Form>
  );
}
