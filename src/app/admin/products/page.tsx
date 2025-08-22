import AppLayout from '@/components/layout/app-layout';
import { PageHeader } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';


const products = [
    { id: 'prod_001', name: 'AcousticPro Headphones', imageUrl: 'https://placehold.co/40x40.png', category: 'Electronics', price: 199.99, stock: 120, sales: 1500 },
    { id: 'prod_002', name: 'ErgoFlow Office Chair', imageUrl: 'https://placehold.co/40x40.png', category: 'Furniture', price: 349.99, stock: 50, sales: 800 },
    { id: 'prod_003', name: 'Gourmet Coffee Blend', imageUrl: 'https://placehold.co/40x40.png', category: 'Groceries', price: 24.99, stock: 300, sales: 5000 },
    { id: 'prod_004', name: 'Classic Leather Wallet', imageUrl: 'https://placehold.co/40x40.png', category: 'Accessories', price: 79.99, stock: 200, sales: 2500 },
    { id: 'prod_005', name: 'YogaFlex Mat', imageUrl: 'https://placehold.co/40x40.png', category: 'Sports', price: 49.99, stock: 150, sales: 3000 },
];
  
export default function AdminProductsPage() {
  return (
    <AppLayout userType="admin">
      <PageHeader title="Product Management" description="Add, edit, and manage all products on the platform." />
       <main className="p-4 xl:p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Products</CardTitle>
                <CardDescription>A list of all available products.</CardDescription>
              </div>
              <Button>
                <PlusCircle className="mr-2"/>
                Add Product
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                         <Image src={product.imageUrl} alt={product.name} width={40} height={40} className="rounded-md" />
                         {product.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell className="text-right font-medium">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Analytics</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
       </main>
    </AppLayout>
  );
}
