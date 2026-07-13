import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPage, PageHeader } from '@/components/admin/layout';
import { Button } from '@/components/ui/button';

type Partner = {
    id: number;
    name: string;
    description: string | null;
    sort_order: number;
    logo_url: string | null;
};

export default function PartnersIndex({ partners }: { partners: Partner[] }) {
    function destroy(row: Partner) {
        if (confirm(`Delete ${row.name}?`)) {
            router.delete(`/admin/partners/${row.id}`, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Partners" />

            <AdminPage>
                <PageHeader title="Partners" description="Display-only logos shown across the site">
                    <Button asChild>
                        <Link href="/admin/partners/create">
                            <Plus className="size-4" /> Add partner
                        </Link>
                    </Button>
                </PageHeader>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {partners.length === 0 && <p className="text-sm text-muted-foreground">No partners yet.</p>}
                    {partners.map((row) => (
                        <div key={row.id} className="flex items-center gap-4 rounded-xl border p-4">
                            <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                                {row.logo_url ? (
                                    <img src={row.logo_url} alt="" className="max-h-12 max-w-full object-contain" />
                                ) : (
                                    <span className="px-1 text-center text-xs font-medium">{row.name}</span>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate font-medium">{row.name}</div>
                                <div className="truncate text-sm text-muted-foreground">{row.description}</div>
                            </div>
                            <div className="flex gap-1">
                                <Button asChild variant="ghost" size="icon">
                                    <Link href={`/admin/partners/${row.id}/edit`} aria-label="Edit">
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
            </AdminPage>
        </>
    );
}

PartnersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Partners', href: '/admin/partners' },
    ],
};
