'use server';
/**
 * @fileOverview Handles new client onboarding by an affiliate.
 *
 * - onboardClient - A function that handles the client intake process.
 * - OnboardClientInput - The input type for the onboardClient function.
 * - OnboardClientOutput - The return type for the onboardClient function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateCreditDisputeLetter } from './generate-credit-dispute-letter';
import { analyzeCreditProfile, type AnalyzeCreditProfileOutput } from './analyze-credit-profile';
import { addToGoHighLevelWorkflow } from '@/services/gohighlevel';


const OnboardClientInputSchema = z.object({
  clientName: z.string().describe('The full name of the client.'),
  clientEmail: z.string().email().describe('The email address of the client.'),
  clientPhone: z.string().describe('The phone number of the client.'),
  creditReportDataUri: z.string().describe("The client's credit report as a data URI."),
  disputeReason: z.string().describe('The reason for disputing the credit report information.'),
  affiliateId: z.string().describe('The ID of the referring affiliate.'),
});
export type OnboardClientInput = z.infer<typeof OnboardClientInputSchema>;

const OnboardClientOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  generatedLetter: z.string().optional(),
  analysis: z.object({
    summary: z.string(),
    actionItems: z.array(z.string()),
    disputableItems: z.array(z.object({
        item: z.string(),
        reason: z.string(),
        successProbability: z.number()
    })).optional(),
  }).optional(),
});
export type OnboardClientOutput = z.infer<typeof OnboardClientOutputSchema>;

export async function onboardClient(input: OnboardClientInput): Promise<OnboardClientOutput> {
  return onboardClientFlow(input);
}


const onboardClientFlow = ai.defineFlow(
  {
    name: 'onboardClientFlow',
    inputSchema: OnboardClientInputSchema,
    outputSchema: OnboardClientOutputSchema,
  },
  async (input) => {
    // In a real app, you would save the client data to a database here.
    
    // 1. Analyze the credit profile first
    const analysisResult = await analyzeCreditProfile({
        creditReportDataUri: input.creditReportDataUri,
    });
    
    // 2. Generate the dispute letter
    const personalInformation = `Name: ${input.clientName}\nEmail: ${input.clientEmail}\nPhone: ${input.clientPhone}`;
    // For the new generateCreditDisputeLetter which takes more inputs:
    const letterResult = await generateCreditDisputeLetter({
        creditReportDataUri: input.creditReportDataUri,
        personalInformation: personalInformation,
    });
    
    const firstLetter = letterResult.equifaxLetter || letterResult.experianLetter || letterResult.transunionLetter;

    if (!firstLetter) {
        return {
            success: false,
            message: "Failed to generate a dispute letter from the provided report. Please check the file and try again."
        }
    }

    // The letter now awaits client approval in the portal before being mailed.
    console.log(`Generated letter for ${input.clientName}. It is now awaiting approval in the client portal.\n`, firstLetter);
    console.log(`Credit analysis for ${input.clientName}:\n`, analysisResult);


    // 3. Trigger GoHighLevel Workflows
    // In a real app, these workflow IDs would come from your GoHighLevel account.
    const clientWelcomeWorkflowId = "GHL_PERSONAL_CLIENT_WELCOME_WORKFLOW_ID";
    const affiliateNotificationWorkflowId = "GHL_PERSONAL_AFFILIATE_NOTIFICATION_WORKFLOW_ID";

    // Add new client to their welcome workflow
    await addToGoHighLevelWorkflow(clientWelcomeWorkflowId, {
      name: input.clientName,
      email: input.clientEmail,
      phone: input.clientPhone,
      tags: ['New Lead', 'Personal Credit', `Affiliate: ${input.affiliateId}`],
      // You can pass the analysis summary and other data as custom fields
      analysis_summary: analysisResult.summary,
    });
    
    // Notify the affiliate by adding them to a separate workflow
    // Assuming affiliateId is their email for this prototype
    if (input.affiliateId !== "none") {
        await addToGoHighLevelWorkflow(affiliateNotificationWorkflowId, {
            name: input.affiliateId,
            email: input.affiliateId,
            tags: ['Affiliate Notification'],
            // Pass the new client's details as custom fields for the email template
            new_lead_name: input.clientName,
            new_lead_email: input.clientEmail,
        });
    }

    // 4. Return success and the letter
    return {
      success: true,
      message: `Client ${input.clientName} onboarded successfully. Their first dispute letter has been generated and their credit profile has been analyzed.`,
      generatedLetter: firstLetter,
      analysis: analysisResult,
    };
  }
);
