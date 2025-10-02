import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';

export function LowStockTable() {
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle className="font-headline">Low Stock Alerts</CardTitle>
        <CardDescription>Products that need restocking soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Left</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockProducts.map(product => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">{product.stock}</Badge>
                </TableCell>
                <TableCell>{product.lowStockThreshold}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline">Restock</Button>
                </TableCell>
              </TableRow>
            ))}
            {lowStockProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  All products are well-stocked.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
