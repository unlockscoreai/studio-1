'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Rocket, ShieldCheck, Bot, LineChart, Check, FileText, Banknote } from 'lucide-react';
import { useState } from 'react';

function LandingHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">UnlockScore AI</span>
          </Link>
        </div>
        <button
          className="inline-flex items-center justify-center p-2 rounded-md md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Rocket className="h-6 w-6 text-primary" />
          <span className="sr-only">Open main menu</span>
        </button>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="text-foreground/60 transition-colors hover:text-foreground/80">Features</Link>
            <Link href="#testimonials" className="text-foreground/60 transition-colors hover:text-foreground/80">Testimonials</Link>
            <Link href="#pricing" className="text-foreground/60 transition-colors hover:text-foreground/80">Pricing</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
       {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-foreground/60 hover:text-foreground/80">Features</Link>
            <Link href="#testimonials" className="block px-3 py-2 rounded-md text-base font-medium text-foreground/60 hover:text-foreground/80">Testimonials</Link>
            <Link href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-foreground/60 hover:text-foreground/80">Pricing</Link>
          </div>
        </div>
      )}
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t">
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


export default function Home() {
  const features = [
    {
      icon: <Bot className="w-8 h-8 text-primary" />,
      title: 'AI Letter Generation',
      description: 'Leverage our AI to generate personalized, effective credit dispute letters in minutes.',
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: 'Secure & Private',
      description: 'Your data is protected with industry-leading security standards. Your privacy is our priority.',
    },
    {
      icon: <LineChart className="w-8 h-8 text-primary" />,
      title: 'Track Your Progress',
      description: 'Monitor your disputes and see your credit score improve with our intuitive dashboard.',
    },
    {
      icon: <Banknote className="w-8 h-8 text-primary" />,
      title: 'Affiliate Program',
      description: 'Earn commissions by referring clients to our platform. Track your leads and earnings in real-time.',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah L.',
      title: 'Client',
      quote: 'UnlockScore AI made the credit dispute process so simple. I saw results faster than I ever thought possible!',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    },
    {
      name: 'Mike R.',
      title: 'Affiliate Partner',
      quote: 'The affiliate dashboard is fantastic. It\'s easy to track my referrals and commissions. A great passive income stream.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    },
    {
      name: 'Jessica P.',
      title: 'Client',
      quote: 'I was skeptical about AI, but the letters generated were professional and incredibly effective. My score went up 60 points!',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    },
  ];

  const pricingTiers = [
    {
      name: 'Client',
      price: '$49',
      period: '/month',
      features: [
        'AI Letter Generation',
        'Unlimited Disputes',
        'Progress Tracking Dashboard',
        'Email Support',
      ],
      cta: 'Choose Client Plan',
      href: '/sign-up'
    },
    {
      name: 'Affiliate',
      price: 'Free',
      period: '',
      features: [
        'Referral Link Generator',
        'Real-time Lead Tracking',
        'Commission Dashboard',
        'Marketing Materials',
      ],
      cta: 'Become an Affiliate',
      href: '/sign-up'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />

      <main className="flex-1">
        <section className="py-20 sm:py-32">
          <div className="container text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl font-headline text-primary">
              Fix Your Credit with the Power of AI
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg text-foreground/80">
              UnlockScore AI generates personalized, effective dispute letters to help you clean up your credit report and boost your score. Fast, easy, and secure.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                <Link href="/sign-up">Start Your Dispute for Free</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-secondary">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl font-headline text-primary">Why Choose UnlockScore AI?</h2>
              <p className="max-w-2xl mx-auto mt-4 text-foreground/70">
                Our platform is designed to give you the upper hand in credit disputes.
              </p>
            </div>
            <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="flex justify-center mb-4">{feature.icon}</div>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/70">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl font-headline text-primary">Trusted by Users and Affiliates</h2>
              <p className="max-w-2xl mx-auto mt-4 text-foreground/70">
                Hear what people are saying about their success with UnlockScore AI.
              </p>
            </div>
            <div className="grid gap-8 mt-12 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <p className="italic">"{testimonial.quote}"</p>
                  </CardContent>
                  <CardFooter className="flex items-center gap-4 mt-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-foreground/70">{testimonial.title}</p>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        <section id="pricing" className="py-20 bg-secondary">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl font-headline text-primary">Choose Your Path</h2>
              <p className="max-w-2xl mx-auto mt-4 text-foreground/70">
                Whether you're fixing your credit or helping others, we have a plan for you.
              </p>
            </div>
            <div className="grid max-w-md gap-8 mx-auto mt-12 md:max-w-2xl md:grid-cols-2">
                {pricingTiers.map((tier) => (
                    <Card key={tier.name} className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="mb-6">
                                <span className="text-4xl font-bold">{tier.price}</span>
                                <span className="text-muted-foreground">{tier.period}</span>
                            </div>
                            <ul className="space-y-4">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="w-5 h-5 text-green-500" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                                <Link href={tier.href}>{tier.cta}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
