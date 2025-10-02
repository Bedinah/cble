import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { customers, sales } from '@/lib/data';

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Sales</CardTitle>
        <CardDescription>A log of the most recent sales.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sales.slice(0, 5).map((sale) => {
          const customer = customers.find(c => c.name === sale.customerName);
          const initials = sale.customerName.split(' ').map(n => n[0]).join('') || 'WI';

          return (
            <div key={sale.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={customer?.avatarUrl} alt="Avatar" />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  Purchased {sale.items.reduce((acc, item) => acc + item.quantity, 0)} items
                </p>
              </div>
              <div className="ml-auto font-medium">
                +RWF{sale.total.toLocaleString()}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
