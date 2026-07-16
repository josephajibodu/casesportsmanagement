import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { FileManager } from './file-manager';
import type { MediaFile } from './types';
import { UploadPanel } from './upload-panel';
import { useFileManager } from './use-file-manager';

type Tab = 'browse' | 'upload';

/**
 * The reusable file picker. Any admin form opens this instead of using a
 * native file input, so every upload lands in the File Manager.
 */
export function FileManagerModal({
    open,
    onClose,
    onSelect,
    multiple = false,
    accept,
    title = 'Select a file',
}: {
    open: boolean;
    onClose: () => void;
    onSelect: (files: MediaFile[]) => void;
    multiple?: boolean;
    /** e.g. ['image/*'] or ['jpg','png','pdf'] */
    accept?: string[];
    title?: string;
}) {
    const fm = useFileManager({ accept });
    const [tab, setTab] = useState<Tab>('browse');
    const [selected, setSelected] = useState<MediaFile[]>([]);

    function toggle(file: MediaFile) {
        if (!fm.isSelectable(file)) return;

        setSelected((prev) => {
            const exists = prev.some((f) => f.id === file.id);
            if (multiple) {
                return exists ? prev.filter((f) => f.id !== file.id) : [...prev, file];
            }
            return exists ? [] : [file];
        });
    }

    function confirm() {
        if (!selected.length) return;

        onSelect(selected);
        setSelected([]);
        onClose();
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    setSelected([]);
                    onClose();
                }
            }}
        >
            {/* The sm:* variant matters: DialogContent ships `sm:max-w-lg`, which
                a plain `max-w-*` cannot override (different variant, so
                tailwind-merge keeps both and the sm: rule wins). */}
            <DialogContent className="flex h-[85vh] w-[95vw] flex-col gap-0 p-0 sm:max-w-6xl">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {multiple ? 'Choose one or more files, or upload new ones.' : 'Choose a file, or upload a new one.'}
                    </DialogDescription>
                </DialogHeader>

                {/* Tabs */}
                <div className="flex gap-1 border-b px-6 pt-3">
                    {(['browse', 'upload'] as Tab[]).map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setTab(value)}
                            className={cn(
                                '-mb-px border-b-2 px-4 py-2 text-sm font-medium capitalize transition',
                                tab === value
                                    ? 'border-primary text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {value === 'browse' ? 'Browse files' : 'Upload'}
                        </button>
                    ))}
                </div>

                {/* Only the file area scrolls, so the toolbar, sidebar and
                    breadcrumbs stay put like a desktop file manager. */}
                <div className="min-h-0 flex-1 overflow-hidden p-6">
                    {tab === 'browse' ? (
                        <FileManager
                            fm={fm}
                            accept={accept}
                            selectedIds={selected.map((f) => f.id)}
                            onFileClick={toggle}
                            onUploadRequest={() => setTab('upload')}
                            className="h-full"
                            contentClassName="overflow-y-auto pr-1"
                        />
                    ) : (
                        <div className="h-full overflow-y-auto">
                            <UploadPanel
                                folderId={fm.folderId}
                                accept={accept}
                                onUploaded={(file) => {
                                    // New uploads appear in the browser and are pre-selected.
                                    fm.addUploadedFile(file);
                                    fm.refresh();
                                    setSelected((prev) => (multiple ? [...prev, file] : [file]));
                                }}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="border-t px-6 py-4">
                    <span className="mr-auto text-sm text-muted-foreground">
                        {selected.length > 0
                            ? `${selected.length} selected`
                            : tab === 'upload'
                              ? 'Uploaded files are selected automatically.'
                              : 'Nothing selected'}
                    </span>
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="button" onClick={confirm} disabled={!selected.length}>
                        {multiple && selected.length > 1 ? `Use ${selected.length} files` : 'Use file'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
