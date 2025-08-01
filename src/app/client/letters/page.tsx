
'use client';
import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  Lock,
  MailCheck,
  Send,
  ShieldCheck,
  Loader2,
  CheckCircle,
  Zap,
  AlertTriangle,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { sendLetterForMailing } from './actions';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { generatePdf } from '@/lib/pdf-generator';
import { FormattedLetter, type Bureau } from '@/components/client/formatted-letter';

// Mock data for letters
const mockLetters: { id: string; title: string; date: string; status: string; content: string; bureau: Bureau }[] = [
  {
    id: 'letter-1',
    title: 'Initial Dispute for Experian',
    bureau: 'Experian',
    date: '2024-07-25',
    status: 'Awaiting Approval',
    content: 'Dear Experian,\n\nI am writing to dispute the following information in my file...\n\n1. IC System – Medical Collection\nThis account reports a balance of $486 with an open date of 08/21/2020. You are reporting this as a medical collection. However, no signed HIPAA authorization exists allowing the collection agency or credit bureaus to legally access or report my protected health information. Under HIPAA (45 CFR §164.508), disclosure without proper consent is a violation. Please remove this account immediately unless legal documentation is provided.\n\n2. Navy Federal Credit Union – Charged Off\nThis account was opened on 09/26/2019 and shows a charged-off status with a balance of $1,862. Upon reviewing my credit report, I have observed discrepancies in reporting across bureaus regarding the balance and payment status. Under FCRA §602 and §611, you are required to ensure the accuracy and consistency of data furnished. Please conduct a full reinvestigation and remove or correct any unverifiable or inconsistent information.\n\nSincerely,\nSarah Lee',
  },
  {
    id: 'letter-2',
    title: 'Follow-up for Equifax',
    bureau: 'Equifax',
    date: '2024-07-22',
    status: 'Mailed',
    content: 'This is a follow-up letter for Equifax...',
  },
  {
    id: 'letter-3',
    title: 'MOV Request for TransUnion',
    bureau: 'TransUnion',
    date: '2024-07-18',
    status: 'Mailed',
    content: 'This is a Method of Verification letter for TransUnion...',
  },
];

type SubscriptionTier = 'starter' | 'pro' | 'vip';
type MailingStatus = {
    state: 'idle' | 'loading' | 'sent';
    trackingNumber?: string;
    cost?: number;
};
// In a real app, this would be fetched based on the client's associated affiliate.
const mockAffiliateCreditBalance = 48;
const mockSenderInfo = "Sarah Lee\n123 Main St\nAnytown, CA 12345";


