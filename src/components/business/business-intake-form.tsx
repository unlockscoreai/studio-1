
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { analyzeBusinessCreditReport } from "@/ai/flows/analyze-business-credit-report"
import type { AnalyzeBusinessCreditReportOutput } from "@/ai/flows/analyze-business-credit-report"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle } from "lucide-react"
import { BusinessReportCard } from "./business-report-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];


const formSchema = z.object({
  businessName: z.string().min(2, "Business name is required."),
  state: z.string({ required_error: "Please select a state."}),
  ownerEmail: z.string().email("Please enter a valid email address for where to send the report."),
});

export function BusinessIntakeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [analysis, setAnalysis] = useState<AnalyzeBusinessCreditReportOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      ownerEmail: "",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setAnalysis(null)

    try {
      // For a lead magnet, we are not using the uploaded report. 
      // The AI flow is designed to handle this case and rely on public data.
      const result = await analyzeBusinessCreditReport({
          businessName: values.businessName,
          state: values.state,
      })

      if (result) {
          setAnalysis(result);
          // In a real app, you would also now save the lead's email (values.ownerEmail)
          // and associate it with the generated report.
      } else {
          throw new Error("Analysis failed to return a result.")
      }
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (analysis) {
    return (
        <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">Analysis Complete!</h3>
              <p className="text-muted-foreground">Here is the fundability report for {form.getValues('businessName')}.</p>
            </div>
            <BusinessReportCard analysis={analysis} />
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Business Name</FormLabel>
              <FormControl><Input placeholder="Acme Corporation" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State of Registration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="ownerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Email Address</FormLabel>
                <FormControl><Input type="email" placeholder="you@company.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
          ) : "Run Free Scan"}
        </Button>
      </form>
    </Form>
  )
}
