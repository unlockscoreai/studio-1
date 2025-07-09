
'use server';
/**
 * @fileOverview Analyzes a business credit report to generate a fundability summary.
 *
 * - analyzeBusinessCreditReport - A function that analyzes a business credit report.
 * - AnalyzeBusinessCreditReportInput - The input type for the function.
 * - AnalyzeBusinessCreditReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getBusinessDetailsFromState } from '@/ai/tools/get-business-details';

const AnalyzeBusinessCreditReportInputSchema = z.object({
  businessName: z.string().describe("The name of the business to analyze."),
  state: z.string().length(2).describe("The 2-letter postal code for the state where the business is registered."),
  businessCreditReportDataUri: z
    .string()
    .optional()
    .describe(
      "A business credit report file (D&B, Experian Biz, or Equifax Biz) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  manualBusinessDetails: z.string().optional().describe("A textual description of the business's credit situation, provided by the user if no report is available."),
});
export type AnalyzeBusinessCreditReportInput = z.infer<typeof AnalyzeBusinessCreditReportInputSchema>;

const AnalyzeBusinessCreditReportOutputSchema = z.object({
  businessSummary: z.object({
      businessName: z.string().describe("The name of the business."),
      dunsNumber: z.string().optional().describe("The Dun & Bradstreet D-U-N-S number."),
      entityType: z.string().optional().describe("The legal entity type of the business (e.g., LLC, Corp)."),
      yearsInBusiness: z.number().optional().describe("The number of years the business has been in operation."),
      monthlyRevenue: z.string().optional().describe("The reported monthly revenue."),
  }).describe("A summary of the business's basic information."),
  creditScoreBreakdown: z.object({
      paydexScore: z.string().optional().describe("The Paydex score from Dun & Bradstreet."),
      experianIntelliscore: z.string().optional().describe("The Experian Intelliscore."),
      equifaxBusinessScore: z.string().optional().describe("The Equifax business credit score."),
      activeTradelines: z.number().optional().describe("The number of active tradelines."),
      averageAccountAge: z.string().optional().describe("The average age of all credit accounts."),
      creditUtilization: z.string().optional().describe("The business credit utilization percentage."),
  }).describe("A breakdown of key business credit scores and metrics."),
  riskFactors: z.array(z.string()).describe("A list of identified risk factors, such as UCC filings, late payments, public records, or a thin credit file."),
  fundabilityGrade: z.string().length(1, { message: "Must be a single letter grade from A-F." }).describe("A single letter grade (A-F) representing the overall fundability of the business."),
  actionPlan: z.array(z.string()).describe("A list of 3-5 specific, actionable steps to improve the business credit profile."),
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
  prompt: `You are a business credit analyst for Unlock Score AI. The user will upload a business credit report from Dun & Bradstreet, Experian Business, or Equifax Business, OR they will provide a manual description of their credit situation.

Your job is to:
1.  First, use the getBusinessDetailsFromState tool to look up the official business information from the Secretary of State based on the provided 'businessName' and 'state'. This is the authoritative source for entity type and formation date.
2.  Next, extract key data from the provided credit report or manual description: DUNS number, Paydex score, Experian score, account age, # of tradelines, credit utilization, and any derogatory items (collections, UCCs, liens, etc.).
3.  Synthesize information from both the Secretary of State lookup and the user-provided details to form a complete picture.
4.  Identify any red flags or missing components that may affect business fundability. For each identified risk, add it to the 'riskFactors' array.
5.  Provide a fundability rating (A–F) and assign it to the 'fundabilityGrade' field.
6.  Offer 3–5 specific action steps to improve their business credit profile and add them to the 'actionPlan' array.

Do NOT assume anything. Base your analysis strictly on the data provided and the data retrieved from the tool.

{{#if businessCreditReportDataUri}}
Source Information (from uploaded report):
{{media url=businessCreditReportDataUri}}
{{else}}
Source Information (from manual description):
{{{manualBusinessDetails}}}
{{/if}}

Generate the complete analysis and provide the output in the specified JSON format.
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
