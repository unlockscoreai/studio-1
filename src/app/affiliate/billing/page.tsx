
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, CreditCard, ShoppingCart, Users, Building, Info } from "lucide-react";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

// Mock data from other pages to calculate commissions
const personalClientsCount = 4; // From client-management mock data
const businessClientsCount = 3; // From client-management mock data

const COMMISSION_RATES = {
    personal: 15, // $15 per personal client
    business: 50, // $50 per business client
};

const creditPackages = [
    { name: 'Starter Pack', credits: 10, price: 50, pricePer: 5.00 },
    { name: 'Pro Pack', credits: 50, price: 225, pricePer: 4.50, popular: true },
    { name: 'Agency Pack', credits: 100, price: 400, pricePer: 4.00 },
];

const transactionHistory = [
    { id: 1, date: '2024-07-25', description: 'Used 1 credit for Jane Doe - Letter 1', type: 'usage', amount: -1 },
    { id: 2, date: '2024-07-24', description: 'Purchased Pro Pack (50 credits)', type: 'purchase', amount: 50 },
    { id: 3, date: '2024-07-22', description: 'Used 1 credit for John Smith - Letter 1', type: 'usage', amount: -1 },
];

export default function BillingPage() {
    const [mailCredits, setMailCredits] = useState(48);
    const { toast } = useToast();

    const personalCommission = personalClientsCount * COMMISSION_RATES.personal;
    const businessCommission = businessClientsCount * COMMISSION_RATES.business;
    const totalPayout = personalCommission + businessCommission;

    const handlePurchase = (credits: number, price: number) => {
        // In a real app, this would trigger a payment flow (e.g., Stripe)
        // For this demo, we just update the state.
        setMailCredits(prev => prev + credits);
        toast({
            title: 'Purchase Successful!',
            description: `You have added ${credits} mail credits to your account for $${price}.`,
        });
    }

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             <Card>
                <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                    Purchase Mail Credits
                </CardTitle>
                <CardDescription>
                    Purchase certified mail credits in advance for your clients' automated dispute letters. Each credit covers one certified mailing.
                </CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                    {creditPackages.map(pkg => (
                        <Card key={pkg.name} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{pkg.name}</CardTitle>
                                <p className="text-3xl font-bold">{pkg.credits} <span className="text-lg font-normal text-muted-foreground">Credits</span></p>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-2xl font-semibold">${pkg.price}</p>
                                <p className="text-sm text-muted-foreground">(${pkg.pricePer.toFixed(2)} per letter)</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" variant={pkg.popular ? 'default' : 'outline'} onClick={() => handlePurchase(pkg.credits, pkg.price)}>
                                    Purchase
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle className="font-headline">Payout History</CardTitle>
                <CardDescription>
                    This is a placeholder for your commission payout history. Payouts are typically processed on the 1st of each month.
                </CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="p-4 bg-muted rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Feature Coming Soon</p>
                    </div>
                </CardContent>
            </Card>
          </div>
        
          <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <DollarSign className="h-6 w-6" />
                        Commission Summary
                    </CardTitle>
                    <CardDescription>
                        Estimated payout for the current period.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4" /> Personal Referrals</span>
                            <span>{personalClientsCount} &times; ${COMMISSION_RATES.personal}</span>
                            <span className="font-medium">${personalCommission.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground flex items-center gap-2"><Building className="w-4 h-4" /> Business Referrals</span>
                            <span>{businessClientsCount} &times; ${COMMISSION_RATES.business}</span>
                            <span className="font-medium">${businessCommission.toFixed(2)}</span>
                        </div>
                    </div>
                    <Separator />
                     <div>
                        <p className="text-sm text-muted-foreground">Next Payout Estimate</p>
                        <p className="text-3xl font-bold">${totalPayout.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">On August 1, 2024</p>
                    </div>
                     <Button className="w-full">Manage Payout Method</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Credit Balance
                    </CardTitle>
                </CardHeader>
                 <CardContent>
                    <div>
                        <p className="text-sm text-muted-foreground">Mail Credit Balance</p>
                        <p className="text-4xl font-bold">{mailCredits}</p>
                    </div>
                    <Separator className="my-4" />
                    <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {transactionHistory.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell className="text-xs">{tx.date}</TableCell>
                                <TableCell className="text-xs">{tx.description}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={tx.type === 'purchase' ? 'default' : 'secondary'} className={tx.type === 'purchase' ? 'bg-green-600' : ''}>
                                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
