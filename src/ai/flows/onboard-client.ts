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

// Assuming you have functions for interacting with Firestore and DocuPost
// import { getUserData, updateUserCredits } from '@/services/firestore';
// import { sendLetterViaDocuPost } from '@/services/docupost';


export const OnboardClientInputSchema = z.object({
  clientName: z.string().describe('Full name of the client.'),
  clientEmail: z.string().email().describe('Email address of the client.'),
  clientPhone: z.string().describe('Phone number of the client.'),
  creditReportDataUri: z.string().describe("Client credit report as a data URI."),
  affiliateId: z.string().describe('ID of the referring affiliate.'),
  clientSocialLastFour: z.string().describe("Last four digits of client Social Security Number."),
  clientAddress: z.string().describe("Client address."),
  identificationDocumentDataUri: z.string().describe("Client identification document as a data URI."),
  proofOfAddressDocumentDataUri: z.string().describe("Client proof of address document as a data URI."),
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


// Credit bureau addresses (from src/app/client/mailing-instructions/page.tsx)
const creditBureauAddresses = {
    experian: [
      "Experian",
      "P.O. Box 4500",
      "Allen, TX 75013"
    ],
    equifax: [
      "Equifax",
      "P.O. Box 740241",
      "Atlanta, GA 30374-0241"
    ],
    transunion: [
      "TransUnion",
      "P.O. Box 2000",
      "Chester, PA 19016-2000"
    ]
};

// Helper function to format address for DocuPost (adjust based on DocuPost API requirements)
const formatAddressForDocuPost = (addressLines: string[]) => {
    return addressLines.join(`
`);
    // Or format as needed by DocuPost
};

// Helper function to parse full name into first and last name (if needed by DocuPost)
const parseFullName = (fullName: string) => {
    const parts = fullName.split(' ');
    const firstName = parts[0];
    const lastName = parts.length > 1 ? parts[parts.length - 1] : ''; // Simple approach, adjust as needed
    return { firstName, lastName };
};


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
    const personalInformation = `Name: ${input.clientName}
Email: ${input.clientEmail}
Phone: ${input.clientPhone}`;
    // For the new generateCreditDisputeLetter which takes more inputs:
    const letterResult = await generateCreditDisputeLetter({
        creditReportDataUri: input.creditReportDataUri,
        personalInformation: personalInformation,
        // If generateCreditDisputeLetter still requires disputeReason, you might need to handle it here.
        // For now, assuming it doesn't need it based on the request.
    });
    
    const firstLetter = letterResult.equifaxLetter || letterResult.experianLetter || letterResult.transunionLetter;

    if (!firstLetter) {
        return {
            success: false,
            message: "Failed to generate a dispute letter from the provided report. Please check the file and try again."
        }
    }

    // The letter now awaits client approval in the portal before being mailed.
    console.log(`Generated letter for ${input.clientName}. It is now awaiting approval in the client portal.
`, firstLetter);
    console.log(`Credit analysis for ${input.clientName}:
`, analysisResult);


    // *** New Logic for Automailer and Credits (Conceptual) - Implement this later ***

    // You will need to implement the logic here to:
    // 1. Get user's available credits from Firestore.
    // 2. Check if user has sufficient credits.
    // 3. If credits are sufficient, call your DocuPost integration function (e.g., sendLetterViaDocuPost).
    // 4. Deduct credits from the user's balance in Firestore upon successful mailing.
    // 5. Handle cases for insufficient credits or DocuPost API failures.
    // 6. Potentially log mailing events in a Firestore collection.

    // *** End of New Logic ***


    // Trigger GoHighLevel Workflows 
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


    // Return success and the letter
    return {
      success: true,
      message: `Client ${input.clientName} onboarded successfully. Their first dispute letter has been generated and their credit profile has been analyzed.`,
      generatedLetter: firstLetter,
      analysis: analysisResult,
    };
  }
);
