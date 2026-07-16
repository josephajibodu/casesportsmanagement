import { Folder, HardDrive } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { fileManagerApi } from './api';
import type { MediaFolder } from './types';

/** Single text input dialog, used for "New folder" and every rename. */
export function PromptDialog({
    open,
    title,
    description,
    label,
    initialValue = '',
    confirmLabel = 'Save',
    onCancel,
    onConfirm,
}: {
    open: boolean;
    title: string;
    description?: string;
    label: string;
    initialValue?: string;
    confirmLabel?: string;
    onCancel: () => void;
    onConfirm: (value: string) => void;
}) {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (open) setValue(initialValue);
    }, [open, initialValue]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = value.trim();
        if (trimmed) onConfirm(trimmed);
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
            <DialogContent className="max-w-md">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>

                    <div className="grid gap-2 py-4">
                        <Label htmlFor="prompt-value">{label}</Label>
                        <Input id="prompt-value" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!value.trim()}>
                            {confirmLabel}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

/** Confirmation before destructive actions. */
export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Delete',
    onCancel,
    onConfirm,
}: {
    open: boolean;
    title: string;
    description?: string;
    confirmLabel?: string;
    onCancel: () => void;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/** Flatten the folder tree into indented options for the move picker. */
function flatten(folders: MediaFolder[], depth = 0): { folder: MediaFolder; depth: number }[] {
    return folders.flatMap((folder) => [
        { folder, depth },
        ...flatten(folder.children ?? [], depth + 1),
    ]);
}

export function MoveDialog({
    open,
    currentFolderId,
    onCancel,
    onMove,
}: {
    open: boolean;
    currentFolderId: number | null;
    onCancel: () => void;
    onMove: (folderId: number | null) => void;
}) {
    const [tree, setTree] = useState<MediaFolder[]>([]);
    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        if (!open) return;

        setSelected(currentFolderId);
        fileManagerApi.tree().then((data) => setTree(data.tree)).catch(() => setTree([]));
    }, [open, currentFolderId]);

    const options = flatten(tree);

    return (
        <Dialog open={open} onOpenChange={(next) => !next && onCancel()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Move file</DialogTitle>
                    <DialogDescription>Choose the folder to move this file into.</DialogDescription>
                </DialogHeader>

                <div className="max-h-72 space-y-0.5 overflow-y-auto py-2">
                    <button
                        type="button"
                        onClick={() => setSelected(null)}
                        className={cn(
                            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition',
                            selected === null ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-accent',
                        )}
                    >
                        <HardDrive className="size-4" /> All files (root)
                    </button>

                    {options.map(({ folder, depth }) => (
                        <button
                            key={folder.id}
                            type="button"
                            onClick={() => setSelected(folder.id)}
                            style={{ paddingLeft: `${depth * 16 + 8}px` }}
                            className={cn(
                                'flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-sm transition',
                                selected === folder.id ? 'bg-primary/10 font-medium text-primary' : 'hover:bg-accent',
                            )}
                        >
                            <Folder className="size-4 shrink-0 fill-primary/20 text-primary" />
                            <span className="truncate">{folder.name}</span>
                        </button>
                    ))}
                </div>

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={() => onMove(selected)}>
                        Move here
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
