'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized crop recommendations to farmers based on their soil data and local climate conditions.
 *
 * - personalizedCropRecommendations - A function that orchestrates the crop recommendation process.
 * - PersonalizedCropRecommendationsInput - The input type for the personalizedCropRecommendations function.
 * - PersonalizedCropRecommendationsOutput - The return type for the personalizedCropRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCropRecommendationsInputSchema = z.object({
  soilData: z
    .string()
    .optional()
    .describe('Detailed soil composition data including pH, NPK values, and organic matter content.'),
  climateData: z
    .string()
    .describe('Local climate conditions including average rainfall, temperature range, and sunlight hours.'),
  location: z.string().describe('The geographical location of the farm.'),
});
export type PersonalizedCropRecommendationsInput = z.infer<
  typeof PersonalizedCropRecommendationsInputSchema
>;

const PersonalizedCropRecommendationsOutputSchema = z.object({
  recommendedCrops: z
    .string()
    .describe(
      'A list of recommended crops suitable for the given soil and climate conditions, with reasons for each recommendation.'
    ),
  soilImprovementTips: z
    .string()
    .describe(
      'Tips for improving soil health to optimize crop yield for the recommended crops.'
    ),
  plantingCalendar: z
    .string()
    .describe('A planting calendar outlining the best times to plant each recommended crop based on the local climate.'),
});
export type PersonalizedCropRecommendationsOutput = z.infer<
  typeof PersonalizedCropRecommendationsOutputSchema
>;

export async function personalizedCropRecommendations(
  input: PersonalizedCropRecommendationsInput
): Promise<PersonalizedCropRecommendationsOutput> {
  return personalizedCropRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCropRecommendationsPrompt',
  input: {schema: PersonalizedCropRecommendationsInputSchema},
  output: {schema: PersonalizedCropRecommendationsOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided soil data, climate conditions, and farm location, recommend the most suitable crops for the farmer.
  {{#if soilData}}
  Soil Data: {{{soilData}}}
  {{else}}
  No soil data provided. You must ask the user for their soil data before you can provide a crop recommendation.
  {{/if}}
  Climate Data: {{{climateData}}}
  Location: {{{location}}}

  In addition to crop recommendations, provide actionable soil improvement tips and a planting calendar tailored to the local climate.
  Respond in the language of the location provided, if possible.
  `,
});

const personalizedCropRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedCropRecommendationsFlow',
    inputSchema: PersonalizedCropRecommendationsInputSchema,
    outputSchema: PersonalizedCropRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
