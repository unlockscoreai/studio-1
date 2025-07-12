
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail, CreditCard, Send, Zap, AlertTriangle, Eye, Loader2, MailCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendLetterForMailing } from '@/app/client/letters/actions';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';

const mockMailingQueue = [
    { 
        clientId: 1, 
        clientName: 'Jane Doe',
        letterId: 'letter-1-jane',
        letterTitle: 'Initial Dispute for Experian',
        status: 'Ready to Send',
        letterContent: 'Dear Experian, I am writing to dispute...',
        idUrl: 'https://placehold.co/400x250.png',
        proofUrl: 'https://placehold.co/400x500.png',
    },
    { 
        clientId: 2, 
        clientName: 'John Smith',
        letterId: 'letter-1-john',
        letterTitle: 'Initial Dispute for TransUnion',
        status: 'Ready to Send',
        letterContent: 'Dear TransUnion, I am writing to dispute...',
        idUrl: 'https://placehold.co/400x250.png',
        proofUrl: 'https://placehold.co/400x500.png',
    },
    { 
        clientId: 4, 
        clientName: 'Samantha Bee',
        letterId: 'letter-1-samantha',
        letterTitle: 'Initial Dispute for Equifax',
        status: 'Mailed',
        letterContent: 'Dear Equifax, I am writing to dispute...',
        trackingNumber: '9407111899561234567890',
        idUrl: 'https://placehold.co/400x250.png',
        proofUrl: 'https://placehold.co/400x500.png',
    },
];

type MailingItem = typeof mockMailingQueue[0];

export default function MailingCenterPage() {
    const [mailCredits, setMailCredits] = useState(48);
    const [autoMailer, setAutoMailer] = useState(false);
    const [queue, setQueue] = useState(mockMailingQueue);
    const [selectedItem, setSelectedItem] = useState<MailingItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSending, setIsSending] = useState<string | null>(null);
    const { toast } = useToast();

    const handleReviewFile = (item: MailingItem) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    const handleSendMail = async (item: MailingItem) => {
        if (mailCredits < 1) {
            toast({ variant: 'destructive', title: 'No Mail Credits', description: 'Please purchase more mail credits to send letters.' });
            return;
        }
        setIsSending(item.letterId);
        try {
            const result = await sendLetterForMailing({
                letterId: item.letterId,
                title: item.letterTitle,
                letterContent: item.letterContent
            });

            if (result.success && result.trackingNumber) {
                 setQueue(prev => prev.map(q => q.letterId === item.letterId ? {...q, status: 'Mailed', trackingNumber: result.trackingNumber} : q));
                 setMailCredits(prev => prev - 1);
                 toast({ title: 'Letter Sent!', description: `Letter for ${item.clientName} has been mailed successfully.`});
            } else {
                throw new Error(result.message || 'Mailing failed.');
            }
        } catch (error) {
            toast({ variant: 'destructive', title: 'Mailing Failed', description: error instanceof Error ? error.message : 'An unknown error occurred.' });
        } finally {
            setIsSending(null);
        }
    };

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><Mail className="w-6 h-6 text-primary" /> Mailing Center</CardTitle>
                <CardDescription>Manage your client dispute mailings and credit balance from one central hub.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                     <h3 className="font-semibold text-lg">Automation Settings</h3>
                     <div className="flex items-center space-x-3 p-4 border rounded-lg">
                        <Switch id="auto-mailer-toggle" checked={autoMailer} onCheckedChange={setAutoMailer} aria-label="Automated Mailing Toggle" disabled={mailCredits === 0}/>
                        <div className="flex-1">
                            <Label htmlFor="auto-mailer-toggle" className="font-semibold">Automated Mailing</Label>
                            <p className="text-sm text-muted-foreground">Automatically send new dispute letters for onboarded clients.</p>
                        </div>
                    </div>
                     {mailCredits === 0 && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Out of Credits</AlertTitle>
                            <AlertDescription>
                                Automated mailing is disabled. Please purchase more credits to continue sending mail.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                 <div className="space-y-4">
                     <h3 className="font-semibold text-lg">Credit Balance</h3>
                     <div className="p-4 border rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Available Mail Credits</p>
                        <p className="text-5xl font-bold">{mailCredits}</p>
                        <Button className="mt-2 w-full"><CreditCard className="mr-2" /> Purchase More Credits</Button>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Client Mailing Queue</CardTitle>
                <CardDescription>
                    Clients who have completed onboarding and have letters ready for mailing will appear here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Letter</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {queue.map((item) => (
                            <TableRow key={item.letterId}>
                                <TableCell className="font-medium">{item.clientName}</TableCell>
                                <TableCell>{item.letterTitle}</TableCell>
                                <TableCell>
                                    <Badge variant={item.status === 'Mailed' ? 'default' : 'secondary'}>{item.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" onClick={() => handleReviewFile(item)}><Eye className="mr-2 h-4 w-4"/>Review File</Button>
                                    {item.status === 'Ready to Send' && (
                                        <Button size="sm" onClick={() => handleSendMail(item)} disabled={isSending === item.letterId || mailCredits < 1}>
                                            {isSending === item.letterId ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                                            Send Mail
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        {selectedItem && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Review File for: {selectedItem.clientName}</DialogTitle>
                        <DialogDescription>{selectedItem.letterTitle}</DialogDescription>
                    </DialogHeader>
                    <div className="grid md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto p-1">
                        <div>
                            <h3 className="font-semibold mb-2">Dispute Letter</h3>
                            <div className="p-4 border rounded-md bg-secondary h-96 overflow-y-auto text-sm">
                                <pre className="whitespace-pre-wrap font-sans">{selectedItem.letterContent}</pre>
                            </div>
                        </div>
                        <div className="space-y-4">
                             <div>
                                <h3 className="font-semibold mb-2">Uploaded ID</h3>
                                <div className="p-2 border rounded-md bg-secondary">
                                    <img src={selectedItem.idUrl} alt="Client ID" className="w-full h-auto object-contain rounded" data-ai-hint="document id card" />
                                </div>
                            </div>
                             <div>
                                <h3 className="font-semibold mb-2">Proof of Address</h3>
                                <div className="p-2 border rounded-md bg-secondary">
                                    <img src={selectedItem.proofUrl} alt="Proof of Address" className="w-full h-auto object-contain rounded" data-ai-hint="document utility bill" />
                                </div>
                            </div>
                        </div>
                    </div>
                     <Separator className="my-4" />
                     {selectedItem.status === "Mailed" && selectedItem.trackingNumber && (
                        <Alert variant="default" className="border-green-500">
                             <MailCheck className="h-4 w-4" />
                             <AlertTitle>Mailing Status: Sent</AlertTitle>
                             <AlertDescription>
                                Tracking Number: <span className="font-mono">{selectedItem.trackingNumber}</span>
                             </AlertDescription>
                         </Alert>
                     )}
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>Close</Button>
                         {selectedItem.status === 'Ready to Send' && (
                            <Button onClick={() => handleSendMail(selectedItem)} disabled={isSending === selectedItem.letterId || mailCredits < 1}>
                                {isSending === selectedItem.letterId ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                                Send Mail (1 Credit)
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
    </div>
  );
}
