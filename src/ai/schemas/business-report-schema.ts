import { z } from 'genkit';

export const AnalyzeBusinessCreditReportOutputSchema = z.object({
  fundabilityScore: z.number().min(0).max(100).describe("A fundability score from 0 to 100, representing how ready the business is for funding."),
  socialScore: z.number().min(0).max(100).describe("A score from 0-100 representing the business's social media and online presence strength, based on a simulated web search."),
  fundabilityGrade: z.string().describe("A fundability letter grade (A, B, C, D, F) based on the score."),
  businessSummary: z.object({
      businessName: z.string(),
      entityType: z.string().optional(),
      yearsInBusiness: z.string().optional(),
      monthlyRevenue: z.string().optional(),
      status: z.string().optional().describe("The current status of the business (e.g., Active, Inactive, Dissolved)."),
      registeredAgent: z.string().optional().describe("The name of the registered agent on file with the SoS."),
      mailingAddress: z.string().optional().describe("The official mailing address on file with the SoS."),
      lastHistoryUpdate: z.string().optional().describe("The date of the last history update with the SoS."),
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
