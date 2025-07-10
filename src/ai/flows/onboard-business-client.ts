
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


// Mock email sending service
async function sendWelcomeEmailToBusiness(clientEmail: string, clientName: string, analysis: AnalyzeBusinessCreditReportOutput) {
    console.log(`---
    SENDING EMAIL TO: ${clientEmail}
    SUBJECT: Your Business Credit Fundability Report is ready!
    BODY:
    Hi ${clientName},

    Thank you for your interest in UnlockScore AI's business credit services.
    
    Your AI-generated Business Credit Fundability Report has been created based on the information you provided.
    
    Here is a brief summary:
    Fundability Grade: ${analysis.fundabilityGrade}
    Next Steps:
    ${analysis.actionPlan.map(item => `- ${item}`).join('\n')}

    To see your full report and get started with our tools, please log in to your portal.

    Best,
    The UnlockScore AI Team
    ---`);
    // In a real app, you'd use an email service like Resend, SendGrid, etc.
    return Promise.resolve();
}

const OnboardBusinessClientInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  state: z.string().length(2).describe("The 2-letter postal code for the state where the business is registered."),
  ein: z.string().describe('The Employer Identification Number.'),
  yearsInBusiness: z.string().describe('How many years the business has been in operation.'),
  monthlyRevenue: z.string().describe('The average monthly revenue of the business.'),
  businessEmail: z.string().email().describe('The email address of the business contact.'),
  businessPhone: z.string().describe('The phone number of the business.'),
  businessCreditReportDataUri: z.string().optional().describe("The client's business credit report as a data URI."),
  manualBusinessDetails: z.string().optional().describe("A manual description of the business's credit situation."),
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

    // Send notifications
    await sendWelcomeEmailToBusiness(input.businessEmail, input.businessName, analysisResult);
    
    return {
      success: true,
      message: `Business client ${input.businessName} onboarded successfully. Their fundability report has been generated.`,
      analysis: analysisResult,
    };
  }
);
