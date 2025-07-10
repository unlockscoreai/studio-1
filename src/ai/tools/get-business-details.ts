'use server';
/**
 * @fileOverview A tool for fetching official business details from the Secretary of State.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const getBusinessDetailsFromState = ai.defineTool(
  {
    name: 'getBusinessDetailsFromState',
    description: "Gets official business registration data and public online presence information for a business.",
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
        websiteFound: z.boolean().describe("Whether a professional website was found for the business."),
        googleReviews: z.number().describe("The number of Google reviews found for the business."),
        socialLinks: z.array(z.string()).describe("A list of URLs for social media profiles found (e.g., Facebook, LinkedIn)."),
        dunsStatus: z.enum(["found", "not_found"]).describe("The status of the Dun & Bradstreet D-U-N-S number."),
        hasDomainEmail: z.boolean().describe("Whether the business appears to use a professional domain-based email address."),
    }),
  },
  async (input) => {
    console.log(`--- SIMULATING SoS & PUBLIC DATA API CALL for ${input.businessName}, ${input.state} ---`);
    // In a real application, this would integrate with multiple APIs:
    // 1. A Secretary of State API (per state) or a data aggregator.
    // 2. A Google Search/Places API for reviews.
    // 3. A web scraper or social media search tool.
    // 4. A WHOIS/domain lookup service.

    // For this prototype, we'll return mock data based on the business name.
    const isCorp = input.businessName.toLowerCase().includes("corp");
    const hasLogistics = input.businessName.toLowerCase().includes("logistics");

    if (hasLogistics) { // Simulate a less-established business
        return {
            isFound: true,
            officialName: `${input.businessName} LLC`,
            entityType: 'LLC',
            formationDate: '2022-08-20',
            status: 'Active',
            websiteFound: false,
            googleReviews: 0,
            socialLinks: [`facebook.com/${input.businessName.replace(/\s+/g, '').toLowerCase()}`],
            dunsStatus: "not_found",
            hasDomainEmail: false,
        };
    }

    return { // Simulate a more established business
        isFound: true,
        officialName: isCorp ? input.businessName : `${input.businessName} LLC`,
        entityType: isCorp ? 'C-Corporation' : 'LLC',
        formationDate: '2020-01-15',
        status: 'Active',
        websiteFound: true,
        googleReviews: 12,
        socialLinks: [
            `facebook.com/${input.businessName.replace(/\s+/g, '').toLowerCase()}`,
            `linkedin.com/company/${input.businessName.replace(/\s+/g, '').toLowerCase()}`,
        ],
        dunsStatus: "found",
        hasDomainEmail: true,
    };
  }
);
