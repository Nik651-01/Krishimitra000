
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";

const systemPromptCode = `
const prompt = ai.definePrompt({
  name: 'assistantChatPrompt',
  tools: [/* ... available tools ... */],
  system: \`You are KrishiMitra, a friendly and knowledgeable AI assistant for an Indian farming application.
Your goal is to provide helpful and encouraging answers to farmers' questions.
Your interaction style is a two-step process:
1. First, provide a concise, direct answer to the user's immediate question.
2. After giving the initial answer, ALWAYS ask a relevant follow-up question to encourage the user to provide more details for a more comprehensive and personalized response.

If a question is outside the scope of agriculture, politely decline to answer.
You have access to a number of tools to help answer questions. Use them when appropriate.
\`,
  prompt: \`User's question: {{{query}}}\`,
});
`.trim();

const toolCode = `
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
`.trim();

const ragCode = `
const simulatedVectorDB = [
    {
        content: "To combat whitefly infestation in cotton crops, a mixture of neem oil (5ml/litre) and a mild liquid soap can be sprayed...",
        metadata: { source: 'Modern Pest Control Strategies.pdf', page: 18 }
    },
    // ... more document chunks
];

export const searchMyDocumentsTool = ai.defineTool(
  {
    name: 'searchMyDocuments',
    description: 'Searches through the user\\'s uploaded documents and knowledge base to answer questions about specific farming techniques, crop varieties, pest control, etc.',
    inputSchema: z.object({
      query: z.string().describe('The user\\'s question...'),
    }),
    outputSchema: z.string(),
  },
  async (input) => await searchDocuments(input.query)
);
`.trim();


export default function TrainingAiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">How the AI Assistant is "Trained"</h1>
        <p className="text-muted-foreground">
          KrishiMitra learns and responds based on a combination of instructions, tools, and custom data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>1. System Prompt: Defining the AI's Personality</CardTitle>
          <CardDescription>
            The core of the assistant's behavior is defined by its system prompt. This is a set of instructions that tells the AI how to act, its name, its conversational style, and what its goals are. Think of it as the AI's job description. We can change this prompt to alter its personality and rules of engagement.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <CodeBlock code={systemPromptCode} lang="typescript" />
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>2. Tools: Giving the AI Skills</CardTitle>
          <CardDescription>
            We "train" the assistant by giving it tools it can use to perform actions. Each tool is a function the AI can decide to call to get information. For example, we gave it a tool to get the weather. When you ask, "What's the weather like?", the AI knows to use the <code className="font-mono bg-muted p-1 rounded">getWeatherForecastTool</code> to find the answer. The tool's description is crucial, as it tells the AI what the tool is for.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <CodeBlock code={toolCode} lang="typescript" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3. Custom Knowledge: Retrieval-Augmented Generation (RAG)</CardTitle>
          <CardDescription>
            To answer questions from your specific documents (like PDFs), we use a technique called RAG. We create a tool that simulates searching a "vector database" of your document's content. When you ask a question like "How do I control whitefly?", the AI uses the <code className="font-mono bg-muted p-1 rounded">searchMyDocumentsTool</code> to find the relevant text from your documents and uses that information to construct the answer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={ragCode} lang="typescript" />
        </CardContent>
      </Card>

    </div>
  );
}
