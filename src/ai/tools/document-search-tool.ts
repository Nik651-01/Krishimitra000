'use server';
/**
 * @fileoverview Defines a tool for the AI assistant to search within user-provided documents.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This is a placeholder for a real vector database.
// In a real application, you would replace this with a call to a service like Pinecone, Firebase Vector Search, etc.
const simulatedVectorDB = [
    {
        content: "The 'Gujarat-17' variety of groundnut is highly recommended for sandy loam soils. It is drought-resistant and has a maturity period of 110-120 days. Optimal sowing time is the last week of June.",
        metadata: { source: 'Gujarat Agri University Handbook', page: 42 }
    },
    {
        content: "To combat whitefly infestation in cotton crops, a mixture of neem oil (5ml/litre) and a mild liquid soap can be sprayed. This should be done in the evening to avoid leaf burn. Repeat every 7-10 days during high infestation periods.",
        metadata: { source: 'Modern Pest Control Strategies.pdf', page: 18 }
    },
    {
        content: "Crop rotation is a critical practice for maintaining soil health. After harvesting a nitrogen-depleting crop like wheat, it is advisable to plant a nitrogen-fixing legume such as gram (chana) or lentil (masoor).",
        metadata: { source: 'Sustainable Farming Practices.pdf', page: 7 }
    }
];

async function searchDocuments(query: string): Promise<string> {
    console.log(`Searching documents for: ${query}`);
    // In a real RAG implementation, you would convert the query to an embedding
    // and perform a similarity search in your vector database.
    // For this simulation, we'll just find keywords.
    const queryWords = query.toLowerCase().split(/\s+/);
    const relevantDocs = simulatedVectorDB.filter(doc => 
        queryWords.some(word => doc.content.toLowerCase().includes(word))
    );

    if (relevantDocs.length === 0) {
        return "No relevant information found in the documents.";
    }

    // Format the search results to be sent to the LLM.
    return relevantDocs.map(doc => 
        `Found in document '${doc.metadata.source}' (page ${doc.metadata.page}):\n"${doc.content}"`
    ).join('\n\n');
}


export const searchMyDocumentsTool = ai.defineTool(
  {
    name: 'searchMyDocuments',
    description: 'Searches through the user\'s uploaded documents and knowledge base to answer questions about specific farming techniques, crop varieties, pest control, etc.',
    inputSchema: z.object({
      query: z.string().describe('The user\'s question or the topic to search for in the documents.'),
    }),
    outputSchema: z.string().describe('A string containing the formatted search results from the documents, or a message indicating that no relevant information was found.'),
  },
  async (input) => await searchDocuments(input.query)
);
