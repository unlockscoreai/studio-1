'use server';
/**
 * @fileOverview Analyzes a credit report against a checklist for a high Unlock Score.
 *
 * - analyzeCreditProfile - A function that analyzes a credit report.
 * - AnalyzeCreditProfileInput - The input type for the analyzeCreditProfile function.
 * - AnalyzeCreditProfileOutput - The return type for the analyzeCreditProfile function.
 */
import { z, type ZodObject, type ZodString, type ZodNumber, type ZodBoolean, type ZodArray } from 'zod';

import { ai } from '@/ai/genkit';
import { defineFlow, definePrompt, type PromptResult } from '@genkit-ai/flow';
 
const AnalyzeCreditProfileInputSchema = z.object({
  creditReportDataUri: z
    .string()
    .describe(
      "A credit report file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

export type AnalyzeCreditProfileInput = z.infer<typeof AnalyzeCreditProfileInputSchema>;

const AnalyzeCreditProfileOutputSchema = z.object({
  summary: z.object({
    openAccounts: z.number().describe('Number of open credit accounts.'),
    inquiries: z.number().describe('Number of recent credit inquiries.'),
    negativeAccounts: z.number().describe('Number of negative accounts.'),
    derogatoryItems: z.number().describe('Number of derogatory items.'),
    primaryTradelines: z.number().describe('Number of primary tradelines.'),
    authorizedUserTradelines: z.number().describe('Number of authorized user tradelines.'),
    hasAutoInstallment: z.boolean().describe('Indicates if the profile has an auto installment loan.'),
    hasMortgage: z.boolean().describe('Indicates if the profile has a mortgage.'),
  }).describe('A brief summary of the credit profile analysis.'),
  actionItems: z.array(z.string()).describe('A list of personalized action items to improve the credit profile.'),
  disputableItems: z
    .array(
      z.object({
        item: z
          .string()
          .describe(
            'The name of the disputable item from the report (e.g., "Late Payment - Capital One").'
          ),
        reason: z
          .string()
          .describe('A brief reason why this item is likely disputable (e.g., "Inaccurate reporting date").'),
        successProbability: z
          .number()
          .min(0)
          .max(100)
          .describe(
            'The estimated probability of successfully removing this item, as a percentage (e.g., 75).'
          ),
        creditorName: z.string().describe('The name of the creditor associated with the item.'),
        type: z.string().describe('The type of the account (e.g., "Revolving", "Installment").'),
        dateReported: z.string().describe('The date the item was reported.'),
        disputeSuccessChance: z
          .number()
          .min(0)
          .max(100)
          .describe('The estimated probability of successfully removing this item, as a percentage (e.g., 75).'),
      })
    )
    .describe('A list of items identified as potentially disputable, along with their chance of successful removal.'),
  customerInfo: z.object({
    name: z.string().describe('The name of the customer.'),
    address: z.string().describe('The address of the customer.'),
    city: z.string().describe('The city of the customer.'),
    state: z.string().describe('The state of the customer.'),
    zip: z.string().describe('The zip code of the customer.'),
    dob: z.string().describe('The date of birth of the customer.'),
    fullName: z.string().describe('The full name of the customer.'),
    referredBy: z.string().describe('How the customer was referred.'),
    ssn: z.string().describe('The social security number of the customer.'),
  }).describe('Basic customer information derived from the credit report.'),
  creditScores: z.object({
    experian: z.number(),
    equifax: z.number(),
    transunion: z.number(),
  }).describe('Credit scores from different bureaus.'),
  planOfAction: z.string().describe('A detailed plan of action based on the analysis and disputable items.'),
});
export type AnalyzeCreditProfileOutput = z.infer<typeof AnalyzeCreditProfileOutputSchema>;
export type DisputableItem = z.infer<typeof AnalyzeCreditProfileOutputSchema>['disputableItems'][number];
export async function analyzeCreditProfile(input: AnalyzeCreditProfileInput): Promise<AnalyzeCreditProfileOutput> {
  return analyzeCreditProfileFlow(input);
}

const prompt = ai.definePrompt(
  {
    name: 'analyzeCreditProfilePrompt',
    inputSchema: AnalyzeCreditProfileInputSchema,
    outputSchema: AnalyzeCreditProfileOutputSchema,
  },
  async (input) => {
    return {
      messages: [
        {
          role: 'user',
          content: [
            {
              text: 'Analyze the following credit report data and provide a summary, action items, disputable items with reasons and success probability, and a plan of action.',
            },
            {
              text: input.creditReportDataUri,
            },
          ],
        },
      ],
    };
  }
);
const checklist = `
Credit Profile Checklist for a High Unlock Score:

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


export const analyzeCreditProfileFlow = defineFlow<AnalyzeCreditProfileInput, AnalyzeCreditProfileOutput>(
  {
    name: 'analyzeCreditProfileFlow',
    inputSchema: AnalyzeCreditProfileInputSchema,
    outputSchema: AnalyzeCreditProfileOutputSchema,
  },
  async (input) => {
    const promptResult = await ai.prompt({
      input: {
        content: [
          {
            text: `You are a professional credit analyst. Your task is to analyze the provided credit report, generate a summary and action plan, and identify potentially disputable items with a success probability.

Here is the checklist for a strong credit profile that can achieve a high Unlock Score:
${checklist}

Now, analyze the following credit report:
Credit Report: {{media url=creditReportDataUri}}

Instructions:
1.  Parse the credit report to identify key metrics like FICO score, payment history, credit utilization, number and type of accounts, credit history length, and inquiries.
2.  Compare the user's profile against each item in the checklist.
3.  For the "Summary", provide a short, clear overview of where the user's credit profile stands.
4.  For the "Action Items", create a list of specific, actionable steps the user should take to meet the checklist criteria. Be direct and provide concrete examples.
5.  **Crucially, identify all potentially disputable negative items in the report. For each item, create an entry in the 'disputableItems' array.**
    -   Provide the 'item' name (e.g., "Collection from XYZ Corp").
    -   Provide a 'reason' why it might be disputable (e.g., "Inaccurate reporting date").
    -   Estimate a 'successProbability' as a percentage (e.g., 65 for a moderately likely success, 85 for a highly likely success). This should be a number from 0 to 100.

Generate the complete analysis and provide the output in the specified JSON format.
Provide a detailed 'planOfAction' based on the summary and disputable items identified.`,
          },
          { media: { url: input.creditReportDataUri } },
        ],
      },
      output: { schema: AnalyzeCreditProfileOutputSchema },
    });

    return promptResult.output() as AnalyzeCreditProfileOutput;
  },
);