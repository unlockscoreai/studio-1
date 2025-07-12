'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DollarSign, CreditCard, ShoppingCart, CheckCircle, AlertTriangle } from "lucide-react";
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
                    This is a placeholder for your commission payout history.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Payout history and settings will be displayed here.</p>
                </CardContent>
            </Card>
          </div>
        
          <div className="lg:col-span-1 space-y-8">
              <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <CreditCard className="h-6 w-6" />
                        Billing Overview
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Mail Credit Balance</p>
                        <p className="text-4xl font-bold">{mailCredits}</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Next Payout</p>
                        <p className="text-2xl font-bold">$1,240.00</p>
                        <p className="text-xs text-muted-foreground">On August 1, 2024</p>
                    </div>
                     <Button className="w-full">Manage Payment Method</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                    <CardTitle>Credit Transaction History</CardTitle>
                </CardHeader>
                 <CardContent>
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