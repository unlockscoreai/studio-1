
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Download, Send, Twitter, Facebook, Mail, Link as LinkIcon, Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const affiliateLink = "https://unlockscore.ai/intake?affiliate_id=creditup-solutions";

const socialCaptions = [
    "Tired of bad credit? I found this AI tool that writes dispute letters for you. Changed the game for me! #creditrepair #fintech #AI",
    "Boost your credit score the smart way. UnlockScore AI automates the dispute process. Check it out! #financialfreedom #creditscore",
    "Finally, a credit repair tool that actually works. Generated and sent my dispute letters in minutes. Highly recommend UnlockScore AI.",
];

const emailScript = `Subject: A Tool That Helped Me With My Credit

Hey [Name],

I wanted to share something that's been a huge help for my credit. It's called UnlockScore AI. It uses artificial intelligence to write and manage credit dispute letters.

It made the whole process super simple. If you're looking to clean up your credit report, you should definitely check it out.

Here's my link if you want to try it: ${affiliateLink}

Best,
[Your Name]`;

const leaderboardData = [
    { rank: 1, name: 'CreditUp Solutions', referrals: 157, earnings: 2355 },
    { rank: 2, name: 'BoostMyScore Inc.', referrals: 142, earnings: 2130 },
    { rank: 3, name: 'Financial Freedom LLC', referrals: 121, earnings: 1815 },
    { rank: 4, name: 'The Credit Guru', referrals: 105, earnings: 1575 },
    { rank: 5, name: 'Score Masters', referrals: 98, earnings: 1470 },
];

export default function ResourcesPage() {
    const [copied, setCopied] = useState('');
    const { toast } = useToast();

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        toast({ title: `Copied ${type} to clipboard!` });
        setTimeout(() => setCopied(''), 2000);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Referral Tools</CardTitle>
                    <CardDescription>Your unique link and resources to help you promote.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Your Unique Referral Link</h3>
                        <div className="flex items-center gap-2">
                            <Input readOnly value={affiliateLink} />
                            <Button onClick={() => handleCopy(affiliateLink, 'link')}>
                                {copied === 'link' ? <Check /> : <Copy />}
                                <span className="ml-2 hidden sm:inline">{copied === 'link' ? 'Copied!' : 'Copy'}</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Social Media Captions</h3>
                            {socialCaptions.map((caption, index) => (
                                <Card key={index} className="bg-muted/50">
                                    <CardContent className="p-3">
                                        <p className="text-sm text-muted-foreground mb-2">{caption}</p>
                                        <div className="flex justify-end gap-2">
                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(caption, `caption-${index}`)}>
                                                {copied === `caption-${index}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8"><Twitter className="h-4 w-4" /></Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8"><Facebook className="h-4 w-4" /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <h3 className="font-semibold">Email & SMS Scripts</h3>
                            <Card className="bg-muted/50">
                                <CardContent className="p-3">
                                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans mb-2">{emailScript}</pre>
                                     <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(emailScript, 'email')}>
                                             {copied === 'email' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8"><Mail className="h-4 w-4" /></Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                     <div>
                        <h3 className="font-semibold mb-2">Downloadable Resources</h3>
                         <div className="flex gap-4">
                            <Button variant="outline"><Download className="mr-2" /> Marketing Flyer (PDF)</Button>
                            <Button variant="outline"><Download className="mr-2" /> Canva Templates</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Leaderboard</CardTitle>
                    <CardDescription>See how you stack up against other affiliates this month.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Affiliate Name</TableHead>
                                <TableHead>Referrals</TableHead>
                                <TableHead className="text-right">Earnings</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardData.map((row) => (
                                <TableRow key={row.rank} className={row.name === "CreditUp Solutions" ? "bg-primary/10" : ""}>
                                    <TableCell className="font-bold text-lg">{row.rank === 1 ? '🏆' : row.rank}</TableCell>
                                    <TableCell className="font-medium">{row.name}</TableCell>
                                    <TableCell>{row.referrals}</TableCell>
                                    <TableCell className="text-right">${row.earnings.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
