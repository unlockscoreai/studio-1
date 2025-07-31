'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { whitelabel } from "@/lib/whitelabel";

const subscriptionPlans = [
    { plan: 'Basic', price: '$39/mo', includes: 'Dashboard, AI scan, 1 credit/mo', affiliateResidual: '$5/mo' },
    { plan: 'Pro', price: '$89/mo', includes: '3 credits/mo, automation + tracking', affiliateResidual: '$15/mo' },
    { plan: 'VIP', price: '$199/mo', includes: '10 credits/mo, business tools + VIP support', affiliateResidual: '$40/mo' },
];

const creditPacks = [
    { name: 'Starter', credits: 1, price: '$39', costPerCredit: '$39', affiliatePayout: '$5 one-time' },
    { name: 'Growth', credits: 5, price: '$95', costPerCredit: '$19', affiliatePayout: '$10 one-time' },
    { name: 'Power', credits: 15, price: '$270', costPerCredit: '$18', affiliatePayout: '$30 one-time' },
    { name: 'Elite', credits: 30, price: '$540', costPerCredit: '$18', affiliatePayout: '$60 one-time' },
];

export default function AffiliateLandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="px-4 lg:px-6 h-16 flex items-center bg-background/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
                <Logo />
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link href="/login">
                        <Button variant="ghost">Login</Button>
                    </Link>
                    <Link href="/signup">
                        <Button>Sign Up</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1 pt-24 md:pt-32 lg:pt-40">
                <section className="w-full pb-12 md:pb-24 lg:pb-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                                    Become a {whitelabel.companyName} Affiliate
                                </h1>
                                <p className="max-w-[800px] text-foreground/80 md:text-xl mx-auto">
                                    Earn recurring commissions by sharing the most powerful AI credit repair tool on the market. Help others improve their credit while building your own passive income stream.
                                </p>
                            </div>
                            <Link href="/signup">
                                <Button size="lg" className="mt-4">
                                    <Rocket className="mr-2 h-5 w-5" />
                                    Sign Up & Start Earning
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="w-full pb-12 md:pb-24 lg:pb-32 bg-card">
                    <div className="container px-4 md:px-6 space-y-12">
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-3xl">Affiliate Program Overview</CardTitle>
                                <CardDescription>
                                    Unlock Score is your complete credit repair & automation suite powered by AI and fueled by affiliate-driven growth. Each credit used on the platform covers the generation and automated mailing of a dispute letter via Click2Mail.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-semibold font-headline mb-4">💸 Pricing & Credit System</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Credits renew monthly with the subscription plan or can be added with one-time credit packs.
                                    </p>
                                    
                                    <h4 className="font-semibold text-lg mb-2">Subscriptions (Monthly Access)</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Plan</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Includes</TableHead>
                                                <TableHead>Affiliate Residual</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subscriptionPlans.map((plan) => (
                                                <TableRow key={plan.plan}>
                                                    <TableCell className="font-medium">{plan.plan}</TableCell>
                                                    <TableCell>{plan.price}</TableCell>
                                                    <TableCell>{plan.includes}</TableCell>
                                                    <TableCell><Badge variant="secondary">{plan.affiliateResidual}</Badge></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <h4 className="font-semibold text-lg mt-6 mb-2">Credit Packs (One-Time Add-ons)</h4>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Pack Name</TableHead>
                                                <TableHead>Credits</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead>Cost/Credit</TableHead>
                                                <TableHead>Affiliate Payout</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {creditPacks.map((pack) => (
                                                <TableRow key={pack.name}>
                                                    <TableCell className="font-medium">{pack.name}</TableCell>
                                                    <TableCell>{pack.credits}</TableCell>
                                                    <TableCell>{pack.price}</TableCell>
                                                    <TableCell>{pack.costPerCredit}</TableCell>
                                                    <TableCell><Badge>{pack.affiliatePayout}</Badge></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        1 credit = 1 AI letter printed + mailed. Cost includes Click2Mail + AI generation.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold font-headline mb-4">💰 Compensation Plan Structure</h3>
                                    <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                                        <li>
                                            <strong className="text-foreground">Direct Commissions:</strong> 20% on all personal subscription referrals and
                                            fixed bonuses on credit pack purchases.
                                        </li>
                                        <li>
                                            <strong className="text-foreground">Tier 2 Residuals:</strong> 5% override on your direct affiliates' subscription
                                            commissions.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold font-headline mb-4">🚀 Income Example (Starter Affiliate)</h3>
                                    <p className="text-muted-foreground">
                                        Refers 3 Pro users ($89/mo): earns <strong>$15 × 3 = $45/mo</strong>.
                                        They each buy 5-credit packs monthly: earns <strong>$10 × 3 = $30</strong>.
                                        Total Monthly = <strong>$75 passive</strong>.
                                    </p>
                                    <p className="text-muted-foreground mt-2">
                                        If your team grows to 10 Pros on your second tier, you'd get a 5% override from their subs: <strong>$4 × 10 = $40/mo</strong>. That's
                                        <strong>$115/mo passive income</strong> with the potential to unlock rank bonuses.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-semibold font-headline mb-4">✅ Built-In Product Value</h3>
                                    <p className="text-muted-foreground">
                                        Each credit funds a real deliverable (AI letter + postage). There are no fake tokens or fluff—all commissions are backed by the utility
                                        and tangible results our platform provides.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
                <p className="text-xs text-foreground/70">&copy; 2024 {whitelabel.companyName}. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
