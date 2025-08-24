
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { addProduct, ProductData } from '@/services/product-service';
import { useToast } from '@/hooks/use-toast';


const formSchema = z.object({
    name: z.string().min(1, 'Product name is required.'),
    description: z.string().min(1, 'Description is required.'),
    imageUrl: z.string().url('Please enter a valid URL.'),
    price: z.coerce.number().positive('Price must be a positive number.'),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
    category: z.string().min(1, 'Category is required.'),
    weight: z.coerce.number().positive('Weight must be a positive number.').optional(),
    length: z.coerce.number().positive('Length must be a positive number.').optional(),
    breadth: z.coerce.number().positive('Breadth must be a positive number.').optional(),
    height: z.coerce.number().positive('Height must be a positive number.').optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddProductFormProps {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onProductAdded: () => void;
}

export function AddProductForm({ children, isOpen, setIsOpen, onProductAdded }: AddProductFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: '',
        description: '',
        imageUrl: '',
        category: '',
        price: undefined,
        stock: undefined,
        weight: undefined,
        length: undefined,
        breadth: undefined,
        height: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
        const productData: ProductData = {
            ...data,
            dimensions: {
                length: data.length,
                breadth: data.breadth,
                height: data.height,
            }
        };
        await addProduct(productData);
        toast({
            title: 'Product Added',
            description: `${data.name} has been successfully added.`,
        });
        onProductAdded();
        form.reset();
    } catch (error) {
        console.error('Failed to add product:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to add product. Please try again.',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Name</FormLabel>
                            <FormControl className="col-span-3">
                                <Input placeholder="Product name" {...field} />
                            </FormControl>
                            <FormMessage className="col-span-1" />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-start gap-4">
                            <FormLabel className="text-right pt-2">Description</FormLabel>
                            <FormControl className="col-span-3">
                                <Textarea placeholder="Product description" {...field} />
                            </FormControl>
                            <FormMessage className="col-span-1" />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-4 items-center gap-4">
                            <FormLabel className="text-right">Image URL</FormLabel>
                            <FormControl className="col-span-3">
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage className="col-span-1" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center gap-4">
                                <FormLabel className="text-right">Price</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="e.g., 99.99" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage className="col-start-2 col-span-1" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center gap-4">
                                <FormLabel className="text-right">Stock</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 100" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage className="col-start-2 col-span-1" />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                             <FormItem className="grid grid-cols-2 items-center gap-4">
                                <FormLabel className="text-right">Category</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Electronics" {...field} />
                                </FormControl>
                                <FormMessage className="col-start-2 col-span-1" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-2 items-center gap-4">
                                <FormLabel className="text-right">Weight (kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" placeholder="e.g., 1.5" {...field} value={field.value ?? ''} />
                                </FormControl>
                                 <FormMessage className="col-start-2 col-span-1" />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Dimensions (cm)</Label>
                    <div className="col-span-3 grid grid-cols-3 gap-2">
                        <FormField
                            control={form.control}
                            name="length"
                            render={({ field }) => <FormItem><FormControl><Input type="number" placeholder="Length" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>}
                        />
                         <FormField
                            control={form.control}
                            name="breadth"
                            render={({ field }) => <FormItem><FormControl><Input type="number" placeholder="Breadth" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>}
                        />
                         <FormField
                            control={form.control}
                            name="height"
                            render={({ field }) => <FormItem><FormControl><Input type="number" placeholder="Height" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Product
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
