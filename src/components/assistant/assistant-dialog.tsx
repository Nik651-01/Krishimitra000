
"use client";
import { useState, useEffect, useRef, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Bot, User, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { chat } from '@/ai/flows/assistant-chat';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useLocationStore } from '@/lib/location-store';
import { useTranslation } from '@/hooks/use-translation';

interface Message {
  id: number;
  type: 'user' | 'bot';
  text: string;
}

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' &&
    ((window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition)) ||
  null;

export function AssistantDialog({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { location } = useLocationStore();
  const { t } = useTranslation();

  const starterQuestions = [
    t('assistant.starter1'),
    t('assistant.starter2'),
    t('assistant.starter3'),
    t('assistant.starter4')
  ];

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError(t('assistant.micDenied'));
      }
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map(result => result.transcript)
        .join('');
      setInput(transcript);
    };

    recognitionRef.current = recognition;
  }, [t]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setError(null); // Clear previous errors
      recognitionRef.current?.start();
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      stopAudio();
      setMessages([]);
      setInput('');
      setError(null);
      setIsLoading(false);
      if (isListening) {
        recognitionRef.current?.stop();
      }
    }
  }

  const handleSubmit = async (eventOrQuery: React.FormEvent<HTMLFormElement> | string) => {
    if (typeof eventOrQuery === 'object') {
        eventOrQuery.preventDefault();
    }
    
    const query = typeof eventOrQuery === 'string' ? eventOrQuery : input;

    if (!query.trim() || isLoading) return;

    stopAudio();

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      text: query.trim(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Get text response
      const chatResponse = await chat({ 
        query: userMessage.text,
        location: location || undefined
      });
      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        text: chatResponse.response,
      };
      setMessages(prev => [...prev, botMessage]);

      // Get audio response
      const ttsResponse = await textToSpeech({ text: chatResponse.response });
      if (audioRef.current) {
        audioRef.current.src = ttsResponse.audio;
        audioRef.current.play();
      }

    } catch (err) {
      console.error('Assistant error:', err);
      setError(t('assistant.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg grid-rows-[auto_1fr_auto] max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            {t('assistant.title')}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[50vh] p-4">
          <div className="space-y-4">
            {messages.length === 0 && !isLoading && (
                 <div className="text-center text-muted-foreground p-4">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p>{t('assistant.welcome')}</p>
                </div>
            )}
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.type === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.type === 'bot' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                      <Bot />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-3 py-2 max-w-sm ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                {message.type === 'user' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
                 <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 border">
                        <AvatarFallback>
                            <Bot />
                        </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg px-3 py-2 bg-muted flex items-center">
                       <Loader2 className="w-5 h-5 animate-spin"/>
                    </div>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-2 rounded-md">
                    <AlertTriangle className="w-5 h-5" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          {messages.length === 0 && !isLoading && (
            <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">{t('assistant.starterQuestions')}</p>
                <div className="grid grid-cols-2 gap-2">
                    {starterQuestions.map((q) => (
                        <Button 
                            key={q} 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-auto py-1 px-2 whitespace-normal text-left justify-start"
                            onClick={() => handleSubmit(q)}
                            disabled={isLoading}
                        >
                            {q}
                        </Button>
                    ))}
                </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={t('assistant.placeholder')}
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="button"
              size="icon"
              variant={isListening ? 'destructive' : 'outline'}
              onClick={toggleListening}
              disabled={!SpeechRecognition || isLoading}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
        <audio ref={audioRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
