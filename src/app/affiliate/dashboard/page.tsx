'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, BarChart, Link as LinkIcon, Copy, Check, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ClientPipeline } from "@/components/affiliate/ClientPipeline";
import { useToast } from "@/hooks/use-toast";

export default function AffiliateDashboardPage() {
  const [copiedLink, setCopiedLink] = useState<'personal' | 'business' | null>(null);
  const { toast } = useToast();
  // In a real app, the affiliate ID would be dynamic based on the logged-in user.
  const affiliateId = "creditup-solutions";
  const personalReferralLink = `https://unlockscore.ai/intake?affiliate_id=${affiliateId}`;
  const businessReferralLink = `https://unlockscore.ai/business-intake?affiliate_id=${affiliateId}`;

  const handleCopy = (type: 'personal' | 'business') => {
    const linkToCopy = type === 'personal' ? personalReferralLink : businessReferralLink;
    if (typeof navigator.clipboard?.writeText !== 'function') {
      toast({
        variant: "destructive",
        title: "Copy failed",
        description: "Your browser does not support copying to clipboard.",
      });
      return;
    }
    navigator.clipboard.writeText(linkToCopy);
    setCopiedLink(type);
    toast({
      title: "Copied to clipboard!",
    });
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125</div>
            <p className="text-xs text-muted-foreground">+15 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business Referrals</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">+5 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24%</div>
            <p className="text-xs text-muted-foreground">Up 3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payout</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240.00</div>
            <p className="text-xs text-muted-foreground">Next payout in 15 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5" /> Your Personal Referral Link</CardTitle>
                <CardDescription>Share this link to refer personal credit clients.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Input readOnly value={personalReferralLink} />
                <Button onClick={() => handleCopy('personal')}>
                    {copiedLink === 'personal' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">{copiedLink === 'personal' ? 'Copied' : 'Copy Link'}</span>
                </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><LinkIcon className="h-5 w-5" /> Your Business Referral Link</CardTitle>
                <CardDescription>Share this link to refer business clients.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Input readOnly value={businessReferralLink} />
                <Button onClick={() => handleCopy('business')}>
                    {copiedLink === 'business' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">{copiedLink === 'business' ? 'Copied' : 'Copy Link'}</span>
                </Button>
            </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Client Pipeline</CardTitle>
            <CardDescription>Track the progress of your referred clients.</CardDescription>
        </CardHeader>
        <CardContent>
            <ClientPipeline />
        </CardContent>
      </Card>
    </div>
  );
}
