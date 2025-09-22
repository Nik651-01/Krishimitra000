'use server';
/**
 * @fileOverview This file defines a Genkit flow for fetching market price data from data.gov.in.
 *
 * - getMarketPrices - Fetches latest mandi prices for agricultural commodities.
 * - MarketPriceRecord - The record structure for a single market price entry.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetMarketPricesInputSchema = z.object({
    state: z.string().optional(),
});
export type GetMarketPricesInput = z.infer<typeof GetMarketPricesInputSchema>;

const MarketPriceRecordSchema = z.object({
  state: z.string(),
  district: z.string(),
  market: z.string(),
  commodity: z.string(),
  variety: z.string(),
  arrival_date: z.string(),
  min_price: z.string(),
  max_price: z.string(),
  modal_price: z.string(),
});
export type MarketPriceRecord = z.infer<typeof MarketPriceRecordSchema>;

const GetMarketPricesOutputSchema = z.object({
  records: z.array(MarketPriceRecordSchema),
});
export type GetMarketPricesOutput = z.infer<typeof GetMarketPricesOutputSchema>;

export async function getMarketPrices(input?: GetMarketPricesInput): Promise<GetMarketPricesOutput> {
  return getMarketPricesFlow(input);
}

const getMarketPricesFlow = ai.defineFlow(
  {
    name: 'getMarketPricesFlow',
    inputSchema: GetMarketPricesInputSchema,
    outputSchema: GetMarketPricesOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.DATA_GOV_API_KEY;
    if (!apiKey) {
      throw new Error('DATA_GOV_API_KEY is not set in environment variables.');
    }
    
    const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';
    const limit = 1000;
    let url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=${limit}`;

    if (input?.state) {
        url += `&filters[state]=${encodeURIComponent(input.state)}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      
      // The API returns records, we will validate them with Zod
      const validatedRecords = z.array(MarketPriceRecordSchema).safeParse(data.records);

      if (!validatedRecords.success) {
          console.error("Failed to validate market price records:", validatedRecords.error);
          return { records: [] };
      }

      return { records: validatedRecords.data };
    } catch (error) {
      console.error('Error fetching market prices:', error);
      throw new Error('Could not fetch market prices.');
    }
  }
);
