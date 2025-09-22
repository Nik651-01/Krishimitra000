'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Leaf, TestTube2, CloudSun, BookOpen, MapPin, ShoppingCart } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/recommendations', icon: Leaf, label: 'Crop Recommendations' },
    { href: '/soil-health', icon: TestTube2, label: 'Soil Health' },
    { href: '/weather', icon: CloudSun, label: 'Weather' },
    { href: '/advisories', icon: BookOpen, label: 'Advisory Services' },
    { href: '/geofencing', icon: MapPin, label: 'Geofencing' },
    { href: '/marketplace', icon: ShoppingCart, label: 'Marketplace' },
];

export function SidebarNav() {
    const pathname = usePathname();

    return (
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild isActive={pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))}>
                        <Link href={item.href}>
                            <item.icon />
                            <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
