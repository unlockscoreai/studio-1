import { BusinessIntakeForm } from "@/components/business/business-intake-form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function BusinessIntakePage() {
  return (
    <Card className="w-full max-w-3xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Business Credit Analysis</CardTitle>
        <CardDescription>
          Enter your business information below to receive your AI-powered fundability report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BusinessIntakeForm />
      </CardContent>
    </Card>
  )
}
