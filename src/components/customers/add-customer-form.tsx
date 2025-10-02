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
import type { Customer } from '@/lib/types';

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  contact: z.string().min(10, 'Contact must be a valid phone number or email.'),
});

type AddCustomerFormProps = {
  onAddCustomer: (customer: Omit<Customer, 'id' | 'avatarUrl' | 'debt'>) => void;
};

export function AddCustomerForm({ onAddCustomer }: AddCustomerFormProps) {
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      contact: '',
    },
  });

  function onSubmit(values: z.infer<typeof customerSchema>) {
    onAddCustomer(values);
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
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Info</FormLabel>
              <FormControl>
                <Input placeholder="Phone number or email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Customer</Button>
      </form>
    </Form>
  );
}
