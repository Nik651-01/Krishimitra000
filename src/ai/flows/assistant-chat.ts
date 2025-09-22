'use server';
/**
 * @fileOverview A conversational AI assistant for the KrishiMitra app.
 *
 * - chat - A function that handles the conversational chat with the assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AssistantChatInputSchema = z.object({
  query: z.string().describe('The user\'s query or message.'),
});
export type AssistantChatInput = z.infer<typeof AssistantChatInputSchema>;

const AssistantChatOutputSchema = z.object({
  response: z.string().describe('The assistant\'s response to the user query.'),
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
  prompt: `You are KrishiMitra, a friendly and knowledgeable AI assistant for an Indian farming application.
  Your goal is to provide concise, helpful, and encouraging answers to farmers' questions.
  Keep your responses brief, typically 1-3 sentences.
  You have context about crop recommendations, soil health, weather, market prices, and government advisories.
  If a question is outside the scope of agriculture, politely decline to answer.

  User's question: {{{query}}}
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
