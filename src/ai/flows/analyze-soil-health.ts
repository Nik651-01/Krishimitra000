'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing soil health and providing a score.
 *
 * - analyzeSoilHealth - A function that analyzes soil data and returns a health score and recommendations.
 * - AnalyzeSoilHealthInput - The input type for the analyzeSoilHealth function.
 * - AnalyzeSoilHealthOutput - The return type for the analyzeSoilHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSoilHealthInputSchema = z.object({
  soilData: z
    .string()
    .optional()
    .describe('Detailed soil composition data including pH, NPK values, and organic matter content.'),
  climateData: z
    .string()
    .describe('Local climate conditions. Can be general, like "Average regional climate".'),
  location: z.string().describe('The geographical location of the farm.'),
});
export type AnalyzeSoilHealthInput = z.infer<
  typeof AnalyzeSoilHealthInputSchema
>;

const AnalyzeSoilHealthOutputSchema = z.object({
  healthScore: z.number().describe('A numerical score from 0 to 100 representing the overall soil health.'),
  rating: z.string().describe('A qualitative rating of the soil health (e.g., "Poor", "Fair", "Good", "Excellent").'),
  recommendations: z
    .string()
    .describe(
      'Detailed recommendations for improving soil health, formatted for easy reading.'
    ),
});
export type AnalyzeSoilHealthOutput = z.infer<
  typeof AnalyzeSoilHealthOutputSchema
>;

export async function analyzeSoilHealth(
  input: AnalyzeSoilHealthInput
): Promise<AnalyzeSoilHealthOutput> {
  return analyzeSoilHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSoilHealthPrompt',
  input: {schema: AnalyzeSoilHealthInputSchema},
  output: {schema: AnalyzeSoilHealthOutputSchema},
  prompt: `You are an expert soil scientist. Analyze the provided soil data and location to generate a comprehensive soil health report.
  {{#if soilData}}
  Soil Data: {{{soilData}}}
  {{else}}
  No soil data provided. You must ask the user for their soil data before you can provide a soil health analysis.
  {{/if}}
  Location: {{{location}}}
  Climate Context: {{{climateData}}}

  Based on the soil data, provide:
  1.  A numerical 'healthScore' from 0 to 100. A score of 75 is considered "Good". Base your score on how close the provided values are to ideal ranges for general agriculture in the given location. For example, a pH of 6.5-7.0 is ideal. High NPK and organic matter are generally good.
  2.  A simple, one-word 'rating' for the score (e.g., Poor, Fair, Good, Excellent).
  3.  Detailed, actionable 'recommendations' for improving the soil, formatted with bullet points or numbered lists for readability.
  `,
});

const analyzeSoilHealthFlow = ai.defineFlow(
  {
    name: 'analyzeSoilHealthFlow',
    inputSchema: AnalyzeSoilHealthInputSchema,
    outputSchema: AnalyzeSoilHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
