import { Head, Link, router } from '@inertiajs/react';
import { Link2, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPage, PageHeader } from '@/components/admin/layout';
import { copyToClipboard } from '@/components/file-manager/share-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useRowSelection } from '@/hooks/use-row-selection';

type Article = {
    id: number;
    title: string;
    category: string | null;
    status: string;
    published_at: string | null;
    image_url: string | null;
    public_url: string;
};

export default function NewsIndex({ articles }: { articles: Article[] }) {
    const { selected, toggle, toggleAll, clear, isAllSelected, isIndeterminate } = useRowSelection(articles);

    function destroy(row: Article) {
        if (confirm(`Delete "${row.title}"?`)) {
            router.delete(`/admin/news/${row.id}`, { preserveScroll: true });
        }
    }

    function bulkDestroy() {
        const ids = Array.from(selected);

        if (ids.length === 0) {
            return;
        }

        if (confirm(`Delete ${ids.length} selected article${ids.length === 1 ? '' : 's'}? This cannot be undone.`)) {
            router.delete('/admin/news/bulk-destroy', {
                data: { ids },
                preserveScroll: true,
                onSuccess: () => clear(),
            });
        }
    }

    return (
        <>
            <Head title="News & Press" />

            <AdminPage>
                <PageHeader title="News & Press" description="Publish agency news and announcements">
                    <div className="flex items-center gap-2">
                        {selected.size > 0 && (
                            <Button variant="destructive" size="sm" onClick={bulkDestroy}>
                                <Trash2 className="size-4" /> Delete selected ({selected.size})
                            </Button>
                        )}
                        <Button asChild>
                            <Link href="/admin/news/create">
                                <Plus className="size-4" /> New article
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
                                <th className="p-3 font-medium">Title</th>
                                <th className="hidden p-3 font-medium sm:table-cell">Category</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="hidden p-3 font-medium sm:table-cell">Published</th>
                                <th className="p-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {articles.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No articles yet.
                                    </td>
                                </tr>
                            )}
                            {articles.map((row) => (
                                <tr key={row.id} className="hover:bg-accent/30">
                                    <td className="p-3">
                                        <Checkbox
                                            checked={selected.has(row.id)}
                                            onCheckedChange={() => toggle(row.id)}
                                            aria-label={`Select ${row.title}`}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-14 shrink-0 overflow-hidden rounded bg-muted">
                                                {row.image_url && <img src={row.image_url} alt="" className="size-full object-cover" />}
                                            </div>
                                            <span className="font-medium">{row.title}</span>
                                        </div>
                                    </td>
                                    <td className="hidden p-3 sm:table-cell">{row.category ?? '—'}</td>
                                    <td className="p-3">
                                        <Badge variant={row.status === 'published' ? 'default' : 'secondary'}>{row.status}</Badge>
                                    </td>
                                    <td className="hidden p-3 sm:table-cell">{row.published_at ?? '—'}</td>
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
                                                <Link href={`/admin/news/${row.id}/edit`} aria-label="Edit">
                                                    <Pencil className="size-4" />
                                                </Link>
                                            </Button>
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

NewsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'News & Press', href: '/admin/news' },
    ],
};
