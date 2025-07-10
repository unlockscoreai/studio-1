
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
  businessCreditReportDataUri: z
    .string()
    .optional()
    .describe(
      "An optional business credit report file (D&B, Experian Biz, or Equifax Biz) as a data URI. If provided, this is used for a deeper analysis."
    ),
});
export type AnalyzeBusinessCreditReportInput = z.infer<typeof AnalyzeBusinessCreditReportInputSchema>;

const AnalyzeBusinessCreditReportOutputSchema = z.object({
  fundabilityScore: z.number().min(0).max(100).describe("A fundability score from 0 to 100, representing how ready the business is for funding."),
  businessSummary: z.string().describe("A professional summary of the business's current fundability status, entity details, and online presence."),
  creditScoreBreakdown: z.object({
      paydexScore: z.string().nullable().optional().describe("The Paydex score from Dun & Bradstreet."),
      experianIntelliscore: z.string().nullable().optional().describe("The Experian Intelliscore."),
      equifaxBusinessScore: z.string().nullable().optional().describe("The Equifax business credit score."),
  }).describe("A breakdown of key business credit scores, if available from an uploaded report."),
  riskFactors: z.array(z.string()).describe("A list of identified red flags or risks holding back funding potential (e.g., 'Website not found', 'No Google reviews', 'UCC filings present')."),
  actionPlan: z.array(z.string()).describe("A list of 3-5 specific, actionable steps to improve the business credit profile and become bank-ready."),
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

First, you MUST use the getBusinessDetailsFromState tool to look up the business's public information. This data is the primary source for the online presence and Secretary of State (SoS) status.

Next, check if a credit report was uploaded.
{{#if businessCreditReportDataUri}}
A credit report has been provided. Analyze it to extract key financial data: Paydex score, Experian score, Equifax score, UCC filings, late payments, and public records.
Report: {{media url=businessCreditReportDataUri}}
{{else}}
No credit report was provided. Base your analysis solely on the public data retrieved from the tool.
{{/if}}

Now, generate the complete fundability report:
1.  **Fundability Score**: Create a score from 0-100. A high score (80+) means the business is highly fundable. A low score (<50) indicates significant issues. Base this on all available data (SoS status, web presence, credit report data if available).
2.  **Business Summary**: Write a professional summary. Start with the business name and its SoS status. Mention its online presence (website, reviews, social media).
3.  **Credit Score Breakdown**: If a report was uploaded, fill in the Paydex, Experian, and Equifax scores. If a score is not available, its field should be null.
4.  **Risk Factors**: Identify and list all red flags. Examples: "Website not found," "SoS status is Inactive," "No Google reviews," "UCC filings present," "Late payments reported."
5.  **Action Plan**: Provide 3-5 concrete, actionable steps the business owner should take to improve their fundability. These should directly address the identified risk factors.

The report should be encouraging but direct, motivating the business owner to take action using the Unlock Score AI platform. Generate the report in the specified JSON format.
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
