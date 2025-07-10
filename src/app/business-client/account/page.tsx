'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Initial state for the checklist items. In a real app, this would be fetched from a database.
const initialChecklistState = {
  // Foundation
  entity: true,
  ein: true,
  bankAccount: true,
  address: true,
  phone: true,
  website: false,
  // Bureaus
  duns: true,
  experian: true,
  equifax: false,
  // Tradelines
  tier1: true,
  tier2: false,
  tier3: false,
  tier4: false,
  // Financials
  cashflow: true,
  statements: true,
  financialDocs: false,
};

const checklistData = [
  {
    category: 'Business Foundation',
    description: 'The basic building blocks for a fundable business.',
    items: [
      { id: 'entity', label: 'Business Name & Entity', description: 'Your business is officially registered with the Secretary of State (e.g., LLC, C-Corp).' },
      { id: 'ein', label: 'Employer Identification Number (EIN)', description: 'You have a federal tax ID number for your business from the IRS.' },
      { id: 'bankAccount', label: 'Business Bank Account', description: 'Your business has a dedicated checking account in its legal name.' },
      { id: 'address', label: 'Professional Business Address', description: 'You are using a physical commercial address or virtual office, not a residential or PO Box address.' },
      { id: 'phone', label: 'Business Phone Number', description: 'You have a dedicated business phone line listed in directories.' },
      { id: 'website', label: 'Professional Website & Email', description: 'Your business has a professional website and uses a domain-based email (e.g., you@yourcompany.com).' },
    ],
  },
  {
    category: 'Business Credit Bureaus',
    description: 'Establishing profiles with the major business credit reporting agencies.',
    items: [
      { id: 'duns', label: 'Dun & Bradstreet Profile', description: 'You have a D-U-N-S number and your D&B profile is active and accurate.' },
      { id: 'experian', label: 'Experian Business Profile', description: 'Your business has an established profile with Experian Business.' },
      { id: 'equifax', label: 'Equifax Business Profile', description: 'Your business has an established profile with Equifax Business.' },
    ],
  },
  {
    category: 'Tradeline Building',
    description: 'Building a strong payment history with vendor and financial accounts.',
    items: [
      { id: 'tier1', label: '3+ Tier 1 Vendor Accounts', description: 'You have at least 3 active net-30/60 accounts with vendors that report to business credit bureaus (e.g., Uline, Grainger).' },
      { id: 'tier2', label: '2+ Tier 2 Store Credit Accounts', description: 'You have at least 2 store credit cards (e.g., Home Depot, Lowes) that report to business bureaus.' },
      { id: 'tier3', label: '1+ Tier 3 Fleet/Gas Card', description: 'You have a fleet or gas card (e.g., WEX, Fuelman) for business vehicle expenses.' },
      { id: 'tier4', label: '1+ Tier 4 Business Credit Card', description: 'You have a major business credit card (e.g., Visa, Mastercard, Amex) in the business name.' },
    ],
  },
    {
    category: 'Financial Readiness',
    description: 'Demonstrating the financial health and stability of your business.',
    items: [
      { id: 'cashflow', label: 'Positive Monthly Cash Flow', description: 'Your business bank account consistently shows more income than expenses.' },
      { id: 'statements', label: 'Clean Bank Statements', description: 'Your last 3-6 months of bank statements are free of non-sufficient funds (NSF) or overdrafts.' },
      { id: 'financialDocs', label: 'Financial Statements Prepared', description: 'You have up-to-date financial documents like a Profit & Loss (P&L) statement and Balance Sheet.' },
    ],
  },
];

interface ChecklistItemProps {
  label: string;
  description: string;
  isCompleted: boolean;
  onToggle: () => void;
}

function ChecklistItem({ label, description, isCompleted, onToggle }: ChecklistItemProps) {
  const Icon = isCompleted ? CheckCircle : XCircle;
  const colorClass = isCompleted ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg transition-colors hover:bg-muted/50">
      <div className="flex-shrink-0 pt-1">
        <Icon className={cn('h-6 w-6', colorClass)} />
      </div>
      <div className="flex-grow">
        <h4 className="font-semibold">{label}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex-shrink-0">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={onToggle}
          className="h-6 w-6"
          aria-label={`Mark ${label} as ${isCompleted ? 'incomplete' : 'complete'}`}
        />
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
                Track your progress towards building a highly fundable business. Check off items as you complete them.
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
                        <p className="font-semibold">Your Fundability Progress</p>
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
                <CardContent className="divide-y divide-border">
                    {category.items.map((item) => (
                        <ChecklistItem
                            key={item.id}
                            label={item.label}
                            description={item.description}
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
