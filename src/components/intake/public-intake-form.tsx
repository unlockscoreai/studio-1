
"use client"

import { useState, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
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
import { Loader2, Terminal, CheckCircle } from "lucide-react"

const formSchema = z.object({
  clientName: z.string().min(2, "Your name is required."),
  clientEmail: z.string().email("Please enter a valid email address."),
  clientPhone: z.string().min(10, "Please enter a valid phone number."),
  disputeReason: z.string().min(10, "A reason for the dispute is required."),
  creditReport: z.any().refine((files) => files?.length === 1, "Your credit report is required."),
})

async function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
}

function PublicIntakeFormComponent() {
  const searchParams = useSearchParams()
  const affiliateId = searchParams.get("affiliate_id") || "none"
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false);
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
    setIsSuccess(false)

    try {
        const creditReportFile = values.creditReport[0];
        const creditReportDataUri = await fileToDataUri(creditReportFile);
        
        const result = await onboardClient({
            clientName: values.clientName,
            clientEmail: values.clientEmail,
            clientPhone: values.clientPhone,
            disputeReason: values.disputeReason,
            creditReportDataUri: creditReportDataUri,
            affiliateId: affiliateId,
        })

        if (result.success) {
            setIsSuccess(true);
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
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
        <Alert variant="default" className="border-green-500 text-green-700">
            <CheckCircle className="h-4 w-4 !text-green-500" />
            <AlertTitle>Thank You for Your Submission!</AlertTitle>
            <AlertDescription>
                Your information has been received. Please check your email for instructions to log into our secure client portal and retrieve your free credit analysis.
            </AlertDescription>
        </Alert>
    )
  }


  return (
    <div className="space-y-6">
      {affiliateId && affiliateId !== "none" && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Welcome!</AlertTitle>
          <AlertDescription>
            You were referred by: <span className="font-semibold">{affiliateId}</span>
          </AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
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
                <FormLabel>Your Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
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
                <FormLabel>Your Phone Number</FormLabel>
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
                <FormLabel>Primary Reason for Dispute</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'An incorrect late payment was reported on my account in May 2024.'"
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
                    <FormLabel>Upload Your Credit Report</FormLabel>
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
            Submit & Get My Free Analysis
          </Button>
        </form>
      </Form>
    </div>
  )
}


export function PublicIntakeForm() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PublicIntakeFormComponent />
        </Suspense>
    )
}
