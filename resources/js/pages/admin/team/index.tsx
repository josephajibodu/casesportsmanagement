import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

type Member = {
    id: number;
    full_name: string;
    title: string | null;
    sort_order: number;
    photo_url: string | null;
};

export default function TeamIndex({ members }: { members: Member[] }) {
    function destroy(row: Member) {
        if (confirm(`Delete ${row.full_name}?`)) {
            router.delete(`/admin/team/${row.id}`, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Team" />

            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading title="Team" description="Agency management shown on the About page" />
                    <Button asChild>
                        <Link href="/admin/team/create">
                            <Plus className="size-4" /> Add member
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {members.length === 0 && (
                        <p className="text-sm text-muted-foreground">No team members yet.</p>
                    )}
                    {members.map((row) => (
                        <div key={row.id} className="flex items-center gap-4 rounded-xl border p-4">
                            <div className="size-14 shrink-0 overflow-hidden rounded-full bg-muted">
                                {row.photo_url && <img src={row.photo_url} alt="" className="size-full object-cover" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate font-medium">{row.full_name}</div>
                                <div className="truncate text-sm text-muted-foreground">{row.title}</div>
                            </div>
                            <div className="flex gap-1">
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={`/admin/team/${row.id}/edit`} aria-label="Edit">
                                        <Pencil className="size-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => destroy(row)} aria-label="Delete">
                                    <Trash2 className="size-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

TeamIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Team', href: '/admin/team' },
    ],
};
