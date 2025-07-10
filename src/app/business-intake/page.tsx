
import { BusinessIntakeForm } from "@/components/business/business-intake-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

function BusinessIntakePageContent() {
    return (
        <Card className="w-full max-w-3xl mx-auto my-8">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-3xl">Get Your Free Business Fundability Scan</CardTitle>
                <CardDescription className="text-lg">
                See how fundable your business is in minutes. Our AI analyzes your public records to give you a roadmap to success.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <BusinessIntakeForm />
            </CardContent>
        </Card>
    );
}


export default function BusinessIntakePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BusinessIntakePageContent />
    </Suspense>
  )
}
