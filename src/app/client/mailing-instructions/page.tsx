'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck, Send, CheckCircle, AlertTriangle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const bureaus = [
    {
        name: "Experian",
        address: [
            "P.O. Box 4500",
            "Allen, TX 75013"
        ]
    },
    {
        name: "TransUnion Consumer Solutions",
        address: [
            "P.O. Box 2000",
            "Chester, PA 19016-2000"
        ]
    },
    {
        name: "Equifax Information Services LLC",
        address: [
            "P.O. Box 740256",
            "Atlanta, GA 30374-0256"
        ]
    }
];

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


export default function MailingInstructionsPage() {
  const [subscription, setSubscription] = useState<SubscriptionTier>('starter');

  return (
    <div className="space-y-6">
        <SubscriptionSimulator subscription={subscription} setSubscription={setSubscription} />
        {subscription === 'starter' ? (
             <Card>
                <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Send className="h-6 w-6 text-primary" />
                    Mailing Your Dispute Letters
                </CardTitle>
                <CardDescription>
                    Follow these instructions to ensure your letters are sent correctly and you have proof of delivery.
                </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Don't Forget Your Documents!</AlertTitle>
                    <AlertDescription>
                    For best results, always include a clear photocopy of your driver's license (or other government-issued ID) and a recent utility bill as proof of your address. This helps the bureaus verify your identity quickly.
                    </AlertDescription>
                </Alert>
                
                <div>
                    <h3 className="text-lg font-semibold mb-2">How to Send Certified Mail</h3>
                    <p className="text-muted-foreground mb-4">
                    Sending your dispute letters via USPS Certified Mail with Return Receipt is crucial. This provides you with a legal record that the credit bureaus received your correspondence, which is vital if you need to take further action.
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                    <li>Place your signed dispute letter, a copy of your ID, and a proof of address into an envelope.</li>
                    <li>Take your envelope to any U.S. Post Office.</li>
                    <li>Ask the postal clerk for a Certified Mail form (PS Form 3800) and a Return Receipt form (PS Form 3811, the "green card").</li>
                    <li>Fill out the forms with the bureau's address and your own. The clerk can assist you.</li>
                    <li>The clerk will attach the forms and a tracking barcode to your envelope. You will get a receipt with the tracking number.</li>
                    <li><strong>Keep your receipt in a safe place!</strong> This is your proof of mailing. You will receive the green card back in the mail once your letter is delivered.</li>
                    </ol>
                </div>

                <Alert>
                    <AlertTitle>Important Tip</AlertTitle>
                    <AlertDescription>
                    Do NOT require a signature for your certified mail. Just a return receipt is sufficient and prevents potential delivery delays.
                    </AlertDescription>
                </Alert>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Credit Bureau Mailing Addresses</h3>
                    <p className="text-muted-foreground mb-4">
                    Always double-check the correct address on the bureau's website before sending, as addresses can change. Use the following addresses for disputes.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {bureaus.map((bureau) => (
                        <div key={bureau.name} className="p-4 border rounded-lg bg-card">
                        <h4 className="font-bold">{bureau.name}</h4>
                        <address className="not-italic text-muted-foreground">
                            {bureau.address.map((line) => (
                            <span key={line} className="block">{line}</span>
                            ))}
                        </address>
                        </div>
                    ))}
                    </div>
                </div>
                </CardContent>
            </Card>
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        Automated Mailing Service
                    </CardTitle>
                    <CardDescription>
                        Your current plan includes automated mailing of your dispute letters.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 text-muted-foreground">
                        <p>No need to print, address, or mail anything yourself. With your <span className="font-semibold text-primary">{subscription.charAt(0).toUpperCase() + subscription.slice(1)}</span> plan, we handle the entire mailing process for you.</p>
                        <p>Once you approve a dispute letter in your portal, we automatically send it via USPS Certified Mail to the correct credit bureau. You can track its status right from your "My Disputes" page.</p>
                        <p>Sit back and relax while we take care of the paperwork!</p>
                    </div>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
