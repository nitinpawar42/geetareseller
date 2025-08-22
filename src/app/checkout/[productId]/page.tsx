
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProduct, Product } from '@/services/product-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Loader2, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const params = useParams();
  const productId = params.productId as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        setLoading(true);
        const fetchedProduct = await getProduct(productId);
        setProduct(fetchedProduct);
        setLoading(false);
      };
      fetchProduct();
    }
  }, [productId]);

  const shippingCharges = 5.00;
  const handlingCharges = 2.50;
  const taxRate = 0.08; // 8%

  const taxes = product ? product.price * taxRate : 0;
  const total = product ? product.price + shippingCharges + handlingCharges + taxes : 0;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 font-body">
      <div className="w-full max-w-4xl">
        <div className="mb-6 text-center">
            <Link href="/" className="mb-4 inline-flex items-center justify-center gap-2 text-primary">
                <Sparkles className="size-8" />
                <h1 className="font-headline text-4xl font-bold">AffiliateAce</h1>
            </Link>
            <p className="text-lg text-muted-foreground">
              Complete your purchase securely.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Right side - Order Summary */}
          <div className="md:col-start-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                     <Separator />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Separator />
                     <Skeleton className="h-6 w-full" />
                  </div>
                ) : product && (
                  <>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="rounded-md object-cover" />
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: 1</p>
                            </div>
                        </div>
                        <p className="font-medium">${product.price.toFixed(2)}</p>
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex justify-between">
                            <span>Item Charges</span>
                            <span>${product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping Charges</span>
                            <span>${shippingCharges.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Handling Charges</span>
                            <span>${handlingCharges.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Taxes</span>
                            <span>${taxes.toFixed(2)}</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Left side - Shipping & Payment */}
           <div className="md:col-start-1 md:row-start-1">
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Shipping & Payment</CardTitle>
                    <CardDescription>Enter your details to complete the order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Shipping Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Shipping Information</h3>
                         <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="John Doe" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="123 Main St" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" placeholder="San Francisco" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="zip">ZIP</Label>
                                <Input id="zip" placeholder="94103" />
                            </div>
                        </div>
                    </div>
                    <Separator />
                    {/* Payment Info */}
                    <div className="space-y-4">
                         <h3 className="font-semibold">Payment Details</h3>
                        <div className="grid gap-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <div className="relative">
                                <Input id="card-number" placeholder="•••• •••• •••• ••••" />
                                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Pay ${total.toFixed(2)}
                    </Button>
                </CardFooter>
             </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
