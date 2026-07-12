import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    Newspaper,
    UserRound,
    Images,
    Handshake,
    Mail,
    Settings2,
    Globe,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin', icon: LayoutGrid },
    { title: 'Players & Coaches', href: '/admin/talents', icon: Users },
    { title: 'News & Press', href: '/admin/news', icon: Newspaper },
    { title: 'Team', href: '/admin/team', icon: UserRound },
    { title: 'Gallery', href: '/admin/media', icon: Images },
    { title: 'Partners', href: '/admin/partners', icon: Handshake },
    { title: 'Enquiries', href: '/admin/enquiries', icon: Mail },
    { title: 'Site Settings', href: '/admin/site-settings', icon: Settings2 },
];

const footerNavItems: NavItem[] = [
    { title: 'View website', href: '/', icon: Globe },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
