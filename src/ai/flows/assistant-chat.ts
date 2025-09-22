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
  ],
  system: `You are KrishiMitra, a friendly and knowledgeable AI assistant for an Indian farming application.
Your goal is to provide concise, helpful, and encouraging answers to farmers' questions.
Keep your responses brief, typically 1-3 sentences.
If a question is outside the scope of agriculture, politely decline to answer.

You have access to a number of tools to help answer questions. Use them when appropriate.
- If the user asks about weather, use the getWeatherForecastTool. If they don't specify a location, use the provided user location.
- If the user provides soil data (pH, NPK, etc.) and asks for an analysis, use the analyzeSoilHealthTool.
- If the user asks for crop recommendations, use the getPersonalizedCropRecommendationsTool. You may need to ask for soil and climate data if it's not provided.
- If the user asks about market prices, use the getMarketPricesTool. You can ask for a state if needed.
- If the user asks if a weather alert is important, use the reasonAboutWeatherAlertRelevanceTool. You may need to ask for the alert details and their current crops.
- If the user asks a question about specific farming techniques, pest control, or information that might be in their documents (like a PDF), use the searchMyDocumentsTool.
`,
  prompt: `User's question: {{{query}}}
  {{#if location}}
  User's current location: Latitude {{location.latitude}}, Longitude {{location.longitude}}
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
