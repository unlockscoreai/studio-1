
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Star, Building, CalendarDays, DollarSign, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const vendorTiers = [
  {
    tier: "Tier 1: Starter Vendor Accounts",
    description: "Start here. These vendors offer products on 'Net-30' or similar terms and are known to report to business credit bureaus. Aim to open and use at least 3-5 of these accounts to build your initial Paydex score.",
    vendors: [
      { name: "Uline", url: "https://www.uline.com/", type: "Shipping & Office Supplies", net: "Net-30", limit: "Varies", qualifications: "EIN, Business Address", easyApproval: true },
      { name: "Grainger", url: "https://www.grainger.com/", type: "Industrial Supplies", net: "Net-30", limit: "$1,000+", qualifications: "EIN, may require initial purchase", easyApproval: false },
      { name: "Quill", url: "https://www.quill.com/", type: "Office Supplies", net: "Net-30", limit: "$500 - $2,000", qualifications: "Business entity, EIN", easyApproval: true },
      { name: "Summa Office Supplies", url: "https://summaofficesupplies.com/", type: "Office Supplies", net: "Net-30", limit: "Up to $2,000", qualifications: "30+ days in business", easyApproval: true },
      { name: "Crown Office Supplies", url: "https://crownofficesupplies.com/", type: "Office Supplies", net: "Net-30", limit: "Up to $1,500", qualifications: "90+ days in business, EIN", easyApproval: true },
    ],
  },
  {
    tier: "Tier 2: Retail & Store Credit",
    description: "Once you have an established payment history with Tier 1 vendors, move to store credit cards. These are often easier to obtain than bank credit cards and add more weight to your credit profile.",
    vendors: [
      { name: "Home Depot Commercial", url: "https://www.homedepot.com/c/Pro_Xtra", type: "Retail", net: "Net-30/60", limit: "Varies", qualifications: "EIN, 6+ months in business", easyApproval: false },
      { name: "Lowe's Commercial", url: "https://www.lowes.com/l/Pro.html", type: "Retail", net: "Net-30", limit: "Varies", qualifications: "EIN, good personal credit helps", easyApproval: false },
      { name: "Staples Business", url: "https://www.staples.com/sbd/cre/programs/credit_and_financing/", type: "Retail", net: "Revolving", limit: "$1,000+", qualifications: "EIN, some history preferred", easyApproval: false },
      { name: "Amazon Business", url: "https://www.amazon.com/business", type: "Online Retail", net: "Net-30/55", limit: "Varies", qualifications: "EIN, active Amazon account", easyApproval: true },
    ],
  },
  {
    tier: "Tier 3: Fleet & Gas Cards",
    description: "If your business has vehicle or fuel expenses, these cards are a great way to add another tradeline while managing costs. They often have easier approval requirements than major credit cards.",
    vendors: [
      { name: "WEX Fleet Cards", url: "https://www.wexinc.com/", type: "Fleet/Fuel", net: "Net-15/30", limit: "Varies", qualifications: "EIN, 6+ months in business", easyApproval: true },
      { name: "Fuelman", url: "https://www.fuelman.com/", type: "Fleet/Fuel", net: "Net-15/30", limit: "Varies", qualifications: "EIN, active business", easyApproval: true },
      { name: "Shell Small Business Card", url: "https://www.shell.us/business-customers/shell-fleet-cards.html", type: "Fleet/Fuel", net: "Revolving", limit: "$500+", qualifications: "EIN, fair personal credit", easyApproval: false },
    ],
  },
  {
    tier: "Tier 4: Business Credit Cards",
    description: "These are major credit cards from banks (Visa, Mastercard, Amex). They require a stronger credit profile and good personal credit, and are a key component of a truly fundable business.",
    vendors: [
      { name: "Amex Business Platinum", url: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/", type: "Charge Card", net: "Net-30", limit: "No Pre-set Limit", qualifications: "Strong personal credit (700+)", easyApproval: false },
      { name: "Chase Ink Business", url: "https://creditcards.chase.com/business-credit-cards/ink", type: "Credit Card", net: "Revolving", limit: "$5,000+", qualifications: "Good personal credit (680+)", easyApproval: false },
      { name: "Capital One Spark", url: "https://www.capitalone.com/small-business/credit-cards/", type: "Credit Card", net: "Revolving", limit: "$2,000+", qualifications: "Good personal credit (670+)", easyApproval: false },
    ],
  },
];

const InfoPill = ({ icon: Icon, text }: { icon: React.ElementType, text: string }) => (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        <span>{text}</span>
    </div>
);

export default function VendorAccountsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Business Vendor Directory
          </CardTitle>
          <CardDescription>
            Follow this tiered guide to strategically build your business credit profile. Aim to open at least 3-5 accounts from each tier before moving to the next for the best results.
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
                        <Card key={vendor.name} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                                    {vendor.easyApproval && (
                                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                            <Star className="h-4 w-4 mr-1.5 text-yellow-600" />
                                            Easy Approval
                                        </Badge>
                                    )}
                                </div>
                                 <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                                    <InfoPill icon={Building} text={vendor.type} />
                                    <InfoPill icon={DollarSign} text={vendor.limit} />
                                    <InfoPill icon={CalendarDays} text={vendor.net} />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <h4 className="font-semibold text-sm mb-1">Qualifications</h4>
                                <p className="text-sm text-muted-foreground">{vendor.qualifications}</p>
                            </CardContent>
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
