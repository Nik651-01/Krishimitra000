'use server';
/**
 * @fileOverview This file defines a Genkit flow for performing reverse geocoding.
 *
 * - getLocationFromCoords - A function to get a location address from latitude and longitude.
 * - GetLocationFromCoordsInput - The input type for the function.
 * - LocationAddress - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLocationFromCoordsInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GetLocationFromCoordsInput = z.infer<
  typeof GetLocationFromCoordsInputSchema
>;

const LocationAddressSchema = z.object({
  city: z.string().describe('The city of the location.'),
  state: z.string().describe("The state or administrative division of the location."),
  country: z.string().describe('The country of the location.'),
  description: z.string().describe('A short, human-readable description of the location (e.g., "Pune, Maharashtra").'),
});
export type LocationAddress = z.infer<typeof LocationAddressSchema>;

export async function getLocationFromCoords(
  input: GetLocationFromCoordsInput
): Promise<LocationAddress> {
  return getLocationFromCoordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLocationFromCoordsPrompt',
  input: {schema: GetLocationFromCoordsInputSchema},
  output: {schema: LocationAddressSchema},
  prompt: `You are a reverse geocoding service. Based on the provided latitude and longitude, identify the city, state, and country. Provide a short description as well.

  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}
  `,
});

const getLocationFromCoordsFlow = ai.defineFlow(
  {
    name: 'getLocationFromCoordsFlow',
    inputSchema: GetLocationFromCoordsInputSchema,
    outputSchema: LocationAddressSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
