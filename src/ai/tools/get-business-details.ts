
'use server';
/**
 * @fileOverview A tool for fetching official business details from the Secretary of State and other public records.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const getBusinessDetailsFromState = ai.defineTool(
  {
    name: 'getBusinessDetailsFromState',
    description: "Gets official business registration data and public online presence information for a business. It simulates a search of Secretary of State (SoS) records, a UCC lien search, and a general web search to assess the company's website, contact info, and reputation.",
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
        registeredAgent: z.string().optional().describe("The name of the registered agent on file."),
        mailingAddress: z.string().optional().describe("The official mailing address of the business."),
        lastHistoryUpdate: z.string().optional().describe("The date of the last known filing or history update with the SoS, in YYYY-MM-DD format."),
        websiteFound: z.boolean().describe("Whether a professional website was found for the business."),
        googleReviews: z.number().describe("The number of Google reviews found for the business."),
        socialLinks: z.array(z.string()).describe("A list of URLs for social media profiles found (e.g., Facebook, LinkedIn)."),
        dunsStatus: z.enum(["found", "not_found"]).describe("The status of the Dun & Bradstreet D-U-N-S number."),
        hasDomainEmail: z.boolean().describe("Whether the business appears to use a professional domain-based email address (not @gmail.com, etc.)."),
        uccLienCount: z.number().describe("The number of UCC liens found filed against the business."),
    }),
  },
  async (input) => {
    console.log(`--- SIMULATING SoS & PUBLIC DATA API CALL for ${input.businessName}, ${input.state} ---`);
    // In a real application, this would integrate with multiple APIs:
    // 1. A Secretary of State API (per state) or a data aggregator.
    // 2. A UCC lien search service.
    // 3. A Google Search/Places API for reviews.
    // 4. A web scraper or social media search tool.
    // 5. A WHOIS/domain lookup service.
    // 6. A Dun & Bradstreet API to check for DUNS number status.

    // Specific mock for a real Tennessee business
    if (input.businessName.toLowerCase() === "volunteer express logistics llc" && input.state.toUpperCase() === "TN") {
        return {
            isFound: true,
            officialName: 'Volunteer Express Logistics LLC',
            entityType: 'LLC',
            formationDate: '2021-05-10',
            status: 'Active',
            registeredAgent: 'C T CORPORATION SYSTEM',
            mailingAddress: '800 S GAY ST, SUITE 2102, KNOXVILLE, TN, 37929',
            lastHistoryUpdate: '2023-04-01',
            websiteFound: true,
            googleReviews: 28,
            socialLinks: [
                `linkedin.com/company/volunteer-express-logistics`,
            ],
            dunsStatus: "found",
            hasDomainEmail: true,
            uccLienCount: 2, // Logistics companies often have equipment liens
        };
    }

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
            registeredAgent: 'Capitol Corporate Services Inc',
            mailingAddress: '123 Fake St, Sometown, TX 75001',
            lastHistoryUpdate: '2022-08-20',
            websiteFound: false,
            googleReviews: 0,
            socialLinks: [`facebook.com/${input.businessName.replace(/\s+/g, '').toLowerCase()}`],
            dunsStatus: "not_found",
            hasDomainEmail: false,
            uccLienCount: 1,
        };
    }

    return { // Simulate a more established business
        isFound: true,
        officialName: isCorp ? input.businessName : `${input.businessName} LLC`,
        entityType: isCorp ? 'C-Corporation' : 'LLC',
        formationDate: '2020-01-15',
        status: 'Active',
        registeredAgent: 'LegalZoom.com, Inc.',
        mailingAddress: '456 Corporate Ave, Big City, CA 90210',
        lastHistoryUpdate: '2024-01-10',
        websiteFound: true,
        googleReviews: 12,
        socialLinks: [
            `facebook.com/${input.businessName.replace(/\s+/g, '').toLowerCase()}`,
            `linkedin.com/company/${input.businessName.replace(/\s+/g, '').toLowerCase()}`,
        ],
        dunsStatus: "found",
        hasDomainEmail: true,
        uccLienCount: 0,
    };
  }
);
