// src/ai/flows/personalized-recommendations.ts
'use server';

/**
 * @fileOverview A personalized movie recommendation AI agent.
 *
 * - generatePersonalizedRecommendations - A function that generates personalized movie recommendations based on viewing history.
 * - PersonalizedRecommendationsInput - The input type for the generatePersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the generatePersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  viewingHistory: z
    .string()
    .describe(
      'A list of movies the user has watched, including titles and genres. Example: Titanic (Romance, Drama), Avatar (Action, Sci-Fi)'
    ),
  numberOfRecommendations: z
    .number()
    .default(3)
    .describe('The number of movie recommendations to generate.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('A list of personalized movie recommendations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function generatePersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `Based on the user's viewing history:

  {{viewingHistory}}

  Provide {{numberOfRecommendations}} movie recommendations that the user might enjoy.  Only include the movie titles, separated by commas. Do not provide any explanations.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await personalizedRecommendationsPrompt(input);
    return output!;
  }
);
