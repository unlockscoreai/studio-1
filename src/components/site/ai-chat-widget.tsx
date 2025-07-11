'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { siteChat } from '@/ai/flows/site-chat';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(prev => {
        if (!prev && messages.length === 0) {
            // Greet user on first open
            setMessages([
                { role: 'assistant', content: "Hi! I'm the UnlockScore AI assistant. How can I help you today?" }
            ]);
        }
        return !prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await siteChat({ question: input });
      if (response.answer) {
        const assistantMessage: Message = { role: 'assistant', content: response.answer };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again in a moment." };
      setMessages(prev => [...prev, errorMessage]);
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <>
      <div className={cn("fixed bottom-4 right-4 z-50 transition-all duration-300", isOpen && "opacity-0 pointer-events-none")}>
        <Button onClick={handleToggle} size="lg" className="rounded-full shadow-lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
          <Bot className="mr-2 h-6 w-6" />
          Chat with AI
        </Button>
      </div>

      <div className={cn("fixed bottom-4 right-4 z-50 transition-all duration-300 w-full max-w-sm", !isOpen && "opacity-0 pointer-events-none translate-y-4")}>
        <Card className="shadow-2xl h-[60vh] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleToggle}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : '')}>
                    {message.role === 'assistant' && (
                        <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                            <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn('rounded-lg px-3 py-2 max-w-[80%] text-sm', message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                      <p>{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                        <Avatar className="w-8 h-8 bg-secondary text-secondary-foreground">
                            <AvatarFallback><User className="w-5 h-5"/></AvatarFallback>
                        </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                             <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-3 py-2 bg-muted flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                           <span className="text-muted-foreground text-sm">Thinking...</span>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
              <Input
                placeholder="Ask about pricing, features..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
