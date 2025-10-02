import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function CustomersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Customer &amp; Debt Management</CardTitle>
        <CardDescription>
          Manage customer profiles and track their running tabs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This module helps you keep track of your customers, especially those with unpaid bills. You can create customer profiles, manage their running tabs by adding debts and recording payments, and see reports on total outstanding debt versus collected amounts.</p>
      </CardContent>
    </Card>
  );
}
