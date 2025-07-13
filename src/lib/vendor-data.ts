
export interface Vendor {
    id: string;
    name: string;
}

export const creditBoosterVendors: Vendor[] = [
    { id: 'ava', name: 'Ava' },
    { id: 'kikoff', name: 'Kikoff' },
    { id: 'self', name: 'Self' },
    { id: 'boom', name: 'Boom' },
    { id: 'extra', name: 'Extra' },
    { id: 'grain', name: 'Grain' },
];

export const businessVendorTiers = [
    {
      tier: 'Tier 1 Vendor Accounts',
      description: 'Starter vendors that report to business credit bureaus, ideal for establishing an initial credit profile.',
      vendors: [
        { id: 'uline', name: 'Uline' },
        { id: 'grainger', name: 'Grainger' },
        { id: 'quill', name: 'Quill' },
      ],
    },
    {
      tier: 'Tier 2 Store Credit Accounts',
      description: 'Retail credit accounts that also report to business bureaus. Typically requires some existing credit history.',
      vendors: [
        { id: 'home_depot', name: 'Home Depot Commercial' },
        { id: 'lowes', name: "Lowe's Commercial" },
        { id: 'staples', name: 'Staples Business' },
      ],
    },
    {
      tier: 'Tier 3 Fleet/Gas Cards',
      description: 'For businesses with vehicle expenses, these cards report to credit bureaus and help manage fuel costs.',
      vendors: [
        { id: 'wex', name: 'WEX Fleet Cards' },
        { id: 'fuelman', name: 'Fuelman' },
      ],
    },
    {
      tier: 'Tier 4 Business Credit Cards',
      description: 'Major credit cards in the business\'s name from banks, requiring a more established credit profile.',
      vendors: [
        { id: 'amex', name: 'American Express Business' },
        { id: 'chase_ink', name: 'Chase Ink Business' },
        { id: 'capitol_one_spark', name: 'Capital One Spark' },
      ],
    },
];
