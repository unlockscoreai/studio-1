
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, ExternalLink, XCircle, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


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
    description: 'Building a strong payment history with vendor and financial accounts. Check off the accounts you have successfully opened.',
    items: [
        { 
            id: 'tier1', 
            label: 'Tier 1: Starter Vendor Accounts', 
            description: 'Aim for at least 3-5 of these to build your initial Paydex score.', 
            vendors: [
                { id: 'uline', name: 'Uline'},
                { id: 'grainger', name: 'Grainger'},
                { id: 'quill', name: 'Quill'},
                { id: 'summa', name: 'Summa Office Supplies'},
                { id: 'crown', name: 'Crown Office Supplies'},
            ]
        },
        { 
            id: 'tier2', 
            label: 'Tier 2: Retail & Store Credit', 
            description: 'After establishing Tier 1, add 2-3 of these store credit accounts.',
            vendors: [
                { id: 'home_depot', name: 'Home Depot Commercial'},
                { id: 'lowes', name: 'Lowe\'s Commercial'},
                { id: 'staples', name: 'Staples Business'},
                { id: 'amazon', name: 'Amazon Business'},
            ]
        },
        { 
            id: 'tier3', 
            label: 'Tier 3: Fleet & Gas Cards',
            description: 'If applicable, add 1-2 fleet or gas cards.',
            vendors: [
                { id: 'wex', name: 'WEX Fleet Cards'},
                { id: 'fuelman', name: 'Fuelman'},
                { id: 'shell', name: 'Shell Small Business Card'},
            ]
        },
        { 
            id: 'tier4', 
            label: 'Tier 4: Business Credit Cards',
            description: 'The final tier. Aim for at least one major business card.',
            vendors: [
                { id: 'amex_biz', name: 'Amex Business Platinum/Gold'},
                { id: 'chase_ink', name: 'Chase Ink Business'},
                { id: 'capital_one_spark', name: 'Capital One Spark'},
            ]
        },
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
  entity: true, ein: true, bankAccount: true, address: true, phone: true, website: true,
  // Bureaus
  duns: true, experian: true, equifax: false,
  // Tradelines - Tiers themselves are not checkable
  // Financials
  cashflow: true, statements: true, financialDocs: false,
};

const initialFoundationState: Record<string, string> = {
    entity: 'Volunteer Express Logistics LLC',
    ein: '98-7654321',
    bankAccount: 'Chase Business Complete Banking',
    address: '800 S Gay St, Knoxville, TN 37929',
    phone: '(615) 555-1234',
    website: 'contact@volunteerexpress.com',
};

const initialVendorState: Record<string, boolean> = {
    uline: true, grainger: true, quill: true, // Tier 1
    home_depot: false, // Tier 2
    wex: true, // Tier 3
    chase_ink: false, // Tier 4
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
  const [foundationDetails, setFoundationDetails] = useState(initialFoundationState);
  const [selectedVendors, setSelectedVendors] = useState<Record<string, boolean>>(initialVendorState);
  const { toast } = useToast();

  const handleToggle = (id: string) => {
    setCompletedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));
  };

  const handleFoundationChange = (id: string, value: string) => {
    setFoundationDetails(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveChanges = () => {
    // In a real app, this would save the `foundationDetails`, `completedItems`, and `selectedVendors` to a database
    console.log('Saving foundation details:', foundationDetails);
    console.log('Saving checklist status:', completedItems);
    console.log('Saving vendor selections:', selectedVendors);
    toast({
      title: 'Progress Saved',
      description: 'Your business checklist information has been updated.',
    });
  };

  const totalItems = checklistData.flatMap(cat => cat.category !== 'Tradeline Building' ? cat.items : []).length;
  const totalCompleted = Object.values(completedItems).filter(Boolean).length;
  const totalVendors = checklistData.flatMap(c => c.items.flatMap(i => i.vendors || [])).length;
  const completedVendors = Object.values(selectedVendors).filter(Boolean).length;
  const overallTotal = totalItems + totalVendors;
  const overallCompleted = totalCompleted + completedVendors;

  const completionPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

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
                        <p className="text-muted-foreground">{overallCompleted} of {overallTotal} tasks completed</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveChanges}>
                    <Save className="mr-2 h-4 w-4" /> Save All Progress
                </Button>
            </CardFooter>
        </Card>
      
        {checklistData.map((category) => (
            <Card key={category.category}>
                <CardHeader>
                    <CardTitle className="font-headline text-xl">{category.category}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                
                {category.category === 'Business Foundation' ? (
                  <CardContent className="divide-y divide-border -p-6">
                      {category.items.map((item) => {
                          const Icon = completedItems[item.id] ? CheckCircle : XCircle;
                          const colorClass = completedItems[item.id] ? 'text-green-600' : 'text-red-600';
                          return (
                              <div key={item.id} className="flex items-start gap-4 p-4 transition-colors hover:bg-muted/50">
                                  <div className="flex-shrink-0 pt-1">
                                      <Checkbox
                                          checked={!!completedItems[item.id]}
                                          onCheckedChange={() => handleToggle(item.id)}
                                          className="h-6 w-6"
                                      />
                                  </div>
                                  <div className="flex-grow space-y-2">
                                      <div className="flex items-center gap-2">
                                          <Icon className={cn('h-5 w-5', colorClass)} />
                                          <Label htmlFor={item.id} className="font-semibold">{item.label}</Label>
                                      </div>
                                      <Input
                                          id={item.id}
                                          value={foundationDetails[item.id] || ''}
                                          onChange={(e) => handleFoundationChange(item.id, e.target.value)}
                                          placeholder={`Enter your ${item.label}...`}
                                      />
                                      <p className="text-sm text-muted-foreground">{item.description}</p>
                                      {item.link && (
                                          <Button variant="link" asChild className="p-0 h-auto">
                                              <a href={item.link} target="_blank" rel="noopener noreferrer">
                                                  Get Started <ExternalLink className="ml-1.5 h-4 w-4" />
                                              </a>
                                          </Button>
                                      )}
                                  </div>
                              </div>
                          )
                      })}
                  </CardContent>
                ) : category.category === 'Tradeline Building' ? (
                  <CardContent className="space-y-6">
                    {category.items.map((tier) => (
                      <div key={tier.id}>
                        <h4 className="font-semibold">{tier.label}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{tier.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {tier.vendors?.map((vendor) => (
                            <div key={vendor.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={vendor.id}
                                checked={!!selectedVendors[vendor.id]}
                                onCheckedChange={() => handleVendorToggle(vendor.id)}
                              />
                              <label
                                htmlFor={vendor.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {vendor.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                ) : (
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
                )}
            </Card>
        ))}
    </div>
  );
}
