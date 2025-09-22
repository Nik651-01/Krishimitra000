'use server';
/**
 * @fileoverview A chat assistant for farmers.
 */
import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ChatAssistantInputSchema = z.object({
  history: z
    .array(z.object({role: z.enum(['user', 'model']), content: z.array(z.object({text: z.string()}))}))
    .describe('The chat history.'),
  message: z.string().describe('The user message.'),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

export async function chatAssistant(input: ChatAssistantInput) {
  const {stream} = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: [
      {
        text: `You are a helpful and friendly AI assistant for farmers in India named KrishiMitra.

        Respond in the language of the user's message.
        
        Keep your responses concise and to the point.`,
      },
      ...input.history,
      {role: 'user', content: [{text: input.message}]},
    ],
    stream: true,
  });

  return stream.text();
}
