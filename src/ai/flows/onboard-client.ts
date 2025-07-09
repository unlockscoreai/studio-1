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

// Mock email sending service
async function sendWelcomeEmailToClient(clientEmail: string, clientName: string, affiliateId: string) {
    console.log(`---
    SENDING EMAIL TO: ${clientEmail}
    SUBJECT: Your UnlockScore AI account is ready!
    BODY:
    Hi ${clientName},

    Thank you for your interest in UnlockScore AI, referred by affiliate: ${affiliateId}.
    
    Your credit report has been received and is now under review by our AI.
    
    To complete your setup, please log in to your client portal to finish the onboarding process. This includes verifying your identity and providing some additional details.

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
    SUBJECT: New Client Submission Received
    BODY:
    Hi,

    Thank you for your submission. We have received the details for your new client:
    Name: ${clientName}
    Email: ${clientEmail}

    We will take it from here.

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
  affiliateId: z.string().describe('The ID of the referring affiliate.'),
});
export type OnboardClientInput = z.infer<typeof OnboardClientInputSchema>;

const OnboardClientOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
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
    
    await sendWelcomeEmailToClient(input.clientEmail, input.clientName, input.affiliateId);
    
    // Assuming affiliateId is their email for this prototype
    await sendNotificationEmailToAffiliate(input.affiliateId, input.clientName, input.clientEmail);

    return {
      success: true,
      message: `Client ${input.clientName} onboarded successfully. Emails have been sent.`,
    };
  }
);
