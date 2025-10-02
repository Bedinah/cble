import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ExpensesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Expense Tracking</CardTitle>
        <CardDescription>
          Log and categorize all your daily business expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Keep a detailed record of your daily expenses here. You can categorize costs like staff salaries, rent, new stock purchases, and utilities. This information is crucial for accurately calculating your profit and loss.</p>
      </CardContent>
    </Card>
  );
}
