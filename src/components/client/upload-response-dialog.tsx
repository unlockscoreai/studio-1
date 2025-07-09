"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Sparkles, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { Dispute } from "@/app/client/disputes/page";
import { analyzeBureauResponse } from "@/ai/flows/analyze-bureau-response";
import type { AnalyzeBureauResponseOutput } from "@/ai/flows/analyze-bureau-response";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const formSchema = z.object({
  responseFile: z.any().refine((files) => files?.length === 1, "A response file is required."),
});

interface UploadResponseDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    dispute: Dispute;
}

async function fileToDataUri(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
}

export function UploadResponseDialog({ isOpen, setIsOpen, dispute }: UploadResponseDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeBureauResponseOutput | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      responseFile: undefined,
    },
  });

  const handleClose = () => {
    form.reset();
    setAnalysisResult(null);
    setIsLoading(false);
    setIsOpen(false);
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const responseFile = values.responseFile[0];
      const responseLetterDataUri = await fileToDataUri(responseFile);

      const result = await analyzeBureauResponse({
        responseLetterDataUri: responseLetterDataUri,
        disputedItem: dispute.item,
      });

      if (result) {
        setAnalysisResult(result);
      } else {
        throw new Error("The AI returned an empty analysis. Please try again.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
      setAnalysisResult(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Analyze Bureau Response</DialogTitle>
          <DialogDescription>
            Upload the response letter for: <span className="font-semibold">{dispute.item}</span>
          </DialogDescription>
        </DialogHeader>

        {!analysisResult ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="responseFile"
                render={({ field: { onChange, onBlur, name } }) => (
                  <FormItem>
                    <FormLabel>Response Letter File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
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
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><Sparkles className="mr-2 h-4 w-4" /> Analyze with AI</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
             <Alert variant={analysisResult.outcome === 'deleted' || analysisResult.outcome === 'repaired' ? 'default' : 'destructive'} className={analysisResult.outcome === 'deleted' || analysisResult.outcome === 'repaired' ? 'border-green-500' : ''}>
              {analysisResult.outcome === 'deleted' || analysisResult.outcome === 'repaired' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertTitle>Analysis Complete: <span className="capitalize">{analysisResult.outcome.replace('_', ' ')}</span></AlertTitle>
              <AlertDescription className="space-y-2">
                <div>
                    <h4 className="font-semibold mt-2">Summary</h4>
                    <p>{analysisResult.summary}</p>
                </div>
                 <div>
                    <h4 className="font-semibold mt-2">Next Step</h4>
                    <p>{analysisResult.nextStep}</p>
                </div>
              </AlertDescription>
            </Alert>
            <DialogFooter>
                <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
