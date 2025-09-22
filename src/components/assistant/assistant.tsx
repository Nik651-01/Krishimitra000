'use client';

import { useChat } from 'ai/react';
import { Bot, Mic, User } from 'lucide-react';
import { FormEvent, useRef } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export function Assistant() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    error,
  } = useChat({
    api: '/api/chat',
    body: {
        flow: 'chatAssistant',
    }
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    originalHandleSubmit(e);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Mic className="h-5 w-5" />
          <span className="sr-only">Voice Commands</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>KrishiMitra Assistant</DialogTitle>
          <DialogDescription>
            Ask me anything about farming in India.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-4 p-4 h-96 overflow-y-auto rounded-md border">
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
                    <div className="text-sm rounded-md bg-muted/50 p-3">
                        {m.content}
                    </div>
                </div>
            ))}
            {error && <div className="text-red-500">{error.message}</div>}
          </div>
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
            />
            <Button type="submit" className="ml-2">
              Send
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
