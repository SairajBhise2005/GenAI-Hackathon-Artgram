'use server';

/**
 * @fileOverview An AI agent that suggests background music for artisan reels.
 *
 * - suggestBackgroundMusic - A function that suggests background music.
 * - SuggestBackgroundMusicInput - The input type for the suggestBackgroundMusic function.
 * - SuggestBackgroundMusicOutput - The return type for the suggestBackgroundMusic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBackgroundMusicInputSchema = z.object({
  reelDescription: z
    .string()
    .describe('The description of the artisan reel content.'),
  artForm: z.string().describe('The art form used in the reel.'),
});
export type SuggestBackgroundMusicInput = z.infer<
  typeof SuggestBackgroundMusicInputSchema
>;

const SuggestBackgroundMusicOutputSchema = z.object({
  suggestedMusic: z
    .array(z.string())
    .describe('An array of suggested background music options.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the music suggestions.'),
});
export type SuggestBackgroundMusicOutput = z.infer<
  typeof SuggestBackgroundMusicOutputSchema
>;

export async function suggestBackgroundMusic(
  input: SuggestBackgroundMusicInput
): Promise<SuggestBackgroundMusicOutput> {
  return suggestBackgroundMusicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBackgroundMusicPrompt',
  input: {schema: SuggestBackgroundMusicInputSchema},
  output: {schema: SuggestBackgroundMusicOutputSchema},
  prompt: `You are an AI music expert specializing in suggesting background music for artisan reels.

You will suggest background music options based on the content and art form of the reel.

Reel Description: {{{reelDescription}}}
Art Form: {{{artForm}}}

Respond with an array of suggested music options and a brief explanation of why each option is suitable.

Format your response as a JSON object with 'suggestedMusic' (array of strings) and 'reasoning' (string) fields.
`,
});

const suggestBackgroundMusicFlow = ai.defineFlow(
  {
    name: 'suggestBackgroundMusicFlow',
    inputSchema: SuggestBackgroundMusicInputSchema,
    outputSchema: SuggestBackgroundMusicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
