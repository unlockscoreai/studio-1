
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
- Identify the creditor name and account type (e.g., revolving, installment, auto)
- Note the open date, account status (open/closed), and any discrepancies in balance, dates, payment history, or status across Equifax, Experian, and TransUnion
- Demand a reinvestigation and correction or deletion under:
  • FCRA §602(a): Accuracy and fairness
  • FCRA §609(a): Right to request full file disclosure
  • FCRA §611: Right to dispute inaccurate information
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

3. For Medical Accounts:
- Demand deletion of any account that violates the client’s rights under the HIPAA Privacy Rule (45 CFR §164.508) if no signed authorization is on file
- State: “Under HIPAA, you are not permitted to share or collect protected health information without explicit written consent. Please provide the signed authorization or remove this account.”

4. For Child Support, Judgments, and Liens:
- Challenge the presence of outdated or unverifiable public records under FCRA §609 and §611
- Request validation and source of public record entry
- State: “The reporting of legal matters such as judgments, liens, and child support must be verifiable, accurate, and current. If you cannot prove this with official documentation, these items must be removed from my file.”

5. For Repossessions:
- Dispute inaccurate balances, dates, and status (e.g., charge-off vs settled)
- Demand verification of repossession documentation, payment logs, and deficiency notices
- Note any difference across bureaus as grounds for deletion

6. For Negative Closed Accounts:
- Challenge the necessity and legality of continuing to report closed negative accounts beyond 7 years from date of first delinquency
- Demand removal if account is outdated or unverifiable
- Use FCRA §605(a) as a legal reference for time-based deletions

7. General Rules:
- Use a professional tone with no headers or footers
- Write one paragraph per item — no general filler text
- Each paragraph should focus on factual inaccuracies and legal basis for dispute
- Dispute only primary tradelines, inquiries, and legal items; avoid AU accounts unless inaccurate

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

