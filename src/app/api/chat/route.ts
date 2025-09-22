/**
 * This is a Next.js route that streams the output of a Genkit flow.
 */
import {NextRequest} from 'next/server';
import {Message, StreamingTextResponse} from 'ai';
import { chat, ChatInput } from '@/ai/flows/chat';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const {
    messages,
  }: {messages: Message[]; [key: string]: any} = await req.json();

  try {
    const chatInput: ChatInput = {
      history: messages.map(m => ({
        role: m.role as 'user' | 'model',
        content: [{text: m.content}],
      })).slice(0, -1),
      message: messages.findLast(m => m.role === 'user')?.content ?? '',
    };
    const stream = await chat(chatInput);
    return new StreamingTextResponse(stream);
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
