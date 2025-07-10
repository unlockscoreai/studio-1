
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { predictFundingApproval } from "@/ai/flows/predict-funding-approval"
import type { PredictFundingApprovalOutput } from "@/ai/flows/predict-funding-approval"
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
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles, Target, Banknote, Percent, FileText, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "../ui/progress"
import { Separator } from "../ui/separator"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

const formSchema = z.object({
    businessName: z.string().min(2, "Business name is required."),
    yearsInBusiness: z.coerce.number().min(0, "Years in business cannot be negative."),
    monthlyRevenue: z.coerce.number().min(0, "Monthly revenue cannot be negative."),
    industry: z.string().min(2, "Industry is required."),
    personalCreditScore: z.coerce.number().min(300, "Invalid score.").max(850, "Invalid score."),
    businessCreditScore: z.coerce.number().min(0, "Invalid score.").max(100, "Invalid score."),
});

export function FundingPredictionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictFundingApprovalOutput | null>(null)
  const { toast } = useToast()

  // Pre-fill with mock data. In a real app, this would be fetched from the user's profile.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "Volunteer Express Logistics LLC",
      yearsInBusiness: 3,
      monthlyRevenue: 75000,
      industry: "Logistics and Trucking",
      personalCreditScore: 750,
      businessCreditScore: 82,
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await predictFundingApproval(values);

      if (response.predictions && response.predictions.length > 0) {
        setResult(response);
      } else {
        throw new Error("The AI failed to return a valid prediction. Please try again.")
      }
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <FormControl><Input placeholder="e.g., Retail, Software" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <FormField
                    control={form.control}
                    name="yearsInBusiness"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Years in Business</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="monthlyRevenue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Avg. Monthly Revenue</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 10000" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="personalCreditScore"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Personal FICO Score</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="businessCreditScore"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Score (0-100)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
          
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Predicting...</>
            ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Predict My Funding Approval</>
            )}
          </Button>
        </form>
      </Form>
      
      {result && (
        <div className="space-y-6 pt-8">
            <Separator />
            <div className="text-center">
                <h3 className="text-2xl font-headline font-bold">Funding Prediction Results</h3>
                <p className="text-muted-foreground">Based on the information you provided, here are your potential funding options.</p>
            </div>
             <div className="grid md:grid-cols-2 gap-6">
                {result.predictions.map((prediction, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Target /> {prediction.product}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground flex items-center gap-1.5"><Banknote className="w-4 h-4" /> Amount</span>
                                <span className="font-semibold">{prediction.amountRange}</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1.5"><Percent className="w-4 h-4" /> Approval Likelihood</span>
                                    <span className="font-semibold">{prediction.approvalLikelihood}%</span>
                                </div>
                                <Progress value={prediction.approvalLikelihood} />
                            </div>
                            <p className="text-sm text-muted-foreground pt-2"><strong className="text-foreground">Reasoning:</strong> {prediction.reasoning}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>Overall Summary</AlertTitle>
                <AlertDescription>{result.overallSummary}</AlertDescription>
            </Alert>
            <Card className="text-center bg-secondary p-4 rounded-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center justify-center gap-2"><Calendar className="w-6 h-6 text-primary"/> Discuss Your Funding Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground max-w-2xl mx-auto">Ready to take the next step? Our funding experts can help you navigate these options and create a tailored strategy for your business.</p>
                    <Button asChild>
                        <Link href="/business-client/book-consultation">
                            Book a Funding Consultation
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  )
}
