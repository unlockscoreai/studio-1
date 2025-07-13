
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Save, Check } from 'lucide-react';
import type { Vendor } from '@/lib/vendor-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TradelineLinksTableProps {
  vendors: Vendor[];
}

export function TradelineLinksTable({ vendors }: TradelineLinksTableProps) {
  // In a real app, initial state would be fetched from the DB
  const [links, setLinks] = useState<Record<string, string>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const { toast } = useToast();

  const handleLinkChange = (vendorId: string, value: string) => {
    setLinks((prev) => ({ ...prev, [vendorId]: value }));
    if (savedStatus[vendorId]) {
      setSavedStatus(prev => ({...prev, [vendorId]: false}));
    }
  };

  const handleSave = (vendorId: string, vendorName: string) => {
    // In a real app, you would save the link to your database
    console.log(`Saving link for ${vendorName}:`, links[vendorId]);
    setSavedStatus(prev => ({...prev, [vendorId]: true}));
    toast({
      title: 'Link Saved!',
      description: `Your referral link for ${vendorName} has been updated.`,
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vendor</TableHead>
          <TableHead>Your Referral Link</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((vendor) => (
          <TableRow key={vendor.id}>
            <TableCell className="font-medium">{vendor.name}</TableCell>
            <TableCell>
              <Input
                id={vendor.id}
                placeholder={`https://.../ref?id=${vendor.id}`}
                value={links[vendor.id] || ''}
                onChange={(e) => handleLinkChange(vendor.id, e.target.value)}
              />
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button 
                size="sm"
                onClick={() => handleSave(vendor.id, vendor.name)}
                disabled={!links[vendor.id] || savedStatus[vendor.id]}
              >
                {savedStatus[vendor.id] ? <Check className="mr-2" /> : <Save className="mr-2" />}
                {savedStatus[vendor.id] ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={links[vendor.id] || '#'} target="_blank" rel="noopener noreferrer" aria-disabled={!links[vendor.id]}>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
