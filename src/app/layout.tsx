
'use client';
import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { useLanguageStore } from '@/lib/language-store';
import { LanguageSelector } from '@/components/language/language-selector';
import { Loader2 } from 'lucide-react';
import { TranslationProvider } from '@/components/language/translation-provider';

// This metadata would ideally be dynamic based on language
// export const metadata: Metadata = {
//   title: 'KrishiMitra',
//   description: 'A smart agri-advisor for Indian farmers.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { language } = useLanguageStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <html lang={language || 'en'} suppressHydrationWarning>
      <head>
        <title>KrishiMitra</title>
        <meta name="description" content="A smart agri-advisor for Indian farmers." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin=""/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css" />
      </head>
      <body className="font-body antialiased">
        {!isHydrated ? (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : !language ? (
          <LanguageSelector />
        ) : (
          <TranslationProvider>
            <AppShell>
                {children}
            </AppShell>
          </TranslationProvider>
        )}
        <Toaster />
      </body>
    </html>
  );
}
