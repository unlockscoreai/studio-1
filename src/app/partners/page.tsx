
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Rocket, ShieldCheck, Check, Star, Briefcase, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block font-headline">UnlockScore AI</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t mt-auto">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Rocket className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by UnlockScore AI. The future of credit repair is here.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground">© {new Date().getFullYear()} UnlockScore AI, Inc.</p>
      </div>
    </footer>
  );
}

export default function PartnersPage() {
    const partnerTiers = [
    {
      name: 'VIP',
      price: '$599',
      period: '/month',
      mostPopular: true,
      description: 'For power affiliates and coaches who need the ultimate toolkit for personal and business clients.',
      features: [
        'All Pro Features, plus:',
        'Full Business AI Portal Access',
        'AI Business Fundability Scan',
        'Done-for-You Vendor Applications',
        'AI Funding Pre-Approval Engine',
      ],
      cta: 'Become a VIP Affiliate',
      href: '/sign-up',
    },
    {
      name: 'White Label & Licensing',
      price: 'Contact Us',
      period: '',
      description: 'For established credit repair companies who want to use our software under their own brand.',
      features: [
        'Your Own Branding & Domain',
        'Dedicated Infrastructure',
        'Full Control Over Pricing & Plans',
        'Priority Support & Training',
        'API Access for Custom Integrations'
      ],
      cta: 'Contact Sales',
      href: '#',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <LandingHeader />

      <main className="flex-1">
        <section id="pricing" className="py-20">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline text-primary">Partner & Enterprise Solutions</h1>
              <p className="max-w-2xl mx-auto mt-4 text-foreground/70 text-lg">
                Scale your business with our powerful affiliate and white-label programs.
              </p>
            </div>

            <div className="grid max-w-4xl gap-8 mx-auto mt-12 md:grid-cols-2">
                {partnerTiers.map((tier) => (
                    <Card key={tier.name} className={cn("flex flex-col", tier.mostPopular && "border-primary ring-2 ring-primary")}>
                        <CardHeader className="relative">
                            <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                            {tier.mostPopular && <div className="absolute top-0 right-4 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1"><Star className="w-4 h-4" /> Most Popular</div>}
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="mb-6">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                <span className="text-muted-foreground">{tier.period}</span>
                            </div>
                            <ul className="space-y-4">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild variant={tier.mostPopular ? 'default' : 'outline'} style={tier.mostPopular ? { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' } : {}}>
                                <Link href={tier.href}>{tier.cta}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             <div className="text-center mt-12">
                 <p className="text-lg text-foreground/80">Looking for individual plans?</p>
                <Button variant="link" asChild className="text-lg">
                    <Link href="/#pricing">View Consumer Pricing</Link>
                </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
