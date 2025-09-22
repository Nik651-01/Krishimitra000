'use client';

import { useChat } from 'ai/react';
import { Bot, User, Loader2 } from 'lucide-react';
import { FormEvent, useRef, useEffect } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Assistant() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    error,
    isLoading
  } = useChat({
    api: '/api/chat',
    body: {
      flow: 'chat',
    },
  });
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    originalHandleSubmit(e);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  return (
    <Card className="flex-1 flex flex-col">
        <CardHeader>
            <CardTitle>KrishiMitra Assistant</CardTitle>
            <CardDescription>Your friendly AI farming advisor.</CardDescription>
        </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 p-4 border rounded-md" ref={scrollAreaRef}>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="w-8 h-8 border">
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm rounded-md bg-muted/50 p-3">
                Hello! How can I help you today?
              </div>
            </div>

            {messages.map((m) => (
                <div key={m.id} className="flex items-start gap-4">
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback>
                        {m.role === 'user' ? <User /> : <Bot />}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-sm rounded-md bg-muted/50 p-3 whitespace-pre-wrap">
                        {m.content}
                    </div>
                </div>
            ))}
            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="flex items-start gap-4">
                     <Avatar className="w-8 h-8 border">
                        <AvatarFallback>
                            <Bot />
                        </AvatarFallback>
                    </Avatar>
                     <div className="text-sm rounded-md bg-muted/50 p-3 flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                </div>
            )}
            {error && <div className="text-red-500">{error.message}</div>}
          </div>
        </ScrollArea>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex items-center"
        >
          <Input
            type="text"
            placeholder="Ask a question..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button type="submit" className="ml-2" disabled={isLoading}>
            Send
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
