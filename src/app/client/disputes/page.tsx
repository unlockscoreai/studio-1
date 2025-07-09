'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UploadCloud, ShieldCheck, Lock } from "lucide-react";
import { UploadResponseDialog } from "@/components/client/upload-response-dialog";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";


// Mock data matching the dashboard for consistency
const allDisputes = [
  // Active items still in progress
  { id: 5, bureau: 'Experian', item: 'Late Payment - Capital One', status: 'Submitted', statusVariant: 'secondary' as const, date: '2024-07-10', successChance: 75 },
  { id: 6, bureau: 'Equifax', item: 'Incorrect Balance - Chase', status: 'Bureau Responded', statusVariant: 'outline' as const, date: '2024-07-08', successChance: 60 },
  { id: 7, bureau: 'TransUnion', item: 'Unknown Inquiry', status: 'Submitted', statusVariant: 'secondary' as const, date: '2024-07-05', successChance: 85 },
  // Successfully removed items
  { id: 1, bureau: 'Experian', item: 'Collection Account - XYZ', status: 'Removed', statusVariant: 'default' as const, date: '2024-06-20', successChance: 90 },
  { id: 2, bureau: 'TransUnion', item: 'Old Medical Bill', status: 'Removed', statusVariant: 'default' as const, date: '2024-06-15', successChance: 70 },
  { id: 3, bureau: 'Equifax', item: 'Duplicate Inquiry', status: 'Removed', statusVariant: 'default' as const, date: '2024-05-30', successChance: 95 },
  { id: 4, bureau: 'Experian', item: 'Incorrect Address History', status: 'Removed', statusVariant: 'default' as const, date: '2024-05-25', successChance: 80 },
];

export type Dispute = typeof allDisputes[0];
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


export default function DisputesPage() {
  const [subscription, setSubscription] = useState<SubscriptionTier>('pro');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUploadClick = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsDialogOpen(true);
  };

  const isSubscribed = subscription === 'pro' || subscription === 'vip';

  return (
    <div className="space-y-6">
      <SubscriptionSimulator subscription={subscription} setSubscription={setSubscription} />
      {isSubscribed ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">My Disputes</CardTitle>
              <CardDescription>
                Track all your dispute history here and upload bureau responses for AI analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bureau</TableHead>
                    <TableHead>Disputed Item</TableHead>
                    <TableHead>Date Submitted</TableHead>
                    <TableHead>Success Chance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allDisputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-medium">{dispute.bureau}</TableCell>
                      <TableCell>{dispute.item}</TableCell>
                      <TableCell>{dispute.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={dispute.successChance} className="w-20" />
                          <span className="text-muted-foreground font-medium">{dispute.successChance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={dispute.statusVariant} className={dispute.status === 'Removed' ? 'bg-green-600 hover:bg-green-600/80' : ''}>
                          {dispute.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {dispute.status !== 'Removed' && (
                          <Button variant="outline" size="sm" onClick={() => handleUploadClick(dispute)}>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload Response
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {selectedDispute && (
            <UploadResponseDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                dispute={selectedDispute}
            />
          )}
        </>
      ) : (
        <Card className="text-center p-10 flex flex-col items-center">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Lock className="w-10 h-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">Unlock Full Dispute Management</CardTitle>
            <CardDescription className="mt-2 mb-6 max-w-md mx-auto">
                Your current plan does not include dispute tracking or Round 2 response analysis. Upgrade to Pro to manage your entire dispute lifecycle from one place.
            </CardDescription>
            <div className="p-6 border rounded-lg bg-background w-full max-w-sm">
                <h4 className="font-semibold text-lg text-primary flex items-center gap-2 justify-center"><ShieldCheck /> Pro Plan Features</h4>
                <ul className="text-left list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
                    <li>Track all your dispute statuses in real-time.</li>
                    <li>Upload bureau responses for instant AI analysis.</li>
                    <li>Receive AI-powered "next step" recommendations.</li>
                    <li>View your complete dispute history.</li>
                </ul>
            </div>
            <Button size="lg" className="mt-6">Upgrade to Pro</Button>
        </Card>
      )}
    </div>
  );
}
