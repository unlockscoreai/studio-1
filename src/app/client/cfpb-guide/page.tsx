'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lock, ShieldCheck, ExternalLink, Gavel } from "lucide-react";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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

export default function CfpbGuidePage() {
  const [subscription, setSubscription] = useState<SubscriptionTier>('pro');
  const isSubscribed = subscription === 'pro' || subscription === 'vip';
  
  return (
    <div className="space-y-6">
        <SubscriptionSimulator subscription={subscription} setSubscription={setSubscription} />
        {isSubscribed ? (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Gavel className="w-6 h-6 text-primary" />
                        CFPB Complaint Guide
                    </CardTitle>
                    <CardDescription>Leverage the CFPB to get faster results on your disputes when bureaus are unresponsive.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Why File a Complaint with the CFPB?</h3>
                        <p className="text-muted-foreground mb-4">
                            The Consumer Financial Protection Bureau (CFPB) is a U.S. government agency that ensures banks, lenders, and other financial companies treat you fairly. When a credit bureau ignores your dispute or fails to correct an error, filing a complaint with the CFPB adds significant pressure. They are legally required to respond, often leading to quicker resolutions.
                        </p>
                    </div>

                    <Alert>
                        <AlertTitle>Important Prerequisite</AlertTitle>
                        <AlertDescription>
                        You must first attempt to resolve the issue directly with the credit bureau by sending a dispute letter. Only file a CFPB complaint if they do not respond within 30 days or if you are unsatisfied with their response.
                        </AlertDescription>
                    </Alert>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">How to File a Complaint</h3>
                        <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                            <li>
                                <strong>Gather Your Documents:</strong> Have your original dispute letter, any response from the bureau, and your personal information ready.
                            </li>
                            <li>
                                <strong>Go to the CFPB Website:</strong> Navigate to the official complaint page.
                                <Button variant="link" asChild className="p-1 h-auto -ml-1">
                                    <a href="https://www.consumerfinance.gov/complaint/" target="_blank" rel="noopener noreferrer">
                                        consumerfinance.gov/complaint <ExternalLink className="inline-block ml-1 h-4 w-4" />
                                    </a>
                                </Button>
                            </li>
                            <li>
                                <strong>Start a New Complaint:</strong> Select "Credit reporting, credit repair services, or other personal consumer reports."
                            </li>
                             <li>
                                <strong>Describe the Issue:</strong> Clearly explain your problem. State the facts, what you've done to resolve it (i.e., you sent a dispute letter), and what you want the outcome to be. Be professional and concise.
                            </li>
                            <li>
                                <strong>Upload Your Documents:</strong> Attach a copy of the dispute letter you sent to the bureau, plus the copies of your ID and proof of address that you included in the mailing. This provides a complete record of your dispute.
                            </li>
                            <li>
                                <strong>Submit and Track:</strong> After submitting, you will receive a case number. You can use this to track the progress of your complaint on the CFPB portal.
                            </li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        ) : (
            <Card className="text-center p-10 flex flex-col items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Lock className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Unlock Advanced Dispute Tactics</CardTitle>
                <CardDescription className="mt-2 mb-6 max-w-md mx-auto">
                    Your current plan doesn't include our guide to filing complaints with the CFPB. Upgrade to Pro for powerful, step-by-step instructions.
                </CardDescription>
                <div className="p-6 border rounded-lg bg-background w-full max-w-sm">
                    <h4 className="font-semibold text-lg text-primary flex items-center gap-2 justify-center"><ShieldCheck /> Pro & VIP Features</h4>
                    <ul className="text-left list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
                        <li>Full Dispute Management & Tracking.</li>
                        <li>AI Bureau Response Analysis.</li>
                        <li><strong>Step-by-step CFPB Complaint Guide.</strong></li>
                        <li>Automated Mailing Service.</li>
                    </ul>
                </div>
                <Button size="lg" className="mt-6">Upgrade to Pro</Button>
            </Card>
        )}
    </div>
  )
}
