import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SalesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Sales &amp; POS</CardTitle>
        <CardDescription>
          Record new sales and view your daily earnings reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is your Point-of-Sale (POS) interface. Here, you'll be able to quickly sell products using a touch-friendly interface. Sales will be tracked by customer, which is useful for managing debts. You can also generate and view detailed daily earnings reports.</p>
      </CardContent>
    </Card>
  );
}