function SubscriptionSimulator({
  subscription,
  setSubscription,
}: {
  subscription: SubscriptionTier;
  setSubscription: (tier: SubscriptionTier) => void;
}) {
  return (
    <Card className="mb-6 bg-secondary border-dashed">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Subscription Simulator</CardTitle>
        <CardDescription>
          Use this to see how this page changes for different subscription tiers.
          This is for demo purposes only.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={subscription}
          onValueChange={(value) => setSubscription(value as SubscriptionTier)}
          className="flex items-center gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="starter" id="r1" />
            <Label htmlFor="r1">Starter</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pro" id="r2" />
            <Label htmlFor="r2">Pro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="vip" id="r3" />
            <Label htmlFor="r3">VIP</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default function LettersPage() {
  const [subscription, setSubscription] = useState<SubscriptionTier>('pro');
  const [mailingStatus, setMailingStatus] = useState<Record<string, MailingStatus>>({});
  const [autoDispute, setAutoDispute] = useState(false);
  const { toast } = useToast();
  const letterRef = useRef<HTMLDivElement>(null);
  const [letterToPrint, setLetterToPrint] = useState<{ content: string; bureau: Bureau; } | null>(null);

  const handleMailLetter = async (letterId: string, title: string, content: string) => {
    setMailingStatus(prev => ({...prev, [letterId]: { state: 'loading' }}));
    try {
        const result = await sendLetterForMailing({letterId, title, letterContent: content });
        if (result.success && result.trackingNumber) {
            toast({
                title: "Letter Sent!",
                description: `${title} has been sent for certified mailing. Cost: $${result.cost}`
            });
            setMailingStatus(prev => ({...prev, [letterId]: { state: 'sent', trackingNumber: result.trackingNumber, cost: result.cost }}));
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Mailing Failed",
            description: error instanceof Error ? error.message : "Could not send letter for mailing. Please try again."
        });
        setMailingStatus(prev => ({...prev, [letterId]: { state: 'idle' }}));
    }
  }

  const handleDownloadPdf = (content: string, bureau: Bureau) => {
    setLetterToPrint({ content, bureau });
    
    setTimeout(() => {
        if (letterRef.current) {
            generatePdf(letterRef.current, `${bureau}_dispute_letter.pdf`);
            setLetterToPrint(null);
        } else {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not generate PDF. Please try again.',
            });
        }
    }, 100);
  };


  const isSubscribed = subscription === 'pro' || subscription === 'vip';
  const hasCredits = mockAffiliateCreditBalance > 0;

  return (
    <div className="space-y-6">
        {letterToPrint && (
            <div className="hidden">
                 <FormattedLetter 
                    ref={letterRef}
                    senderInfo={mockSenderInfo}
                    bureau={letterToPrint.bureau}
                    body={letterToPrint.content}
                />
            </div>
        )}
      <SubscriptionSimulator
        subscription={subscription}
        setSubscription={setSubscription}
      />
      {isSubscribed ? (
        <>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Zap className="w-5 h-5 text-primary"/> Automation Settings</CardTitle>
                <CardDescription>Enable auto-disputes to have new letters sent automatically using your affiliate's mail credits.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-3">
                    <Switch id="auto-dispute-toggle" checked={autoDispute} onCheckedChange={setAutoDispute} aria-label="Automated Disputes Toggle" disabled={!hasCredits}/>
                    <Label htmlFor="auto-dispute-toggle" className={!hasCredits ? 'text-muted-foreground' : ''}>Automated Disputes</Label>
                </div>
                {!hasCredits ? (
                    <p className="text-sm text-destructive mt-2 flex items-center gap-2">
                       <AlertTriangle className="w-4 h-4" /> Your affiliate is out of mail credits. Automation is disabled.
                    </p>
                ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                        {autoDispute ? "Automatic mailing is active. 1 credit will be used per letter." : "Turn this on to have us mail your letters for you automatically."}
                    </p>
                )}
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Letters</CardTitle>
            <CardDescription>
              Review your generated letters here. {autoDispute && hasCredits ? 'Automated mailing is active.' : 'Approve letters to send them for mailing.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockLetters.map((letter) => {
              const currentStatus = mailingStatus[letter.id];
              const isMailedManually = currentStatus?.state === 'sent';
              const isLoading = currentStatus?.state === 'loading';
              const isMailedAutomatically = letter.status === 'Awaiting Approval' && autoDispute && hasCredits;
              const isAlreadyMailed = letter.status === 'Mailed';
              const showAsMailed = isMailedManually || isMailedAutomatically || isAlreadyMailed;

              return (
              <Card key={letter.id} className="flex flex-col p-4 gap-4">
                <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className="flex-1">
                        <p className="font-semibold">{letter.title}</p>
                        <p className="text-sm text-muted-foreground">
                            Generated on {letter.date}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={showAsMailed ? 'default' : 'secondary'}>
                            {showAsMailed ? (isMailedAutomatically ? 'Mailed Automatically' : 'Mailed') : letter.status}
                        </Badge>
                        
                         <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadPdf(letter.content, letter.bureau)}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>

                        {!showAsMailed ? (
                            <Button
                            size="sm"
                            onClick={() => handleMailLetter(letter.id, letter.title, letter.content)}
                            disabled={isLoading || !hasCredits}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                )}
                            Approve & Mail (1 Credit)
                            </Button>
                        ) : (
                            <Button size="sm" variant="outline" disabled>
                                <MailCheck className="mr-2 h-4 w-4" /> Mailed
                            </Button>
                        )}
                    </div>
                </div>
                {isMailedManually && currentStatus.trackingNumber && (
                    <Alert className="mt-2 text-sm">
                        <CheckCircle className='h-4 w-4' />
                        <AlertTitle>Mailing Confirmation</AlertTitle>
                        <AlertDescription>
                            Tracking Number: <span className='font-mono'>{currentStatus.trackingNumber}</span> - Cost: <span className='font-mono'>${currentStatus.cost?.toFixed(2) ?? 'N/A'}</span>
                        </AlertDescription>
                    </Alert>
                )}
              </Card>
            )})}
          </CardContent>
        </Card>
        </>
      ) : (
        <Card className="text-center p-10 flex flex-col items-center">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-2xl">
            Automate Your Mailings
          </CardTitle>
          <CardDescription className="mt-2 mb-6 max-w-md mx-auto">
            Your current plan requires you to mail letters yourself. Upgrade to
            Pro to unlock our automated certified mailing service.
          </CardDescription>
          <div className="p-6 border rounded-lg bg-background w-full max-w-sm">
            <h4 className="font-semibold text-lg text-primary flex items-center gap-2 justify-center">
              <ShieldCheck /> Pro Plan Features
            </h4>
            <ul className="text-left list-disc pl-5 mt-4 space-y-2 text-muted-foreground">
              <li>Review and approve letters in your portal.</li>
              <li>
                <strong>We handle all printing and certified mailing.</strong>
              </li>
              <li>Track mailing status and delivery automatically.</li>
              <li>Full dispute management and history.</li>
            </ul>
          </div>
          <Button size="lg" className="mt-6">
            Upgrade to Pro
          </Button>
        </Card>
      )}
    </div>
  );
}
