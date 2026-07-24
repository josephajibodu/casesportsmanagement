import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Inbox, MailOpen, MoreHorizontal, Search, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdminPage, PageHeader } from '@/components/admin/layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useInitials } from '@/hooks/use-initials';
import { useRowSelection } from '@/hooks/use-row-selection';
import { avatarColor } from '@/lib/utils';

type Submission = {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    status: string;
    handled_by: string | null;
    handled_at: string | null;
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
    const [query, setQuery] = useState('');
    const getInitials = useInitials();

    const visible = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) {
            return submissions;
        }

        return submissions.filter((s) =>
            [s.name, s.email, s.subject, s.message].some((field) => field?.toLowerCase().includes(q)),
        );
    }, [submissions, query]);

    const { selected, toggle, toggleAll, clear, isAllSelected, isIndeterminate } = useRowSelection(visible);

    function setStatus(row: Submission, status: string) {
        router.patch(`/admin/enquiries/${row.id}`, { status }, { preserveScroll: true });
    }

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

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-2">
                        {[
                            { key: '', label: 'All' },
                            { key: 'new', label: `New${newCount ? ` (${newCount})` : ''}` },
                            { key: 'handled', label: 'Handled' },
                        ].map((tab) => (
                            <Link
                                key={tab.key}
                                href={tab.key ? `/admin/enquiries?status=${tab.key}` : '/admin/enquiries'}
                                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                                    filters.status === tab.key
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent'
                                }`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search name, email, message…"
                            className="pl-8"
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                aria-label="Clear search"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border bg-card shadow-sm">
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
                                <th className="hidden p-3 font-medium md:table-cell">Message</th>
                                <th className="hidden p-3 font-medium lg:table-cell">Received</th>
                                <th className="p-3 font-medium">Status</th>
                                <th className="w-12 p-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {visible.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Inbox className="size-8 text-muted-foreground/50" />
                                            {submissions.length === 0 ? (
                                                <span>No enquiries yet.</span>
                                            ) : (
                                                <span>No enquiries match your search.</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {visible.map((row) => {
                                const unread = row.status === 'new';

                                return (
                                    <tr key={row.id} className="group hover:bg-accent/30">
                                        <td className="p-3">
                                            <Checkbox
                                                checked={selected.has(row.id)}
                                                onCheckedChange={() => toggle(row.id)}
                                                aria-label={`Select enquiry from ${row.name}`}
                                            />
                                        </td>
                                        <td className="p-3">
                                            <Link href={`/admin/enquiries/${row.id}`} className="flex items-center gap-3">
                                                <span className="relative shrink-0">
                                                    <Avatar>
                                                        <AvatarFallback className={avatarColor(row.name)}>
                                                            {getInitials(row.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {unread && (
                                                        <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary ring-2 ring-card" />
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <div className={unread ? 'font-semibold' : 'font-medium'}>{row.name}</div>
                                                    <div className="truncate text-xs text-muted-foreground">{row.email}</div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="hidden max-w-xs p-3 md:table-cell">
                                            <Link href={`/admin/enquiries/${row.id}`} className="block">
                                                <div className={`truncate ${unread ? 'font-medium' : ''}`}>{row.subject ?? 'Website enquiry'}</div>
                                                <div className="truncate text-xs text-muted-foreground">{row.message}</div>
                                            </Link>
                                        </td>
                                        <td className="hidden p-3 whitespace-nowrap text-muted-foreground lg:table-cell">{row.created_at}</td>
                                        <td className="p-3">
                                            <Badge variant={unread ? 'default' : 'secondary'} className="uppercase">
                                                {row.status}
                                            </Badge>
                                            {!unread && row.handled_by && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="mt-1 truncate text-xs text-muted-foreground">by {row.handled_by}</div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{row.handled_at ?? row.handled_by}</TooltipContent>
                                                </Tooltip>
                                            )}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-end">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" aria-label="Actions">
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {unread ? (
                                                            <DropdownMenuItem onClick={() => setStatus(row, 'handled')}>
                                                                <CheckCircle2 className="size-4" /> Mark as handled
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem onClick={() => setStatus(row, 'new')}>
                                                                <MailOpen className="size-4" /> Mark as new
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem variant="destructive" onClick={() => destroy(row)}>
                                                            <Trash2 className="size-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
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
