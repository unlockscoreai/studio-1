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

const formSchema = z.object({
  businessName: z.string().min(2, "Business name is required."),
  ein: z.string().min(9, "Please enter a valid EIN."),
  yearsInBusiness: z.string().min(1, "Years in business is required."),
  monthlyRevenue: z.string().min(2, "Monthly revenue is required."),
  businessEmail: z.string().email("Please enter a valid email address."),
  businessPhone: z.string().min(10, "Please enter a valid phone number."),
  creditReport: z.any().refine((files) => files?.length === 1, "Credit report is required."),
})

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
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setIsSuccess(false)
    setAnalysis(null)

    try {
        const creditReportFile = values.creditReport[0];
        const creditReportDataUri = await fileToDataUri(creditReportFile);
        
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
            name="monthlyRevenue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Revenue</FormLabel>
                <FormControl><Input placeholder="$15,000" {...field} /></FormControl>
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
        <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
          {isLoading ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Report...</>
          ) : "Get My Fundability Report"}
        </Button>
      </form>
    </Form>
  )
}
