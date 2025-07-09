import { ClientIntakeForm } from "@/components/affiliate/client-intake-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function AffiliateDashboardPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Client Intake Form</CardTitle>
          <CardDescription>
            Enter your new client's information below to get them started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClientIntakeForm />
        </CardContent>
      </Card>
    </div>
  )
}
