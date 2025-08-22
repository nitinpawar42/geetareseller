'use client';

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
import { PlusCircle } from 'lucide-react';

export function AddProductForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" placeholder="Product name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Product description"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">
              Image URL
            </Label>
            <Input id="imageUrl" placeholder="https://..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right col-span-2">
                Price
                </Label>
                <Input id="price" type="number" placeholder="e.g. 99.99" className="col-span-2" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right col-span-2">
                Stock
                </Label>
                <Input id="stock" type="number" placeholder="e.g. 100" className="col-span-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right col-span-2">
                Category
                </Label>
                <Input id="category" placeholder="e.g. Electronics" className="col-span-2" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right col-span-2">
                Weight (kg)
                </Label>
                <Input id="weight" type="number" placeholder="e.g. 1.5" className="col-span-2" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Dimensions (cm)</Label>
            <div className="col-span-3 grid grid-cols-3 gap-2">
              <Input id="length" type="number" placeholder="Length" />
              <Input id="breadth" type="number" placeholder="Breadth" />
              <Input id="height" type="number" placeholder="Height" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
