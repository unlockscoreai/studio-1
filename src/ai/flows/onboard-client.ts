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

// Mock email sending service
async function sendWelcomeEmailToClient(clientEmail: string, clientName: string, affiliateId: string, analysis?: AnalyzeCreditProfileOutput) {
    let analysisSection = '';
    if (analysis) {
        analysisSection = `
    Here is a brief analysis of the credit profile submitted:
    Summary: ${analysis.summary}
    Action Items:
    ${analysis.actionItems.map(item => `- ${item}`).join('\n')}
        `;
    }

    console.log(`---
    SENDING EMAIL TO: ${clientEmail}
    SUBJECT: Your first dispute letter is ready!
    BODY:
    Hi ${clientName},

    Thank you for your interest in UnlockScore AI, referred by affiliate: ${affiliateId}.
    
    Your first AI-generated dispute letter has been created based on the information provided.
    ${analysisSection}
    To complete your setup, please log in to your client portal to review the letter and finish the onboarding process. This includes verifying your identity and providing some additional details.

    You can log in at our website to get started.

    Best,
    The UnlockScore AI Team
    ---`);
    // In a real app, you'd use an email service like Resend, SendGrid, etc.
    return Promise.resolve();
}

async function sendNotificationEmailToAffiliate(affiliateEmail: string, clientName: string, clientEmail: string) {
    // We don't have the affiliate's email, so I'll just use a placeholder.
    // I'll assume affiliateId is the email for this prototype.
    console.log(`---
    SENDING EMAIL TO: ${affiliateEmail}
    SUBJECT: New Client Submission Received & Letter Generated
    BODY:
    Hi,

    Thank you for your submission. We have received the details for your new client and generated their first dispute letter:
    Name: ${clientName}
    Email: ${clientEmail}

    We will take it from here. The client has been notified to log in and complete their onboarding.

    Best,
    The UnlockScore AI Team
    ---`);
    // In a real app, you'd use an email service like Resend, SendGrid, etc.
    return Promise.resolve();
}

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
    
    // 1. Generate the dispute letter
    const personalInformation = `Name: ${input.clientName}\nEmail: ${input.clientEmail}\nPhone: ${input.clientPhone}`;
    const letterPromise = generateCreditDisputeLetter({
        creditReportData: input.creditReportDataUri,
        personalInformation: personalInformation,
        disputeReason: input.disputeReason,
    });

    // 2. Analyze the credit profile
    const analysisPromise = analyzeCreditProfile({
        creditReportDataUri: input.creditReportDataUri,
    });

    const [letterResult, analysisResult] = await Promise.all([letterPromise, analysisPromise]);


    if (!letterResult.letter) {
        return {
            success: false,
            message: "Failed to generate the dispute letter. Please check the inputs and try again."
        }
    }

    // In a real app, you would save the generated letter to the database, associated with the client.
    console.log(`Generated letter for ${input.clientName}:\n`, letterResult.letter);
    console.log(`Credit analysis for ${input.clientName}:\n`, analysisResult);


    // 3. Send notifications
    await sendWelcomeEmailToClient(input.clientEmail, input.clientName, input.affiliateId, analysisResult);
    
    // Assuming affiliateId is their email for this prototype
    await sendNotificationEmailToAffiliate(input.affiliateId, input.clientName, input.clientEmail);

    // 4. Return success and the letter
    return {
      success: true,
      message: `Client ${input.clientName} onboarded successfully. Their first dispute letter has been generated and their credit profile has been analyzed.`,
      generatedLetter: letterResult.letter,
      analysis: analysisResult,
    };
  }
);
