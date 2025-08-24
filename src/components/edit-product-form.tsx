
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UploadCloud } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { updateProduct, Product, EditProductFormData } from '@/services/product-service';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
    name: z.string().min(1, 'Product name is required.'),
    description: z.string().min(1, 'Description is required.'),
    imageFile: z.custom<FileList>().optional(),
    price: z.coerce.number().positive('Price must be a positive number.'),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative.'),
    category: z.string().min(1, 'Category is required.'),
    weight: z.coerce.number().positive('Weight must be a positive number.').optional(),
    length: z.coerce.number().positive('Length must be a positive number.').optional(),
    breadth: z.coerce.number().positive('Breadth must be a positive number.').optional(),
    height: z.coerce.number().positive('Height must be a positive number.').optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditProductFormProps {
    product: Product;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onProductUpdated: () => void;
}

export function EditProductForm({ product, isOpen, setIsOpen, onProductUpdated }: EditProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product.imageUrl);
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        weight: product.weight,
        length: product.dimensions?.length,
        breadth: product.dimensions?.breadth,
        height: product.dimensions?.height,
    },
  });

  useEffect(() => {
    // Reset form when product changes
    form.reset({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        weight: product.weight,
        length: product.dimensions?.length,
        breadth: product.dimensions?.breadth,
        height: product.dimensions?.height,
    });
    setImagePreview(product.imageUrl);
  }, [product, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
      } else {
        setImagePreview(product.imageUrl);
      }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
        const productData: EditProductFormData = {
            ...data,
            imageUrl: product.imageUrl,
            imageFile: data.imageFile?.[0], // Get the File object from the FileList
            dimensions: {
                length: data.length,
                breadth: data.breadth,
                height: data.height,
            }
        };
        await updateProduct(product.id, productData);
        toast({
            title: 'Product Updated',
            description: `${data.name} has been successfully updated.`,
        });
        onProductUpdated();
    } catch (error) {
        console.error('Failed to update product:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to update product. Please try again.',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the details for "{product.name}".
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
                    name="imageFile"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem className="grid grid-cols-4 items-start gap-4">
                            <FormLabel className="text-right pt-2">Product Image</FormLabel>
                            <FormControl className="col-span-3">
                                <div className="flex w-full items-center gap-4">
                                     <div className="relative flex-1">
                                        <Input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                        onChange={(e) => {
                                            onChange(e.target.files);
                                            handleImageChange(e);
                                        }}
                                        {...rest}
                                        />
                                        <div className="flex h-24 w-full items-center justify-center rounded-md border-2 border-dashed border-input bg-background text-center text-muted-foreground">
                                             <div>
                                                <UploadCloud className="mx-auto mb-2 h-8 w-8" />
                                                <p>Click or drag to upload</p>
                                             </div>
                                        </div>
                                    </div>
                                    {imagePreview && (
                                        <div className="relative h-24 w-24 flex-shrink-0">
                                            <Image
                                                src={imagePreview}
                                                alt="Image preview"
                                                fill
                                                className="rounded-md object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage className="col-start-2 col-span-2" />
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
                        Save Changes
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
