
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TradelineLinksTable } from "@/components/affiliate/tradeline-links-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { creditBoosterVendors, businessVendorTiers } from "@/lib/vendor-data";

export default function TradelineLinksPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Manage Tradeline Referral Links</CardTitle>
          <CardDescription>
            Add your personal affiliate links for these tradeline vendors. These links will be shared with your referred clients to help them build their credit.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="boosters" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="boosters">Credit Boosters</TabsTrigger>
                    <TabsTrigger value="business">Business Tradelines</TabsTrigger>
                </TabsList>
                <TabsContent value="boosters" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Credit Booster Services</CardTitle>
                            <CardDescription>Popular services that help clients build credit through rent reporting, credit-builder loans, etc.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <TradelineLinksTable vendors={creditBoosterVendors} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="business" className="mt-4 space-y-6">
                    {businessVendorTiers.map((tier) => (
                        <Card key={tier.tier}>
                            <CardHeader>
                                <CardTitle>{tier.tier}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TradelineLinksTable vendors={tier.vendors} />
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
