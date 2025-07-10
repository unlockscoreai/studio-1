
'use server';
/**
 * @fileOverview Handles new business client onboarding.
 *
 * - onboardBusinessClient - A function that handles the business client intake process.
 * - OnboardBusinessClientInput - The input type for the function.
 * - OnboardBusinessClientOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { analyzeBusinessCreditReport, type AnalyzeBusinessCreditReportOutput } from './analyze-business-credit-report';
import { AnalyzeBusinessCreditReportOutputSchema } from '@/ai/schemas/business-report-schema';
import { addToGoHighLevelWorkflow } from '@/services/gohighlevel';


const OnboardBusinessClientInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  state: z.string().length(2).describe("The 2-letter postal code for the state where the business is registered."),
  ein: z.string().describe('The Employer Identification Number.'),
  yearsInBusiness: z.string().describe('How many years the business has been in operation.'),
  monthlyRevenue: z.string().describe('The average monthly revenue of the business.'),
  businessEmail: z.string().email().describe('The email address of the business contact.'),
  businessPhone: z.string().describe('The phone number of the business.'),
  businessAddress: z.string().optional().describe("The business's full physical address."),
  businessCreditReportDataUri: z.string().optional().describe("The client's business credit report as a data URI."),
  manualBusinessDetails: z.string().optional().describe("A manual description of the business's credit situation."),
  affiliateId: z.string().optional().describe('The ID of the referring affiliate.'),
});
export type OnboardBusinessClientInput = z.infer<typeof OnboardBusinessClientInputSchema>;

const OnboardBusinessClientOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  analysis: AnalyzeBusinessCreditReportOutputSchema.optional(),
});
export type OnboardBusinessClientOutput = z.infer<typeof OnboardBusinessClientOutputSchema>;

export async function onboardBusinessClient(input: OnboardBusinessClientInput): Promise<OnboardBusinessClientOutput> {
  return onboardBusinessClientFlow(input);
}


const onboardBusinessClientFlow = ai.defineFlow(
  {
    name: 'onboardBusinessClientFlow',
    inputSchema: OnboardBusinessClientInputSchema,
    outputSchema: OnboardBusinessClientOutputSchema,
  },
  async (input) => {
    
    // In a real app, you would save the client data to a database here.
    
    const analysisResult = await analyzeBusinessCreditReport({
        businessName: input.businessName,
        state: input.state,
        ein: input.ein,
        yearsInBusiness: input.yearsInBusiness,
        monthlyRevenue: input.monthlyRevenue,
        businessPhone: input.businessPhone,
        businessAddress: input.businessAddress,
        businessCreditReportDataUri: input.businessCreditReportDataUri,
        manualBusinessDetails: input.manualBusinessDetails,
    });

    if (!analysisResult) {
        return {
            success: false,
            message: "Failed to analyze the business credit report. Please check the file and try again."
        }
    }
    
    console.log(`Business credit analysis for ${input.businessName}:\n`, analysisResult);

    // Trigger GoHighLevel Workflows
    // In a real app, these workflow IDs would come from your GoHighLevel account.
    const clientWelcomeWorkflowId = "GHL_BUSINESS_WELCOME_WORKFLOW_ID";
    const affiliateNotificationWorkflowId = "GHL_BUSINESS_AFFILIATE_NOTIFICATION_WORKFLOW_ID";

    // Add new business client to welcome workflow
    await addToGoHighLevelWorkflow(clientWelcomeWorkflowId, {
        name: input.businessName,
        email: input.businessEmail,
        phone: input.businessPhone,
        tags: ['New Business Lead', `Affiliate: ${input.affiliateId || 'none'}`],
        // You would pass analysis results as custom fields
        fundability_grade: analysisResult.fundabilityGrade,
        fundability_score: analysisResult.fundabilityScore,
    });

    if (input.affiliateId && input.affiliateId !== "none") {
        // Notify affiliate by adding them to a separate workflow
        await addToGoHighLevelWorkflow(affiliateNotificationWorkflowId, {
            name: input.affiliateId, // Assuming affiliateId is name
            email: input.affiliateId, // Assuming affiliateId is email
            tags: ['Affiliate Notification'],
            // Pass the new lead's details as custom fields for the email template
            new_lead_name: input.businessName,
            new_lead_email: input.businessEmail,
        });
    }
    
    return {
      success: true,
      message: `Business client ${input.businessName} onboarded successfully. Their fundability report has been generated.`,
      analysis: analysisResult,
    };
  }
);
