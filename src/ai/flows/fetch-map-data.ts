'use server';
/**
 * @fileOverview This file defines a Genkit flow for fetching map data, intended to be integrated with the Bhuvan API.
 *
 * - fetchMapData - A function to fetch map tiles or geofence data.
 * - FetchMapDataInput - The input type for the fetchMapData function.
 * - FetchMapDataOutput - The return type for the fetchMapData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchMapDataInputSchema = z.object({
  latitude: z.number().describe('The latitude for the center of the map view.'),
  longitude: z.number().describe('The longitude for the center of the map view.'),
  zoom: z.number().describe('The zoom level of the map.'),
});
export type FetchMapDataInput = z.infer<typeof FetchMapDataInputSchema>;

const FetchMapDataOutputSchema = z.object({
  tileUrl: z.string().describe('The URL for the map tile from the Bhuvan API.'),
  geofenceData: z.any().describe('Geofence data retrieved from the API.'),
});
export type FetchMapDataOutput = z.infer<typeof FetchMapDataOutputSchema>;

export async function fetchMapData(
  input: FetchMapDataInput
): Promise<FetchMapDataOutput> {
  return fetchMapDataFlow(input);
}

const fetchMapDataFlow = ai.defineFlow(
  {
    name: 'fetchMapDataFlow',
    inputSchema: FetchMapDataInputSchema,
    outputSchema: FetchMapDataOutputSchema,
  },
  async input => {
    const apiKey = process.env.BHUVAN_API_KEY;
    if (!apiKey) {
      console.error("Bhuvan API key is not set in environment variables.");
      // Fallback to placeholder if key is missing
      return {
         tileUrl: `https://picsum.photos/seed/farmmap/1200/400`,
         geofenceData: {
            message: "API Key not configured. Please set BHUVAN_API_KEY in your .env file."
         },
      };
    }

    // This is a sample Bhuvan WMS URL. You may need to adjust parameters like
    // LAYERS, BBOX calculations, and WIDTH/HEIGHT for a real implementation.
    const bboxWidth = 360 / Math.pow(2, input.zoom);
    const lon1 = input.longitude - bboxWidth / 2;
    const lon2 = input.longitude + bboxWidth / 2;
    const lat1 = input.latitude - bboxWidth / 4;
    const lat2 = input.latitude + bboxWidth / 4;

    const tileUrl = `https://bhuvan-vec1.nrsc.gov.in/bhuvan/gwc/service/wms?LAYERS=shrin&FORMAT=image/png&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&SRS=EPSG:4326&BBOX=${lon1},${lat1},${lon2},${lat2}&WIDTH=1200&HEIGHT=400&TOKEN=${apiKey}`;
    
    return {
      tileUrl: tileUrl,
      geofenceData: {
        message: "Successfully created Bhuvan API URL. Further integration required for interactive geofencing."
      },
    };
  }
);
