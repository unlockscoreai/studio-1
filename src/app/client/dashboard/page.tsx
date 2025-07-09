'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreditScoreChart } from '@/components/client/credit-score-chart';
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
import { TrendingUp, Trash2, FileClock, Sparkles, ListChecks, Lock } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const allDisputes = [
  // Successfully removed items
  { id: 1, bureau: 'Experian', item: 'Collection Account - XYZ', status: 'Removed', statusVariant: 'default' as const },
  { id: 2, bureau: 'TransUnion', item: 'Old Medical Bill', status: 'Removed', statusVariant: 'default' as const },
  { id: 3, bureau: 'Equifax', item: 'Duplicate Inquiry', status: 'Removed', statusVariant: 'default' as const },
  { id: 4, bureau: 'Experian', item: 'Incorrect Address History', status: 'Removed', statusVariant: 'default' as const },
  // Active items still in progress
  { id: 5, bureau: 'Experian', item: 'Late Payment - Capital One', status: 'Submitted', statusVariant: 'secondary' as const },
  { id: 6, bureau: 'Equifax', item: 'Incorrect Balance - Chase', status: 'Bureau Responded', statusVariant: 'outline' as const },
  { id: 7, bureau: 'TransUnion', item: 'Unknown Inquiry', status: 'Submitted', statusVariant: 'secondary' as const },
];

const totalDisputed = allDisputes.length;
const itemsRemoved = allDisputes.filter(d => d.status === 'Removed').length;
const activeDisputesCount = totalDisputed - itemsRemoved;
const activeDisputesForTable = allDisputes.filter(d => d.status !== 'Removed');

type SubscriptionTier = 'starter' | 'pro' | 'vip';

// A simple component to simulate switching subscription tiers for the demo.
function SubscriptionSimulator({ subscription, setSubscription }: { subscription: SubscriptionTier, setSubscription: (tier: SubscriptionTier) => void }) {
  return (
    <Card className="mb-6 bg-secondary border-dashed">
        <CardHeader className="pb-4">
            <CardTitle className="text-lg">Subscription Simulator</CardTitle>
            <CardDescription>Use this to see how the dashboard changes for different subscription tiers. This is for demo purposes only.</CardDescription>
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

export default function ClientDashboardPage() {
  const [subscription, setSubscription] = useState<SubscriptionTier>('starter');

  return (
    <div className="space-y-6">
      <SubscriptionSimulator subscription={subscription} setSubscription={setSubscription} />
      {/* Stat Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">720</div>
            <p className="text-xs text-muted-foreground text-green-600">+50 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disputed</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDisputed}</div>
            <p className="text-xs text-muted-foreground">Across all bureaus</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Removed</CardTitle>
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemsRemoved}</div>
            <p className="text-xs text-muted-foreground">Successfully deleted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Disputes</CardTitle>
            <FileClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDisputesCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting bureau response</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Score Progress</CardTitle>
              <CardDescription>Your credit score over the last 6 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <CreditScoreChart />
            </CardContent>
          </Card>
          
          {(subscription === 'pro' || subscription === 'vip') ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Active Disputes</CardTitle>
                <CardDescription>Track the status of your ongoing disputes.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bureau</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeDisputesForTable.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell>{dispute.bureau}</TableCell>
                        <TableCell className="font-medium">{dispute.item}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={dispute.statusVariant} className={dispute.status === 'Removed' ? 'bg-green-600 hover:bg-green-600/80' : ''}>
                            {dispute.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center text-center p-8">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <Lock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-headline">Track Your Disputes</CardTitle>
                <CardDescription className="mt-2 mb-4 max-w-sm">
                    Upgrade to our Pro plan to track every dispute in real-time and analyze bureau responses with our AI.
                </CardDescription>
                <Button>Upgrade to Pro</Button>
            </Card>
          )}

        </div>
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-accent/80 to-primary/80 text-primary-foreground border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                Upgrade to VIP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-primary-foreground/90 mb-4">
                Let us handle the mailing, follow-ups, and advanced dispute tactics for you. Accelerate your results with our full-service VIP plan.
              </p>
              <Button variant="secondary" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
