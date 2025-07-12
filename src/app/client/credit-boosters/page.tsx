
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Info, Banknote, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const creditBoosters = [
  {
    name: "Ava",
    description: "A credit-building card and financial tool that helps you save and build credit safely without interest.",
    url: "https://www.ava.finance/",
    type: "Credit-Builder Card",
    price: "$9/month",
    limit: "Up to $2,500",
    reportsTo: ["Experian", "Equifax", "TransUnion"],
    potentialBoost: "10-50+ points",
  },
  {
    name: "Kikoff",
    description: "Offers a small line of credit that you don't spend, but builds payment history. No credit check required.",
    url: "https://kikoff.com/",
    type: "Credit-Builder Loan",
    price: "$5/month",
    limit: "$750 revolving line",
    reportsTo: ["Experian", "Equifax"],
    potentialBoost: "20-60+ points",
  },
  {
    name: "Self",
    description: "A credit-builder loan where your payments are saved in a Certificate of Deposit (CD), which you get back at the end.",
    url: "https://www.self.inc/",
    type: "Credit-Builder Loan",
    price: "Starts at $25/month",
    limit: "Varies by plan ($520+)",
    reportsTo: ["Experian", "Equifax", "TransUnion"],
    potentialBoost: "30-70+ points",
  },
  {
    name: "Boom",
    description: "Reports your rent payments to all three credit bureaus, turning your largest monthly expense into a credit-building tool.",
    url: "https://www.boompay.app/",
    type: "Rent Reporting",
    price: "$2/month + initial fee",
    limit: "Your Rent Amount",
    reportsTo: ["Experian", "Equifax", "TransUnion"],
    potentialBoost: "10-40+ points",
  },
  {
    name: "Extra",
    description: "A debit card that builds credit by reporting your everyday purchases to the credit bureaus like a credit card.",
    url: "https://extra.app/",
    type: "Credit-Building Debit Card",
    price: "Starts at $20/month",
    limit: "Based on bank balance",
    reportsTo: ["Experian", "Equifax"],
    potentialBoost: "20-50+ points",
  },
  {
    name: "Grain",
    description: "Connects to your checking account to offer a revolving line of credit based on your cash flow, not your FICO score.",
    url: "https://trygrain.com/",
    type: "Alternative Credit Line",
    price: "Interest on balance",
    limit: "Up to $1,000",
    reportsTo: ["TransUnion"],
    potentialBoost: "25-60+ points",
  },
];

export default function CreditBoostersPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Credit Boosters & Tradelines
          </CardTitle>
          <CardDescription>
            Use these third-party services to add positive payment history and tradelines to your credit report. This is one of the fastest ways to see a score increase.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {creditBoosters.map((booster) => (
            <Card key={booster.name} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{booster.name}</CardTitle>
                <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary">{booster.type}</Badge>
                    <Badge variant="outline">{booster.price}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <p className="text-muted-foreground">{booster.description}</p>
                 <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Limit:</strong> {booster.limit}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        <span><strong>Reports to:</strong> {booster.reportsTo.join(', ')}</span>
                    </div>
                </div>
                 <div className="flex items-start gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-md border border-green-200">
                    <TrendingUp className="h-4 w-4 mt-0.5 shrink-0" />
                    <span><strong>Potential Boost:</strong> {booster.potentialBoost}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="default" className="w-full">
                  <a href={booster.url} target="_blank" rel="noopener noreferrer">
                    Learn More
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </CardContent>
         <CardFooter className="flex-col items-start gap-2 rounded-lg border bg-secondary p-4 mt-6">
             <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-muted-foreground"/>
                <h3 className="font-semibold">Important Disclaimer</h3>
             </div>
            <p className="text-xs text-muted-foreground">
              UnlockScore AI is not affiliated with these third-party services. The "potential boost" is an estimate based on industry data and is not guaranteed. Results vary based on your individual credit profile and history. Please review each service's terms and conditions before signing up.
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
