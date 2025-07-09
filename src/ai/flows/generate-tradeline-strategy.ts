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
  hasPrimaryTradelines: z.boolean().describe('Whether the user currently has any primary tradelines.'),
  creditAnalysis: z.string().optional().describe('The user\'s credit profile analysis summary.'),
});
export type GenerateTradelineStrategyInput = z.infer<typeof GenerateTradelineStrategyInputSchema>;

const GenerateTradelineStrategyOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      category: z.string().describe('The category of tradeline (e.g., Tier 1, Builder, Fintech, Business).'),
      products: z.array(
        z.object({
          name: z.string().describe('The name of the tradeline product.'),
          description: z.string().describe('A brief description of why this product is being recommended.'),
        })
      ).describe('A list of recommended products in this category.'),
    })
  ).describe('A list of suggested tradeline categories and products.'),
});
export type GenerateTradelineStrategyOutput = z.infer<typeof GenerateTradelineStrategyOutputSchema>;

export async function generateTradelineStrategy(input: GenerateTradelineStrategyInput): Promise<GenerateTradelineStrategyOutput> {
  return generateTradelineStrategyFlow(input);
}

const tradelineExamples = `
- Tier 1 Tradeline Accounts: Discover IT Secured, Navy Federal Credit Union (NFCU) products, Capital One Quicksilver. These are for building a solid foundation.
- Builder Products: Self, Kikoff, Chime Credit Builder. These are great for people with no credit or who need to add different types of credit (like installment loans).
- Fintech Options: TomoCredit, Grain, GrowCredit. These are modern alternatives that may not require a traditional credit check.
- Business Tradelines: Uline, Quill, Grainger, Nav. These are for building business credit.
`;

const prompt = ai.definePrompt({
  name: 'generateTradelineStrategyPrompt',
  input: {schema: GenerateTradelineStrategyInputSchema},
  output: {schema: GenerateTradelineStrategyOutputSchema},
  prompt: `You are an AI credit-building assistant. Your goal is to provide a strategic list of tradeline products to help a user build their credit profile.

Here is some information about the user:
- Has primary tradelines: {{{hasPrimaryTradelines}}}
- Credit Profile Analysis: "{{{creditAnalysis}}}"

Here are some examples of tradeline products you can recommend:
${tradelineExamples}

Instructions:
1.  Analyze the user's situation based on whether they have primary tradelines and their credit analysis.
2.  If 'hasPrimaryTradelines' is false, you should heavily focus on "Builder Products" and "Tier 1 Tradeline Accounts" to get them started.
3.  If 'hasPrimaryTradelines' is true, they might benefit from more advanced options or diversifying with "Fintech" or "Business" tradelines if their analysis mentions business activities.
4.  Provide a list of suggestions grouped by category. For each product, give a short, helpful description explaining why it's a good fit.
5.  Do not recommend business tradelines unless the credit analysis indicates they have a business.

Generate the suggestions and provide the output in the specified JSON format.
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
