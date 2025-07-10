
"use client"

import { useState, useRef, useEffect } from "react"
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
import { Loader2, CheckCircle, Terminal } from "lucide-react"
import { BusinessReportCard } from "./business-report-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "../ui/textarea"
import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"


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
  businessAddress: z.object({ label: z.string(), value: z.any() }).optional(),
  ein: z.string().optional(),
  businessPhone: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  monthlyRevenue: z.string().optional(),
  creditReport: z.any().optional(),
  manualBusinessDetails: z.string().optional(),
}).refine(data => data.creditReport?.length > 0 || data.manualBusinessDetails, {
    message: "Either a credit report or a manual description is required.",
    path: ["manualBusinessDetails"],
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
  const [analysis, setAnalysis] = useState<AnalyzeBusinessCreditReportOutput | null>(null)
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams();
  const affiliateId = searchParams.get('affiliate_id');

  const hasApiKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    setIsClient(true)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "Volunteer Express Logistics LLC",
      state: "TN",
      ownerEmail: "contact@volunteerexpress.com",
      businessAddress: undefined,
      ein: "98-7654321",
      businessPhone: "(615) 555-1234",
      yearsInBusiness: "3",
      monthlyRevenue: "75000",
      creditReport: undefined,
      manualBusinessDetails: "Primary business is regional freight shipping. We have two vehicle loans and are looking to expand our fleet. We have accounts with major fuel card providers and are seeking a line of credit for operational expenses.",
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setAnalysis(null)

    try {
      let creditReportDataUri: string | undefined;
      if (values.creditReport && values.creditReport[0]) {
        creditReportDataUri = await fileToDataUri(values.creditReport[0]);
      }
      
      const result = await onboardBusinessClient({
          businessName: values.businessName,
          state: values.state,
          businessEmail: values.ownerEmail,
          businessAddress: values.businessAddress?.label,
          ein: values.ein,
          businessPhone: values.businessPhone,
          yearsInBusiness: values.yearsInBusiness,
          monthlyRevenue: values.monthlyRevenue,
          businessCreditReportDataUri: creditReportDataUri,
          manualBusinessDetails: values.manualBusinessDetails,
          affiliateId: affiliateId || undefined,
      })

      if (result.success && result.analysis) {
          setAnalysis(result.analysis);
          // In a real app, you would also now save the lead's email (values.ownerEmail)
          // and associate it with the generated report.
      } else {
          throw new Error(result.message || "Analysis failed to return a result.")
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
        {affiliateId && (
            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Affiliate Referral</AlertTitle>
                <AlertDescription>
                    You have been referred by: <span className="font-semibold">{affiliateId}</span>
                </AlertDescription>
            </Alert>
        )}
        <div className="grid md:grid-cols-2 gap-6">
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
        </div>

        <FormField
          control={form.control}
          name="businessAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Address</FormLabel>
              <FormControl>
                {isClient && hasApiKey ? (
                  <GooglePlacesAutocomplete
                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                      selectProps={{
                          ...field,
                          placeholder: 'Start typing your business address...',
                          styles: {
                            input: (base) => ({
                              ...base,
                              paddingLeft: '0.75rem',
                              paddingRight: '0.75rem',
                            }),
                            control: (base) => ({
                              ...base,
                              borderColor: 'hsl(var(--input))',
                              borderRadius: 'var(--radius)',
                              minHeight: '2.5rem',
                              boxShadow: 'none',
                              '&:hover': {
                                borderColor: 'hsl(var(--input))',
                              }
                            })
                          }
                      }}
                  />
                ) : (
                  <Input
                    placeholder="Enter full business address"
                    value={field.value?.label || ''}
                    onChange={(e) => field.onChange({ label: e.target.value, value: e.target.value })}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={!isClient}
                  />
                )}
              </FormControl>
              <FormDescription>
                {hasApiKey ? "As you type, Google will suggest addresses." : "To enable address autocompletion, please add a Google Maps API key."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />


        <div className="grid md:grid-cols-2 gap-6">
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
            <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Business Phone (Optional)</FormLabel>
                    <FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="yearsInBusiness"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Years in Business (Optional)</FormLabel>
                    <FormControl><Input placeholder="3" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="monthlyRevenue"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Avg. Monthly Revenue (Optional)</FormLabel>
                    <FormControl><Input placeholder="$10,000" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="ein"
            render={({ field }) => (
                <FormItem>
                <FormLabel>EIN (Optional)</FormLabel>
                <FormControl><Input placeholder="12-3456789" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="creditReport"
            render={({ field: { onChange, onBlur, name, ref } }) => (
              <FormItem>
                <FormLabel>Upload Business Credit Report (Optional)</FormLabel>
                <FormControl>
                  <Input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e => onChange(e.target.files)} ref={ref} />
                </FormControl>
                <FormDescription>Upload a D&B, Experian, or Equifax business report for the most accurate analysis.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manualBusinessDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Or, Describe Your Business's Credit (if no report)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your tradelines, payment history, etc." {...field} />
                </FormControl>
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
