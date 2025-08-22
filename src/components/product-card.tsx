'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2 } from 'lucide-react';
import { ShareDialog } from './share-dialog';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  aiHint: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            data-ai-hint={product.aiHint}
          />
        </div>
        <div className="p-6 pb-2">
          <Badge variant="outline" className="mb-2">{product.category}</Badge>
          <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between bg-secondary/30 p-6">
        <p className="font-headline text-2xl font-semibold text-primary">
          {formatPrice(product.price)}
        </p>
        <ShareDialog product={product}>
          <Button>
            <Share2 className="mr-2" /> Share
          </Button>
        </ShareDialog>
      </CardFooter>
    </Card>
  );
}
