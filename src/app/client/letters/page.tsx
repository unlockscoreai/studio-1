'use client';
import { useState } from 'react';
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
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { sendLetterForMailing } from './actions';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Mock data for letters
const mockLetters = [
  {
    id: 'letter-1',
    title: 'Initial Dispute for Experian',
    date: '2024-07-25',
    status: 'Awaiting Approval',
    content: 'Dear Experian,\n\nI am writing to dispute the following information in my file...',
    cost: 5.43,
  },
  {
    id: 'letter-2',
    title: 'Follow-up for Equifax',
    date: '2024-07-22',
    status: 'Mailed',
    content: 'This is a follow-up letter for Equifax...',
    cost: 5.43,
  },
  {
    id: 'letter-3',
    title: 'MOV Request for TransUnion',
    date: '2024-07-18',
    status: 'Mailed',
    content: 'This is a Method of Verification letter for TransUnion...',
    cost: 5.43,
  },
];

type SubscriptionTier = 'starter' | 'pro' | 'vip';
type MailingStatus = {
    state: 'idle' | 'loading' | 'sent';
    trackingNumber?: string;
    cost?: number;
};

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

  const handleMailLetter = async (letterId: string, title: string, content: string, cost: number) => {
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


  const isSubscribed = subscription === 'pro' || subscription === 'vip';

  return (
    <div className="space-y-6">
      <SubscriptionSimulator
        subscription={subscription}
        setSubscription={setSubscription}
      />
      {isSubscribed ? (
        <>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Zap className="w-5 h-5 text-primary"/> Automation Settings</CardTitle>
                <CardDescription>Enable auto-disputes to have new letters sent automatically as soon as they are generated.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-3">
                    <Switch id="auto-dispute-toggle" checked={autoDispute} onCheckedChange={setAutoDispute} aria-label="Automated Disputes Toggle"/>
                    <Label htmlFor="auto-dispute-toggle">Automated Disputes</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                    {autoDispute ? "Automatic mailing is active. You can turn this off to approve letters manually." : "Turn this on to have us mail your letters for you automatically."}
                </p>
            </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">My Letters</CardTitle>
            <CardDescription>
              Review your generated letters here. {autoDispute ? 'Automated mailing is active.' : 'Approve letters to send them for mailing.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockLetters.map((letter) => {
              const currentStatus = mailingStatus[letter.id];
              const isMailedManually = currentStatus?.state === 'sent';
              const isLoading = currentStatus?.state === 'loading';
              const isMailedAutomatically = letter.status === 'Awaiting Approval' && autoDispute;
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
                    <div className="flex items-center gap-2">
                        <Badge variant={showAsMailed ? 'default' : 'secondary'}>
                            {showAsMailed ? (isMailedAutomatically ? 'Mailed Automatically' : 'Mailed') : letter.status}
                        </Badge>
                        
                        {!showAsMailed ? (
                            <Button
                            size="sm"
                            onClick={() => handleMailLetter(letter.id, letter.title, letter.content, letter.cost)}
                            disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="mr-2 h-4 w-4" />
                                )}
                            Approve & Mail for ${letter.cost.toFixed(2)}
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
                            Tracking Number: <span className='font-mono'>{currentStatus.trackingNumber}</span> - Cost: <span className='font-mono'>${currentStatus.cost?.toFixed(2)}</span>
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
