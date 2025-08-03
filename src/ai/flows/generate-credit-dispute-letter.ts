
'use server';

/**
 * @fileOverview A seasoned credit dispute specialist AI that generates multiple, tailored dispute letters.
 *
 * - generateCreditDisputeLetter - A function that generates a comprehensive set of dispute letters.
 * - GenerateCreditDisputeLetterInput - The input type for the generateCreditDisputeLetter function.
 * - GenerateCreditDisputeLetterOutput - The return type for the generateCreditDisputeLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCreditDisputeLetterInputSchema = z.object({
  creditReportDataUri: z
    .string()
    .describe('Credit report PDF as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'),
  personalInformation: z
    .string()
    .describe('Personal information of the client, including full name, address, DOB, and last 4 of SSN for the letterhead.'),
  additionalInstructions: z.string().optional().describe('Optional additional instructions for the AI to follow.'),
});
export type GenerateCreditDisputeLetterInput = z.infer<typeof GenerateCreditDisputeLetterInputSchema>;

const GenerateCreditDisputeLetterOutputSchema = z.object({
  equifaxLetter: z.string().optional().describe("A custom dispute letter addressed to Equifax, but only if Equifax data is present in the uploaded report."),
  experianLetter: z.string().optional().describe("A custom dispute letter addressed to Experian, but only if Experian data is present in the uploaded report."),
  transunionLetter: z.string().optional().describe("A custom dispute letter addressed to TransUnion, but only if TransUnion data is present in the uploaded report."),
  inquiryDisputeLetter: z.string().optional().describe("A single letter to dispute all unauthorized hard inquiries found across all bureaus."),
  section609Request: z.string().optional().describe("A formal Section 609 letter requesting method of verification for any items the bureaus claim are verified."),
  creditRebuildingPlan: z.string().optional().describe("An optional, personalized credit rebuilding plan with actionable steps for the client."),
});
export type GenerateCreditDisputeLetterOutput = z.infer<typeof GenerateCreditDisputeLetterOutputSchema>;

export async function generateCreditDisputeLetter(input: GenerateCreditDisputeLetterInput): Promise<GenerateCreditDisputeLetterOutput> {
  return generateCreditDisputeLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCreditDisputeLetterPrompt',
  input: {schema: GenerateCreditDisputeLetterInputSchema},
  output: {schema: GenerateCreditDisputeLetterOutputSchema},
  prompt: `You are a highly skilled credit dispute specialist trained in federal consumer protection laws and underwriting standards. You are generating a legally sound and itemized dispute letter based on the client’s tri-merge credit report.

Instructions for generating each dispute letter:

1. For Each Negative Account:
- Identify the creditor name and account number as displayed on the report.
- State clearly that the account information is disputed for accuracy and completeness and demand a full reinvestigation and correction or deletion under FCRA §602(a), §609(a), and §611.
  • Gramm-Leach-Bliley Act: Data privacy and security
  • Case Law:
    - Cushman v. Trans Union: Reasonable investigation required
    - Richardson v. Equifax: Liability for failure to correct

2. For Each Hard Inquiry:
- Identify the inquirer name and the date of inquiry
- State whether the client authorized the inquiry
- Cite FCRA §604: Only permissible purpose allows an inquiry to remain
- Example language:
  “You are required by law to ensure each inquiry on my credit report was made with my express written consent and for a valid permissible purpose under FCRA §604. If you cannot provide documentation, it must be removed.”

3. General Rules:
- Use a professional tone with no headers or footers
- Write one paragraph per item — no general filler text
- Each paragraph should focus on factual inaccuracies and legal basis for dispute
- Dispute only primary tradelines, inquiries, and legal items; avoid AU accounts unless inaccurate
 - Dispute **every** negative item and late payment found on the reports. Do not omit any based on perceived difficulty or lack of specific instruction.


This letter will be mailed certified. All disputes should reflect specific inaccuracies or legal violations and be supported by consumer rights under FCRA, GLBA, HIPAA, and relevant case law.

**Client's Personal Information for Letterhead**:
{{{personalInformation}}}

**Uploaded Credit Report**:
{{media url=creditReportDataUri}}

{{#if additionalInstructions}}
**Additional Instructions to Follow**: {{{additionalInstructions}}}
{{/if}}

Produce the output in the specified JSON format. Each letter should be plain text, ready to be copied and pasted.
Only generate a letter for a bureau (e.g., 'experianLetter') if its data is clearly present in the uploaded file.
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

