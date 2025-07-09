
"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { onboardBusinessClient } from "@/ai/flows/onboard-business-client"
import type { AnalyzeBusinessCreditReportOutput } from "@/ai/flows/analyze-business-credit-report"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"
import { BusinessReportCard } from "./business-report-card"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"
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
  ein: z.string().min(9, "Please enter a valid EIN."),
  yearsInBusiness: z.string().min(1, "Years in business is required."),
  monthlyRevenue: z.string().min(2, "Monthly revenue is required."),
  businessEmail: z.string().email("Please enter a valid email address."),
  businessPhone: z.string().min(10, "Please enter a valid phone number."),
  creditReport: z.any().optional(),
  manualBusinessDetails: z.string().optional(),
}).refine(data => data.creditReport?.length === 1 || !!data.manualBusinessDetails, {
    message: "Please either upload a credit report or describe your business credit situation below.",
    path: ["creditReport"],
});

async function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
}

export function BusinessIntakeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [analysis, setAnalysis] = useState<AnalyzeBusinessCreditReportOutput | null>(null)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      ein: "",
      yearsInBusiness: "",
      monthlyRevenue: "",
      businessEmail: "",
      businessPhone: "",
      creditReport: undefined,
      manualBusinessDetails: "",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setIsSuccess(false)
    setAnalysis(null)

    try {
        const creditReportFile = values.creditReport?.[0];
        const creditReportDataUri = creditReportFile ? await fileToDataUri(creditReportFile) : undefined;
        
        const result = await onboardBusinessClient({
            ...values,
            businessCreditReportDataUri: creditReportDataUri,
        })

        if (result.success && result.analysis) {
            setIsSuccess(true);
            setAnalysis(result.analysis);
            form.reset();
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } else {
            throw new Error(result.message || "An unknown error occurred.")
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

  if (isSuccess && analysis) {
    return (
        <div className="space-y-6">
            <Alert variant="default" className="border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4 !text-green-500" />
                <AlertTitle>Analysis Complete!</AlertTitle>
                <AlertDescription>
                    Your AI-powered Business Credit Fundability Report is ready. An email with a summary has been sent to you.
                </AlertDescription>
            </Alert>
            <BusinessReportCard analysis={analysis} />
        </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl><Input placeholder="ABC Corporation" {...field} /></FormControl>
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
            name="ein"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EIN</FormLabel>
                <FormControl><Input placeholder="12-3456789" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearsInBusiness"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years in Business</FormLabel>
                <FormControl><Input type="number" placeholder="3" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="businessEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Email</FormLabel>
                <FormControl><Input type="email" placeholder="contact@abccorp.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="businessPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Phone</FormLabel>
                <FormControl><Input type="tel" placeholder="(555) 123-4567" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="creditReport"
          render={({ field: { onChange, onBlur, name } }) => (
              <FormItem>
                  <FormLabel>Upload Business Credit Report</FormLabel>
                  <FormControl>
                      <Input 
                          type="file" 
                          accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                          ref={fileInputRef}
                          onChange={(e) => onChange(e.target.files)}
                          onBlur={onBlur}
                          name={name}
                       />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )}
        />
        
        <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
        </div>
        
        <FormField
          control={form.control}
          name="manualBusinessDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No Report? Describe Your Business Credit</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., I have 2 business credit cards with Chase and Amex, both about a year old with $5k limits. No late payments. I also have a net-30 account with Uline..."
                  className="h-28"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide as much detail as you can about your existing business credit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...</>
          ) : "Get My Fundability Report"}
        </Button>
      </form>
    </Form>
  )
}
