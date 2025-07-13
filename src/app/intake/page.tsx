import { PublicIntakeForm } from "@/components/intake/public-intake-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Suspense } from "react";

function PublicIntakePageContent() {
    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Welcome to UnlockScore AI</CardTitle>
                <CardDescription>
                Please enter your information below to get started on your credit journey.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <PublicIntakeForm />
            </CardContent>
        </Card>
    );
}

export default function PublicIntakePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PublicIntakePageContent />
    </Suspense>
  )
}
