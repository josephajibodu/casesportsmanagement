import { Head, Link, router, usePage } from '@inertiajs/react';
import { Copy, KeyRound, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AdminPage, PageHeader } from '@/components/admin/layout';
import { copyToClipboard } from '@/components/file-manager/share-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Admin = {
    id: number;
    name: string;
    email: string;
    created_at: string | null;
};

type GeneratedAdmin = {
    name: string;
    email: string;
    password: string;
    login_url: string;
};

export default function AdminsIndex({ admins }: { admins: Admin[] }) {
    const { props } = usePage<{ auth: { user: { id: number } } }>();
    const [credentials, setCredentials] = useState<GeneratedAdmin | null>(null);

    // Inertia delivers flash data as a top-level page field (not a prop), surfaced
    // via this router event — the same mechanism useFlashToast uses for toasts.
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash as { generatedAdmin?: GeneratedAdmin } | undefined;

            if (flash?.generatedAdmin) {
                setCredentials(flash.generatedAdmin);
            }
        });
    }, []);

    function destroy(row: Admin) {
        if (confirm(`Delete ${row.name}? This cannot be undone.`)) {
            router.delete(`/admin/admins/${row.id}`, { preserveScroll: true });
        }
    }

    function resetPassword(row: Admin) {
        if (confirm(`Generate a new password for ${row.name}? Their current password will stop working immediately.`)) {
            router.post(`/admin/admins/${row.id}/reset-password`, {}, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Admins" />

            <AdminPage>
                <PageHeader title="Admins" description="Manage who can sign in to this admin panel">
                    <Button asChild>
                        <Link href="/admin/admins/create">
                            <Plus className="size-4" /> Add admin
                        </Link>
                    </Button>
                </PageHeader>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left text-xs text-muted-foreground uppercase">
                            <tr>
                                <th className="p-3 font-medium">Name</th>
                                <th className="p-3 font-medium">Email</th>
                                <th className="hidden p-3 font-medium sm:table-cell">Added</th>
                                <th className="p-3 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {admins.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                        No admins yet.
                                    </td>
                                </tr>
                            )}
                            {admins.map((row) => {
                                const isSelf = row.id === props.auth.user.id;

                                return (
                                    <tr key={row.id} className="hover:bg-accent/30">
                                        <td className="p-3">
                                            <div className="font-medium">
                                                {row.name}
                                                {isSelf && <span className="ml-2 text-xs text-muted-foreground">(you)</span>}
                                            </div>
                                        </td>
                                        <td className="p-3 text-muted-foreground">{row.email}</td>
                                        <td className="hidden p-3 text-muted-foreground sm:table-cell">{row.created_at ?? '—'}</td>
                                        <td className="p-3">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => resetPassword(row)}
                                                    aria-label="Generate new password"
                                                >
                                                    <KeyRound className="size-4" />
                                                </Button>
                                                <Button asChild variant="ghost" size="icon">
                                                    <Link href={`/admin/admins/${row.id}/edit`} aria-label="Edit">
                                                        <Pencil className="size-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => destroy(row)}
                                                    disabled={isSelf}
                                                    aria-label="Delete"
                                                >
                                                    <Trash2 className="size-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </AdminPage>

            <Dialog open={!!credentials} onOpenChange={(open) => !open && setCredentials(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{credentials?.name}'s credentials</DialogTitle>
                        <DialogDescription>
                            Share these with {credentials?.name} now. The password won't be shown again.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Login link</Label>
                            <div className="flex gap-2">
                                <Input readOnly value={credentials?.login_url ?? ''} onFocus={(e) => e.target.select()} />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => credentials && copyToClipboard(credentials.login_url)}
                                    aria-label="Copy login link"
                                >
                                    <Copy className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <div className="flex gap-2">
                                <Input readOnly value={credentials?.email ?? ''} onFocus={(e) => e.target.select()} />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => credentials && copyToClipboard(credentials.email)}
                                    aria-label="Copy email"
                                >
                                    <Copy className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label>Temporary password</Label>
                            <div className="flex gap-2">
                                <Input readOnly value={credentials?.password ?? ''} onFocus={(e) => e.target.select()} />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => credentials && copyToClipboard(credentials.password)}
                                    aria-label="Copy password"
                                >
                                    <Copy className="size-4" />
                                </Button>
                            </div>
                        </div>
                        <Button
                            type="button"
                            className="w-full"
                            onClick={() =>
                                credentials &&
                                copyToClipboard(
                                    `Login: ${credentials.login_url}\nEmail: ${credentials.email}\nPassword: ${credentials.password}`,
                                )
                            }
                        >
                            <Copy className="size-4" /> Copy all
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

AdminsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Admins', href: '/admin/admins' },
    ],
};
