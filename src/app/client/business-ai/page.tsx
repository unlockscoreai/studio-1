'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";

export default function BusinessAiPage() {
  return (
    <Card className="text-center p-10 flex flex-col items-center">
        <div className="p-4 bg-primary/10 rounded-full mb-4">
            <Zap className="w-10 h-10 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">Unlock Your Business's Funding Potential</CardTitle>
        <CardDescription className="mt-2 mb-6 max-w-xl mx-auto">
            Transition from personal credit repair to building a business with a high Unlock Score. Our Business AI plan gives you the tools and insights to secure funding.
        </CardDescription>
        <div className="p-6 border rounded-lg bg-background w-full max-w-md text-left">
            <h4 className="font-semibold text-lg text-primary flex items-center gap-2 justify-center mb-4"><Briefcase /> Business AI Features</h4>
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <span><strong>Free Business Unlock Score™ Scan:</strong> Instantly see how lenders view your business with our AI-powered audit.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <span><strong>Interactive Business Checklist:</strong> Follow a step-by-step guide to build a rock-solid foundation for a high Unlock Score.</span>
                </li>
                <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <span><strong>"Done For You" Services:</strong> Let our AI handle vendor credit applications for you, saving you time and effort.</span>
                </li>
                 <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                    <span><strong>Growth & Funding Tracker:</strong> Monitor your progress and get matched with funding opportunities as you grow.</span>
                </li>
            </ul>
        </div>
        <Button size="lg" className="mt-6" asChild>
            <Link href="/business-intake">Upgrade to Business AI</Link>
        </Button>
    </Card>
  );
}
