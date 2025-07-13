
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Check, Download, Send, Twitter, Facebook, Mail, Info, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


const affiliateLink = "https://unlockscore.ai/intake?affiliate_id=creditup-solutions";

const socialCaptions = [
    "Tired of bad credit? I found this AI tool that writes dispute letters for you. Changed the game for me! #creditrepair #fintech #AI",
    "Boost your credit score the smart way. UnlockScore AI automates the dispute process. Check it out! #financialfreedom #creditscore",
    "Finally, a credit repair tool that actually works. Generated and sent my dispute letters in minutes. Highly recommend UnlockScore AI.",
    "Don't let errors on your credit report dictate your financial future. This AI platform helped me take control. #creditboost #dispute",
    "If you're looking for a side hustle, check out the @UnlockScoreAI affiliate program. Helping others fix their credit and earning rewards is a win-win. #affiliatemarketing",
    "Just helped another client get a negative item removed with UnlockScore AI. This platform is powerful. #creditrepair #results",
    "The secret to a better credit score isn't a secret anymore. It's AI. Check out UnlockScore. #innovation #finance",
];

const emailScripts = [
    {
        title: "Friendly Intro Email",
        script: `Subject: A Tool That Helped Me With My Credit

Hey [Name],

I wanted to share something that's been a huge help for my credit. It's called UnlockScore AI. It uses artificial intelligence to write and manage credit dispute letters.

It made the whole process super simple. If you're looking to clean up your credit report, you should definitely check it out.

Here's my link if you want to try it: ${affiliateLink}

Best,
[Your Name]`
    },
    {
        title: "Direct SMS Script",
        script: `Hey! I found this AI tool that makes fixing your credit report super easy. It writes the dispute letters for you. If you're looking to boost your score, you should check it out: ${affiliateLink}`
    },
    {
        title: "Follow-Up Email",
        script: `Subject: Following up on that credit tool

Hey [Name],

Just wanted to quickly follow up and see if you had a chance to look at UnlockScore AI. A few friends have used it and seen great results on their credit reports.

Let me know if you have any questions about it! Here's the link again: ${affiliateLink}

Cheers,
[Your Name]`
    },
    {
        title: "Business Owner Outreach",
        script: `Subject: Building business credit just got easier

Hey [Name],

Saw you're running [Business Name] and wanted to share a tool that's helping businesses like yours get funding-ready. It's called UnlockScore AI. It analyzes your business's public profile and gives you a step-by-step plan to build your business credit.

It’s pretty impressive. You can get a free analysis here: [Your Business Referral Link]

Best,
[Your Name]`
    }
]

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
                    <CardTitle className="font-headline flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        Platform Overview
                    </CardTitle>
                    <CardDescription>Use this information to understand and explain the value of UnlockScore AI to your clients.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg">What is Unlock Score AI?</h3>
                        <p className="text-muted-foreground">Unlock Score AI is an all-in-one, AI-powered platform designed to help individuals repair their personal credit and assist businesses in building their credit profile to become funding-ready.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold">The Problem</h4>
                            <p className="text-muted-foreground">The traditional credit dispute process is slow, confusing, and often requires hiring expensive lawyers or credit repair companies with no guarantee of results.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold">Our Solution</h4>
                            <p className="text-muted-foreground">Our AI automates the most complex parts of credit repair, providing a fast, simple, and effective path to a better credit score and improved business fundability.</p>
                        </div>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="personal-credit">
                            <AccordionTrigger className="text-lg font-semibold">How Personal Credit Repair Works</AccordionTrigger>
                            <AccordionContent className="pt-2">
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li><strong>Client Uploads Report:</strong> The client signs up and uploads their 3-bureau credit report from a service like IdentityIQ or myFICO.</li>
                                    <li><strong>AI Analyzes & Generates Letters:</strong> Our AI analyzes the report, identifies negative items, and generates highly effective, personalized dispute letters for each bureau.</li>
                                    <li><strong>Client Mails Letters:</strong> On the Starter plan, the client mails the letters themselves. On Pro & VIP plans, we mail them via Certified Mail automatically.</li>
                                    <li><strong>AI Analyzes Responses (Round 2):</strong> When the bureaus respond, the client uploads the response letters. Our AI analyzes the outcome and generates the next strategic follow-up letter.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="business-credit">
                            <AccordionTrigger className="text-lg font-semibold">How Business Credit Building Works</AccordionTrigger>
                            <AccordionContent className="pt-2">
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                     <li><strong>Business Owner Provides Details:</strong> The business owner fills out a simple intake form with their business name, state, and other basic info.</li>
                                    <li><strong>AI Runs "Unlock Score" Scan:</strong> Our AI performs a comprehensive public data scan (SoS, web presence, etc.) to generate the business's "Unlock Score™"—a 0-1000 metric of funding readiness.</li>
                                    <li><strong>Action Plan Delivered:</strong> The AI provides a detailed report identifying risk factors and a step-by-step action plan to improve their Unlock Score.</li>
                                    <li><strong>Client Builds Credit:</strong> Using our platform, the client can open vendor accounts (tradelines), track their progress, and ultimately apply for funding with a much higher chance of success.</li>
                                </ol>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>

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

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Social Media Captions</h3>
                            <Carousel className="w-full" opts={{ loop: true }}>
                                <CarouselContent>
                                    {socialCaptions.map((caption, index) => (
                                        <CarouselItem key={index}>
                                            <Card className="bg-muted/50 h-full">
                                                <CardContent className="p-4 flex flex-col h-full">
                                                    <p className="text-sm text-muted-foreground mb-4 flex-grow">{caption}</p>
                                                    <div className="flex justify-end gap-2 mt-auto">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(caption, `caption-${index}`)}>
                                                            {copied === `caption-${index}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8"><Twitter className="h-4 w-4" /></Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8"><Facebook className="h-4 w-4" /></Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="hidden sm:flex" />
                                <CarouselNext className="hidden sm:flex" />
                            </Carousel>
                        </div>
                         <div className="space-y-4">
                            <h3 className="font-semibold">Email & SMS Scripts</h3>
                            <Carousel className="w-full" opts={{ loop: true }}>
                                <CarouselContent>
                                    {emailScripts.map((item, index) => (
                                        <CarouselItem key={index}>
                                            <Card className="bg-muted/50 h-full">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base">{item.title}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4 flex flex-col h-full">
                                                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans mb-4 flex-grow">{item.script}</pre>
                                                    <div className="flex justify-end gap-2 mt-auto">
                                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleCopy(item.script, `email-${index}`)}>
                                                            {copied === `email-${index}` ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8"><Mail className="h-4 w-4" /></Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="hidden sm:flex" />
                                <CarouselNext className="hidden sm:flex" />
                            </Carousel>
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
