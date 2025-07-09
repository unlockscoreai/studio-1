'use server';
/**
 * @fileOverview Analyzes a credit bureau's response letter.
 *
 * - analyzeBureauResponse - A function that analyzes a response letter.
 * - AnalyzeBureauResponseInput - The input type for the function.
 * - AnalyzeBureauResponseOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeBureauResponseInputSchema = z.object({
  responseLetterDataUri: z
    .string()
    .describe(
      "A credit bureau response letter file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  disputedItem: z.string().describe("The original item that was disputed."),
});
export type AnalyzeBureauResponseInput = z.infer<typeof AnalyzeBureauResponseInputSchema>;

const AnalyzeBureauResponseOutputSchema = z.object({
  outcome: z.enum(["deleted", "repaired", "verified", "stalled", "rejected", "information_request"]).describe('The outcome of the dispute based on the bureau\'s response.'),
  summary: z.string().describe("A concise summary of the bureau's response."),
  nextStep: z.string().describe("A clear, actionable next step for the client to take."),
});
export type AnalyzeBureauResponseOutput = z.infer<typeof AnalyzeBureauResponseOutputSchema>;

export async function analyzeBureauResponse(input: AnalyzeBureauResponseInput): Promise<AnalyzeBureauResponseOutput> {
  return analyzeBureauResponseFlow(input);
}


const prompt = ai.definePrompt({
  name: 'analyzeBureauResponsePrompt',
  input: {schema: AnalyzeBureauResponseInputSchema},
  output: {schema: AnalyzeBureauResponseOutputSchema},
  prompt: `You are an expert credit repair analyst. Your task is to analyze the provided credit bureau response letter and determine the outcome and next steps for the user.

The user originally disputed the following item: "{{disputedItem}}"

Now, analyze the following response letter from the credit bureau:
Response Letter: {{media url=responseLetterDataUri}}

Instructions:
1.  Read the letter carefully to understand the bureau's decision regarding the disputed item.
2.  Determine the 'outcome' based on the letter's content. The possible outcomes are:
    - "deleted": The bureau has removed the negative item.
    - "repaired": The bureau has corrected some information but did not delete the item.
    - "verified": The bureau claims the information is accurate and will not remove it.
    - "stalled": The bureau is asking for more time or has not made a decision.
    - "information_request": The bureau requires more information from the client (e.g., ID, proof of address).
    - "rejected": The bureau has rejected the dispute for a technical reason (e.g., frivolous).
3.  Write a brief 'summary' of the letter's main point.
4.  Provide a clear, actionable 'nextStep' for the client. Examples:
    - If deleted: "No further action is needed for this item. Congratulations! Monitor your credit report to ensure it's gone."
    - If verified: "The bureau claims this is verified. The next step is to send a Method of Verification (MOV) letter to challenge their process."
    - If information_request: "The bureau needs more documents. Please provide a clear copy of your driver's license and a recent utility bill."

Generate the analysis and provide the output in the specified JSON format.
`,
});

const analyzeBureauResponseFlow = ai.defineFlow(
  {
    name: 'analyzeBureauResponseFlow',
    inputSchema: AnalyzeBureauResponseInputSchema,
    outputSchema: AnalyzeBureauResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
