
'use server';

import { z } from 'zod';

const AddressSchema = z.object({
    name: z.string(),
    address1: z.string(),
    address2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
});

const SendLetterParamsSchema = z.object({
    title: z.string(),
    letterContent: z.string(),
    from: AddressSchema,
    to: AddressSchema,
});

const SendLetterResponseSchema = z.object({
    success: z.boolean(),
    orderId: z.string().optional(),
    trackingNumber: z.string().optional(),
    status: z.string(),
    cost: z.number().optional(),
    message: z.string().optional(),
});

type SendLetterParams = z.infer<typeof SendLetterParamsSchema>;
type SendLetterResponse = z.infer<typeof SendLetterResponseSchema>;

const CLICK2MAIL_API_URL = 'https://api.click2mail.com/v3';
const click2mailUser = process.env.CLICK2MAIL_USER;
// The API key is used as the password for Basic Auth
const click2mailApiKey = process.env.CLICK2MAIL_API_KEY;

/**
 * Sends a certified letter via the Click2Mail REST API.
 * @param params - The parameters for sending the letter.
 * @returns A promise that resolves with the response from the Click2Mail API.
 */
export async function sendCertifiedLetter(params: SendLetterParams): Promise<SendLetterResponse> {
    if (!click2mailUser || !click2mailApiKey) {
        console.warn("Click2Mail credentials are not set in .env. Falling back to mock response.");
        return {
            success: true,
            orderId: `mock_ord_${Date.now()}`,
            trackingNumber: `9407111899560000000000`, 
            status: 'Submitted (Mock)',
            cost: 5.43,
            message: 'This is a mock response. Please set your Click2Mail credentials in the .env file.'
        };
    }

    const authHeader = `Basic ${Buffer.from(`${click2mailUser}:${click2mailApiKey}`).toString('base64')}`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
    };

    try {
        // 1. Create a document to be mailed
        const docResponse = await fetch(`${CLICK2MAIL_API_URL}/documents`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                document_name: params.title,
                document_class: "Letter 8.5 x 11",
                document_format: "TEXT",
                document_content: params.letterContent
            })
        });

        const docResult = await docResponse.json();
        if (!docResponse.ok) {
            throw new Error(`Click2Mail Document Error: ${docResult.description}`);
        }
        const documentId = docResult.id;

        // 2. Create an address list
        const addressListResponse = await fetch(`${CLICK2MAIL_API_URL}/address-lists`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                address_list_name: `${params.to.name} - Address`,
                addresses: [{
                    address_name: params.to.name,
                    address_street_1: params.to.address1,
                    address_street_2: params.to.address2,
                    address_city: params.to.city,
                    address_state: params.to.state,
                    address_postal_code: params.to.postalCode
                }]
            })
        });

        const addressListResult = await addressListResponse.json();
         if (!addressListResponse.ok) {
            throw new Error(`Click2Mail Address List Error: ${addressListResult.description}`);
        }
        const addressListId = addressListResult.id;

        // 3. Create a job to send the letter
        const jobResponse = await fetch(`${CLICK2MAIL_API_URL}/jobs`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                document_id: documentId,
                address_list_id: addressListId,
                job_production_speed: '2', // 2 = Next Day
                mail_class: "First-Class Mail",
                mail_type: "Certified w/ Return Receipt Electronic"
            })
        });

        const jobResult = await jobResponse.json();
        if (!jobResponse.ok || jobResult.status !== 'success') {
            throw new Error(`Click2Mail Job Error: ${jobResult.description}`);
        }

        return {
            success: true,
            orderId: jobResult.id,
            // Note: C2M API v3 doesn't return the tracking number directly on job creation.
            // A real app would need a webhook or polling to get this later.
            trackingNumber: 'Pending from Click2Mail', 
            status: 'Submitted to Click2Mail',
            cost: parseFloat(jobResult.price),
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during mailing.';
        console.error("Error sending letter via Click2Mail:", errorMessage);
        return { success: false, message: errorMessage, status: 'Failed' };
    }
}
