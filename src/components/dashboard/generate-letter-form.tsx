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

const formSchema = z.object({
  personalInformation: z.string().min(10, "Please provide more details."),
  disputeReason: z.string().min(10, "Please provide a clear reason for the dispute."),
  creditReport: z.any().refine((file) => file?.length == 1, "Credit report is required."),
})

async function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
}

export function GenerateLetterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personalInformation: "",
      disputeReason: "",
    },
  })
  const fileRef = form.register("creditReport")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setGeneratedLetter("")
    try {
        const creditReportFile = values.creditReport[0];
        const creditReportData = await fileToDataUri(creditReportFile);
        
        const result: GenerateCreditDisputeLetterOutput = await generateCreditDisputeLetter({
            personalInformation: values.personalInformation,
            disputeReason: values.disputeReason,
            creditReportData: creditReportData,
        })
        if (result.letter) {
            setGeneratedLetter(result.letter)
        } else {
            throw new Error("Failed to generate letter.")
        }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate the dispute letter. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
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
                    placeholder="Enter your full name, address, and relevant account numbers..."
                    {...field}
                  />
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
                    placeholder="Clearly explain why you are disputing the item on your credit report..."
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
                        <Input type="file" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
            />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Letter
          </Button>
        </form>
      </Form>

      {generatedLetter && (
        <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">Your Generated Letter</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                    {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent>
                <Textarea readOnly value={generatedLetter} className="h-96 bg-secondary" />
            </CardContent>
        </Card>
      )}
    </>
  )
}
