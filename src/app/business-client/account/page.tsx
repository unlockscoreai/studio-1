
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, ExternalLink, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Data enriched with links from your example
const checklistData = [
  {
    category: 'Business Foundation',
    description: 'The basic building blocks for a credible and fundable business.',
    items: [
      { id: 'entity', label: 'Business Name & Entity', description: 'Your business is officially registered with the Secretary of State (e.g., LLC, C-Corp).', link: 'https://www.nolo.com/legal-encyclopedia/starting-your-business-state.html' },
      { id: 'ein', label: 'Employer Identification Number (EIN)', description: 'You have a federal tax ID number for your business from the IRS.', link: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online' },
      { id: 'bankAccount', label: 'Business Bank Account', description: 'Your business has a dedicated checking account in its legal name.', link: 'https://www.nav.com/business-bank-account/' },
      { id: 'address', label: 'Professional Business Address', description: 'You are using a physical commercial address or virtual office, not a residential or PO Box address.', link: 'https://ipostal1.com/' },
      { id: 'phone', label: 'Business Phone Number', description: 'You have a dedicated business phone line listed in directories.', link: 'https://www.411.com/' },
      { id: 'website', label: 'Professional Website & Email', description: 'Your business has a professional website and uses a domain-based email (e.g., you@yourcompany.com).', link: 'https://www.namecheap.com/' },
    ],
  },
  {
    category: 'Business Credit Bureaus',
    description: 'Establishing profiles with the major business credit reporting agencies.',
    items: [
      { id: 'duns', label: 'Dun & Bradstreet Profile', description: 'You have a D-U-N-S number and your D&B profile is active and accurate.', link: 'https://www.dnb.com/' },
      { id: 'experian', label: 'Experian Business Profile', description: 'Your business has an established profile with Experian Business.', link: 'https://www.experian.com/small-business/business-credit-reports' },
      { id: 'equifax', label: 'Equifax Business Profile', description: 'Your business has an established profile with Equifax Business.', link: 'https://www.equifax.com/business/business-credit-reports/' },
    ],
  },
  {
    category: 'Tradeline Building',
    description: 'Building a strong payment history with vendor and financial accounts.',
    items: [
      { id: 'tier1', label: '3+ Tier 1 Vendor Accounts', description: 'You have at least 3 active net-30/60 accounts with vendors that report to business credit bureaus (e.g., Uline, Grainger).', link: 'https://www.nav.com/resource/vendor-accounts/' },
      { id: 'tier2', label: '2+ Tier 2 Store Credit Accounts', description: 'You have at least 2 store credit cards (e.g., Home Depot, Lowes) that report to business bureaus.', link: 'https://www.cardrates.com/advice/best-business-store-credit-cards/' },
      { id: 'tier3', label: '1+ Tier 3 Fleet/Gas Card', description: 'You have a fleet or gas card (e.g., WEX, Fuelman) for business vehicle expenses.', link: 'https://www.wexinc.com/' },
      { id: 'tier4', label: '1+ Tier 4 Business Credit Card', description: 'You have a major business credit card (e.g., Visa, Mastercard, Amex) in the business name.', link: 'https://www.nerdwallet.com/best/business/credit-cards' },
    ],
  },
    {
    category: 'Financial Readiness',
    description: 'Demonstrating the financial health and stability of your business.',
    items: [
      { id: 'cashflow', label: 'Positive Monthly Cash Flow', description: 'Your business bank account consistently shows more income than expenses.', link: 'https://quickbooks.intuit.com/r/financial-management/how-to-calculate-cash-flow' },
      { id: 'statements', label: 'Clean Bank Statements', description: 'Your last 3-6 months of bank statements are free of non-sufficient funds (NSF) or overdrafts.', link: 'https://bench.co/blog/accounting/bank-statement/' },
      { id: 'financialDocs', label: 'Financial Statements Prepared', description: 'You have up-to-date financial documents like a Profit & Loss (P&L) statement and Balance Sheet.', link: 'https://www.score.org/resource/business-financial-statement-templates' },
    ],
  },
];

// Initial state for the checklist items. In a real app, this would be fetched from a database.
const initialChecklistState: Record<string, boolean> = {
  // Foundation
  entity: true, ein: true, bankAccount: true, address: true, phone: true, website: false,
  // Bureaus
  duns: true, experian: true, equifax: false,
  // Tradelines
  tier1: true, tier2: false, tier3: false, tier4: false,
  // Financials
  cashflow: true, statements: true, financialDocs: false,
};


interface ChecklistItemProps {
  label: string;
  description: string;
  link?: string;
  isCompleted: boolean;
  onToggle: () => void;
}

function ChecklistItem({ label, description, link, isCompleted, onToggle }: ChecklistItemProps) {
  const Icon = isCompleted ? CheckCircle : XCircle;
  const colorClass = isCompleted ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-muted/50">
       <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={onToggle}
            className="h-6 w-6"
            aria-label={`Mark ${label} as ${isCompleted ? 'incomplete' : 'complete'}`}
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
            <Icon className={cn('h-5 w-5', colorClass)} />
            <h4 className="font-semibold">{label}</h4>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        {link && (
            <Button variant="link" asChild className="p-0 h-auto mt-2">
                <a href={link} target="_blank" rel="noopener noreferrer">
                    Get Started <ExternalLink className="ml-1.5 h-4 w-4" />
                </a>
            </Button>
        )}
      </div>
    </div>
  );
}

export default function MyBusinessPage() {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(initialChecklistState);

  const handleToggle = (id: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalItems = checklistData.flatMap(cat => cat.items).length;
  const totalCompleted = Object.values(completedItems).filter(Boolean).length;
  const completionPercentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">My Business Checklist</CardTitle>
                <CardDescription>
                Track your progress towards building a highly fundable business and improving your Unlock Score™.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    <div
                        className="w-20 h-20 flex items-center justify-center rounded-full bg-primary/10 border-4 border-primary text-primary text-2xl font-bold"
                    >
                        {completionPercentage}%
                    </div>
                    <div>
                        <p className="font-semibold">Your Readiness Progress</p>
                        <p className="text-muted-foreground">{totalCompleted} of {totalItems} tasks completed</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      
        {checklistData.map((category) => (
            <Card key={category.category}>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">{category.category}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="divide-y divide-border -p-6">
                    {category.items.map((item) => (
                        <ChecklistItem
                            key={item.id}
                            label={item.label}
                            description={item.description}
                            link={item.link}
                            isCompleted={!!completedItems[item.id]}
                            onToggle={() => handleToggle(item.id)}
                        />
                    ))}
                </CardContent>
            </Card>
        ))}
    </div>
  );
}
