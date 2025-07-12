

'use client';

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
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
            description: 'Aim for at least 3-5 of these to build your initial Paydex score. Click names to apply.', 
            vendors: [
                { id: 'uline', name: 'Uline', url: 'https://www.uline.com/' },
                { id: 'grainger', name: 'Grainger', url: 'https://www.grainger.com/' },
                { id: 'quill', name: 'Quill', url: 'https://www.quill.com/' },
                { id: 'summa', name: 'Summa Office Supplies', url: 'https://summaofficesupplies.com/' },
                { id: 'crown', name: 'Crown Office Supplies', url: 'https://crownofficesupplies.com/' },
                { id: 'creative_analytics', name: 'Creative Analytics', url: 'https://creativeanalytics.net/' },
                { id: 'shirtsy', name: 'Shirtsy', url: 'https://www.shirtsy.com/' },
                { id: 'ceo_creative', name: 'CEO Creative', url: 'https://ceocreative.com/' },
                { id: 'the_business_tshirt_club', name: 'The Business T-Shirt Club', url: 'https://thebusinesstshirtclub.com/' },
            ]
        },
        { 
            id: 'tier2', 
            label: 'Tier 2: Retail & Store Credit', 
            description: 'After establishing Tier 1, add 2-3 of these store credit accounts. Click names to apply.',
            vendors: [
                { id: 'home_depot', name: 'Home Depot Commercial', url: 'https://www.homedepot.com/c/Pro_Xtra' },
                { id: 'lowes', name: 'Lowe\'s Commercial', url: 'https://www.lowes.com/l/Pro.html' },
                { id: 'staples', name: 'Staples Business', url: 'https://www.staples.com/sbd/cre/programs/credit_and_financing/' },
                { id: 'amazon', name: 'Amazon Business', url: 'https://www.amazon.com/business' },
                { id: 'walmart_biz', name: 'Walmart Business', url: 'https://www.walmart.com/business' },
                { id: 'bestbuy_biz', name: 'Best Buy Business', url: 'https://www.bestbuy.com/site/business/best-buy-business/pcmcat210900050005.c' },
                { id: 'officedepot_biz', name: 'Office Depot Business', url: 'https://www.officedepot.com/cm/account/business-account' },
                { id: 'sams_club_biz', name: 'Sam\'s Club Business', url: 'https://www.samsclub.com/content/business-credit' },
                { id: 'costco_biz', name: 'Costco Business', url: 'https://www.costco.com/business-card.html' },
            ]
        },
        { 
            id: 'tier3', 
            label: 'Tier 3: Fleet & Gas Cards',
            description: 'If applicable, add 1-2 fleet or gas cards. Click names to apply.',
            vendors: [
                { id: 'wex', name: 'WEX Fleet Cards', url: 'https://www.wexinc.com/' },
                { id: 'fuelman', name: 'Fuelman', url: 'https://www.fuelman.com/' },
                { id: 'shell_biz', name: 'Shell Small Business Card', url: 'https://www.shell.us/business-customers/shell-fleet-cards.html' },
                { id: 'bp_biz', name: 'BP Business Solutions', url: 'https://www.bp.com/en_us/united-states/home/products-and-services/cards/fleet-cards.html' },
                { id: 'sunoco_biz', name: 'Sunoco Universal Fleet Card', url: 'https://www.sunocofleetcards.com/' },
                { id: 'chevron_biz', name: 'Chevron & Texaco Business Card', url: 'https://www.chevrontexacobusinesscard.com/' },
                { id: 'exxonmobil_biz', name: 'ExxonMobil BusinessPro', url: 'https://www.exxon.com/en/businesspro-fleet-card' },
                { id: 'marathon_biz', name: 'Marathon Fleet Card', url: 'https://www.marathonbrand.com/Fleet/' },
                { id: '76_biz', name: '76 Fleet Card', url: 'https://www.76fleet.com/' },
            ]
        },
        { 
            id: 'tier4', 
            label: 'Tier 4: Business Credit Cards',
            description: 'The final tier. Aim for at least one major business card. Click names to apply.',
            vendors: [
                { id: 'amex_biz', name: 'Amex Business Platinum/Gold', url: 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/' },
                { id: 'chase_ink', name: 'Chase Ink Business', url: 'https://creditcards.chase.com/business-credit-cards/ink' },
                { id: 'capital_one_spark', name: 'Capital One Spark', url: 'https://www.capitalone.com/small-business/credit-cards/' },
                { id: 'brex', name: 'Brex Card', url: 'https://www.brex.com/' },
                { id: 'us_bank_biz', name: 'U.S. Bank Business Cards', url: 'https://www.usbank.com/business-banking/business-credit-cards.html' },
                { id: 'bank_of_america_biz', name: 'Bank of America Business Cards', url: 'https://www.bankofamerica.com/smallbusiness/credit-cards/' },
                { id: 'citi_biz', name: 'CitiBusiness / AAdvantage', url: 'https://www.citi.com/credit-cards/business-credit-cards' },
                { id: 'wells_fargo_biz', name: 'Wells Fargo Business Cards', url: 'https://www.wellsfargo.com/biz/business-credit/credit-cards/' },
                { id: 'divvy', name: 'Divvy / Bill.com Card', url: 'https://www.divvy.com/' },
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
    uline: true, grainger: true, quill: true, summa: true, // Tier 1 (4)
    home_depot: true, lowes: true, amazon: true, // Tier 2 (3)
    wex: true, fuelman: true, // Tier 3 (2)
    chase_ink: true, // Tier 4 (1)
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ReadinessPieChart = ({ data }: { data: { name: string, value: number }[] }) => {
    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie 
                    data={data} 
                    cx="50%" 
                    cy="50%" 
                    labelLine={false} 
                    outerRadius={80} 
                    fill="#8884d8" 
                    dataKey="value" 
                    nameKey="name" 
                    label={({ name, percent }) => `${name} ${Math.round(percent * 100)}%`}
                    fontSize={12}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, `Section Weight`]} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

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
    console.log('Saving foundation details:', foundationDetails);
    console.log('Saving checklist status:', completedItems);
    console.log('Saving vendor selections:', selectedVendors);
    toast({
      title: 'Progress Saved',
      description: 'Your business checklist information has been updated.',
    });
  };

  const readinessData = useMemo(() => {
    const foundationItems = checklistData.find(c => c.category === 'Business Foundation')?.items.map(i => i.id) || [];
    const completedFoundation = foundationItems.filter(id => completedItems[id]).length;
    const isFoundationComplete = completedFoundation >= 6;

    const bureauItems = checklistData.find(c => c.category === 'Business Credit Bureaus')?.items.map(i => i.id) || [];
    const completedBureaus = bureauItems.filter(id => completedItems[id]).length;
    const isBureausComplete = completedBureaus >= 1;

    const tradelineTiers = checklistData.find(c => c.category === 'Tradeline Building')?.items || [];
    let completedTiers = 0;
    tradelineTiers.forEach(tier => {
        const vendorIds = tier.vendors?.map(v => v.id) || [];
        const completedInTier = vendorIds.filter(vId => selectedVendors[vId]).length;
        if (completedInTier >= 3) {
            completedTiers++;
        }
    });
    const isTradelinesComplete = completedTiers >= 4;

    const financialItems = checklistData.find(c => c.category === 'Financial Readiness')?.items.map(i => i.id) || [];
    const completedFinancials = financialItems.filter(id => completedItems[id]).length;
    const isFinancialsComplete = completedFinancials >= 3;
    
    let overallProgress = 0;
    if (isFoundationComplete) overallProgress += 25;
    if (isBureausComplete) overallProgress += 25;
    if (isTradelinesComplete) overallProgress += 25;
    if (isFinancialsComplete) overallProgress += 25;
    
    const pieData = [
        { name: 'Foundation', value: isFoundationComplete ? 25 : 0 },
        { name: 'Bureaus', value: isBureausComplete ? 25 : 0 },
        { name: 'Tradelines', value: isTradelinesComplete ? 25 : 0 },
        { name: 'Financials', value: isFinancialsComplete ? 25 : 0 },
    ].filter(d => d.value > 0);

    // If no sections are complete, show a placeholder so the chart isn't empty
    if(pieData.length === 0){
        pieData.push({name: "Incomplete", value: 100});
    }

    const totalTasks = foundationItems.length + bureauItems.length + tradelineTiers.reduce((acc, tier) => acc + (tier.vendors?.length || 0), 0) + financialItems.length;
    const completedTasks = Object.values(completedItems).filter(Boolean).length + Object.values(selectedVendors).filter(Boolean).length;
    const hasSolidProfile = completedTasks >= 28;

    return {
        pieData,
        overallProgress,
        hasSolidProfile,
        completedTasks,
        totalTasks
    };
  }, [completedItems, selectedVendors]);

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">My Business Readiness Report</CardTitle>
                <CardDescription>
                Track your progress towards building a highly fundable business. Each section represents 25% of your total readiness.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-4 items-center">
                    <div>
                        <ReadinessPieChart data={readinessData.pieData} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg font-semibold">Overall Readiness: {readinessData.overallProgress}%</p>
                        <p className="text-muted-foreground">{readinessData.completedTasks} of {readinessData.totalTasks} total tasks completed.</p>
                        {readinessData.hasSolidProfile && (
                            <p className="text-green-600 font-semibold">Congratulations! You have a solid business profile.</p>
                        )}
                         <Button onClick={handleSaveChanges}>
                            <Save className="mr-2 h-4 w-4" /> Save All Progress
                        </Button>
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
                               <a
                                href={vendor.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium leading-none underline-offset-4 hover:underline peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                               >
                                {vendor.name} <ExternalLink className="inline-block h-3 w-3 ml-1" />
                              </a>
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

