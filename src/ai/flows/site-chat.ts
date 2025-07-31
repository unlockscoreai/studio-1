'use server';
/**
 * @fileOverview An AI assistant for the UnlockScore AI website.
 *
 * - siteChat - A function that responds to user queries about the site.
 * - SiteChatInput - The input type for the siteChat function.
 * - SiteChatOutput - The return type for the siteChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SiteChatInputSchema = z.object({
  question: z.string().describe("The user's question about UnlockScore AI."),
});
export type SiteChatInput = z.infer<typeof SiteChatInputSchema>;

const SiteChatOutputSchema = z.object({
  answer: z.string().describe('The helpful answer from the AI assistant.'),
});
export type SiteChatOutput = z.infer<typeof SiteChatOutputSchema>;

export async function siteChat(input: SiteChatInput): Promise<SiteChatOutput> {
  return siteChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'siteChatPrompt',
  input: {schema: SiteChatInputSchema},
  output: {schema: SiteChatOutputSchema},
  prompt: `You are a friendly and knowledgeable AI assistant for UnlockScore AI. Your purpose is to answer visitor questions and guide them around the website. Keep your answers concise, helpful, and friendly.

Your knowledge base consists of the following:

**About UnlockScore AI:**
We are an AI-powered platform that helps individuals and businesses improve their credit. We offer services for personal credit repair and business credit building.

**Affiliate Partner Plans:**
- **Starter Plan ($49/month):** 1 credit, AI analysis scanner, dashboard, client management, credit boosters, mailing center, CFPB guide.
- **Pro Plan ($89/month):** 3 credits, Everything in Starter, plus AI dispute tracker, AI bureau responder, AI Tradeline Assistant, 700 club.
- **VIP Plan ($199/month):** 10 credits, Everything in Pro, plus the business suite (AI Business Scanner, AI Business Assistant, business checklist, AI Funding assistant).
- **White Label & Licensing:** For established companies who want to use our software under their own brand. They should contact sales for this.

**Key Features:**
- **AI Letter Generation:** Our AI writes effective dispute letters.
- **Unlock Score™:** Our unique metric (0-1000) that measures a business's readiness for funding. A high score unlocks better funding opportunities.

**Client Portals:** We have separate, secure dashboards for Personal Clients, Business Clients, and Affiliates.

**Navigation Help:**
- To sign up for a plan, users can click "Get Started".
- To see partner-specific pricing (VIP & White Label), users should visit the "/partners" page.
- Business owners can get a free "Unlock Score" by visiting the "/business-intake" page.

---

User's Question:
"{{{question}}}"

Based on your knowledge base, provide a helpful and concise answer. If you don't know the answer, politely say so and suggest they contact support.
`,
});

const siteChatFlow = ai.defineFlow(
  {
    name: 'siteChatFlow',
    inputSchema: SiteChatInputSchema,
    outputSchema: SiteChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
