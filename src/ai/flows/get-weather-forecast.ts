'use server';
/**
 * @fileOverview This file defines a Genkit flow for fetching real weather forecast data.
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


// Function to interpret WMO weather codes into descriptions
function getWeatherDescription(code: number): string {
    const descriptions: { [key: number]: string } = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Fog',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow fall',
        73: 'Moderate snow fall',
        75: 'Heavy snow fall',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return descriptions[code] || 'Unknown weather';
}


const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: GetWeatherForecastInputSchema,
    outputSchema: WeatherForecastSchema,
  },
  async ({ latitude, longitude }) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`Weather API request failed with status ${response.status}`);
        }
        const data = await response.json();

        if (!data.current || !data.daily) {
            throw new Error('Invalid data format from weather API');
        }

        const forecast: WeatherForecast = {
            currentTemp: Math.round(data.current.temperature_2m),
            tempHigh: Math.round(data.daily.temperature_2m_max[0]),
            tempLow: Math.round(data.daily.temperature_2m_min[0]),
            description: getWeatherDescription(data.current.weather_code),
            humidity: data.current.relative_humidity_2m,
            windSpeed: Math.round(data.current.wind_speed_10m),
            reasoning: "Data fetched from Open-Meteo API.",
        };
        
        return forecast;

    } catch (error) {
        console.error('Error fetching real weather data:', error);
        // Fallback to simulated data in case of API failure
        return {
            currentTemp: 25,
            tempHigh: 30,
            tempLow: 20,
            description: "Partly Drizzly",
            humidity: 70,
            windSpeed: 10,
            reasoning: "Failed to fetch real data, showing fallback simulated data.",
        }
    }
  }
);
