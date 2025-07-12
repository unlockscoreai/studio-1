"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { generateTradelineStrategy } from "@/ai/flows/generate-tradeline-strategy"
import type { GenerateTradelineStrategyOutput } from "@/ai/flows/generate-tradeline-strategy"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles, Wand2, CreditCard, Car, ShoppingCart, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Input } from "../ui/input"

const formSchema = z.object({
  creditAnalysis: z.string().min(20, "Please provide a brief summary of your credit profile."),
  creditGoal: z.string().optional(),
  hasAutoLoan: z.enum(["true", "false"], { required_error: "Please select an option." }),
  hasPrimaryRevolving: z.enum(["true", "false"], { required_error: "Please select an option." }),
})

export function TradelineStrategyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [strategy, setStrategy] = useState<GenerateTradelineStrategyOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creditAnalysis: "My FICO is 680 with 42% utilization. I have no late payments but only 2 years of credit history and no installment loans. I have a few authorized user accounts but no primary credit card with a high limit.",
      creditGoal: "Qualify for a mortgage in the next 12 months.",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setStrategy(null)
    try {
      const result = await generateTradelineStrategy({
        creditAnalysis: values.creditAnalysis,
        creditGoal: values.creditGoal,
        hasAutoLoan: values.hasAutoLoan === "true",
        hasPrimaryRevolving: values.hasPrimaryRevolving === "true",
      })
      if (result) {
        setStrategy(result)
      } else {
        throw new Error("Failed to generate a strategy.")
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate a strategy. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="creditAnalysis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Credit Profile Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., My FICO is 650 with high utilization. No late payments, but only a couple of low-limit cards..."
                    className="h-24"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief summary of your credit situation for the most accurate recommendations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Credit Goal (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Get a business loan, qualify for a mortgage" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="hasPrimaryRevolving"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Do you have a primary credit card with a limit over $5,000?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="true" /></FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="false" /></FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasAutoLoan"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Do you have an auto loan (open or closed) on your credit report?</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="true" /></FormControl>
                        <FormLabel className="font-normal">Yes</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="false" /></FormControl>
                        <FormLabel className="font-normal">No</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Wand2 className="mr-2 h-4 w-4" />
            Generate My Tradeline Strategy
          </Button>
        </form>
      </Form>

      {strategy && (
        <Card className="mt-8 bg-secondary">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Your AI-Powered Tradeline Recommendations
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>AI Analysis</AlertTitle>
                  <AlertDescription>
                    {strategy.introductoryMessage}
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-6">
                  {strategy.revolvingTradeline ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary"><CreditCard/>Revolving Tradeline</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p><strong>Limit:</strong> ${strategy.revolvingTradeline.limit.toLocaleString()}</p>
                        <p><strong>Age:</strong> {strategy.revolvingTradeline.ageInMonths} months</p>
                        <p className="font-bold text-lg mt-2">Cost: ${strategy.revolvingTradeline.cost.toLocaleString()}</p>
                        <Button className="w-full mt-4"><ShoppingCart className="mr-2 h-4 w-4" /> Purchase Tradeline</Button>
                      </CardContent>
                    </Card>
                  ) : (
                     <Card className="flex flex-col items-center justify-center p-6 text-center bg-background">
                        <CheckCircle className="w-10 h-10 text-green-500 mb-2"/>
                        <p className="font-semibold">Revolving Credit looks good!</p>
                        <p className="text-sm text-muted-foreground">Our AI did not detect a need for a new primary revolving tradeline.</p>
                    </Card>
                  )}

                   {strategy.autoTradeline ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary"><Car/>Auto Tradeline</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p><strong>Amount:</strong> ${strategy.autoTradeline.limit.toLocaleString()}</p>
                        <p><strong>Age:</strong> {strategy.autoTradeline.ageInMonths} months</p>
                        <p className="font-bold text-lg mt-2">Cost: ${strategy.autoTradeline.cost.toLocaleString()}</p>
                        <Button className="w-full mt-4"><ShoppingCart className="mr-2 h-4 w-4" /> Purchase Tradeline</Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="flex flex-col items-center justify-center p-6 text-center bg-background">
                        <CheckCircle className="w-10 h-10 text-green-500 mb-2"/>
                        <p className="font-semibold">Auto Credit looks good!</p>
                        <p className="text-sm text-muted-foreground">Our AI did not detect a need for a new auto loan tradeline.</p>
                    </Card>
                  )}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  )
}
