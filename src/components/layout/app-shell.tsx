
"use client";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarInset, SidebarTrigger, SidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Sparkles, LogOut } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarNav } from "./sidebar-nav";
import { AssistantDialog } from "../assistant/assistant-dialog";
import { useTranslation } from "@/hooks/use-translation";
import { LanguageSwitcher } from "../language/language-switcher";
import { useAuthStore } from "@/lib/auth-store";
import { Logo } from "../logo";

export function AppShell({ children }: { children: React.ReactNode }) {
    const { t } = useTranslation();
    const { user, isGuest, logout } = useAuthStore();
    
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader className="p-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo />
                    </Link>
                </SidebarHeader>
                <SidebarContent className="p-2">
                    <SidebarNav />
                </SidebarContent>
                 <SidebarFooter className="p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start gap-2 p-2 h-auto">
                                 <Avatar className="h-9 w-9">
                                    <AvatarImage src={isGuest ? undefined : "https://picsum.photos/seed/farmer/40/40"} data-ai-hint="farmer profile" />
                                    <AvatarFallback>{isGuest ? 'G' : (user?.email?.charAt(0).toUpperCase() || 'F')}</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                     <p className="font-medium text-sm truncate">{isGuest ? t('appShell.guest', {defaultValue: "Guest User"}) : (user?.email || 'Farmer Kumar')}</p>
                                     {!isGuest && <p className="text-xs text-muted-foreground font-normal truncate">{user?.email}</p>}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56" side="top" sideOffset={8}>
                            {!isGuest && (
                                <>
                                    <DropdownMenuLabel>
                                        <p className="font-medium">{user?.email || 'Farmer Kumar'}</p>
                                        <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>{t('appShell.profile')}</DropdownMenuItem>
                                    <DropdownMenuItem>{t('appShell.settings')}</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            <DropdownMenuItem onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                {t('appShell.logout')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="flex items-center justify-between h-16 px-4 border-b bg-card sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                         <SidebarTrigger className="md:hidden" />
                         <div className="md:hidden">
                            <Link href="/" className="flex items-center gap-2">
                                <Logo />
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
                        <LanguageSwitcher />
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
                        <div className="hidden md:block">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={isGuest ? undefined : "https://picsum.photos/seed/farmer/40/40"} data-ai-hint="farmer profile" />
                                            <AvatarFallback>{isGuest ? 'G' : (user?.email?.charAt(0).toUpperCase() || 'F')}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                     {!isGuest && (
                                        <>
                                            <DropdownMenuLabel>
                                                <p className="font-medium">{user?.email || 'Farmer Kumar'}</p>
                                                <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>{t('appShell.profile')}</DropdownMenuItem>
                                            <DropdownMenuItem>{t('appShell.settings')}</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                     )}
                                    <DropdownMenuItem onClick={logout}>
                                         <LogOut className="mr-2 h-4 w-4" />
                                        {t('appShell.logout')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
