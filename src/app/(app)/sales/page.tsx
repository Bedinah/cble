'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { products as initialProducts, customers as initialCustomers, sales as initialSales } from '@/lib/data';
import type { Product, Sale, Customer } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MinusCircle, PlusCircle, ShoppingCart, X, CreditCard, Wallet, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AddCustomerForm } from '@/components/customers/add-customer-form';

type CartItem = {
  product: Product;
  quantity: number;
};

type PaymentMethod = 'cash' | 'credit';

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('walk-in');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const { toast } = useToast();

  const handleAddCustomer = (newCustomerData: Omit<Customer, 'id' | 'avatarUrl' | 'debt'>) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: `cust_${customers.length + 1}`,
      debt: 0,
      avatarUrl: `https://picsum.photos/seed/${customers.length + 1}/40/40`,
    };
    setCustomers(prev => {
        const updatedCustomers = [...prev, newCustomer];
        setSelectedCustomer(newCustomer.id);
        return updatedCustomers;
    });
    setIsAddCustomerOpen(false);
    toast({
        title: 'Customer Added',
        description: `${newCustomer.name} has been successfully added and selected.`
    })
  };


  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
            return prevCart.map(item =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        } else {
            toast({
                title: 'Out of Stock',
                description: `Cannot add more ${product.name}. Stock limit reached.`,
                variant: 'destructive',
            });
            return prevCart;
        }
      }
      if (product.stock > 0) {
        return [...prevCart, { product, quantity: 1 }];
      } else {
         toast({
            title: 'Out of Stock',
            description: `${product.name} is currently out of stock.`,
            variant: 'destructive',
        });
        return prevCart;
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart(prevCart => {
        const product = products.find(p => p.id === productId);
        if (!product) return prevCart;

        if (newQuantity <= 0) {
            return prevCart.filter(item => item.product.id !== productId);
        }
        if (newQuantity > product.stock) {
            toast({
                title: 'Stock Limit Exceeded',
                description: `Only ${product.stock} units of ${product.name} available.`,
                variant: 'destructive',
            });
            return prevCart;
        }
        return prevCart.map(item =>
            item.product.id === productId ? { ...item, quantity: newQuantity } : item
        );
    });
  };
  
  const cartTotal = cart.reduce((total, item) => total + item.product.retailPrice * item.quantity, 0);

  const completeSale = () => {
    if (cart.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Please add items to the cart before completing a sale.',
        variant: 'destructive',
      });
      return;
    }

    if (paymentMethod === 'credit' && selectedCustomer === 'walk-in') {
      toast({
        title: 'Invalid Customer',
        description: 'Please select or add a registered customer for credit sales.',
        variant: 'destructive'
      });
      return;
    }

    // 1. Create the new sale record
    const newSale: Sale = {
      id: `sale_${sales.length + 1}`,
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.retailPrice * item.quantity,
      })),
      total: cartTotal,
      customerName: selectedCustomer === 'walk-in' ? 'Walk-in' : customers.find(c => c.id === selectedCustomer)?.name || 'Unknown',
      date: new Date().toISOString(),
    };
    setSales(prev => [newSale, ...prev]);

    // 2. Update stock levels
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(item => item.product.id === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.quantity };
        }
        return p;
      });
    });

    // 3. Update customer debt if it's a credit sale
    if (paymentMethod === 'credit') {
      setCustomers(prevCustomers => 
        prevCustomers.map(c => 
          c.id === selectedCustomer ? { ...c, debt: c.debt + cartTotal } : c
        )
      );
    }

    // 4. Clear the cart and reset customer/payment
    setCart([]);
    setSelectedCustomer('walk-in');
    setPaymentMethod('cash');

    // 5. Show success message
    toast({
      title: 'Sale Completed!',
      description: `Total: RWF ${cartTotal.toLocaleString()}. Paid by ${paymentMethod}.`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-10rem)]">
      {/* Products Grid */}
      <div className="lg:col-span-2 h-full overflow-y-auto">
        <h1 className="text-2xl font-bold font-headline mb-4">Select Products</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(product => (
            <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addToCart(product)}>
              <CardContent className="p-4 text-center space-y-2">
                <p className="font-semibold font-headline text-md truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground">RWF {product.retailPrice.toLocaleString()}</p>
                <Badge variant={product.stock > 0 ? 'secondary' : 'destructive'} className="w-full justify-center">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="h-full">
        <Card className="flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <ShoppingCart />
              Current Order
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-4">
             {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <ShoppingCart className="w-16 h-16 mb-4" />
                    <p>Your cart is empty.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item.product.id} className="flex items-start justify-between">
                            <div>
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-sm text-muted-foreground">RWF {item.product.retailPrice.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                    <MinusCircle className="h-4 w-4" />
                                </Button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.product.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
          </CardContent>
          {cart.length > 0 && (
             <CardFooter className="flex-col items-stretch space-y-4 border-t pt-4">
                <div className="space-y-2">
                    <Label>Customer</Label>
                    <div className="flex gap-2">
                      <Select onValueChange={setSelectedCustomer} value={selectedCustomer}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select a customer..." />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                              {customers.map(customer => (
                                  <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                              ))}
                          </SelectContent>
                      </Select>
                       <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
                          <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                  <UserPlus className="h-4 w-4" />
                              </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                  <DialogTitle>Add New Customer</DialogTitle>
                                  <DialogDescription>Create a new customer profile. They will be automatically selected.</DialogDescription>
                              </DialogHeader>
                              <AddCustomerForm onAddCustomer={handleAddCustomer} />
                          </DialogContent>
                      </Dialog>
                    </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <RadioGroup value={paymentMethod} className="flex" onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer"><Wallet className="w-4 h-4" /> Cash</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer"><CreditCard className="w-4 h-4" /> On Credit</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>RWF {cartTotal.toLocaleString()}</span>
                </div>
                <Button onClick={completeSale}>Complete Sale</Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
