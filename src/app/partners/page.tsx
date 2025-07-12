
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Rocket, ShieldCheck, Check, Star, Briefcase, Building, BarChart, Users, DollarSign, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" asChild>
                <Link href="/sign-in">Affiliate Login</Link>
            </Button>
            <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                <Link href="/sign-up">Become an Affiliate</Link>
            </Button>
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

const incentives = [
    { icon: <DollarSign className="w-8 h-8 text-primary" />, title: 'Generous Commissions', description: 'Earn competitive commissions for every client you refer to our Starter, Pro, and VIP plans.' },
    { icon: <Star className="w-8 h-8 text-primary" />, title: 'Unlock Free Access', description: 'Refer just 3 clients to any paid plan and get your own VIP subscription for free.' },
    { icon: <BarChart className="w-8 h-8 text-primary" />, title: 'Advanced Dashboard', description: 'Track your referrals, conversions, and earnings in real-time with our powerful affiliate portal.' },
    { icon: <Users className="w-8 h-8 text-primary" />, title: 'Grow Your Business', description: 'Provide immense value to your clients by offering them a best-in-class AI credit repair solution.' },
];

const howItWorks = [
    { step: 1, title: 'Sign Up', description: 'Join our affiliate program in minutes and get your unique referral link.', icon: <Rocket className="w-10 h-10 text-primary" /> },
    { step: 2, title: 'Share Your Link', description: 'Promote UnlockScore AI to your audience using our library of marketing materials.', icon: <LinkIcon className="w-10 h-10 text-primary" /> },
    { step: 3, title: 'Get Paid', description: 'Earn commissions and rewards for every client who signs up through your link.', icon: <DollarSign className="w-10 h-10 text-primary" /> },
];

const testimonials = [
    {
      name: 'Mike R.',
      title: 'Affiliate Partner',
      quote: 'The affiliate dashboard is fantastic. It\'s easy to track my referrals and commissions. A great passive income stream for my coaching business.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    },
    {
      name: 'CreditUp Solutions',
      title: 'White-Label Partner',
      quote: 'Integrating UnlockScore AI under our brand was seamless. It has revolutionized our service offering and client results.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    },
     {
      name: 'Financial Freedom LLC',
      title: 'Affiliate Partner',
      quote: 'The "Refer 3, Get it Free" incentive is a game-changer. My own VIP plan is paid for by the value I bring to my network. It\'s a win-win.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
    },
];

export default function PartnersPage() {

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <LandingHeader />

      <main className="flex-1">
        <section className="py-20 sm:py-32 bg-secondary text-center">
            <div className="container">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl font-headline text-primary">
                    Refer 3, Get It Free — And More 💸
                </h1>
                <p className="max-w-3xl mx-auto mt-6 text-lg text-foreground/80">
                   Join the UnlockScore AI affiliate program and earn recurring commissions while helping people change their financial future. Provide real value, get real rewards.
                </p>
                <div className="mt-8">
                <Button size="lg" asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                    <Link href="/sign-up">Become an Affiliate Now</Link>
                </Button>
                </div>
            </div>
        </section>

        <section id="incentives" className="py-20">
            <div className="container">
                <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-4">
                {incentives.map((item, index) => (
                    <Card key={index} className="text-center border-0 shadow-none bg-transparent">
                    <CardHeader>
                        <div className="flex justify-center mb-4">{item.icon}</div>
                        <CardTitle className="font-headline">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-foreground/70">{item.description}</p>
                    </CardContent>
                    </Card>
                ))}
                </div>
            </div>
        </section>
        
        <section id="howitworks" className="py-20 bg-secondary">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl font-headline text-primary">How It Works</h2>
            </div>
             <div className="relative mt-12">
                 <div className="absolute left-1/2 top-10 hidden h-1/2 w-px -translate-x-1/2 border-l-2 border-dashed border-gray-300 md:block lg:h-2/3 lg:w-0 lg:border-t-2 lg:left-1/4 lg:top-1/2 lg:h-0 lg:w-1/2"></div>
                <div className="grid gap-12 md:grid-cols-3">
                     {howItWorks.map((step) => (
                         <div key={step.step} className="text-center relative">
                             <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-md">
                                 {step.icon}
                             </div>
                             <h3 className="text-xl font-bold font-headline">{step.title}</h3>
                             <p className="text-muted-foreground">{step.description}</p>
                         </div>
                     ))}
                 </div>
             </div>
          </div>
        </section>

         <section id="testimonials" className="py-20">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl font-headline text-primary">Join a Community of Successful Partners</h2>
              <p className="max-w-2xl mx-auto mt-4 text-foreground/70">
                Our partners are seeing incredible results for their clients and their bottom line.
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

        <section id="whitelabel" className="py-20 bg-secondary">
          <div className="container">
            <Card className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                         <h2 className="text-3xl font-bold sm:text-4xl font-headline text-primary">White-Label & Enterprise</h2>
                          <p className="mt-4 text-foreground/70 mb-6">
                            For established credit repair companies who want to use our software under their own brand. Get dedicated infrastructure, full control over pricing, and priority support.
                          </p>
                          <div className="flex gap-4">
                            <Button size="lg" asChild>
                                <Link href="/sign-up">Contact Sales</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/#pricing">View Consumer Plans</Link>
                            </Button>
                          </div>
                    </div>
                     <div className="hidden md:block">
                        <Image src="https://placehold.co/600x400.png" alt="White-label dashboard" width={600} height={400} className="object-cover h-full w-full" data-ai-hint="dashboard software" />
                    </div>
                </div>
            </Card>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
