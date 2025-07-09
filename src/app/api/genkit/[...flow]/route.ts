import { nextHandler } from '@genkit-ai/next/server';
import { config } from 'dotenv';
config();

// Import flows so they are registered.
// These imports will in turn import and initialize the ai object from @/ai/genkit.ts
import '@/ai/flows/generate-credit-dispute-letter';
import '@/ai/flows/improve-uploaded-letter';

export const POST = nextHandler();
