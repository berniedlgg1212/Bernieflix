// src/ai/flows/generate-synopsis.ts
'use server';
/**
 * @fileOverview A movie synopsis summarization AI agent.
 *
 * - generateSynopsis - A function that handles the movie synopsis summarization process.
 * - GenerateSynopsisInput - The input type for the generateSynopsis function.
 * - GenerateSynopsisOutput - The return type for the generateSynopsis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSynopsisInputSchema = z.object({
  synopsis: z.string().describe('The original movie synopsis.'),
});
export type GenerateSynopsisInput = z.infer<typeof GenerateSynopsisInputSchema>;

const GenerateSynopsisOutputSchema = z.object({
  summary: z.string().describe('The summarized movie synopsis.'),
});
export type GenerateSynopsisOutput = z.infer<typeof GenerateSynopsisOutputSchema>;

export async function generateSynopsis(input: GenerateSynopsisInput): Promise<GenerateSynopsisOutput> {
  return generateSynopsisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSynopsisPrompt',
  input: {schema: GenerateSynopsisInputSchema},
  output: {schema: GenerateSynopsisOutputSchema},
  prompt: `You are an expert movie summarizer.  You will be given a synopsis of a movie, and you will summarize it to be shorter, while still conveying the main points of the movie.\n\nOriginal Synopsis: {{{synopsis}}}`,
});

const generateSynopsisFlow = ai.defineFlow(
  {
    name: 'generateSynopsisFlow',
    inputSchema: GenerateSynopsisInputSchema,
    outputSchema: GenerateSynopsisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
