
'use client';

import { useState } from 'react';
import { addDays, format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
  '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM',
];

export default function BookConsultationPage() {
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isBooked, setIsBooked] = useState(false);
  const { toast } = useToast();

  const handleBooking = () => {
    if (!date || !selectedTime) {
      toast({
        variant: 'destructive',
        title: 'Selection Required',
        description: 'Please select a date and time for your consultation.',
      });
      return;
    }

    // Simulate payment and booking
    setIsBooked(true);
    toast({
      title: 'Booking Confirmed!',
      description: `Your consultation is scheduled for ${format(date, 'PPP')} at ${selectedTime}.`,
    });
  };

  if (isBooked) {
    return (
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto bg-green-100 p-3 rounded-full w-fit mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="font-headline text-2xl">Consultation Booked!</CardTitle>
          <CardDescription>
            Your payment was successful and your appointment is confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            A calendar invitation and meeting link have been sent to your email. We look forward to speaking with you on{' '}
            <span className="font-semibold text-primary">{format(date!, 'EEEE, MMMM do')}</span> at{' '}
            <span className="font-semibold text-primary">{selectedTime}</span>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Book Your Strategy Consultation</CardTitle>
        <CardDescription>
          Invest in a 30-minute, one-on-one session with a business credit expert for just $99.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">What you'll get:</h3>
          <ul className="list-disc list-inside text-muted-foreground space-y-1">
            <li>A deep dive into your business structure and Unlock Score.</li>
            <li>Identification of the missing pieces in your credit profile.</li>
            <li>A personalized, actionable plan to get you funding-ready.</li>
            <li>Answers to your most pressing questions about business credit.</li>
          </ul>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
             <h3 className="font-semibold mb-2">1. Select a Date</h3>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={{ before: new Date() }}
              className="rounded-md border"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-center md:text-left">2. Select a Time</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  className={cn(selectedTime === time && 'bg-primary text-primary-foreground')}
                  onClick={() => setSelectedTime(time)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {time}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <Button 
            className="w-full text-lg" 
            size="lg"
            onClick={handleBooking}
            disabled={!date || !selectedTime}
        >
          Book & Pay $99
        </Button>
      </CardContent>
    </Card>
  );
}

    
