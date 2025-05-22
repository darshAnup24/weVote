// This file uses server-side code.
'use server';

/**
 * @fileOverview AI-powered moderation tool for discussion forum posts.
 *
 * - moderateForumPost - A function that moderates forum posts.
 * - ModerateForumPostInput - The input type for the moderateForumPost function.
 * - ModerateForumPostOutput - The return type for the moderateForumPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateForumPostInputSchema = z.object({
  text: z.string().describe('The text of the forum post to be moderated.'),
});
export type ModerateForumPostInput = z.infer<typeof ModerateForumPostInputSchema>;

const ModerateForumPostOutputSchema = z.object({
  isFlagged: z.boolean().describe('Whether the post should be flagged for review.'),
  reason: z.string().describe('The reason for flagging the post, if applicable.'),
});
export type ModerateForumPostOutput = z.infer<typeof ModerateForumPostOutputSchema>;

export async function moderateForumPost(input: ModerateForumPostInput): Promise<ModerateForumPostOutput> {
  return moderateForumPostFlow(input);
}

const moderateForumPostPrompt = ai.definePrompt({
  name: 'moderateForumPostPrompt',
  input: {schema: ModerateForumPostInputSchema},
  output: {schema: ModerateForumPostOutputSchema},
  prompt: `You are an AI moderator for an anonymous discussion forum related to elections.

  Your task is to review the provided forum post and determine if it violates the community guidelines.
  Specifically, you should flag posts that contain hate speech, misinformation, or spam.

  Provide a brief explanation for your decision.

  Forum Post: {{{text}}}

  Output should be in JSON format.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const moderateForumPostFlow = ai.defineFlow(
  {
    name: 'moderateForumPostFlow',
    inputSchema: ModerateForumPostInputSchema,
    outputSchema: ModerateForumPostOutputSchema,
  },
  async input => {
    const {output} = await moderateForumPostPrompt(input);
    return output!;
  }
);
