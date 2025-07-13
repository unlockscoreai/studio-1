
'use server';

import { z } from 'zod';
import { sendCertifiedLetter } from '@/services/click2mail';

const mailingSchema = z.object({
    letterId: z.string(),
    title: z.string(),
    letterContent: z.string(),
});

// This action now calls the real Click2Mail service.
export async function sendLetterForMailing(input: z.infer<typeof mailingSchema>) {
    const validatedInput = mailingSchema.parse(input);
    const { letterId, title, letterContent } = validatedInput;

    // These are mock addresses. In a real application, you'd fetch these from your database
    // based on the client's data and the bureau being disputed.
    const fromAddress = {
        name: 'Sarah Lee',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
    };

    const toAddress = {
        name: 'Experian',
        address1: 'P.O. Box 4500',
        city: 'Allen',
        state: 'TX',
        postalCode: '75013',
    };

    try {
        const result = await sendCertifiedLetter({
            title: title,
            letterContent: letterContent,
            from: fromAddress,
            to: toAddress,
        });
        
        console.log('--- Click2Mail API Response ---', result);
        
        return { success: true, ...result };

    } catch (error) {
        console.error("Error sending letter via Click2Mail:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during mailing.';
        return { success: false, message: errorMessage };
    }
}
