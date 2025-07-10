'use server';
/**
 * @fileOverview An AI-powered engine to predict funding pre-approval chances.
 *
 * - predictFundingApproval - A function that runs the prediction.
 * - PredictFundingApprovalInput - The input type for the function.
 * - PredictFundingApprovalOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFundingApprovalInputSchema = z.object({
  businessName: z.string().describe("The name of the business."),
  yearsInBusiness: z.number().min(0).describe("How many years the business has been in operation."),
  monthlyRevenue: z.number().min(0).describe("The average monthly revenue of the business."),
  industry: z.string().describe("The industry the business operates in (e.g., 'Logistics', 'Retail', 'Software')."),
  personalCreditScore: z.number().min(300).max(850).describe("The business owner's personal FICO score."),
  businessCreditScore: z.number().min(0).max(100).describe("The business's fundability or Paydex score (0-100 scale)."),
});
export type PredictFundingApprovalInput = z.infer<typeof PredictFundingApprovalInputSchema>;

const PredictionSchema = z.object({
    product: z.string().describe("The type of funding product (e.g., 'SBA Loan', 'Business Line of Credit', 'Term Loan', 'Fintech Loan')."),
    lenderType: z.string().describe("The type of lender (e.g., 'Major Bank', 'SBA Lender', 'Fintech', 'Online Lender')."),
    amountRange: z.string().describe("The estimated range of funding the business could qualify for (e.g., '$50,000 - $100,000')."),
    approvalLikelihood: z.number().min(0).max(100).describe("The estimated probability of approval, from 0 to 100."),
    reasoning: z.string().describe("A brief explanation for the prediction, citing the user's provided data."),
});

const PredictFundingApprovalOutputSchema = z.object({
  predictions: z.array(PredictionSchema).describe("A list of potential funding options and their pre-approval analysis."),
  overallSummary: z.string().describe("A brief, overall summary of the business's funding readiness and a concluding recommendation."),
});
export type PredictFundingApprovalOutput = z.infer<typeof PredictFundingApprovalOutputSchema>;

export async function predictFundingApproval(input: PredictFundingApprovalInput): Promise<PredictFundingApprovalOutput> {
  return predictFundingApprovalFlow(input);
}


const prompt = ai.definePrompt({
  name: 'predictFundingApprovalPrompt',
  input: {schema: PredictFundingApprovalInputSchema},
  output: {schema: PredictFundingApprovalOutputSchema},
  prompt: `You are an AI-powered funding pre-approval engine for UnlockScore AI. Your task is to analyze a business's profile and predict its likelihood of obtaining various types of funding.

Business Profile:
- Business Name: {{businessName}}
- Years in Business: {{yearsInBusiness}}
- Average Monthly Revenue: \${{monthlyRevenue}}
- Industry: {{industry}}
- Owner's Personal FICO Score: {{personalCreditScore}}
- Business Fundability Score: {{businessCreditScore}}/100

Instructions:
1.  **Analyze the Profile**: Based on the data provided, assess the business's strengths and weaknesses from a lender's perspective.
    -   **Time in Business**: 2+ years is ideal for traditional banks. Less than 2 years is better suited for fintech/online lenders.
    -   **Revenue**: Strong revenue increases options and amounts.
    -   **Credit Scores**: Personal FICO > 680 and Business Score > 75 are strong indicators. Lower scores limit options to more expensive fintech loans.
    -   **Industry**: Some industries are considered higher risk than others.

2.  **Generate Predictions**: Create a list of 2-4 \`predictions\` in the specified JSON format. For each prediction:
    -   \`product\`: Suggest a suitable funding product (e.g., 'Business Line of Credit').
    -   \`lenderType\`: Suggest the most likely lender type (e.g., 'Major Bank', 'SBA Lender', 'Fintech').
    -   \`amountRange\`: Provide a realistic estimated funding range.
    -   \`approvalLikelihood\`: Give a percentage chance of approval (e.g., 70 for 70%). This is a core part of the feature.
    -   \`reasoning\`: Briefly explain *why* you are making this prediction, referencing the business's data. For example, "With a FICO score over 700 and 3 years in business, you are a strong candidate for a traditional bank line of credit." or "Because the business is under 2 years old, fintech lenders are the most likely option."

3.  **Create Overall Summary**: Write a concluding \`overallSummary\` that synthesizes the findings and gives the user a clear understanding of their current funding position and what to focus on next.

The goal is to provide realistic, data-driven predictions that empower the business owner to pursue the right funding opportunities.
`,
});

const predictFundingApprovalFlow = ai.defineFlow(
  {
    name: 'predictFundingApprovalFlow',
    inputSchema: PredictFundingApprovalInputSchema,
    outputSchema: PredictFundingApprovalOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
