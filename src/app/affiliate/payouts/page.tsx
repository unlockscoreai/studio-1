import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export default function PayoutsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Payouts
          </CardTitle>
          <CardDescription>
            This is a placeholder page for affiliate payouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Payout history and settings will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
