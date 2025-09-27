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
  prompt: `You are an expert agricultural advisor. Your task is to provide crop recommendations based on the provided data.

  **IMPORTANT**: You MUST always return a valid JSON object that conforms to the output schema.

  Based on the provided soil data, climate conditions, and farm location, recommend the most suitable crops for the farmer.
  
  Climate Data: {{{climateData}}}
  Location: {{{location}}}

  {{#if soilData}}
  Soil Data: {{{soilData}}}
  
  In addition to crop recommendations, provide actionable soil improvement tips and a planting calendar tailored to the local climate.
  Respond in the language of the location provided, if possible.
  {{else}}
  **CRITICAL**: No soil data was provided. You cannot give a recommendation. Instead, you MUST return a JSON object where 'recommendedCrops' contains the message 'Soil data is required to provide a crop recommendation. Please provide details on your soil’s pH, NPK values, and organic matter content.', and the other fields are empty strings.
  {{/if}}
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
