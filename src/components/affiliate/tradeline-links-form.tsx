'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Save } from 'lucide-react';

const tradelineData = [
  {
    tier: 'Credit Booster Services',
    description: 'Popular third-party services that help clients build credit history through methods like rent reporting and credit-builder loans.',
    vendors: [
      { id: 'ava', name: 'Ava' },
      { id: 'kikoff', name: 'Kikoff' },
      { id: 'self', name: 'Self' },
      { id: 'boom', name: 'Boom' },
      { id: 'extra', name: 'Extra' },
      { id: 'grain', name: 'Grain' },
    ],
  },
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

export function TradelineLinksForm() {
  const [links, setLinks] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleLinkChange = (vendorId: string, value: string) => {
    setLinks((prev) => ({ ...prev, [vendorId]: value }));
  };

  const handleSaveChanges = () => {
    // In a real app, you would save the `links` object to your database
    // associated with the logged-in affiliate.
    console.log('Saving links:', links);
    toast({
      title: 'Links Saved!',
      description: 'Your tradeline referral links have been updated.',
    });
  };

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={[tradelineData[0].tier, tradelineData[1].tier]} className="w-full">
        {tradelineData.map((category) => (
          <AccordionItem value={category.tier} key={category.tier}>
            <AccordionTrigger className="text-xl font-headline text-primary hover:no-underline">
              {category.tier}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground mb-6">{category.description}</p>
              <div className="space-y-4">
                {category.vendors.map((vendor) => (
                  <div key={vendor.id} className="space-y-2">
                    <Label htmlFor={vendor.id}>{vendor.name} Referral Link</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={vendor.id}
                        placeholder={`https://.../ref?id=${vendor.id}`}
                        value={links[vendor.id] || ''}
                        onChange={(e) => handleLinkChange(vendor.id, e.target.value)}
                      />
                       <Button variant="ghost" size="icon" asChild>
                          <a href={links[vendor.id] || '#'} target="_blank" rel="noopener noreferrer" aria-disabled={!links[vendor.id]}>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                       </Button>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button onClick={handleSaveChanges}>
        <Save className="mr-2 h-4 w-4" />
        Save All Changes
      </Button>
    </div>
  );
}
