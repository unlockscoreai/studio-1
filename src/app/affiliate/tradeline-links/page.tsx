import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TradelineLinksForm } from "@/components/affiliate/tradeline-links-form";

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
          <TradelineLinksForm />
        </CardContent>
      </Card>
    </div>
  );
}
