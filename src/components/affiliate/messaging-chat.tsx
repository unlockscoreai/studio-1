
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import type { Client } from '@/app/affiliate/messaging/page';
import { cn } from '@/lib/utils';

// Mock conversation data
const mockConversations: Record<number, { sender: 'client' | 'affiliate'; text: string; timestamp: string }[]> = {
  1: [
    { sender: 'client', text: "Hi, just checking in on the status of my disputes. Any updates?", timestamp: '10:00 AM' },
    { sender: 'affiliate', text: "Hi Jane! Great question. Experian has received your letter, and we are now waiting for their 30-day response window to complete. I'll let you know the moment we hear back.", timestamp: '10:02 AM' },
    { sender: 'client', text: "Sounds good, thank you!", timestamp: '10:05 AM' },
  ],
  2: [
    { sender: 'affiliate', text: "Hey John, just got a response from Equifax. Can you upload it in your portal so our AI can analyze it?", timestamp: 'Yesterday' },
    { sender: 'client', text: "Okay, I have uploaded the response.", timestamp: 'Today' },
  ],
  3: [
    { sender: 'affiliate', text: "Great news, Peter! The last negative item was removed from your report. You officially made it to the 700 Club!", timestamp: '2 days ago' },
    { sender: 'client', text: "Wow, that was fast!", timestamp: '1 day ago' },
  ],
  4: [
    { sender: 'client', text: "I have a quick question.", timestamp: '3 hours ago' },
  ],
};

interface MessagingChatProps {
  client: Client;
}

export function MessagingChat({ client }: MessagingChatProps) {
  const [messages, setMessages] = useState(mockConversations[client.id] || []);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When the client changes, update the messages
    setMessages(mockConversations[client.id] || []);
  }, [client]);
  
  useEffect(() => {
    // Auto-scroll to the bottom when new messages are added
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message = {
      sender: 'affiliate' as const,
      text: newMessage,
      timestamp: 'Just now',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center gap-3 border-b">
        <Avatar>
          <AvatarImage src={client.avatar} alt={client.name} />
          <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{client.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-end gap-2',
                  msg.sender === 'affiliate' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'client' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2',
                    msg.sender === 'affiliate'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                   <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={1}
            className="min-h-[40px] max-h-24 resize-y"
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                }
            }}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
