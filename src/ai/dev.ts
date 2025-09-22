import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-crop-recommendations.ts';
import '@/ai/flows/reason-weather-alert-relevance.ts';
import '@/ai/flows/fetch-map-data.ts';
import '@/ai/flows/get-weather-forecast.ts';
import '@/ai/flows/get-location-from-coords.ts';
import '@/ai/flows/analyze-soil-health.ts';
import '@/ai/flows/get-market-prices.ts';
import '@/ai/flows/assistant-chat.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/tools/app-tools.ts';
