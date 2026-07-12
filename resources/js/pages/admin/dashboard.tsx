import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';

type Stats = {
    talents: number;
    players: number;
    coaches: number;
    published_talents: number;
    news: number;
    published_news: number;
    team: number;
    partners: number;
    media: number;
    new_enquiries: number;
};

type Enquiry = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    status: string;
    created_at: string;
};

const cards = [
    { key: 'players', label: 'Players', href: '/admin/talents' },
    { key: 'coaches', label: 'Coaches', href: '/admin/talents' },
    { key: 'published_news', label: 'Published news', href: '/admin/news' },
    { key: 'team', label: 'Team members', href: '/admin/team' },
    { key: 'media', label: 'Gallery items', href: '/admin/media' },
    { key: 'partners', label: 'Partners', href: '/admin/partners' },
] as const;

export default function AdminDashboard({
    stats,
    recentEnquiries,
}: {
    stats: Stats;
    recentEnquiries: Enquiry[];
}) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                <Heading title="Dashboard" description="Overview of your website content" />

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    {cards.map((card) => (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="rounded-xl border p-4 transition hover:border-primary/40 hover:bg-accent/40"
                        >
                            <div className="text-3xl font-semibold">{stats[card.key]}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{card.label}</div>
                        </Link>
                    ))}
                </div>

                <div className="rounded-xl border">
                    <div className="flex items-center justify-between border-b p-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-semibold">Recent enquiries</h2>
                            {stats.new_enquiries > 0 && (
                                <Badge variant="secondary">{stats.new_enquiries} new</Badge>
                            )}
                        </div>
                        <Link href="/admin/enquiries" className="text-sm text-primary hover:underline">
                            View all
                        </Link>
                    </div>

                    {recentEnquiries.length === 0 ? (
                        <p className="p-4 text-sm text-muted-foreground">No enquiries yet.</p>
                    ) : (
                        <ul className="divide-y">
                            {recentEnquiries.map((enquiry) => (
                                <li key={enquiry.id}>
                                    <Link
                                        href={`/admin/enquiries/${enquiry.id}`}
                                        className="flex items-center justify-between gap-4 p-4 hover:bg-accent/40"
                                    >
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium">
                                                {enquiry.name}
                                                {enquiry.subject ? ` — ${enquiry.subject}` : ''}
                                            </div>
                                            <div className="truncate text-xs text-muted-foreground">
                                                {enquiry.email}
                                            </div>
                                        </div>
                                        {enquiry.status === 'new' && <Badge>New</Badge>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/admin' }],
};
