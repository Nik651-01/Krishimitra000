
'use client';

import { useLanguageStore } from "@/lib/language-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { availableLanguages } from "@/lib/languages";
import { Logo } from "../logo";

export function LanguageSelector() {
    const { setLanguage } = useLanguageStore();

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <Logo className="mb-4" />
                    <CardTitle>Choose Your Language</CardTitle>
                    <CardDescription>Select a language to continue</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        {availableLanguages.map((lang) => (
                            <Button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                variant="outline"
                                size="lg"
                                className="justify-start text-base"
                            >
                                <span className="w-1/2 text-left">{lang.name}</span>
                                <span className="w-1/2 text-right text-muted-foreground">{lang.nativeName}</span>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
