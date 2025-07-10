import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

const reportSources = [
  {
    name: "Nav",
    description: "Access and monitor business credit reports from major bureaus like Dun & Bradstreet, Experian, and Equifax. Offers both free and paid plans.",
    url: "https://www.nav.com/",
    logo: "nav_logo.png" // placeholder
  },
  {
    name: "Dun & Bradstreet",
    description: "Get your D-U-N-S Number and access your PAYDEX score. D&B is one of the most important business credit bureaus for suppliers and lenders.",
    url: "https://www.dnb.com/",
    logo: "dnb_logo.png"
  },
  {
    name: "Experian Business",
    description: "Provides business credit scores (Intelliscore Plus) and detailed reports on your company's payment history and public records.",
    url: "https://www.experian.com/small-business/business-credit-reports",
    logo: "experian_logo.png"
  },
  {
    name: "Equifax Business",
    description: "Offers business credit monitoring and reports to help you manage your company's financial health and prepare for funding applications.",
    url: "https://www.equifax.com/business/",
    logo: "equifax_logo.png"
  }
];

export default function GetBusinessReportsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Get Your Business Credit Reports
          </CardTitle>
          <CardDescription>
            To build strong business credit, you need to know where you stand. Use these resources to obtain your reports from the major business credit bureaus.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {reportSources.map((source) => (
            <Card key={source.name}>
              <CardHeader>
                <CardTitle>{source.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground flex-grow">{source.description}</p>
                 <Button asChild variant="outline">
                    <a href={source.url} target="_blank" rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
