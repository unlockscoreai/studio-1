import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenerateLetterForm } from "@/components/dashboard/generate-letter-form"
import { ImproveLetterForm } from "@/components/dashboard/improve-letter-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate New Letter</TabsTrigger>
          <TabsTrigger value="improve">Improve Existing Letter</TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Generate Dispute Letter</CardTitle>
              <CardDescription>
                Fill out the details below and our AI will craft a professional dispute letter for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenerateLetterForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="improve">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Improve Your Letter</CardTitle>
              <CardDescription>
                Paste your existing letter and our AI will analyze and enhance it for maximum effectiveness.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImproveLetterForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
