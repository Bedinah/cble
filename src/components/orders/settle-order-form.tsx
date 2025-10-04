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
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const settleSchema = z.object({
  amountPaid: z.coerce.number().min(0, 'Amount must be a positive number.'),
});

type SettleOrderFormProps = {
  order: Order;
  onSettle: (orderId: string, amountPaid: number) => void;
};

export function SettleOrderForm({ order, onSettle }: SettleOrderFormProps) {
    const { toast } = useToast();
    const remainingBalance = order.total - order.amountPaid;

    const form = useForm<z.infer<typeof settleSchema>>({
        resolver: zodResolver(settleSchema),
        defaultValues: {
            amountPaid: remainingBalance,
        },
    });

  function onSubmit(values: z.infer<typeof settleSchema>) {
    if (values.amountPaid > remainingBalance) {
        toast({
            title: 'Overpayment',
            description: `Amount paid cannot exceed the remaining balance of RWF ${remainingBalance.toLocaleString()}`,
            variant: 'destructive',
        })
        return;
    }
    onSettle(order.id, values.amountPaid);
    form.reset();
  }
  
  const amountToPay = form.watch('amountPaid');
  const newDebt = remainingBalance - amountToPay;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <div className="p-4 border rounded-lg bg-secondary/50">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Total:</span>
                <span className="font-bold">RWF {order.total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Already Paid:</span>
                <span className="font-medium text-accent">RWF {order.amountPaid.toLocaleString()}</span>
            </div>
             <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                <span>Remaining Balance:</span>
                <span>RWF {remainingBalance.toLocaleString()}</span>
            </div>
        </div>
        <FormField
          control={form.control}
          name="amountPaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Pay Now (RWF)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {newDebt > 0 && order.customerId !== 'walk-in' && (
            <p className="text-sm text-center text-destructive font-medium">
                This will add RWF {newDebt.toLocaleString()} to the customer's debt.
            </p>
        )}
        <Button type="submit">Settle Payment</Button>
      </form>
    </Form>
  );
}
