'use client';

import { DollarSign, TrendingDown, TrendingUp, AlertCircle, Package } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { BestSellers } from '@/components/dashboard/best-sellers';
import { sales, expenses, customers } from '@/lib/data';
import { LowStockTable } from '@/components/dashboard/low-stock-table';
import { subDays } from 'date-fns';

// Helper to calculate percentage change
const calculateChange = (current: number, previous: number) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

export default function DashboardPage() {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const today = new Date();
  const yesterday = subDays(today, 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Today's stats
  const revenueToday = sales
    .filter(s => s.date.startsWith(todayStr))
    .reduce((sum, sale) => sum + sale.total, 0);

  const expensesToday = expenses
    .filter(e => e.date.startsWith(todayStr))
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  const earningsToday = revenueToday - expensesToday;

  // Yesterday's stats
  const revenueYesterday = sales
    .filter(s => s.date.startsWith(yesterdayStr))
    .reduce((sum, sale) => sum + sale.total, 0);

  const expensesYesterday = expenses
    .filter(e => e.date.startsWith(yesterdayStr))
    .reduce((sum, expense) => sum + expense.amount, 0);
    
  const totalDebt = customers.reduce((sum, customer) => sum + customer.debt, 0);

  const revenueChange = calculateChange(revenueToday, revenueYesterday);
  const expensesChange = calculateChange(expensesToday, expensesYesterday);


  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue (Today)"
          value={`RWF ${revenueToday.toLocaleString()}`}
          icon={DollarSign}
          description={`${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}% from RWF ${revenueYesterday.toLocaleString()}`}
          colorClass={revenueChange >= 0 ? 'text-accent' : 'text-destructive'}
        />
        <StatCard
          title="Expenses (Today)"
          value={`RWF ${expensesToday.toLocaleString()}`}
          icon={TrendingDown}
          description={`${expensesChange >= 0 ? '+' : ''}${expensesChange.toFixed(1)}% from RWF ${expensesYesterday.toLocaleString()}`}
          colorClass={expensesChange > 0 ? 'text-destructive' : 'text-accent'}
        />
        <StatCard
          title="Earnings (Today)"
          value={`RWF ${earningsToday.toLocaleString()}`}
          icon={earningsToday >= 0 ? TrendingUp : TrendingDown}
          description={earningsToday >= 0 ? "Profit made today" : "Loss made today"}
          colorClass={earningsToday >= 0 ? 'text-accent' : 'text-destructive'}
        />
        <StatCard
          title="Outstanding Debts"
          value={`RWF ${totalDebt.toLocaleString()}`}
          icon={AlertCircle}
          description="Total amount owed by customers"
          colorClass="text-destructive"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <OverviewChart />
        <BestSellers />
      </div>

      <LowStockTable />
    </div>
  );
}
