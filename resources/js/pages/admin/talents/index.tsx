import { Head, Link, router } from '@inertiajs/react';
import { Link2, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { AdminPage, PageHeader } from '@/components/admin/layout';
import { copyToClipboard } from '@/components/file-manager/share-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRowSelection } from '@/hooks/use-row-selection';

type TalentRow = {
    id: number;
    full_name: string;
    type: string;
    position: string | null;
    nationality: string | null;
    photo_url: string | null;
    is_featured: boolean;
    status: string;
    public_url: string;
};

export default function TalentsIndex({ talents }: { talents: TalentRow[] }) {
    const { selected, toggle, toggleAll, clear, isAllSelected, isIndeterminate } = useRowSelection(talents);

    function destroy(row: TalentRow) {
        if (confirm(`Delete ${row.full_name}? This cannot be undone.`)) {
            router.delete(`/admin/talents/${row.id}`, { preserveScroll: true });
        }
    }

    function bulkDestroy() {
        const ids = Array.from(selected);

        if (ids.length === 0) {
            return;
        }

        if (confirm(`Delete ${ids.length} selected profile${ids.length === 1 ? '' : 's'}? This cannot be undone.`)) {
            router.delete('/admin/talents/bulk-destroy', {
                data: { ids },
                preserveScroll: true,
                onSuccess: () => clear(),
            });
        }
    }

    function toggleFeatured(row: TalentRow) {
        router.patch(`/admin/talents/${row.id}/featured`, {}, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Players & Coaches" />

            <AdminPage>
                <PageHeader title="Players & Coaches" description="Manage represented talent">
                    <div className="flex items-center gap-2">
                        {selected.size > 0 && (
                            <Button variant="destructive" size="sm" onClick={bulkDestroy}>
                                <Trash2 className="size-4" /> Delete selected ({selected.size})
                            </Button>
                        )}
                        <Button asChild>
                            <Link href="/admin/talents/create">
                                <Plus className="size-4" /> Add profile
                            </Link>
                        </Button>
                    </div>
                </PageHeader>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
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
                                <th className="p-3 font-medium">Name</th>
                                <th className="p-3 font-medium">Type</th>
                                <th className="hidden p-3 font-medium sm:table-cell">Position</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="p-3 font-medium">Featured</th>
                                <th className="p-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {talents.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        No profiles yet. Add your first player or coach.
                                    </td>
                                </tr>
                            )}
                            {talents.map((row) => (
                                <tr key={row.id} className="hover:bg-accent/30">
                                    <td className="p-3">
                                        <Checkbox
                                            checked={selected.has(row.id)}
                                            onCheckedChange={() => toggle(row.id)}
                                            aria-label={`Select ${row.full_name}`}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="size-9 shrink-0 overflow-hidden rounded-full bg-muted">
                                                {row.photo_url && (
                                                    <img src={row.photo_url} alt="" className="size-full object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium">{row.full_name}</div>
                                                <div className="text-xs text-muted-foreground">{row.nationality}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3 capitalize">{row.type}</td>
                                    <td className="hidden p-3 sm:table-cell">{row.position ?? '—'}</td>
                                    <td className="p-3">
                                        <Badge variant={row.status === 'published' ? 'default' : 'secondary'}>
                                            {row.status}
                                        </Badge>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleFeatured(row)}
                                            aria-label="Toggle featured"
                                        >
                                            <Star
                                                className={
                                                    row.is_featured
                                                        ? 'size-5 fill-amber-400 text-amber-400'
                                                        : 'size-5 text-muted-foreground'
                                                }
                                            />
                                        </button>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => copyToClipboard(row.public_url)}
                                                aria-label="Copy shareable link"
                                            >
                                                <Link2 className="size-4" />
                                            </Button>
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/talents/${row.id}/edit`} aria-label="Edit">
                                                    <Pencil className="size-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => destroy(row)}
                                                aria-label="Delete"
                                            >
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

TalentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Players & Coaches', href: '/admin/talents' },
    ],
};
