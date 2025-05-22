
'use server';
/**
 * @fileOverview Generates a participation badge image for an election.
 *
 * - generateParticipationBadge - A function that generates the badge.
 * - GenerateParticipationBadgeInput - The input type for the function.
 * - GenerateParticipationBadgeOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z}_ from 'genkit'; // Use z for schema definition

const GenerateParticipationBadgeInputSchema = z_.object({
  electionTitle: z_.string().describe('The title of the election.'),
  userName: z_.string().optional().describe('The name of the user who voted (optional).'),
});
export type GenerateParticipationBadgeInput = z_.infer<typeof GenerateParticipationBadgeInputSchema>;

const GenerateParticipationBadgeOutputSchema = z_.object({
  badgeImageUrl: z_.string().describe("The data URI of the generated participation badge image. Expected format: 'data:image/png;base64,<encoded_data>'."),
  message: z_.string().optional().describe("A text message accompanying the badge, if any was generated."),
});
export type GenerateParticipationBadgeOutput = z_.infer<typeof GenerateParticipationBadgeOutputSchema>;

export async function generateParticipationBadge(
  input: GenerateParticipationBadgeInput
): Promise<GenerateParticipationBadgeOutput> {
  return generateParticipationBadgeFlow(input);
}

// Note: Gemini 2.0 Flash experimental is used here.
// This model is specifically for tasks that might include image generation.
const generateParticipationBadgeFlow = ai.defineFlow(
  {
    name: 'generateParticipationBadgeFlow',
    inputSchema: GenerateParticipationBadgeInputSchema,
    outputSchema: GenerateParticipationBadgeOutputSchema,
  },
  async (input) => {
    const promptParts = [
        {text: `Generate a symbolic digital badge or sticker image appropriate for someone who has just participated in the election titled "${input.electionTitle}".`}
    ];
    if (input.userName) {
        promptParts.push({text: `The user's name is ${input.userName}, you can subtly incorporate this if it fits the design well, but it's not mandatory.`});
    }
    promptParts.push({text: "The image should evoke a sense of civic duty, achievement, and participation. Focus on symbols like a stylized checkmark, a voting box icon, celebratory graphics, or abstract designs related to community or decision-making. Avoid rendering complex text directly in the image unless it's very simple like 'Voted' or a checkmark symbol. The style should be modern and positive."});
    
    try {
      const {media, text} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Ensure this model is used
        prompt: promptParts,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // Request both IMAGE and TEXT
          // Optional: Add safety settings if needed, though default should be fine for this use case
        },
      });

      if (media && media.url) {
        return {
          badgeImageUrl: media.url, // This will be the data URI
          message: text || "Thank you for your participation!",
        };
      } else {
        // Fallback or error handling if image generation fails
        console.warn('Image generation did not return a media URL.');
        // Potentially return a default placeholder image data URI or throw an error
        return {
            badgeImageUrl: 'https://placehold.co/300x200.png?text=Participation+Acknowledged', // Fallback placeholder
            message: text || "Your participation is acknowledged, but the custom badge could not be generated."
        };
      }
    } catch (error) {
        console.error("Error in generateParticipationBadgeFlow:", error);
        // Provide a fallback image URL in case of error
        return {
            badgeImageUrl: 'https://placehold.co/300x200.png?text=Error+Generating+Badge',
            message: "An error occurred while generating your participation badge."
        };
    }
  }
);
