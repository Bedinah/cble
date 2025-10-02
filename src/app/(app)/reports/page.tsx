import { StockAnalysis } from '@/components/reports/stock-analysis';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-headline">Reports &amp; Analytics</h1>
      
      <StockAnalysis />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Monthly Profit/Loss</CardTitle>
            <CardDescription>Awaiting full report implementation.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">A detailed monthly profit and loss statement will be available here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Expense vs. Income</CardTitle>
            <CardDescription>Awaiting chart implementation.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">A chart comparing expenses and income over time will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
