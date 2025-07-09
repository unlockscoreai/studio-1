'use server';
/**
 * @fileOverview A tool for fetching official business details from the Secretary of State.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const getBusinessDetailsFromState = ai.defineTool(
  {
    name: 'getBusinessDetailsFromState',
    description: "Gets official business registration data from a state's Secretary of State office.",
    inputSchema: z.object({
      businessName: z.string().describe('The legal name of the business to look up.'),
      state: z.string().length(2).describe('The 2-letter postal code abbreviation for the state (e.g., "CA", "TX").'),
    }),
    outputSchema: z.object({
        isFound: z.boolean().describe("Whether the business was found in the state's registry."),
        officialName: z.string().optional().describe("The official registered name of the business."),
        entityType: z.string().optional().describe("The legal entity type (e.g., LLC, C-Corp, S-Corp)."),
        formationDate: z.string().optional().describe("The date the business was officially formed or registered, in YYYY-MM-DD format."),
        status: z.string().optional().describe("The current status of the business (e.g., Active, Inactive, Dissolved)."),
    }),
  },
  async (input) => {
    console.log(`--- SIMULATING SoS API CALL for ${input.businessName}, ${input.state} ---`);
    // In a real application, this is where you would integrate with a specific
    // Secretary of State's API or a data aggregator service like OpenCorporates.
    // Each state has its own API and data format.

    // For this prototype, we'll return mock data.
    if (input.businessName.toLowerCase().includes("corp")) {
        return {
            isFound: true,
            officialName: `${input.businessName}`,
            entityType: 'C-Corporation',
            formationDate: '2021-05-10',
            status: 'Active',
        };
    } else {
         return {
            isFound: true,
            officialName: `${input.businessName} LLC`,
            entityType: 'LLC',
            formationDate: '2022-01-15',
            status: 'Active',
        };
    }
  }
);
