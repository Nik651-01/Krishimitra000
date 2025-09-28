
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, TestTube2, CloudSun, BookOpen, MapPin, ShoppingCart, Sparkles, Microscope } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { AssistantDialog } from '../assistant/assistant-dialog';
import { useTranslation } from '@/hooks/use-translation';

const navItems = [
    { href: '/', icon: Home, labelKey: 'nav.dashboard' },
    { href: '/recommendations', icon: Home, labelKey: 'nav.cropRecommendations' },
    { href: '/soil-health', icon: TestTube2, labelKey: 'nav.soilHealth' },
    { href: '/weather', icon: CloudSun, labelKey: 'nav.weather' },
    { href: '/disease-detection', icon: Microscope, labelKey: 'nav.diseaseDetection' },
    { href: '/advisories', icon: BookOpen, labelKey: 'nav.advisoryServices' },
    { href: '/geofencing', icon: MapPin, labelKey: 'nav.geofencing' },
    { href: '/marketplace', icon: ShoppingCart, labelKey: 'nav.marketplace' },
];

export function SidebarNav() {
    const pathname = usePathname();
    const { t } = useTranslation();

    return (
        <div className="flex flex-col h-full">
            <SidebarMenu className="flex-1">
                {navItems.map((item) => (
                    <SidebarMenuItem key={item.labelKey}>
                        <SidebarMenuButton asChild isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}>
                            <Link href={item.href} className="flex items-center gap-2">
                                {typeof item.icon === 'string' ? (
                                    <Image src={item.icon} alt={t(item.labelKey)} width={24} height={24} />
                                ) : (
                                    <item.icon />
                                )}
                                <span>{t(item.labelKey)}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <SidebarMenu>
                 <SidebarMenuItem>
                    <AssistantDialog>
                        <SidebarMenuButton className="flex items-center gap-2">
                            <Sparkles />
                            <span>{t('nav.aiAssistant')}</span>
                        </SidebarMenuButton>
                    </AssistantDialog>
                </SidebarMenuItem>
            </SidebarMenu>
        </div>
    );
}
