'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AddExpenseForm } from '@/components/expenses/add-expense-form';
import type { Expense } from '@/lib/types';
import { expenses as initialExpenses } from '@/lib/data';
import { format } from 'date-fns';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp_${expenses.length + 1}`,
      date: new Date().toISOString(),
    };
    setExpenses(prev => [newExpense, ...prev]);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Expense Tracking</h1>
          <p className="text-muted-foreground">
            Log and categorize all your daily business expenses.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Record a new business expense.
              </DialogDescription>
            </DialogHeader>
            <AddExpenseForm onAddExpense={handleAddExpense} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map(expense => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {format(new Date(expense.date), 'dd MMM, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell className="text-right font-bold">
                    RWF {expense.amount.toLocaleString()}
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
