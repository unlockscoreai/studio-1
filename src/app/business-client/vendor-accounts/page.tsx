
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const vendorTiers = [
  {
    tier: "Tier 1: Starter Vendor Accounts (Net-30)",
    description: "Start here. These vendors offer products on 'Net-30' terms (pay within 30 days) and report your payment history to business credit bureaus. Open and use at least 3-5 of these accounts to build your initial Paydex score.",
    vendors: [
      { name: "Uline", url: "https://www.uline.com/" },
      { name: "Grainger", url: "https://www.grainger.com/" },
      { name: "Quill", url: "https://www.quill.com/" },
      { name: "Summa Office Supplies", url: "https://summaofficesupplies.com/" },
      { name: "Crown Office Supplies", url: "https://crownofficesupplies.com/" },
    ],
  },
  {
    tier: "Tier 2: Retail & Store Credit",
    description: "Once you have an established payment history with Tier 1 vendors, move to store credit cards. These are often easier to obtain than bank credit cards.",
    vendors: [
      { name: "Home Depot Commercial", url: "https://www.homedepot.com/c/Pro_Xtra" },
      { name: "Lowe's Commercial", url: "https://www.lowes.com/l/Pro.html" },
      { name: "Staples Business", url: "https://www.staples.com/sbd/cre/programs/credit_and_financing/" },
      { name: "Amazon Business", url: "https://www.amazon.com/business" },
    ],
  },
  {
    tier: "Tier 3: Fleet & Gas Cards",
    description: "If your business has vehicle or fuel expenses, these cards are a great way to add another tradeline while managing costs.",
    vendors: [
      { name: "WEX Fleet Cards", url: "https://www.wexinc.com/" },
      { name: "Fuelman", url: "https://www.fuelman.com/" },
      { name: "Shell Small Business Card", url: "https://www.shell.us/business-customers/shell-fleet-cards.html" },
    ],
  },
  {
    tier: "Tier 4: Business Credit Cards",
    description: "These are major credit cards from banks (Visa, Mastercard, Amex). They require a stronger credit profile and are a key component of a fundable business.",
    vendors: [
      { name: "American Express Business Platinum", url: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/" },
      { name: "Chase Ink Business Preferred", url: "https://creditcards.chase.com/business-credit-cards/ink" },
      { name: "Capital One Spark Business", url: "https://www.capitalone.com/small-business/credit-cards/" },
    ],
  },
];

export default function VendorAccountsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Business Vendor Accounts
          </CardTitle>
          <CardDescription>
            Follow this tiered guide to strategically build your business credit profile. Aim to open at least 3 accounts from each tier before moving to the next.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue={vendorTiers[0].tier} className="w-full">
            {vendorTiers.map((tierData) => (
              <AccordionItem value={tierData.tier} key={tierData.tier}>
                <AccordionTrigger className="text-xl font-headline hover:no-underline">
                  {tierData.tier}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-6">{tierData.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tierData.vendors.map((vendor) => (
                        <Card key={vendor.name}>
                            <CardHeader>
                                <CardTitle className="text-lg">{vendor.name}</CardTitle>
                            </CardHeader>
                            <CardFooter>
                                <Button asChild variant="outline" className="w-full">
                                    <a href={vendor.url} target="_blank" rel="noopener noreferrer">
                                        Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                                    </a>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
