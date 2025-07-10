
'use server';
/**
 * @fileOverview Simulates generating and sending a vendor credit application.
 *
 * - generateAndSendVendorApplication - A function that handles the application process.
 * - GenerateAndSendVendorApplicationInput - The input type for the function.
 * - GenerateAndSendVendorApplicationOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessDetailsSchema = z.object({
    businessName: z.string(),
    ownerName: z.string(),
    email: z.string(),
    phone: z.string(),
    ein: z.string(),
    billingAddress: z.string(),
    state: z.string(),
    entityType: z.string(),
    duns: z.string().optional(),
});

const GenerateAndSendVendorApplicationInputSchema = z.object({
  businessDetails: BusinessDetailsSchema,
  vendorName: z.string().describe("The name of the vendor the user is applying to."),
});
export type GenerateAndSendVendorApplicationInput = z.infer<typeof GenerateAndSendVendorApplicationInputSchema>;

const GenerateAndSendVendorApplicationOutputSchema = z.object({
  success: z.boolean(),
  message: z.string().describe("A confirmation message for the user, indicating the application was sent."),
  applicationText: z.string().describe("The formatted text of the generated application for the user's records."),
});
export type GenerateAndSendVendorApplicationOutput = z.infer<typeof GenerateAndSendVendorApplicationOutputSchema>;

export async function generateAndSendVendorApplication(input: GenerateAndSendVendorApplicationInput): Promise<GenerateAndSendVendorApplicationOutput> {
  return generateAndSendVendorApplicationFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateVendorApplicationPrompt',
  input: {schema: GenerateAndSendVendorApplicationInputSchema},
  output: {schema: GenerateAndSendVendorApplicationOutputSchema},
  prompt: `You are a "Done For You" business credit application assistant for UnlockScore AI's VIP clients.
Your task is to take the client's business information and generate a standard credit application for a specific vendor. Then, you must simulate sending it.

Vendor Name: {{vendorName}}

Client Business Information:
- Business Name: {{businessDetails.businessName}}
- Owner Name: {{businessDetails.ownerName}}
- Email: {{businessDetails.email}}
- Phone: {{businessDetails.phone}}
- EIN: {{businessDetails.ein}}
- Billing Address: {{businessDetails.billingAddress}}
- State: {{businessDetails.state}}
- Entity Type: {{businessDetails.entityType}}
{{#if businessDetails.duns}}- DUNS Number: {{businessDetails.duns}}{{/if}}

Instructions:
1.  **Generate 'applicationText'**: Create a clear, well-formatted text document that looks like a filled-out credit application form using all the provided business details. It should be titled "Credit Application for {{vendorName}}".
2.  **Generate 'message'**: Create a friendly confirmation message for the user. Based on the vendor name, decide if it was faxed or emailed (e.g., Uline, Grainger, and Quill are typically faxed). State that the application has been successfully sent to the vendor's credit department.
3.  **Set 'success' to true**.

Provide the output in the specified JSON format.
`,
});

const generateAndSendVendorApplicationFlow = ai.defineFlow(
  {
    name: 'generateAndSendVendorApplicationFlow',
    inputSchema: GenerateAndSendVendorApplicationInputSchema,
    outputSchema: GenerateAndSendVendorApplicationOutputSchema,
  },
  async input => {
    // In a real application, this is where you would:
    // 1. Fetch the vendor's actual PDF template from Cloud Storage.
    // 2. Use a library like 'pdf-lib' to fill the PDF fields with `input.businessDetails`.
    // 3. Fetch the vendor's contact info (fax/email) from a database.
    // 4. Use a service like Phaxio (fax) or SendGrid (email) to send the filled PDF.
    // 5. Save the sent application and tracking ID to the user's record in Firestore.

    // For this prototype, we'll simulate this entire process with a single AI call.
    const {output} = await prompt(input);
    return output!;
  }
);
