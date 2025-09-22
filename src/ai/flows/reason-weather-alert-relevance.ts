'use server';
/**
 * @fileOverview This file contains a Genkit flow that determines the relevance of weather alerts to a specific farm based on its crops and location.
 *
 * - reasonAboutWeatherAlertRelevance - A function that takes weather data, crop information, and location data, and returns a determination of the weather alert's relevance.
 * - ReasonWeatherAlertRelevanceInput - The input type for the reasonAboutWeatherAlertRelevance function.
 * - ReasonWeatherAlertRelevanceOutput - The return type for the reasonAboutWeatherAlertRelevance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReasonWeatherAlertRelevanceInputSchema = z.object({
  weatherData: z
    .string()
    .describe('The weather alert data, including type, intensity, and location.'),
  cropInformation: z
    .string()
    .describe('Information about the crops being grown on the farm, including type and growth stage.'),
  locationData: z.string().describe('The location of the farm.'),
});
export type ReasonWeatherAlertRelevanceInput = z.infer<
  typeof ReasonWeatherAlertRelevanceInputSchema
>;

const ReasonWeatherAlertRelevanceOutputSchema = z.object({
  isRelevant: z
    .boolean()
    .describe(
      'Whether the weather alert is relevant to the farm based on its crops and location.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the determination of whether the weather alert is relevant.'
    ),
});
export type ReasonWeatherAlertRelevanceOutput = z.infer<
  typeof ReasonWeatherAlertRelevanceOutputSchema
>;

export async function reasonAboutWeatherAlertRelevance(
  input: ReasonWeatherAlertRelevanceInput
): Promise<ReasonWeatherAlertRelevanceOutput> {
  return reasonWeatherAlertRelevanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reasonWeatherAlertRelevancePrompt',
  input: {schema: ReasonWeatherAlertRelevanceInputSchema},
  output: {schema: ReasonWeatherAlertRelevanceOutputSchema},
  prompt: `You are an AI assistant helping farmers determine the relevance of weather alerts to their farms.

You will be provided with weather data, crop information, and location data. Your task is to determine whether the weather alert is relevant to the farm and explain your reasoning.

Weather Data: {{{weatherData}}}
Crop Information: {{{cropInformation}}}
Location Data: {{{locationData}}}

Is the weather alert relevant to the farm? Provide a boolean value for isRelevant.
Explain your reasoning in the reasoning field.
`,
});

const reasonWeatherAlertRelevanceFlow = ai.defineFlow(
  {
    name: 'reasonWeatherAlertRelevanceFlow',
    inputSchema: ReasonWeatherAlertRelevanceInputSchema,
    outputSchema: ReasonWeatherAlertRelevanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
