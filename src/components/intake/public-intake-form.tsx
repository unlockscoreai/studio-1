
"use client"

import { v4 as uuidv4 } from 'uuid';
import { useState, useRef, Suspense } from "react"
import Link from "next/link";
import { createClient, saveAnalysis, findClientByEmail } from "@/services/firestore";
import { useRouter } from 'next/navigation';
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { onboardClient, type OnboardClientOutput } from "@/ai/flows/onboard-client"
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
import { Loader2, Terminal, CheckCircle, ShieldAlert } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Progress } from "../ui/progress"

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
  const [analysisResult, setAnalysisResult] = useState<OnboardClientOutput['analysis'] | null>(null);
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

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
    setAnalysisResult(null);
    let clientId;

    try {
        const creditReportFile = values.creditReport[0];
        const creditReportDataUri = await fileToDataUri(creditReportFile);
        
        const existingClient = await findClientByEmail(values.clientEmail);

        if (existingClient) {
 clientId = existingClient.id;
 // Assuming you have an updateClient function to add 'personalScan' if not present
            // Assuming you have an updateClient function to add 'personalScan' if not present
 // This part is not yet implemented in firestore.ts, will need to add it later
 // if (!existingClient.unlockedTools?.includes('personalScan')) {
 // await updateClient(clientId, { unlockedTools: [...(existingClient.unlockedTools || []), 'personalScan'] });
            // This part is not yet implemented in firestore.ts, will need to add it later
            // if (!existingClient.unlockedTools?.includes('personalScan')) {
            //     await updateClient(clientId, { unlockedTools: [...(existingClient.unlockedTools || []), 'personalScan'] });
            // }
        } else {
            const newClient = await createClient(values.clientEmail, values.clientName, 'personal');
 clientId = newClient.id;
 const activationToken = uuidv4();
 const activationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
            // Assuming createClient now accepts these fields or you have an update function
 await createClient({ email: values.clientEmail, fullName: values.clientName, scanType: 'personal', activationToken: activationToken, activationTokenExpiresAt: activationTokenExpiresAt });
 // You might need to refetch or get the ID differently if createClient doesn't return the full doc with ID
 // For now, we'll assume createClient returns the doc reference or ID
        }

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
            if (result.analysis) {
                setAnalysisResult(result.analysis);
            }
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
      <div className="space-y-6">
        <div className="space-y-4 text-center">
            <Alert variant="default" className="border-green-500 text-green-700 text-left">
            <CheckCircle className="h-4 w-4 !text-green-500" />
            <AlertTitle>Analysis Complete!</AlertTitle>
            <AlertDescription>
                Your info is in our secured portal. Please check your email for a welcome message with instructions on how to log in and retrieve your full analysis and first dispute letter.
            </AlertDescription>
            </Alert>
        </div>

        {analysisResult && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-primary" />
                         Disputable Items Found
                    </CardTitle>
                    <CardDescription>
                        Our AI has identified the following items on your report that are likely inaccurate or unverifiable. We can generate dispute letters to challenge them.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Disputable Item</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Success Chance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {analysisResult.disputableItems?.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.item}</TableCell>
                                    <TableCell>{item.reason}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={item.successProbability} className="w-20" />
                                            <span className="text-muted-foreground font-medium">{item.successProbability}%</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        )}

        <div className="text-center">
            <Button asChild size="lg">
                <Link href="/sign-up">Sign Up to Start Disputing</Link>
            </Button>
        </div>
      </div>
    );
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
