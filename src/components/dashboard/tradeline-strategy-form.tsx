"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { generateTradelineStrategy } from "@/ai/flows/generate-tradeline-strategy"
import type { GenerateTradelineStrategyOutput } from "@/ai/flows/generate-tradeline-strategy"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles, Wand2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"

const formSchema = z.object({
  hasPrimaryTradelines: z.enum(["true", "false"], {
    required_error: "You need to select an option.",
  }),
  creditAnalysis: z.string().optional(),
})

export function TradelineStrategyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [strategy, setStrategy] = useState<GenerateTradelineStrategyOutput | null>(null)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creditAnalysis: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setStrategy(null)
    try {
      const result = await generateTradelineStrategy({
        hasPrimaryTradelines: values.hasPrimaryTradelines === "true",
        creditAnalysis: values.creditAnalysis,
      })
      if (result.suggestions) {
        setStrategy(result)
      } else {
        throw new Error("Failed to generate a strategy.")
      }
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to generate a strategy. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="hasPrimaryTradelines"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Do you currently have any primary tradelines (e.g., credit cards or loans in your own name)?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Yes, I have one or more primary tradelines.
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        No, I do not have any primary tradelines.
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creditAnalysis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit Profile Analysis (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="For a more personalized strategy, paste the summary from your credit profile analysis here."
                    className="h-24"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can get this from the welcome email or by having an affiliate run your profile.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Wand2 className="mr-2 h-4 w-4" />
            Generate My Strategy
          </Button>
        </form>
      </Form>

      {strategy && (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Your Personalized Tradeline Strategy
                </CardTitle>
                <CardDescription>
                    Follow these suggestions to build a stronger credit profile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {strategy.suggestions.map((category, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-lg font-semibold">{category.category}</AccordionTrigger>
                            <AccordionContent>
                                <ul className="space-y-4 pl-2">
                                    {category.products.map((product, pIndex) => (
                                        <li key={pIndex}>
                                            <p className="font-semibold">{product.name}</p>
                                            <p className="text-muted-foreground">{product.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      )}
    </div>
  )
}
