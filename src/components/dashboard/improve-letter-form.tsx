"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { improveUploadedLetter } from "@/ai/flows/improve-uploaded-letter"
import type { ImproveUploadedLetterOutput } from "@/ai/flows/improve-uploaded-letter"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Copy, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const formSchema = z.object({
  letterText: z.string().min(50, "Please enter a complete letter to improve."),
})

export function ImproveLetterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [improvedLetter, setImprovedLetter] = useState("")
  const [hasCopied, setHasCopied] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      letterText: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setImprovedLetter("")
    try {
      const result: ImproveUploadedLetterOutput = await improveUploadedLetter({
        letterText: values.letterText,
      })
      if (result.improvedLetterText) {
        setImprovedLetter(result.improvedLetterText)
      } else {
        throw new Error("Failed to improve letter.")
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to improve the letter. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedLetter)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="letterText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Existing Letter</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Paste your credit dispute letter here..."
                    className="h-64"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Improve My Letter
          </Button>
        </form>
      </Form>

      {improvedLetter && (
        <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-headline">Your Improved Letter</CardTitle>
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                    {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </CardHeader>
            <CardContent>
                <Textarea readOnly value={improvedLetter} className="h-96 bg-secondary" />
            </CardContent>
        </Card>
      )}
    </>
  )
}
