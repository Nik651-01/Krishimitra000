/**
 * This is a Next.js route that streams the output of a Genkit flow.
 */
import {NextRequest, NextResponse} from 'next/server';
import {Message, streamToResponse, StreamingTextResponse} from 'ai';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const {
    messages,
    flow,
    ...rest
  }: {messages: Message[]; flow: string; [key: string]: any} = await req.json();

  const flowFn = (await import(`@/ai/flows/${flow}`))[flow];

  try {
    const stream = await flowFn({
      history: messages.map(m => ({
        role: m.role,
        content: [{text: m.content}],
      })),
      message: messages.findLast(m => m.role === 'user')?.content,
      ...rest,
    });
    return new StreamingTextResponse(stream);
  } catch (err: any) {
    return NextResponse.json({error: err.message}, {status: err.status ?? 500});
  }
}
