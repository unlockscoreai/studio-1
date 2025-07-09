'use server';

/**
 * @fileOverview Generates personalized credit dispute letters using AI.
 *
 * - generateCreditDisputeLetter - A function that generates credit dispute letters.
 * - GenerateCreditDisputeLetterInput - The input type for the generateCreditDisputeLetter function.
 * - GenerateCreditDisputeLetterOutput - The return type for the generateCreditDisputeLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCreditDisputeLetterInputSchema = z.object({
  creditReportData: z
    .string()
    .describe('Credit report data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  personalInformation: z
    .string()
    .describe('Personal information of the client, including name, address, and account numbers.'),
  disputeReason: z.string().describe('The reason for disputing the credit report information.'),
});
export type GenerateCreditDisputeLetterInput = z.infer<typeof GenerateCreditDisputeLetterInputSchema>;

const GenerateCreditDisputeLetterOutputSchema = z.object({
  letter: z.string().describe('The generated credit dispute letter.'),
});
export type GenerateCreditDisputeLetterOutput = z.infer<typeof GenerateCreditDisputeLetterOutputSchema>;

export async function generateCreditDisputeLetter(input: GenerateCreditDisputeLetterInput): Promise<GenerateCreditDisputeLetterOutput> {
  return generateCreditDisputeLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCreditDisputeLetterPrompt',
  input: {schema: GenerateCreditDisputeLetterInputSchema},
  output: {schema: GenerateCreditDisputeLetterOutputSchema},
  prompt: `You are an AI assistant that helps users generate personalized credit dispute letters.

  Based on the credit report data, personal information, and dispute reason provided, generate a personalized credit dispute letter.

  Credit Report Data: {{media url=creditReportData}}
  Personal Information: {{{personalInformation}}}
  Dispute Reason: {{{disputeReason}}}

  Ensure the letter is professional, clear, and concise.
  `,
});

const generateCreditDisputeLetterFlow = ai.defineFlow(
  {
    name: 'generateCreditDisputeLetterFlow',
    inputSchema: GenerateCreditDisputeLetterInputSchema,
    outputSchema: GenerateCreditDisputeLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
