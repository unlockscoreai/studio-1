"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { onboardClient } from "@/ai/flows/onboard-client"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Terminal, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const formSchema = z.object({
  clientName: z.string().min(2, "Client name is required."),
  clientEmail: z.string().email("Please enter a valid email address."),
  clientPhone: z.string().min(10, "Please enter a valid phone number."),
  disputeReason: z.string().min(10, "A reason for the dispute is required."),
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

export function ClientIntakeForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<{success: boolean, message: string} | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      disputeReason: "",
      creditReport: undefined,
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setSubmissionResult(null)
    setGeneratedLetter("")

    try {
        const creditReportFile = values.creditReport[0];
        const creditReportDataUri = await fileToDataUri(creditReportFile);
        
        // In a real app, you'd get the affiliate ID from the authenticated session.
        // For this prototype, we'll hardcode it.
        const affiliateId = "affiliate@example.com";

        const result = await onboardClient({
            clientName: values.clientName,
            clientEmail: values.clientEmail,
            clientPhone: values.clientPhone,
            disputeReason: values.disputeReason,
            creditReportDataUri: creditReportDataUri,
            affiliateId: affiliateId,
        })

        setSubmissionResult(result);
        if (result.success && result.generatedLetter) {
            setGeneratedLetter(result.generatedLetter);
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
        title: "Submission Failed",
        description: errorMessage,
      })
      setGeneratedLetter("");
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter)
    setHasCopied(true)
    toast({
        title: "Copied to clipboard!",
    });
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="client@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="clientPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(555) 555-5555" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="disputeReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reason for Dispute</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Incorrect late payment reported for my credit card account in May 2024.'"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditReport"
            render={({ field: { onChange, onBlur, name } }) => (
                <FormItem>
                    <FormLabel>Upload Client's Credit Report</FormLabel>
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

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Client & Generate Letter
          </Button>
        </form>
      </Form>
      {submissionResult && submissionResult.success && !generatedLetter && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>{submissionResult.message}</AlertDescription>
        </Alert>
      )}
      {generatedLetter && (
        <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="font-headline">Generated Dispute Letter</CardTitle>
                    <CardDescription>The client has been notified to review and complete onboarding.</CardDescription>
                </div>
                <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy letter text">
                    {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent>
                <Textarea readOnly value={generatedLetter} className="h-96 bg-secondary" />
            </CardContent>
        </Card>
      )}
    </div>
  )
}
