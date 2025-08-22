
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, ShoppingCart, Twitter } from 'lucide-react';
import type { Product } from './product-card';
import Link from 'next/link';

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
    </svg>
  );


interface ShareDialogProps {
  product: Product;
  children: React.ReactNode;
}

export function ShareDialog({ product, children }: ShareDialogProps) {
  const [affiliateLink, setAffiliateLink] = useState('');
  const [hasCopied, setHasCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In a real app, you'd get a unique affiliate ID for the logged-in user.
    const affiliateId = 'user123';
    setAffiliateLink(`${window.location.origin}/products/${product.id}?ref=${affiliateId}`);
  }, [product.id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateLink);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  const socialShareText = `Check out this amazing product: ${product.name}! ${affiliateLink}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialShareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(affiliateLink)}`;

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Share & Earn</DialogTitle>
          <DialogDescription>
            Share this link on social media to earn affiliate commissions or proceed to checkout.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                Link
                </Label>
                <Input id="link" defaultValue={affiliateLink} readOnly />
            </div>
            <Button type="submit" size="icon" className="px-3" onClick={copyToClipboard}>
                <span className="sr-only">Copy</span>
                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            </div>
             <div className="flex justify-center space-x-2">
                <Button variant="outline" asChild>
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                        <Twitter className="mr-2 h-4 w-4" /> Twitter
                    </a>
                </Button>
                 <Button variant="outline" asChild>
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                        <FacebookIcon className="mr-2 h-4 w-4" /> Facebook
                    </a>
                </Button>
            </div>
        </div>
        <DialogFooter className="sm:justify-start">
            <Button asChild className="w-full">
                <Link href={`/checkout/${product.id}`}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                </Link>
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
