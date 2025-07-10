
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ShieldCheck, Briefcase } from "lucide-react";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { VendorApplicationForm } from '@/components/business/vendor-application-form';

type SubscriptionTier = 'starter' | 'pro' | 'vip';

function SubscriptionSimulator({ subscription, setSubscription }: { subscription: SubscriptionTier, setSubscription: (tier: SubscriptionTier) => void }) {
  return (
    <Card className="mb-6 bg-secondary border-dashed">
        <CardHeader className="pb-4">
            <CardTitle className="text-lg">Subscription Simulator</CardTitle>
            <CardDescription>Use this to see how this page changes for different subscription tiers. This is for demo purposes only.</CardDescription>
        </CardHeader>
        <CardContent>
             <RadioGroup value={subscription} onValueChange={(value) => setSubscription(value as SubscriptionTier)} className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="starter" id="r1" />
                <Label htmlFor="r1">Starter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pro" id="r2" />
                <Label htmlFor="r2">Pro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vip" id="r3" />
                <Label htmlFor="r3">VIP</Label>
              </div>
            </RadioGroup>
        </CardContent>
    </Card>
  )
}

export default function VendorApplicationsPage() {
  const [subscription, setSubscription] = useState<SubscriptionTier>('starter');
  const isVip = subscription === 'vip';
  
  return (
    <div className="space-y-6">
        <SubscriptionSimulator subscription={subscription} setSubscription={setSubscription} />
        {isVip ? (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        "Done For You" Vendor Applications
                    </CardTitle>
                    <CardDescription>Select a vendor and we'll automatically fill out and send the credit application for you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <VendorApplicationForm />
                </CardContent>
            </Card>
        ) : (
            <Card className="text-center p-10 flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Lock className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Unlock "Done For You" Services</CardTitle>
                <CardDescription className="mt-2 mb-6 max-w-md mx-auto">
                    Your current plan doesn't include our automated vendor application service. Upgrade to VIP and let us handle the paperwork for you.
                </CardDescription>
                <div className="p-6 border rounded-lg bg-background w-full max-w-sm">
                    <h4 className="font-semibold text-lg text-primary flex items-center gap-2 justify-center"><ShieldCheck /> VIP Features</h4>
                    <ul className="text-left list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
                        <li><strong>Automated Vendor Applications.</strong></li>
                        <li>Dedicated Account Manager.</li>
                        <li>Advanced Reporting & Analytics.</li>
                        <li>Priority Support.</li>
                    </ul>
                </div>
                <Button size="lg" className="mt-6">Upgrade to VIP</Button>
            </Card>
        )}
    </div>
  )
}
