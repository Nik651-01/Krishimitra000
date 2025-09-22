'use client';
import type { Language } from './language-store';

export const availableLanguages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'nag', name: 'Nagpuri', nativeName: 'नागपुरी' },
  { code: 'sat', name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'kru', name: 'Kurukh', nativeName: 'कुड़ुख़' },
  { code: 'mun', name: 'Mundari', nativeName: 'ਮੁੰਡਾਰੀ' },
];
