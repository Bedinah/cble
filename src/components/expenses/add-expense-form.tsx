'use client';

import { useForm } from 'react-hook-form';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Expense } from '@/lib/types';

const expenseSchema = z.object({
  category: z.enum(['Salaries', 'Rent', 'Purchases', 'Utilities', 'Other']),
  amount: z.coerce.number().min(1, 'Amount must be greater than zero.'),
  description: z.string().min(3, 'Please provide a brief description.'),
});

type AddExpenseFormProps = {
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
};

export function AddExpenseForm({ onAddExpense }: AddExpenseFormProps) {
  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: 'Purchases',
      amount: 0,
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof expenseSchema>) {
    onAddExpense(values);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an expense category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Purchases">Stock Purchases</SelectItem>
                  <SelectItem value="Salaries">Staff Salaries</SelectItem>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (RWF)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 50000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Bought 2 cases of Mützig"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Expense</Button>
      </form>
    </Form>
  );
}
