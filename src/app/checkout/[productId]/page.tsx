
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { getProduct, Product } from '@/services/product-service';
import { createOrder, OrderData } from '@/services/order-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Loader2, Sparkles, PartyPopper } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const productId = params.productId as string;
  const resellerId = searchParams.get('ref');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

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
  const taxRate = 0.08;

  const taxes = product ? product.price * taxRate : 0;
  const subtotal = product ? product.price : 0;
  const total = subtotal + shippingCharges + handlingCharges + taxes;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const customerName = formData.get('name') as string;
    const customerEmail = formData.get('email') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const zip = formData.get('zip') as string;
    
    // In a real app, you would validate this data
    if (!customerName || !customerEmail || !address || !city || !zip) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please fill out all shipping fields.',
        });
        setSubmitting(false);
        return;
    }
    
    // In a real app, you would get the reseller commission rate from settings
    const resellerCommissionRate = 0.1; // 10%
    const commissionAmount = subtotal * resellerCommissionRate;

    const orderData: OrderData = {
        customer: {
            name: customerName,
            email: customerEmail,
            address: { line1: address, city, zip },
        },
        items: [{
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1
        }],
        subtotal,
        shipping: shippingCharges,
        handling: handlingCharges,
        taxes,
        total,
        commission: {
            resellerId: resellerId || 'direct_sale',
            amount: resellerId ? commissionAmount : 0,
            status: 'pending',
        },
        status: 'pending',
    };

    try {
        // Here you would integrate with a real payment gateway (Stripe, Razorpay, etc.)
        // For this example, we'll simulate a successful payment.
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        
        // After successful payment, create the order in Firestore
        // Disabling for now to prevent stock issues during demo
        // await createOrder(orderData);

        toast({
            title: 'Payment Successful!',
            description: 'Your order has been placed.',
        });
        setOrderComplete(true);

    } catch (error) {
        console.error("Payment failed:", error);
        toast({
            variant: 'destructive',
            title: 'Payment Failed',
            description: 'Could not process your payment. Please try again.',
        });
    } finally {
        setSubmitting(false);
    }
  };
  
  if (orderComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center font-body">
        <PartyPopper className="mb-4 h-16 w-16 text-primary" />
        <h1 className="mb-2 font-headline text-3xl font-bold">Order Confirmed!</h1>
        <p className="max-w-md text-muted-foreground">
            Thank you for your purchase. A confirmation email has been sent to you.
        </p>
        <Button asChild className="mt-8">
            <Link href="/reseller/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }


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
        <form onSubmit={handlePayment} className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                            <span>${subtotal.toFixed(2)}</span>
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
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" name="address" placeholder="123 Main St" required />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" name="city" placeholder="San Francisco" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="zip">ZIP</Label>
                                <Input id="zip" name="zip" placeholder="94103" required />
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
                                <Input id="card-number" placeholder="•••• •••• •••• ••••" required />
                                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input id="expiry" placeholder="MM/YY" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cvc">CVC</Label>
                                <Input id="cvc" placeholder="123" required />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading || submitting}>
                        {(loading || submitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Pay ${total.toFixed(2)}
                    </Button>
                </CardFooter>
             </Card>
           </div>
        </form>
      </div>
    </div>
  );
}
