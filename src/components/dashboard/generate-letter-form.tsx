"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { generateCreditDisputeLetter } from "@/ai/flows/generate-credit-dispute-letter"
import type { GenerateCreditDisputeLetterOutput } from "@/ai/flows/generate-credit-dispute-letter"
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
import { Loader2, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

const formSchema = z.object({
  personalInformation: z.string().min(10, "Please provide your full name and address."),
  additionalInstructions: z.string().optional(),
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

function LetterDisplay({ title, content }: { title: string, content: string | undefined }) {
    const [hasCopied, setHasCopied] = useState(false)
    const { toast } = useToast()

    if (!content) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(content)
        setHasCopied(true)
        toast({ title: "Copied to clipboard!" });
        setTimeout(() => setHasCopied(false), 2000)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">{title}</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                    {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent>
                <Textarea readOnly value={content} className="h-96 bg-secondary" />
            </CardContent>
        </Card>
    )
}

export function GenerateLetterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedLetters, setGeneratedLetters] = useState<GenerateCreditDisputeLetterOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInformation: "",
      additionalInstructions: "",
    },
  })
  const fileRef = form.register("creditReport")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setGeneratedLetters(null)
    try {
        const creditReportFile = values.creditReport[0];
        const creditReportDataUri = await fileToDataUri(creditReportFile);
        
        const result = await generateCreditDisputeLetter({
            personalInformation: values.personalInformation,
            creditReportDataUri: creditReportDataUri,
            additionalInstructions: values.additionalInstructions,
        })
        
        if (Object.values(result).some(letter => letter)) {
            setGeneratedLetters(result)
        } else {
            throw new Error("Failed to generate any letters from the provided report. Please check the file and try again.")
        }
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="personalInformation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Information</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your full name, address, DOB, and last 4 of SSN..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="additionalInstructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Instructions (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'Cite Cushman v. TransUnion Corp.' or 'Keep the tone very firm.'"
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
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Upload Credit Report</FormLabel>
                    <FormControl>
                        <Input type="file" {...fileRef} accept=".pdf, .html, .txt"/>
                    </FormControl>
                     <FormMessage />
                </FormItem>
            )}
            />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Letters
          </Button>
        </form>
      </Form>

      {generatedLetters && (
        <Tabs defaultValue="equifax" className="w-full mt-8">
            <TabsList className="grid w-full grid-cols-5">
                {generatedLetters.equifaxLetter && <TabsTrigger value="equifax">Equifax</TabsTrigger>}
                {generatedLetters.experianLetter && <TabsTrigger value="experian">Experian</TabsTrigger>}
                {generatedLetters.transunionLetter && <TabsTrigger value="transunion">TransUnion</TabsTrigger>}
                {generatedLetters.inquiryDisputeLetter && <TabsTrigger value="inquiries">Inquiries</TabsTrigger>}
                {generatedLetters.section609Request && <TabsTrigger value="section609">Section 609</TabsTrigger>}
            </TabsList>
            <TabsContent value="equifax">
                <LetterDisplay title="Dispute Letter for Equifax" content={generatedLetters.equifaxLetter} />
            </TabsContent>
            <TabsContent value="experian">
                <LetterDisplay title="Dispute Letter for Experian" content={generatedLetters.experianLetter} />
            </TabsContent>
            <TabsContent value="transunion">
                 <LetterDisplay title="Dispute Letter for TransUnion" content={generatedLetters.transunionLetter} />
            </TabsContent>
            <TabsContent value="inquiries">
                 <LetterDisplay title="Hard Inquiry Dispute Letter" content={generatedLetters.inquiryDisputeLetter} />
            </TabsContent>
            <TabsContent value="section609">
                 <LetterDisplay title="Section 609 Request Letter" content={generatedLetters.section609Request} />
            </TabsContent>
        </Tabs>
      )}
    </>
  )
}
