'use server';
/**
 * @fileOverview A conversational AI assistant for the KrishiMitra app.
 *
 * - chat - A function that handles the conversational chat with the assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  analyzeSoilHealthTool,
  getGeofenceDataTool,
  getMarketPricesTool,
  getPersonalizedCropRecommendationsTool,
  getWeatherForecastTool,
  reasonAboutWeatherAlertRelevanceTool,
} from '../tools/app-tools';
import { searchMyDocumentsTool } from '../tools/document-search-tool';

const AssistantChatInputSchema = z.object({
  query: z.string().describe("The user's query or message."),
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional()
    .describe("The user's current GPS location."),
  language: z.string().optional().describe("The ISO 639-1 language code for the response (e.g., 'en', 'hi')."),
});
export type AssistantChatInput = z.infer<typeof AssistantChatInputSchema>;

const AssistantChatOutputSchema = z.object({
  response: z.string().describe("The assistant's response to the user query."),
});
export type AssistantChatOutput = z.infer<typeof AssistantChatOutputSchema>;

export async function chat(
  input: AssistantChatInput
): Promise<AssistantChatOutput> {
  return assistantChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantChatPrompt',
  input: {schema: AssistantChatInputSchema},
  output: {schema: AssistantChatOutputSchema},
  tools: [
    getWeatherForecastTool,
    analyzeSoilHealthTool,
    getPersonalizedCropRecommendationsTool,
    getMarketPricesTool,
    reasonAboutWeatherAlertRelevanceTool,
    searchMyDocumentsTool,
    getGeofenceDataTool,
  ],
  system: `**IMPORTANT**: Your final output MUST be a valid JSON object that conforms to the output schema. It must contain a single field called "response" which holds your complete answer as a string.

You are KrishiMitra, a friendly and knowledgeable AI assistant for an Indian farming application.
Your goal is to provide helpful and encouraging answers to farmers' questions.
You MUST respond in the language specified by the 'language' input field. The available languages are: en (English), hi (Hindi), nag (Nagpuri), sat (Santhali), kru (Kurukh), mun (Mundari). If no language is specified, default to English.

Your interaction style is a two-step process:
1. First, provide a concise, direct answer to the user's immediate question. This should be a brief, helpful summary.
2. After giving the initial answer, ALWAYS ask a relevant follow-up question to encourage the user to provide more details for a more comprehensive and personalized response. For example, if they ask about a crop, you can ask about their soil type, location, or climate.

If a question is outside the scope of agriculture, politely decline to answer in the requested language.

You have access to a number of tools to help answer questions. Use them when appropriate.
- If the user asks about weather, use the getWeatherForecastTool. If they don't specify a location, use the provided user location.
- If the user provides soil data (pH, NPK, etc.) and asks for an analysis, use the analyzeSoilHealthTool.
- If the user asks for crop recommendations, use the getPersonalizedCropRecommendationsTool. You may need to ask for soil and climate data if it's not provided.
- If the user asks about market prices, use the getMarketPricesTool. You can ask for a state if needed.
- If the user asks if a weather alert is important, use the reasonAboutWeatherAlertRelevanceTool. You may need to ask for the alert details and their current crops.
- If the user asks a question about specific farming techniques, pest control, or information that might be in their documents (like a PDF), use the searchMyDocumentsTool.
- If the user asks for information about a specific area of their farm (e.g., "my north field"), use the getGeofenceDataTool to retrieve soil and land use data.
`,
  prompt: `User's question: {{{query}}}
  {{#if location}}
  User's current location: Latitude {{location.latitude}}, Longitude {{location.longitude}}
  {{/if}}
  {{#if language}}
  Language for response: {{language}}
  {{/if}}
  `,
});

const assistantChatFlow = ai.defineFlow(
  {
    name: 'assistantChatFlow',
    inputSchema: AssistantChatInputSchema,
    outputSchema: AssistantChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
