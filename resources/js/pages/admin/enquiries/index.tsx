import { Head, Link, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { AdminPage, PageHeader } from '@/components/admin/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRowSelection } from '@/hooks/use-row-selection';

type Submission = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: string;
    created_at: string;
};

export default function EnquiriesIndex({
    submissions,
    filters,
    newCount,
}: {
    submissions: Submission[];
    filters: { status: string };
    newCount: number;
}) {
    const { selected, toggle, toggleAll, clear, isAllSelected, isIndeterminate } = useRowSelection(submissions);

    function destroy(row: Submission) {
        if (confirm(`Delete enquiry from ${row.name}?`)) {
            router.delete(`/admin/enquiries/${row.id}`, { preserveScroll: true });
        }
    }

    function bulkDestroy() {
        const ids = Array.from(selected);

        if (ids.length === 0) {
            return;
        }

        if (confirm(`Delete ${ids.length} selected enquir${ids.length === 1 ? 'y' : 'ies'}? This cannot be undone.`)) {
            router.delete('/admin/enquiries/bulk-destroy', {
                data: { ids },
                preserveScroll: true,
                onSuccess: () => clear(),
            });
        }
    }

    return (
        <>
            <Head title="Enquiries" />

            <AdminPage>
                <PageHeader title="Enquiries" description="Messages submitted through the contact form">
                    {selected.size > 0 && (
                        <Button variant="destructive" size="sm" onClick={bulkDestroy}>
                            <Trash2 className="size-4" /> Delete selected ({selected.size})
                        </Button>
                    )}
                </PageHeader>

                <div className="flex gap-2">
                    {[
                        { key: '', label: 'All' },
                        { key: 'new', label: `New${newCount ? ` (${newCount})` : ''}` },
                        { key: 'handled', label: 'Handled' },
                    ].map((tab) => (
                        <Link
                            key={tab.key}
                            href={tab.key ? `/admin/enquiries?status=${tab.key}` : '/admin/enquiries'}
                            className={`rounded-full border px-4 py-1.5 text-sm ${
                                filters.status === tab.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="w-10 p-3">
                                    <Checkbox
                                        checked={isIndeterminate ? 'indeterminate' : isAllSelected}
                                        onCheckedChange={toggleAll}
                                        aria-label="Select all"
                                    />
                                </th>
                                <th className="p-3 font-medium">From</th>
                                <th className="hidden p-3 font-medium sm:table-cell">Subject</th>
                                <th className="hidden p-3 font-medium md:table-cell">Received</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {submissions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">No enquiries.</td>
                                </tr>
                            )}
                            {submissions.map((row) => (
                                <tr key={row.id} className="hover:bg-accent/30">
                                    <td className="p-3">
                                        <Checkbox
                                            checked={selected.has(row.id)}
                                            onCheckedChange={() => toggle(row.id)}
                                            aria-label={`Select enquiry from ${row.name}`}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <Link href={`/admin/enquiries/${row.id}`} className="block">
                                            <div className="font-medium">{row.name}</div>
                                            <div className="text-xs text-muted-foreground">{row.email}</div>
                                        </Link>
                                    </td>
                                    <td className="hidden p-3 sm:table-cell">
                                        <Link href={`/admin/enquiries/${row.id}`}>{row.subject ?? '—'}</Link>
                                    </td>
                                    <td className="hidden p-3 text-muted-foreground md:table-cell">{row.created_at}</td>
                                    <td className="p-3">
                                        <Badge variant={row.status === 'new' ? 'default' : 'secondary'}>{row.status}</Badge>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-end">
                                            <Button variant="ghost" size="icon" onClick={() => destroy(row)} aria-label="Delete">
                                                <Trash2 className="size-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminPage>
        </>
    );
}

EnquiriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Enquiries', href: '/admin/enquiries' },
    ],
};
