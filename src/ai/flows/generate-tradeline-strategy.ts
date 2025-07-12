'use server';
/**
 * @fileOverview Generates tradeline strategies for users based on their credit profile.
 *
 * - generateTradelineStrategy - A function that returns tradeline suggestions.
 * - GenerateTradelineStrategyInput - The input type for the function.
 * - GenerateTradelineStrategyOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTradelineStrategyInputSchema = z.object({
  creditAnalysis: z.string().describe('The user\'s credit profile analysis summary, including FICO, utilization, payment history, inquiries, and account mix.'),
  creditGoal: z.string().optional().describe('The user\'s stated credit-building goal (e.g., "Qualify for a mortgage", "Get a $50k business loan").'),
  hasAutoLoan: z.boolean().describe("Whether the user's profile shows an existing auto loan."),
  hasPrimaryRevolving: z.boolean().describe("Whether the user has at least one primary revolving account (credit card) with a limit over $5,000."),
});
export type GenerateTradelineStrategyInput = z.infer<typeof GenerateTradelineStrategyInputSchema>;

const TradelineRecommendationSchema = z.object({
    limit: z.number().describe("The recommended credit limit for the tradeline."),
    ageInMonths: z.number().describe("The recommended age of the tradeline in months."),
    cost: z.number().describe("The estimated cost for the user to acquire this tradeline."),
});

const GenerateTradelineStrategyOutputSchema = z.object({
  introductoryMessage: z.string().describe("A brief, encouraging message that summarizes the user's current situation based on the AI's analysis."),
  revolvingTradeline: TradelineRecommendationSchema.optional().describe("A recommended revolving tradeline, only if the user is missing one."),
  autoTradeline: TradelineRecommendationSchema.optional().describe("A recommended auto loan tradeline, only if the user is missing one."),
});
export type GenerateTradelineStrategyOutput = z.infer<typeof GenerateTradelineStrategyOutputSchema>;

export async function generateTradelineStrategy(input: GenerateTradelineStrategyInput): Promise<GenerateTradelineStrategyOutput> {
  return generateTradelineStrategyFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateTradelineStrategyPrompt',
  input: {schema: GenerateTradelineStrategyInputSchema},
  output: {schema: GenerateTradelineStrategyOutputSchema},
  prompt: `You are an AI credit-building expert for UnlockScore AI. Your task is to analyze a user's credit profile and goals to recommend specific, high-impact primary tradelines.

User's Credit Profile Analysis:
"{{{creditAnalysis}}}"

User's Credit Goal: "{{{creditGoal}}}"
User has an auto loan: {{{hasAutoLoan}}}
User has a primary revolving account >$5k: {{{hasPrimaryRevolving}}}

Instructions:
1.  **Analyze the Profile & Goal**: Read the user's credit analysis and goal. Identify the biggest weaknesses.
    - If 'hasPrimaryRevolving' is false, they have a major gap. This is the highest priority.
    - If 'hasAutoLoan' is false, they are missing a key installment loan type that lenders look for. This is the second highest priority.
2.  **Generate 'introductoryMessage'**: Write a brief, personalized summary. Example: "Your profile shows a solid payment history, but the lack of a primary revolving account is limiting your Unlock Score™. Adding one is the fastest way to improve your funding readiness."
3.  **Recommend 'revolvingTradeline' (if needed)**:
    -   **ONLY** if \`hasPrimaryRevolving\` is **false**, recommend a revolving tradeline.
    -   'limit': Recommend a limit between $15,000 and $25,000. Higher credit goals warrant higher limits.
    -   'ageInMonths': Recommend an age between 24 and 36 months.
    -   'cost': Calculate the cost as 5% of the recommended limit (e.g., $20,000 limit = $1000 cost).
4.  **Recommend 'autoTradeline' (if needed)**:
    -   **ONLY** if \`hasAutoLoan\` is **false**, recommend an auto loan tradeline.
    -   'limit': Recommend an amount between $20,000 and $35,000.
    -   'ageInMonths': Recommend an age between 30 and 48 months.
    -   'cost': Calculate the cost as 7% of the recommended loan amount (e.g., $20,000 loan = $1400 cost).

If the user already has a certain type of tradeline, its corresponding field in the output should be null or omitted. Generate the response in the specified JSON format.
`,
});

const generateTradelineStrategyFlow = ai.defineFlow(
  {
    name: 'generateTradelineStrategyFlow',
    inputSchema: GenerateTradelineStrategyInputSchema,
    outputSchema: GenerateTradelineStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
