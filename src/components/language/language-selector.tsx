
'use client';

import { useLanguageStore } from "@/lib/language-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tractor } from "lucide-react";
import { Button } from "../ui/button";
import { availableLanguages } from "@/lib/languages";

export function LanguageSelector() {
    const { setLanguage } = useLanguageStore();

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                     <div className="flex justify-center items-center gap-2 mb-4">
                        <Tractor className="w-8 h-8 text-primary" />
                        <h1 className="text-2xl font-bold font-headline">Welcome to KrishiMitra</h1>
                    </div>
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
