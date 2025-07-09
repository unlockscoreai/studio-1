import { config } from 'dotenv';
config();

import '@/ai/flows/generate-credit-dispute-letter.ts';
import '@/ai/flows/improve-uploaded-letter.ts';
import '@/ai/flows/onboard-client.ts';
import '@/ai/flows/analyze-credit-profile.ts';
import '@/ai/flows/generate-tradeline-strategy.ts';
import '@/ai/flows/analyze-bureau-response.ts';
import '@/ai/flows/analyze-business-credit-report.ts';
import '@/ai/flows/onboard-business-client.ts';
