'use server';
/**
 * @fileOverview Analyzes a credit report against a fundable credit profile checklist.
 *
 * - analyzeCreditProfile - A function that analyzes a credit report.
 * - AnalyzeCreditProfileInput - The input type for the analyzeCreditProfile function.
 * - AnalyzeCreditProfileOutput - The return type for the analyzeCreditProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCreditProfileInputSchema = z.object({
  creditReportDataUri: z
    .string()
    .describe(
      "A credit report file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCreditProfileInput = z.infer<typeof AnalyzeCreditProfileInputSchema>;

const AnalyzeCreditProfileOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the credit profile analysis.'),
  actionItems: z.array(z.string()).describe('A list of personalized action items to improve the credit profile.'),
});
export type AnalyzeCreditProfileOutput = z.infer<typeof AnalyzeCreditProfileOutputSchema>;

export async function analyzeCreditProfile(input: AnalyzeCreditProfileInput): Promise<AnalyzeCreditProfileOutput> {
  return analyzeCreditProfileFlow(input);
}

const checklist = `
Fundable Credit Profile Checklist:

A. Personal Credit (FICO)
- 700+ FICO score
- No late payments in past 24 months
- Utilization < 10%
- At least 2 primary revolving accounts
- $5K+ limit on at least one primary
- Credit history >= 2 years
- 1-2 installment accounts with >=12 months payment history
- <3 inquiries in last 6 months
- Less than 1 AU tradeline

B. Business Credit (if applicable)
- EIN + Business bank account
- At least 3 net-30 vendor accounts
- Business credit score (D&B, Experian) established
- Monthly revenue: $10K+ (for funding)
- Clean 3-6 months of business bank statements
- No recent overdrafts or negative days

C. Supporting Docs for Underwriting (Assume user has these, but mention if report indicates issues)
- Driver’s license
- Proof of address
- 2 months of paystubs or income
- Business incorporation docs (if applying for biz credit)
`;


const prompt = ai.definePrompt({
  name: 'analyzeCreditProfilePrompt',
  input: {schema: AnalyzeCreditProfileInputSchema},
  output: {schema: AnalyzeCreditProfileOutputSchema},
  prompt: `You are a professional credit analyst. Your task is to analyze the provided credit report and generate a summary and a personalized action plan based on the "Fundable Credit Profile Checklist".

Here is the checklist for a strong, fundable credit profile:
${checklist}

Now, analyze the following credit report:
Credit Report: {{media url=creditReportDataUri}}

Instructions:
1. Parse the credit report to identify key metrics like FICO score, payment history, credit utilization, number and type of accounts, credit history length, and inquiries.
2. Compare the user's profile against each item in the checklist.
3. For the "Summary", provide a short, clear overview of where the user's credit profile stands.
4. For the "Action Items", create a list of specific, actionable steps the user should take to meet the checklist criteria. Be direct and provide concrete examples. For instance:
   - "Your CUR is 42%. Pay down $3,250 on your Visa card to get under 10%."
   - "You’re missing a 2-year primary tradeline. You should look into getting one."
   - "You have 3 AUs but no installment loans. Add a Self Lender loan to diversify your credit mix."

Generate the analysis and provide the output in the specified JSON format.
`,
});

const analyzeCreditProfileFlow = ai.defineFlow(
  {
    name: 'analyzeCreditProfileFlow',
    inputSchema: AnalyzeCreditProfileInputSchema,
    outputSchema: AnalyzeCreditProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
