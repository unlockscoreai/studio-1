
'use server';
/**
 * @fileOverview Analyzes a business's fundability based on public records and/or an uploaded credit report.
 *
 * - analyzeBusinessCreditReport - A function that runs the analysis.
 * - AnalyzeBusinessCreditReportInput - The input type for the function.
 * - AnalyzeBusinessCreditReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getBusinessDetailsFromState } from '@/ai/tools/get-business-details';

const AnalyzeBusinessCreditReportInputSchema = z.object({
  businessName: z.string().describe("The name of the business to analyze."),
  state: z.string().length(2).describe("The 2-letter postal code for the state where the business is registered."),
  ein: z.string().optional().describe('The Employer Identification Number.'),
  yearsInBusiness: z.string().optional().describe('How many years the business has been in operation.'),
  monthlyRevenue: z.string().optional().describe('The average monthly revenue of the business.'),
  businessPhone: z.string().optional().describe('The phone number of the business.'),
  businessCreditReportDataUri: z
    .string()
    .optional()
    .describe(
      "An optional business credit report file (D&B, Experian Biz, or Equifax Biz) as a data URI. If provided, this is used for a deeper analysis."
    ),
  manualBusinessDetails: z.string().optional().describe("A manual description of the business's credit situation if no report is provided."),
});
export type AnalyzeBusinessCreditReportInput = z.infer<typeof AnalyzeBusinessCreditReportInputSchema>;

const AnalyzeBusinessCreditReportOutputSchema = z.object({
  fundabilityScore: z.number().min(0).max(100).describe("A fundability score from 0 to 100, representing how ready the business is for funding."),
  socialScore: z.number().min(0).max(100).describe("A score from 0-100 representing the business's social media and online presence strength, based on a simulated web search."),
  fundabilityGrade: z.string().describe("A fundability letter grade (A, B, C, D, F) based on the score."),
  businessSummary: z.object({
      businessName: z.string(),
      entityType: z.string().optional(),
      yearsInBusiness: z.string().optional(),
      monthlyRevenue: z.string().optional(),
      status: z.string().optional().describe("The current status of the business (e.g., Active, Inactive, Dissolved)."),
      summaryText: z.string().describe("A professional summary of the business's current fundability status, entity details, and online presence."),
  }),
  creditScoreBreakdown: z.object({
      paydexScore: z.string().nullable().optional().describe("The Paydex score from Dun & Bradstreet."),
      experianIntelliscore: z.string().nullable().optional().describe("The Experian Intelliscore."),
      equifaxBusinessScore: z.string().nullable().optional().describe("The Equifax business credit score."),
  }).describe("A breakdown of key business credit scores, if available from an uploaded report."),
  riskFactors: z.array(z.string()).describe("A list of identified red flags or risks holding back funding potential (e.g., 'Website not found', 'No Google reviews', 'UCC filings present')."),
  actionPlan: z.array(z.string()).describe("A list of 3-5 specific, actionable steps to improve the business credit profile and become bank-ready."),
  coachCallToAction: z.string().describe("A call to action encouraging the user to book a paid, 30-minute, $99 appointment with a business coach to create a custom funding plan covering business structure, planning, and next steps."),
});
export type AnalyzeBusinessCreditReportOutput = z.infer<typeof AnalyzeBusinessCreditReportOutputSchema>;

export async function analyzeBusinessCreditReport(input: AnalyzeBusinessCreditReportInput): Promise<AnalyzeBusinessCreditReportOutput> {
  return analyzeBusinessCreditReportFlow(input);
}


const prompt = ai.definePrompt({
  name: 'analyzeBusinessCreditReportPrompt',
  input: {schema: AnalyzeBusinessCreditReportInputSchema},
  output: {schema: AnalyzeBusinessCreditReportOutputSchema},
  tools: [getBusinessDetailsFromState],
  prompt: `You are an expert business funding coach for Unlock Score AI. Your task is to create a professional audit report on how fundable a business is.

First, you MUST use the getBusinessDetailsFromState tool to look up the public information for "{{businessName}}" in {{state}}. This data is the primary source for the online presence and Secretary of State (SoS) status.

Simulate a web search using the provided business name, phone number, and email to assess their general online footprint.

The user has provided the following additional information:
{{#if ein}}EIN: {{ein}}{{/if}}
{{#if yearsInBusiness}}Years in Business: {{yearsInBusiness}}{{/if}}
{{#if monthlyRevenue}}Monthly Revenue: {{monthlyRevenue}}{{/if}}
{{#if businessPhone}}Business Phone: {{businessPhone}}{{/if}}
{{#if manualBusinessDetails}}Manual Details: {{manualBusinessDetails}}{{/if}}

Next, check if a credit report was uploaded.
{{#if businessCreditReportDataUri}}
A credit report has been provided. Analyze it to extract key financial data: Paydex score, Experian score, Equifax score, UCC filings, late payments, and public records.
Report: {{media url=businessCreditReportDataUri}}
{{else}}
No credit report was provided. Base your analysis on the public data from the tool and any manual details provided.
{{/if}}

Now, generate the complete fundability report in the specified JSON format:
1.  **Fundability Score**: Create a score from 0-100. A high score (80+) means the business is highly fundable. Base this on all available data (SoS status, web presence, user-provided info, and credit report data if available).
2.  **Social Score**: Based on the business's website, Google reviews, and social media presence from the tool, generate a score from 0-100. A high score (80+) means a strong, trustworthy online presence.
3.  **Fundability Grade**: Assign a letter grade based on the score (90-100: A, 80-89: B, 70-79: C, 60-69: D, <60: F).
4.  **Business Summary**: Create a structured summary.
    -   'businessName': The name of the business.
    -   'entityType': The legal entity type from the tool.
    -   'yearsInBusiness': The years in business provided by the user.
    -   'monthlyRevenue': The monthly revenue provided by the user.
    -   'status': The SoS status from the tool.
    -   'summaryText': Write a professional summary paragraph about the business's status and online presence.
5.  **Credit Score Breakdown**: If a report was uploaded, fill in the Paydex, Experian, and Equifax scores. If a score is not available, its field should be null.
6.  **Risk Factors**: Identify and list all red flags. Examples: "Website not found," "SoS status is Inactive," "No Google reviews," "UCC filings present," "Late payments reported."
7.  **Action Plan**: Provide 3-5 concrete, actionable steps the business owner should take to improve their fundability. These should directly address the identified risk factors.
8.  **Coach Call to Action**: Add a friendly and encouraging message inviting the user to book a paid 30-minute, $99 consultation with a business coach. The consultation will cover business structure, identify missing pieces in their fundability profile, and create an actionable plan. Example: "Your business has a strong foundation! To create a custom funding plan and accelerate your growth, book a 30-minute, $99 consultation with one of our expert business coaches today."

The report should be encouraging but direct, motivating the business owner to take action using the Unlock Score AI platform.
`,
});

const analyzeBusinessCreditReportFlow = ai.defineFlow(
  {
    name: 'analyzeBusinessCreditReportFlow',
    inputSchema: AnalyzeBusinessCreditReportInputSchema,
    outputSchema: AnalyzeBusinessCreditReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    