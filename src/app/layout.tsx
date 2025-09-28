'use client';

import { useEffect, useState } from 'react';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { Toaster } from '@/components/ui/toaster';
import { useLanguageStore } from '@/lib/language-store';
import { Loader2 } from 'lucide-react';
import { TranslationProvider } from '@/components/language/translation-provider';
import { LanguageSelector } from '@/components/language/language-selector';
import { useAuthStore } from '@/lib/auth-store';
import LoginPage from './login/page';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { language } = useLanguageStore();
  const { isLoggedIn, isGuest } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Loading state before hydration
  if (!isHydrated) {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>KrishiMitra</title>
          <meta name="description" content="A smart agri-advisor for Indian farmers." />
        </head>
        <body>
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </body>
      </html>
    );
  }

  // If language not chosen yet
  if (!language) {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>KrishiMitra</title>
          <meta name="description" content="A smart agri-advisor for Indian farmers." />
        </head>
        <body>
          <LanguageSelector />
        </body>
      </html>
    );
  }

  // If not logged in or guest
  if (!isLoggedIn && !isGuest) {
    return (
      <html lang={language} suppressHydrationWarning>
        <head>
          <title>KrishiMitra - Login</title>
          <meta name="description" content="A smart agri-advisor for Indian farmers." />
        </head>
        <body>
          <TranslationProvider>
            <LoginPage />
          </TranslationProvider>
        </body>
      </html>
    );
  }

  // Main app shell
  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <title>KrishiMitra</title>
        <meta name="description" content="A smart agri-advisor for Indian farmers." />

        {/* ✅ PWA setup */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E4EFE7" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Fonts & Styles */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"
        />
      </head>
      <body className="font-body antialiased">
        <TranslationProvider>
          <AppShell>{children}</AppShell>
        </TranslationProvider>
        <Toaster />
      </body>
    </html>
  );
}