
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessagingChat } from '@/components/affiliate/messaging-chat';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare } from 'lucide-react';


const mockClients = [
  {
    id: 1,
    name: 'Jane Doe',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    lastMessage: 'Sounds good, thank you!',
    status: 'Active',
  },
  {
    id: 2,
    name: 'John Smith',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
    lastMessage: 'Okay, I have uploaded the response.',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Peter Jones',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    lastMessage: 'Wow, that was fast!',
    status: 'Completed',
  },
   {
    id: 4,
    name: 'Samantha Bee',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
    lastMessage: 'I have a quick question.',
    status: 'Onboarding',
  },
];

export type Client = typeof mockClients[0];

export default function MessagingPage() {
    const [selectedClient, setSelectedClient] = useState<Client | null>(mockClients[0]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
            <Card className="md:col-span-1 lg:col-span-1 flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline">Clients</CardTitle>
                    <CardDescription>Select a client to view messages.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                    <ScrollArea className="h-full">
                        <div className="space-y-1">
                            {mockClients.map((client) => (
                                <button
                                    key={client.id}
                                    onClick={() => setSelectedClient(client)}
                                    className={cn(
                                        "flex items-center gap-3 p-3 w-full text-left hover:bg-muted/50 transition-colors",
                                        selectedClient?.id === client.id && 'bg-muted'
                                    )}
                                >
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={client.avatar} alt={client.name} />
                                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 truncate">
                                        <p className="font-semibold">{client.name}</p>
                                        <p className="text-sm text-muted-foreground truncate">{client.lastMessage}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="md:col-span-2 lg:col-span-3 h-full">
                {selectedClient ? (
                    <MessagingChat client={selectedClient} />
                ) : (
                    <Card className="h-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <MessageSquare className="mx-auto h-12 w-12" />
                            <p className="mt-4">Select a client to start messaging.</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
