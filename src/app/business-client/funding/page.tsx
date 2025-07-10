import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FundingPredictionForm } from "@/components/business/funding-prediction-form";
import { DollarSign } from "lucide-react";

export default function FundingPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            AI Funding Pre-Approval Engine
          </CardTitle>
          <CardDescription>
            Fill in your business details below to get an AI-powered prediction of your funding potential. This tool simulates what lenders look for to give you a realistic outlook.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FundingPredictionForm />
        </CardContent>
      </Card>
    </div>
  );
}
