import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { products, sales } from '@/lib/data';
import { Progress } from '@/components/ui/progress';

export function BestSellers() {
  // A real app would calculate this from sales data
  const bestSellers = [
    { productId: 'prod_1', salesCount: 52 },
    { productId: 'prod_5', salesCount: 45 },
    { productId: 'prod_3', salesCount: 30 },
    { productId: 'prod_2', salesCount: 18 },
    { productId: 'prod_4', salesCount: 7 },
  ];

  const maxSales = Math.max(...bestSellers.map(p => p.salesCount));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Best Sellers</CardTitle>
        <CardDescription>Top selling products this month.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bestSellers.map(seller => {
            const product = products.find(p => p.id === seller.productId);
            if (!product) return null;
            const progressValue = (seller.salesCount / maxSales) * 100;

            return (
              <div key={product.id} className="space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-muted-foreground">{seller.salesCount} sold</span>
                </div>
                <Progress value={progressValue} className="h-2" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
