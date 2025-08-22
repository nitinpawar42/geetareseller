'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  optimizeCommissionSplits,
  type OptimizeCommissionSplitsOutput,
} from '@/ai/flows/optimize-commission-splits';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  productCategory: z.string().min(1, 'Product category is required.'),
  currentPlatformSplit: z.coerce.number().min(0).max(1, 'Split must be between 0 and 1.'),
  currentResellerAffiliateSplit: z.coerce.number().min(0).max(1, 'Split must be between 0 and 1.'),
  priceElasticity: z.string().min(1, 'Price elasticity description is required.'),
  historicalSalesData: z.string().min(1, 'Historical sales data is required.'),
});

type FormData = z.infer<typeof formSchema>;

export function OptimizerForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeCommissionSplitsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productCategory: 'Electronics',
      currentPlatformSplit: 0.2,
      currentResellerAffiliateSplit: 0.8,
      priceElasticity: 'Demand is moderately elastic. A 10% price increase leads to an 15% drop in sales.',
      historicalSalesData: `Jan: 100 units at $50 (10% commission), Feb: 120 units at $48 (12% commission), Mar: 90 units at $52 (10% commission), Apr: 150 units at $45 (15% commission), May: 110 units at $50 (10% commission), Jun: 130 units at $48 (12% commission), Jul: 95 units at $52 (10% commission), Aug: 160 units at $45 (15% commission), Sep: 115 units at $50 (10% commission), Oct: 140 units at $48 (12% commission).`,
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await optimizeCommissionSplits(data);
      setResult(response);
    } catch (error) {
      console.error('Optimization failed:', error);
      toast({
        variant: 'destructive',
        title: 'Optimization Failed',
        description: 'An error occurred while generating suggestions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Input Data</CardTitle>
          <CardDescription>Provide the necessary data for AI analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Category</FormLabel>
                    <FormControl><Input placeholder="e.g., Electronics" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentPlatformSplit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Split</FormLabel>
                      <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.2" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentResellerAffiliateSplit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reseller/Affiliate Split</FormLabel>
                      <FormControl><Input type="number" step="0.01" placeholder="e.g., 0.8" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="priceElasticity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Elasticity</FormLabel>
                    <FormControl><Textarea placeholder="Describe how demand changes with price..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="historicalSalesData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Historical Sales Data</FormLabel>
                    <FormControl><Textarea rows={5} placeholder="Provide historical sales data points..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Optimize Splits
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">AI Suggestion</CardTitle>
          <CardDescription>Optimal commission splits suggested by AI.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-grow items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p>Analyzing data...</p>
            </div>
          ) : result ? (
            <div className="w-full space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Platform Split</p>
                  <p className="font-headline text-4xl font-bold text-primary">
                    {(result.suggestedPlatformSplit * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reseller/Affiliate</p>
                  <p className="font-headline text-4xl font-bold text-primary">
                    {(result.suggestedResellerAffiliateSplit * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle className="font-headline">Rationale</AlertTitle>
                <AlertDescription>{result.rationale}</AlertDescription>
              </Alert>
            </div>
          ) : (
             <div className="text-center text-muted-foreground">
                <p>Results will be displayed here.</p>
             </div>
          )}
        </CardContent>
        <CardFooter>
            <p className="text-xs text-muted-foreground">
                This tool provides suggestions based on AI analysis. Always review critically before implementation.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
