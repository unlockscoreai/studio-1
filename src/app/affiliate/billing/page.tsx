'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard } from 'lucide-react';

// Placeholder data for credit packs (can be fetched from an API later)
const creditPacks = [
    { name: 'Starter', credits: 1, price: '$39', costPerCredit: '$39' },
    { name: 'Growth', credits: 5, price: '$95', costPerCredit: '$19' },
    { name: 'Power', credits: 15, price: '$270', costPerCredit: '$18' },
    { name: 'Elite', credits: 30, price: '$540', costPerCredit: '$18' },
];

// Placeholder data for credit usage history (can be fetched from an API later)
const creditUsageHistory = [
    { id: 1, date: '2024-07-26', description: 'Used 1 credit for dispute letter for Client A', creditsUsed: 1, remainingCredits: 9 },
    { id: 2, date: '2024-07-25', description: 'Purchased Growth Pack', creditsUsed: 0, remainingCredits: 10 },
    { id: 3, date: '2024-07-20', description: 'Used 1 credit for dispute letter for Client B', creditsUsed: 1, remainingCredits: 5 },
    {
        id: 4,
        date: '2024-07-19',
        description: 'Used 2 credits for dispute letters for Client C and Client D',
        creditsUsed: 2,
        remainingCredits: 6,
    },
];

export default function AffiliateBillingPage() {
    // Placeholder for active mail credits (can be fetched from an API later)
    const [mailCredits, setMailCredits] = useState(10); // Example: 10 credits

    const handlePurchase = (packName: string) => {
        // Placeholder for purchase logic
        console.log(`Attempting to purchase ${packName} credit pack`);
        alert(`Purchasing ${packName} credit pack (frontend placeholder)`);
        // In a real application, this would involve API calls for payment processing
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <CreditCard className="h-6 w-6 text-primary" />
                        Affiliate Billing
                    </CardTitle>
                    <CardDescription>
                        Manage your mail credits and purchase more for your clients' dispute letters.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Active Mail Credits */}
                    <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Available Mail Credits</p>
                        <p className="text-5xl font-bold">{mailCredits}</p>
                    </div>

                    {/* Purchase Credit Packs */}
                    <div>
                        <h3 className="text-2xl font-semibold font-headline mb-4">Purchase Credit Packs</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pack Name</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {creditPacks.map((pack) => (
                                    <TableRow key={pack.name}>
                                        <TableCell className="font-medium">{pack.name}</TableCell>
                                        <TableCell>{pack.credits}</TableCell>
                                        <TableCell>{pack.price}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => handlePurchase(pack.name)}>
                                                Buy Now
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <p className="text-xs text-muted-foreground mt-2">
                            1 credit = 1 AI letter printed + mailed. Cost includes Click2Mail + AI generation.
                        </p>
                    </div>

                    {/* Credit Usage History */}
                    <div>
                        <h3 className="text-2xl font-semibold font-headline mb-4">Credit Usage History</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Credits Used</TableHead>
                                    <TableHead className="text-right">Remaining Credits</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {creditUsageHistory.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell><Badge variant="secondary">-{item.creditsUsed}</Badge></TableCell>
                                        <TableCell className="text-right">{item.remainingCredits}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
