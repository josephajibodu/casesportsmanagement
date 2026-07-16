import { Copy, Link2, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fileManagerApi } from './api';
import type { MediaFile } from './types';

export async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        toast.success('Link copied to clipboard.');
    } catch {
        toast.error('Could not copy the link.');
    }
}

/**
 * Generate, copy, expire and revoke a public share link for a file.
 * Existing links are reused rather than regenerated unless asked.
 */
export function ShareDialog({
    file,
    onClose,
    onUpdated,
}: {
    file: MediaFile | null;
    onClose: () => void;
    onUpdated: (file: MediaFile) => void;
}) {
    const [expiresAt, setExpiresAt] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);

    if (!file) return null;

    async function run(action: () => Promise<{ file: MediaFile }>, message: string) {
        setBusy(true);
        try {
            const { file: updated } = await action();
            onUpdated(updated);
            toast.success(message);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setBusy(false);
        }
    }

    const generate = (regenerate = false) =>
        run(
            () =>
                fileManagerApi.share(file.id, {
                    expires_at: expiresAt || null,
                    password: password || null,
                    regenerate,
                }),
            regenerate ? 'A new link was generated.' : 'Share link ready.',
        );

    const revoke = () => run(() => fileManagerApi.revokeShare(file.id), 'Share link revoked.');

    return (
        <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share “{file.name}”</DialogTitle>
                    <DialogDescription>
                        Anyone with the link can view this file. The link works the same on local and cloud storage.
                    </DialogDescription>
                </DialogHeader>

                {file.is_shared && file.share_url ? (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Share link</Label>
                            <div className="flex gap-2">
                                <Input readOnly value={file.share_url} onFocus={(e) => e.target.select()} />
                                <Button type="button" variant="outline" size="icon" onClick={() => copyToClipboard(file.share_url!)} aria-label="Copy link">
                                    <Copy className="size-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Created {file.shared_at ? new Date(file.shared_at).toLocaleString() : 'just now'}
                                {file.share_expires_at && ` · Expires ${new Date(file.share_expires_at).toLocaleString()}`}
                                {file.share_has_password && ' · Password protected'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => generate(true)} disabled={busy}>
                                <RefreshCw className="size-4" /> Generate new link
                            </Button>
                            <Button type="button" variant="ghost" size="sm" onClick={revoke} disabled={busy}>
                                <Trash2 className="size-4 text-destructive" /> Revoke
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="expires_at">Expires (optional)</Label>
                            <Input id="expires_at" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="share_password">Password (optional)</Label>
                            <Input
                                id="share_password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank for no password"
                            />
                        </div>
                        <Button type="button" onClick={() => generate(false)} disabled={busy} className="w-full">
                            <Link2 className="size-4" /> Create share link
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
