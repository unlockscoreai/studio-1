
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { generateAndSendVendorApplication } from "@/ai/flows/generate-vendor-application"
import type { GenerateAndSendVendorApplicationOutput } from "@/ai/flows/generate-vendor-application"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"
import { Loader2, Send, Wand2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"

const vendors = [
  { id: 'uline', name: 'Uline' },
  { id: 'grainger', name: 'Grainger' },
  { id: 'quill', name: 'Quill' },
  { id: 'crown', name: 'Crown Office Supplies' },
  { id: 'summa', name: 'Summa Office Supplies' },
];

const formSchema = z.object({
  vendor: z.string({ required_error: "Please select a vendor."}),
})

// This is mock data. In a real app, this would be fetched for the authenticated business user.
const mockBusinessDetails = {
    businessName: 'Volunteer Express Logistics LLC',
    ownerName: 'Sarah Lee',
    email: 'contact@volunteerexpress.com',
    phone: '(615) 555-1234',
    ein: '98-7654321',
    billingAddress: '800 S GAY ST, SUITE 2102, KNOXVILLE, TN, 37929',
    state: 'TN',
    entityType: 'LLC',
    duns: '123456789',
};


export function VendorApplicationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GenerateAndSendVendorApplicationOutput | null>(null)
  const [step, setStep] = useState<'form' | 'preview' | 'sent'>('form');
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  
  async function handleGeneratePreview(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await generateAndSendVendorApplication({
        businessDetails: mockBusinessDetails,
        vendorName: vendors.find(v => v.id === values.vendor)?.name || values.vendor,
      });

      if (response.success && response.applicationText) {
        setResult(response);
        setStep('preview');
      } else {
        throw new Error(response.message || "An unknown error occurred.")
      }
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSendApplication() {
    setIsLoading(true);
    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStep('sent');
    setIsLoading(false);
    toast({
        title: "Application Sent!",
        description: result?.message,
    });
  }

  function handleReset() {
    form.reset();
    setResult(null);
    setStep('form');
  }

  if (step === 'sent') {
    return (
        <div className="space-y-4">
            <Alert variant="default" className="border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4 !text-green-500" />
                <AlertTitle>Application Sent Successfully!</AlertTitle>
                <AlertDescription>
                    {result?.message}
                </AlertDescription>
            </Alert>
            <Button onClick={handleReset}>Start New Application</Button>
        </div>
    )
  }

  if (step === 'preview' && result) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Generated Application Preview</Label>
                <Textarea readOnly value={result.applicationText} className="h-80 bg-muted" />
            </div>
             <div className="flex gap-2">
                <Button onClick={handleSendApplication} disabled={isLoading}>
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                        <><Send className="mr-2 h-4 w-4" /> Send Application</>
                    )}
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={isLoading}>
                    Cancel
                </Button>
            </div>
        </div>
    )
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleGeneratePreview)} className="space-y-6 max-w-lg">
          <FormField
            control={form.control}
            name="vendor"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Select a Vendor</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a vendor to apply to..." />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormDescription>We will use your saved business profile information for the application.</FormDescription>
                <FormMessage />
                </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
            ) : (
                <><Wand2 className="mr-2 h-4 w-4" /> Generate Preview</>
            )}
          </Button>
        </form>
      </Form>
  )
}
