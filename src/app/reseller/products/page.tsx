
'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { PageHeader } from '@/components/layout/header';
import { getProducts, Product } from '@/services/product-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <>
      <PageHeader title="Discover Products" description="Browse our curated collection of products. Share them to earn commissions." />
      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:p-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card className="flex flex-col overflow-hidden" key={index}>
              <div className="relative aspect-video">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="p-6 pb-2">
                <Skeleton className="mb-2 h-4 w-1/4" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <div className="flex-grow p-6 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </div>
              <div className="flex items-center justify-between bg-secondary/30 p-6">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-1/4" />
              </div>
            </Card>
          ))
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </>
  );
}

// Dummy Card for skeleton
const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={className}>{children}</div>
);
