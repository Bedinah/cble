import { DollarSign, TrendingDown, TrendingUp, AlertCircle, Package } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { BestSellers } from '@/components/dashboard/best-sellers';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { sales, expenses, customers } from '@/lib/data';
import { LowStockTable } from '@/components/dashboard/low-stock-table';

export default function DashboardPage() {
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalDebt = customers.reduce((sum, customer) => sum + customer.debt, 0);

  // Today's stats
  const today = new Date().toISOString().split('T')[0];
  const revenueToday = sales
    .filter(s => s.date.startsWith(today))
    .reduce((sum, sale) => sum + sale.total, 0);

  const expensesToday = expenses
    .filter(e => e.date.startsWith(today))
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Revenue (Today)"
          value={`RWF ${revenueToday.toLocaleString()}`}
          icon={DollarSign}
          description="Total sales recorded today"
        />
        <StatCard
          title="Expenses (Today)"
          value={`RWF ${expensesToday.toLocaleString()}`}
          icon={TrendingDown}
          description="Total expenses logged today"
        />
        <StatCard
          title="Monthly Profit/Loss"
          value={`RWF ${netProfit.toLocaleString()}`}
          icon={netProfit >= 0 ? TrendingUp : TrendingDown}
          description={netProfit >= 0 ? "You are in profit this month" : "You are at a loss this month"}
          colorClass={netProfit >= 0 ? 'text-accent' : 'text-destructive'}
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity />
        <LowStockTable />
      </div>
    </div>
  );
}
