import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Play, Plus, Trash2 } from 'lucide-react';
import { AdminPage, PageHeader } from '@/components/admin/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Item = {
    id: number;
    media_type: string;
    category: string | null;
    caption: string | null;
    image_url: string | null;
    video_url: string | null;
    talent: string | null;
    sort_order: number;
};

export default function MediaIndex({ items, filters }: { items: Item[]; filters: { type: string } }) {
    function destroy(row: Item) {
        if (confirm('Delete this media item?')) {
            router.delete(`/admin/media/${row.id}`, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Gallery" />

            <AdminPage>
                <PageHeader title="Gallery" description="Images and videos shown on the site">
                    <Button asChild>
                        <Link href="/admin/media/create">
                            <Plus className="size-4" /> Add media
                        </Link>
                    </Button>
                </PageHeader>

                <div className="flex gap-2">
                    {[
                        { key: '', label: 'All' },
                        { key: 'image', label: 'Images' },
                        { key: 'video', label: 'Videos' },
                    ].map((tab) => (
                        <Link
                            key={tab.key}
                            href={tab.key ? `/admin/media?type=${tab.key}` : '/admin/media'}
                            className={`rounded-full border px-4 py-1.5 text-sm ${
                                filters.type === tab.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                            }`}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {items.length === 0 && <p className="text-sm text-muted-foreground">No media items yet.</p>}
                    {items.map((row) => (
                        <div key={row.id} className="overflow-hidden rounded-xl border">
                            <div className="relative flex aspect-video items-center justify-center bg-muted">
                                {row.media_type === 'image' && row.image_url ? (
                                    <img src={row.image_url} alt="" className="size-full object-cover" />
                                ) : (
                                    <Play className="size-8 text-muted-foreground" />
                                )}
                                <Badge className="absolute left-2 top-2 capitalize" variant="secondary">
                                    {row.media_type}
                                </Badge>
                            </div>
                            <div className="p-3">
                                <div className="truncate text-sm font-medium">{row.caption ?? '—'}</div>
                                <div className="truncate text-xs text-muted-foreground">
                                    {row.category}
                                    {row.talent ? ` · ${row.talent}` : ''}
                                </div>
                                <div className="mt-2 flex justify-end gap-1">
                                    <Button asChild variant="ghost" size="icon">
                                        <Link href={`/admin/media/${row.id}/edit`} aria-label="Edit">
                                            <Pencil className="size-4" />
                                        </Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => destroy(row)} aria-label="Delete">
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </AdminPage>
        </>
    );
}

MediaIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Gallery', href: '/admin/media' },
    ],
};
