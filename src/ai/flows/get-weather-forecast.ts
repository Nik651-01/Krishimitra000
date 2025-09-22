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
  tempHigh: z.number().describe("Today's high temperature in Celsius."),
  tempLow: z.number().describe("Today's low temperature in Celsius."),
  description: z
    .string()
    .describe('A brief description of the weather (e.g., "Partly Drizzly").'),
  humidity: z.number().describe('Humidity percentage.'),
  windSpeed: z.number().describe('Wind speed in km/h.'),
  reasoning: z
    .string()
    .describe('Reasoning for the generated forecast.'),
});
export type WeatherForecast = z.infer<typeof WeatherForecastSchema>;

export async function getWeatherForecast(
  input: GetWeatherForecastInput
): Promise<WeatherForecast> {
  return getWeatherForecastFlow(input);
}

// This function simulates a weather forecast locally to avoid API calls.
function simulateWeather(latitude: number, longitude: number): WeatherForecast {
  // Base values (can be adjusted for more realism based on location)
  const baseTemp = 25 + (latitude - 20) * -1; // Simple latitude-based temp
  const descriptions = ["Partly Drizzly", "Clear Skies", "Overcast", "Light Showers", "Sunny"];

  // Generate random variations
  const tempVariation = (Math.random() - 0.5) * 5;
  const currentTemp = Math.round(baseTemp + tempVariation);
  const tempHigh = currentTemp + Math.floor(Math.random() * 5);
  const tempLow = currentTemp - Math.floor(Math.random() * 5);
  const humidity = 50 + Math.floor(Math.random() * 40);
  const windSpeed = 5 + Math.floor(Math.random() * 15);
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];

  return {
    currentTemp,
    tempHigh,
    tempLow,
    description,
    humidity,
    windSpeed,
    reasoning: "This is locally simulated data for demonstration purposes.",
  };
}


const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: WeatherForecastSchema,
  },
  async input => {
    // In a real application, you would call a weather API here.
    // For this demo, we are simulating the data locally to avoid API rate limits.
    const forecast = simulateWeather(input.latitude, input.longitude);
    return forecast;
  }
);
