"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const formSchema = z.object({
  address: z.string().min(10, { message: 'Please enter a valid full address.' }),
  dob: z.date({ required_error: 'Your date of birth is required.' }),
  ssnLast4: z.string().length(4, { message: 'Must be exactly 4 digits.' }).regex(/^\d{4}$/, { message: 'Must be 4 digits.' }),
  idUpload: z.any().refine((files) => files?.length === 1, "Your ID is required."),
  proofOfMail: z.any().refine((files) => files?.length === 1, "Proof of mail is required."),
});

export function OnboardingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        address: '',
        ssnLast4: '',
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setIsSuccess(false);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // In a real app, you would upload files to a secure storage
    // and save the form data to your database.
    console.log('Onboarding data submitted:', {
        ...values,
        idUpload: values.idUpload[0].name,
        proofOfMail: values.proofOfMail[0].name,
    });

    setIsLoading(false);
    setIsSuccess(true);
    toast({
      title: "Onboarding Complete!",
      description: "Your information has been submitted successfully.",
    });
    form.reset();
  }

  if (isSuccess) {
    return (
        <Alert variant="default" className="border-green-500 text-green-700">
            <CheckCircle className="h-4 w-4 !text-green-500" />
            <AlertTitle>Thank You!</AlertTitle>
            <AlertDescription>
                Your onboarding information has been received. You can now use all the features of your dashboard.
            </AlertDescription>
        </Alert>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Mailing Address</FormLabel>
              <FormControl>
                <Textarea placeholder="123 Main St, Anytown, USA 12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ssnLast4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last 4 digits of SSN</FormLabel>
                <FormControl>
                  <Input placeholder="1234" maxLength={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <FormField
                control={form.control}
                name="idUpload"
                render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                        <FormLabel>Upload ID</FormLabel>
                         <FormControl>
                            <Input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={(e) => onChange(e.target.files)}
                                onBlur={onBlur}
                                name={name}
                                ref={ref}
                            />
                        </FormControl>
                        <FormDescription>Driver's license or passport.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="proofOfMail"
                render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                        <FormLabel>Upload Proof of Mail</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept="image/*,.pdf"
                                onChange={(e) => onChange(e.target.files)}
                                onBlur={onBlur}
                                name={name}
                                ref={ref}
                            />
                        </FormControl>
                        <FormDescription>Utility bill or bank statement.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Submit Information
        </Button>
      </form>
    </Form>
  );
}
