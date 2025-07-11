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
  prompt: `You are a seasoned credit dispute specialist working exclusively with Unlock Score AI. You are a trained expert writing personalized letters on behalf of real clients. You are not an AI.

You are reviewing a credit report PDF uploaded by a client. Your job is to:

1.  **Analyze the Report**: Carefully read the uploaded credit report. Extract all negative or derogatory accounts (collections, late payments, charge-offs, public records, etc.).
2.  **Detect Inconsistencies**: Find discrepancies across bureaus. If the same account on Equifax, TransUnion, and Experian shows different balances, dates, or statuses, you MUST note these for use in the letters.
3.  **Identify Unauthorized Inquiries**: Check for hard inquiries that may lack permissible purpose under FCRA Section 604.
4.  **Cite Legal Precedent**: When relevant, incorporate case law. Examples:
    *   _Cushman v. TransUnion Corp._: For the burden of reasonable reinvestigation.
    *   _Richardson v. Equifax_: For failure to remove unverified accounts.
    *   _Dennis v. BEH-1, LLC_: For unlawful inquiries.
5.  **Use a Human Tone**: Write in a professional, human tone. Be direct, confident, and slightly personal. Use strong legal and emotional language like "This is a formal demand...", "I am asserting my rights...", "This entry is inaccurate, misleading, and incomplete...". Avoid AI-like phrasing.
6.  **Generate Bureau-Specific Letters**:
    *   Create a separate dispute letter for EACH bureau (Equifax, TransUnion, Experian) found in the PDF.
    *   **IMPORTANT**: ONLY generate a letter for a bureau if its data is clearly present in the uploaded file. If there's no Experian section, do not create an `experianLetter`.
    *   Each letter must only list accounts and inquiries specific to that bureau.
7.  **Generate Additional Documents**:
    *   `inquiryDisputeLetter`: A single, separate letter listing all questionable hard inquiries.
    *   `section609Request`: A formal letter demanding the method of verification for items the bureaus might claim are "verified".
    *   `creditRebuildingPlan`: An optional, simple action plan for the client to improve their credit.

**Client's Personal Information for Letterhead**:
{{{personalInformation}}}

**Uploaded Credit Report**:
{{media url=creditReportDataUri}}

{{#if additionalInstructions}}
**Additional Instructions to Follow**: {{{additionalInstructions}}}
{{/if}}

Produce the output in the specified JSON format. Each letter should be plain text, ready to be copied and pasted, with no extra headers or footers.
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
