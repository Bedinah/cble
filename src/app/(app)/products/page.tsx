import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function ProductsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Product Management</CardTitle>
        <CardDescription>
          Manage your product categories, prices, and unit conversions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is where you will add, edit, and view all products offered at your bar. You'll be able to set retail and wholesale prices, define unit conversions (e.g., 1 case = 24 bottles), and organize products into categories like Beers, Spirits, and Soft Drinks.</p>
      </CardContent>
    </Card>
  );
}
