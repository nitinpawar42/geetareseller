import { ProductCard, type Product } from '@/components/product-card';
import { PageHeader } from '@/components/layout/header';

const products: Product[] = [
  {
    id: 'prod_001',
    name: 'AcousticPro Headphones',
    description: 'Experience crystal clear audio with our new noise-cancelling headphones.',
    price: 199.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Electronics',
    aiHint: 'headphones audio',
  },
  {
    id: 'prod_002',
    name: 'ErgoFlow Office Chair',
    description: 'Stay comfortable and productive with our ergonomic office chair.',
    price: 349.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Furniture',
    aiHint: 'office chair',
  },
  {
    id: 'prod_003',
    name: 'Gourmet Coffee Blend',
    description: 'Start your day with our rich and aromatic premium coffee blend.',
    price: 24.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Groceries',
    aiHint: 'coffee beans',
  },
  {
    id: 'prod_004',
    name: 'Classic Leather Wallet',
    description: 'A timeless accessory, crafted from genuine leather.',
    price: 79.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Accessories',
    aiHint: 'leather wallet',
  },
  {
    id: 'prod_005',
    name: 'YogaFlex Mat',
    description: 'High-grip, eco-friendly mat for your daily yoga practice.',
    price: 49.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Sports',
    aiHint: 'yoga mat',
  },
  {
    id: 'prod_006',
    name: 'Smart Garden Kit',
    description: 'Grow your own herbs and vegetables indoors with ease.',
    price: 129.99,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Home & Garden',
    aiHint: 'smart garden',
  },
];

export default function ProductsPage() {
  return (
    <>
      <PageHeader title="Discover Products" description="Browse our curated collection of products. Share them to earn commissions." />
      <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:p-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
