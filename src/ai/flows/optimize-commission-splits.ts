'use server';

/**
 * @fileOverview AI-powered commission optimization flow.
 *
 * - optimizeCommissionSplits - Analyzes sales data and suggests optimal commission splits.
 * - OptimizeCommissionSplitsInput - The input type for the optimizeCommissionSplits function.
 * - OptimizeCommissionSplitsOutput - The return type for the optimizeCommissionSplits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCommissionSplitsInputSchema = z.object({
  productCategory: z.string().describe('The category of the product.'),
  currentPlatformSplit: z
    .number()
    .min(0)
    .max(1)
    .describe('The current commission split for the platform (0 to 1).'),
  currentResellerAffiliateSplit: z
    .number()
    .min(0)
    .max(1)
    .describe('The current commission split for resellers/affiliates (0 to 1).'),
  priceElasticity: z
    .string()
    .describe(
      'A description of the price elasticity of the product.  Explain how demand changes with price.'
    ),
  historicalSalesData: z
    .string()
    .describe(
      'Historical sales data for the product, including price, sales volume, and commission rates.  Include at least 10 data points.'
    ),
});
export type OptimizeCommissionSplitsInput = z.infer<typeof OptimizeCommissionSplitsInputSchema>;

const OptimizeCommissionSplitsOutputSchema = z.object({
  suggestedPlatformSplit: z
    .number()
    .min(0)
    .max(1)
    .describe('The suggested commission split for the platform (0 to 1).'),
  suggestedResellerAffiliateSplit: z
    .number()
    .min(0)
    .max(1)
    .describe('The suggested commission split for resellers/affiliates (0 to 1).'),
  rationale: z
    .string()
    .describe(
      'The rationale behind the suggested commission split, explaining how it can maximize overall revenue.'
    ),
});
export type OptimizeCommissionSplitsOutput = z.infer<typeof OptimizeCommissionSplitsOutputSchema>;

export async function optimizeCommissionSplits(
  input: OptimizeCommissionSplitsInput
): Promise<OptimizeCommissionSplitsOutput> {
  return optimizeCommissionSplitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCommissionSplitsPrompt',
  input: {schema: OptimizeCommissionSplitsInputSchema},
  output: {schema: OptimizeCommissionSplitsOutputSchema},
  prompt: `You are an expert in optimizing commission splits for e-commerce platforms.

  Analyze the following data to suggest an optimal commission split between the platform and resellers/affiliates, with the goal of maximizing overall revenue.

  Product Category: {{{productCategory}}}
  Current Platform Split: {{{currentPlatformSplit}}}
  Current Reseller/Affiliate Split: {{{currentResellerAffiliateSplit}}}
  Price Elasticity: {{{priceElasticity}}}
  Historical Sales Data: {{{historicalSalesData}}}

  Consider the price elasticity of the product and the historical sales data to determine how changes in commission splits might affect sales volume and overall revenue.

  Provide a suggested commission split for the platform and resellers/affiliates, along with a clear rationale for your suggestion.

  Ensure that the suggested splits add up to 1.0.`,
});

const optimizeCommissionSplitsFlow = ai.defineFlow(
  {
    name: 'optimizeCommissionSplitsFlow',
    inputSchema: OptimizeCommissionSplitsInputSchema,
    outputSchema: OptimizeCommissionSplitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
