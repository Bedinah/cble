import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function StockPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Stock Management</CardTitle>
        <CardDescription>
          Track your inventory levels, add new stock, and monitor expiry dates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This section allows you to manage your inventory in real-time. You can add new stock by case or by individual units, and the system will automatically track the total quantity. You'll also get low stock alerts and be able to track expiry dates to reduce waste.</p>
      </CardContent>
    </Card>
  );
}
