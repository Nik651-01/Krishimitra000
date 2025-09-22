'use server';
/**
 * @fileOverview This file defines a Genkit flow for fetching simulated weather forecast data.
 *
 * - getWeatherForecast - A function to get a weather forecast for a given location.
 * - GetWeatherForecastInput - The input type for the getWeatherForecast function.
 * - WeatherForecast - The return type for the getWeatherForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWeatherForecastInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type GetWeatherForecastInput = z.infer<
  typeof GetWeatherForecastInputSchema
>;

const WeatherForecastSchema = z.object({
  currentTemp: z.number().describe('Current temperature in Celsius.'),
  tempHigh: z.number().describe('Today\'s high temperature in Celsius.'),
  tempLow: z.number().describe('Today\'s low temperature in Celsius.'),
  description: z.string().describe('A brief description of the weather (e.g., "Partly Drizzly").'),
  humidity: z.number().describe('Humidity percentage.'),
  windSpeed: z.number().describe('Wind speed in km/h.'),
  reasoning: z.string().describe('Reasoning for the generated forecast.'),
});
export type WeatherForecast = z.infer<typeof WeatherForecastSchema>;

export async function getWeatherForecast(
  input: GetWeatherForecastInput
): Promise<WeatherForecast> {
  return getWeatherForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeatherForecastPrompt',
  input: {schema: GetWeatherForecastInputSchema},
  output: {schema: WeatherForecastSchema},
  prompt: `You are a weather simulation API. Generate a realistic-looking but fictional current weather forecast for the given location.

  Location:
  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}

  Base your simulation on general climate patterns for India. For instance, if the location is in a tropical zone, reflect that in the temperature and humidity. Make the values slightly different for each request to simulate real-time data.
  `,
});

const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: WeatherForecastSchema,
  },
  async input => {
    // In a real application, you would call a weather API here.
    // For this demo, we'll use an AI prompt to simulate the data.
    const {output} = await prompt(input);
    return output!;
  }
);
