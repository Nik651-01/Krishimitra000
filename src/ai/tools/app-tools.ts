'use server';
/**
 * @fileoverview Defines tools for the AI assistant to interact with the application's features.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getWeatherForecast } from '../flows/get-weather-forecast';
import { analyzeSoilHealth } from '../flows/analyze-soil-health';
import { personalizedCropRecommendations } from '../flows/personalized-crop-recommendations';
import { getMarketPrices } from '../flows/get-market-prices';
import { reasonAboutWeatherAlertRelevance } from '../flows/reason-weather-alert-relevance';


export const getWeatherForecastTool = ai.defineTool(
  {
    name: 'getWeatherForecast',
    description: 'Get the current weather forecast for a specific location.',
    inputSchema: z.object({
      latitude: z.number().describe('The latitude of the location.'),
      longitude: z.number().describe('The longitude of the location.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => await getWeatherForecast(input)
);

export const analyzeSoilHealthTool = ai.defineTool(
  {
    name: 'analyzeSoilHealth',
    description: 'Analyze soil data to provide a health score and recommendations. Requires detailed soil data.',
    inputSchema: z.object({
        soilData: z.string().optional().describe('Detailed soil composition data including pH, NPK values, and organic matter content.'),
        climateData: z.string().describe('Local climate conditions. Can be general, like "Average regional climate".'),
        location: z.string().describe('The geographical location of the farm.'),
    }),
    outputSchema: z.any(),
  },
  async (input) => await analyzeSoilHealth(input)
);

export const getPersonalizedCropRecommendationsTool = ai.defineTool(
    {
        name: 'getPersonalizedCropRecommendations',
        description: 'Provide personalized crop recommendations based on soil, climate, and location.',
        inputSchema: z.object({
            soilData: z.string().optional().describe('Detailed soil composition data including pH, NPK values, and organic matter content.'),
            climateData: z.string().describe('Local climate conditions including average rainfall, temperature range, and sunlight hours.'),
            location: z.string().describe('The geographical location of the farm.'),
        }),
        outputSchema: z.any(),
    },
    async (input) => await personalizedCropRecommendations(input)
);

export const getMarketPricesTool = ai.defineTool(
    {
        name: 'getMarketPrices',
        description: 'Fetches latest mandi (market) prices for agricultural commodities for a given Indian state.',
        inputSchema: z.object({
            state: z.string().describe("The Indian state to fetch market prices for (e.g., 'Maharashtra')."),
        }),
        outputSchema: z.any(),
    },
    async (input) => await getMarketPrices(input)
);

export const reasonAboutWeatherAlertRelevanceTool = ai.defineTool(
    {
        name: 'reasonAboutWeatherAlertRelevance',
        description: 'Determines if a given weather alert is relevant to a farm based on its crops and location.',
        inputSchema: z.object({
            weatherData: z.string().describe('The weather alert data, including type, intensity, and location.'),
            cropInformation: z.string().describe('Information about the crops being grown on the farm, including type and growth stage.'),
            locationData: z.string().describe('The location of the farm.'),
        }),
        outputSchema: z.any(),
    },
    async (input) => await reasonAboutWeatherAlertRelevance(input)
);
