import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

config();

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyA5jPA7M7GGelwL-0hdDRTuDBm_3tBJNlQ'})],
  model: 'googleai/gemini-2.5-flash',
});