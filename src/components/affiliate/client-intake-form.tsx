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
import { Loader2, Terminal, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const formSchema = z.object({
  clientName: z.string().min(2, "Client name is required."),
  clientEmail: z.string().email("Please enter a valid email address."),
  clientPhone: z.string().min(10, "Please enter a valid phone number."),
  clientSocialLastFour: z.string().min(4, "Last four digits of Social Security Number are required.").max(4, "Last four digits of Social Security Number must be exactly 4 digits.").regex(/^d{4}$/, "Invalid format for last four digits of Social Security Number."),
  clientAddress: z.string().min(10, "Client address is required."),
  disputeReason: z.string().min(10, "A reason for the dispute is required."),
  creditReport: z.any().refine((files) => files?.length === 1, "Credit report is required."),
  identificationDocument: z.any().refine((files) => files?.length === 1, "Identification document is required."),
  proofOfAddressDocument: z.any().refine((files) => files?.length === 1, "Proof of address document is required."),
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
  const [analysisResult, setAnalysisResult] = useState<{summary: string; actionItems: string[]} | null>(null)
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const mailInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientSocialLastFour: "",
      clientAddress: "",
      disputeReason: "",
      creditReport: undefined,
      identificationDocument: undefined,
      proofOfAddressDocument: undefined,
    },
  })
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setSubmissionResult(null)
    setGeneratedLetter("")
    setAnalysisResult(null)

    try {
        const creditReportFile = values.creditReport[0];
        const creditReportDataUri = await fileToDataUri(creditReportFile);
        
        const identificationDocumentFile = values.identificationDocument[0];
        const identificationDocumentDataUri = await fileToDataUri(identificationDocumentFile);

        const proofOfAddressDocumentFile = values.proofOfAddressDocument[0];
        const proofOfAddressDocumentDataUri = await fileToDataUri(proofOfAddressDocumentFile);


        // In a real app, you'd get the affiliate ID from the authenticated session.
        // For this prototype, we'll hardcode it.
        const affiliateId = "affiliate@example.com";

        // *** Placeholder for adding client to client management list ***
        console.log("Adding client to client management list:", { 
            name: values.clientName, 
            email: values.clientEmail, 
            phone: values.clientPhone, 
            affiliateId: affiliateId,
            onboardingComplete: false // Initial state
        });
        // In a real application, you would make an API call here to add the client to your database

        // Check if all documents are uploaded to trigger onboarding complete
        const allDocumentsUploaded = creditReportFile && identificationDocumentFile && proofOfAddressDocumentFile;
        if (allDocumentsUploaded) {
            // *** Placeholder for triggering onboarding complete ***
            console.log("All documents uploaded. Triggering onboarding complete for client:", values.clientEmail);
            // In a real application, you would update the client's status in your database
        }

        const result = await onboardClient({
            clientName: values.clientName,
            clientEmail: values.clientEmail,
            clientPhone: values.clientPhone,
            clientSocialLastFour: values.clientSocialLastFour,
            clientAddress: values.clientAddress,
            creditReportDataUri: creditReportDataUri,
            identificationDocumentDataUri: identificationDocumentDataUri,
            proofOfAddressDocumentDataUri: proofOfAddressDocumentDataUri,
            affiliateId: affiliateId,
        })

        setSubmissionResult(result);
        if (result.success) {
            if (result.generatedLetter) setGeneratedLetter(result.generatedLetter);
            if (result.analysis) setAnalysisResult(result.analysis);
            form.reset();
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
             if (idInputRef.current) {
                idInputRef.current.value = "";
            }
             if (mailInputRef.current) {
                mailInputRef.current.value = "";
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
      setAnalysisResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">New Client Intake</CardTitle>
            <CardDescription>Fill out the form below to onboard a new client and generate their initial dispute letter.</CardDescription>
        </CardHeader>
        <CardContent>
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
                name="clientSocialLastFour"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last four of Social Security Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="clientAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, Anytown, CA 91234" {...field} />
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
                        <FormLabel>Upload Client's Credit Report (PDF, DOC, Image)</FormLabel>
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
                        <CardDescription>
                            Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG.
                        </CardDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
               <FormField
                control={form.control}
                name="identificationDocument"
                render={({ field: { onChange, onBlur, name } }) => (
                    <FormItem>
                        <FormLabel>Upload Client's Identification (e.g., Driver's License) (JPG, PNG, PDF)</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept=".jpg,.png,.pdf"
                                ref={idInputRef}
                                onChange={(e) => onChange(e.target.files)}
                                onBlur={onBlur}
                                name={name}
                             />
                        </FormControl>
                         <CardDescription>
                            Accepted formats: JPG, PNG, PDF.
                        </CardDescription>
                        <FormMessage />
                    </FormItem>
                )}
                />
               <FormField
                control={form.control}
                name="proofOfAddressDocument"
                render={({ field: { onChange, onBlur, name } }) => (
                    <FormItem>
                        <FormLabel>Upload Client's Proof of Address (e.g., Utility Bill) (JPG, PNG, PDF)</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept=".jpg,.png,.pdf"
                                ref={mailInputRef}
                                onChange={(e) => onChange(e.target.files)}
                                onBlur={onBlur}
                                name={name}
                             />
                        </FormControl>
                         <CardDescription>
                            Accepted formats: JPG, PNG, PDF.
                        </CardDescription>
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
        </CardContent>
      </Card>
      {submissionResult && submissionResult.success && !generatedLetter && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>{submissionResult.message}</AlertDescription>
        </Alert>
      )}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {analysisResult && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Credit Profile Analysis
                    </CardTitle>
                    <CardDescription>AI-generated summary and action plan for the client.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-1">Summary</h4>
                        <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Action Plan</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            {analysisResult.actionItems.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        )}
        {generatedLetter && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline">Generated Dispute Letter</CardTitle>
                        <CardDescription>The client has been notified to review this.</CardDescription>
                    </div>
                   
                </CardHeader>
                <CardContent>
                    <Textarea readOnly value={generatedLetter} className="h-80 bg-secondary" />
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  )
}
