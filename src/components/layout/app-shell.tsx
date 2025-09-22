
"use client";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Sparkles, Tractor } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarNav } from "./sidebar-nav";
import { AssistantDialog } from "../assistant/assistant-dialog";
import { useTranslation } from "@/hooks/use-translation";

export function AppShell({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="p-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Tractor className="w-8 h-8 text-primary" />
                        <h1 className="text-xl font-bold font-headline">KrishiMitra</h1>
                    </Link>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarNav />
                </SidebarContent>
            </Sidebar>

            <SidebarInset>
                <header className="flex items-center justify-between h-16 px-4 border-b bg-card sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                         <SidebarTrigger className="md:hidden" />
                         <div className="md:hidden">
                            <Link href="/" className="flex items-center gap-2">
                                <Tractor className="w-6 h-6 text-primary" />
                                <h1 className="text-lg font-bold font-headline">KrishiMitra</h1>
                            </Link>
                         </div>
                    </div>
                    <div className="items-center gap-4 hidden md:flex flex-1">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t('appShell.searchPlaceholder')} className="pl-8" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <AssistantDialog>
                            <Button variant="ghost" size="icon" aria-label={t('appShell.aiAssistant')}>
                                <Sparkles className="h-5 w-5" />
                                <span className="sr-only">{t('appShell.aiAssistant')}</span>
                            </Button>
                        </AssistantDialog>
                        <Button variant="ghost" size="icon" aria-label={t('appShell.notifications')}>
                            <Bell className="h-5 w-5" />
                             <span className="sr-only">{t('appShell.notifications')}</span>
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src="https://picsum.photos/seed/farmer/40/40" data-ai-hint="farmer profile" />
                                        <AvatarFallback>FK</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    <p className="font-medium">Farmer Kumar</p>
                                    <p className="text-xs text-muted-foreground font-normal">farmer.kumar@example.com</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>{t('appShell.profile')}</DropdownMenuItem>
                                <DropdownMenuItem>{t('appShell.settings')}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>{t('appShell.logout')}</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
