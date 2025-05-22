'use server';
/**
 * @fileOverview Summarizes popular discussion threads related to elections.
 *
 * - summarizeElectionDiscussions - A function that summarizes election discussions.
 * - SummarizeElectionDiscussionsInput - The input type for the summarizeElectionDiscussions function.
 * - SummarizeElectionDiscussionsOutput - The return type for the summarizeElectionDiscussions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeElectionDiscussionsInputSchema = z.object({
  discussionThread: z
    .string()
    .describe('The content of the discussion thread to be summarized.'),
  wordLimit: z
    .number()
    .default(100)
    .describe('The maximum number of words for the summary.'),
});
export type SummarizeElectionDiscussionsInput = z.infer<
  typeof SummarizeElectionDiscussionsInputSchema
>;

const SummarizeElectionDiscussionsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the election discussion thread.'),
});
export type SummarizeElectionDiscussionsOutput = z.infer<
  typeof SummarizeElectionDiscussionsOutputSchema
>;

export async function summarizeElectionDiscussions(
  input: SummarizeElectionDiscussionsInput
): Promise<SummarizeElectionDiscussionsOutput> {
  return summarizeElectionDiscussionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeElectionDiscussionsPrompt',
  input: {schema: SummarizeElectionDiscussionsInputSchema},
  output: {schema: SummarizeElectionDiscussionsOutputSchema},
  prompt: `You are an AI assistant specializing in summarizing online discussions.

  Please provide a concise summary of the following election discussion thread, limiting the summary to no more than {{wordLimit}} words.

  Discussion Thread:
  {{discussionThread}}`,
});

const summarizeElectionDiscussionsFlow = ai.defineFlow(
  {
    name: 'summarizeElectionDiscussionsFlow',
    inputSchema: SummarizeElectionDiscussionsInputSchema,
    outputSchema: SummarizeElectionDiscussionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
