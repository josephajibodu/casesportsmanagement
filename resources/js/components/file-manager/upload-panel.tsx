import { CloudUpload, Pencil, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fileManagerApi } from './api';
import { FileIcon } from './file-icon';
import { ImageEditor } from './image-editor';
import type { MediaFile, UploadItem } from './types';

function uid() {
    return Math.random().toString(36).slice(2);
}

function isImage(file: File) {
    return file.type.startsWith('image/');
}

/**
 * Queue + upload files into the current folder. Images can optionally be
 * cropped, rotated, resized and compressed before they are sent.
 */
export function UploadPanel({
    folderId,
    accept,
    initialFiles,
    onUploaded,
    className,
}: {
    folderId: number | null;
    accept?: string[];
    /** Files handed over from a drag-and-drop onto the browser. */
    initialFiles?: File[];
    onUploaded: (file: MediaFile) => void;
    className?: string;
}) {
    const [items, setItems] = useState<UploadItem[]>([]);
    const [dragging, setDragging] = useState(false);
    const [editing, setEditing] = useState<UploadItem | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const update = useCallback((id: string, patch: Partial<UploadItem>) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    }, []);

    const addFiles = useCallback((files: File[]) => {
        const queued: UploadItem[] = files.map((file) => ({
            id: uid(),
            file,
            name: file.name,
            previewUrl: isImage(file) ? URL.createObjectURL(file) : null,
            progress: 0,
            status: 'queued',
        }));

        setItems((prev) => [...prev, ...queued]);
    }, []);

    // Seed the queue with files dropped onto the browser before this opened.
    useEffect(() => {
        if (initialFiles?.length) addFiles(initialFiles);
    }, [initialFiles, addFiles]);

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragging(false);
        addFiles(Array.from(e.dataTransfer.files));
    }

    async function uploadItem(item: UploadItem) {
        update(item.id, { status: 'uploading', progress: 0 });

        try {
            const uploaded = await fileManagerApi.upload(item.file, folderId, {
                onProgress: (progress) => update(item.id, { progress }),
                onAbortReady: (abort) => update(item.id, { abort }),
            });

            update(item.id, { status: 'done', progress: 100 });
            onUploaded(uploaded);
        } catch (error) {
            const message = (error as Error).message;
            update(item.id, { status: message === 'Upload cancelled.' ? 'cancelled' : 'error', error: message });
        }
    }

    async function uploadAll() {
        const pending = items.filter((item) => item.status === 'queued' || item.status === 'error');
        if (!pending.length) return;

        await Promise.all(pending.map(uploadItem));
        toast.success('Upload complete.');
    }

    function remove(item: UploadItem) {
        item.abort?.();
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        setItems((prev) => prev.filter((i) => i.id !== item.id));
    }

    function applyEdit(edited: File) {
        if (!editing) return;

        if (editing.previewUrl) URL.revokeObjectURL(editing.previewUrl);
        update(editing.id, { file: edited, name: edited.name, previewUrl: URL.createObjectURL(edited), status: 'queued', progress: 0 });
        setEditing(null);
    }

    const pendingCount = items.filter((i) => i.status === 'queued' || i.status === 'error').length;

    return (
        <div className={cn('space-y-4', className)}>
            {/* Drop zone */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition',
                    dragging ? 'border-primary bg-primary/5' : 'hover:border-primary/40 hover:bg-accent/30',
                )}
            >
                <CloudUpload className={cn('size-8', dragging ? 'text-primary' : 'text-muted-foreground')} />
                <p className="mt-3 text-sm font-medium">Drop files here, or click to browse</p>
                <p className="mt-1 text-xs text-muted-foreground">
                    {accept?.length ? `Accepts ${accept.join(', ')}` : 'Any file type'}
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={accept?.join(',')}
                    className="hidden"
                    onChange={(e) => {
                        addFiles(Array.from(e.target.files ?? []));
                        e.target.value = '';
                    }}
                />
            </div>

            {/* Queue */}
            {items.length > 0 && (
                <div className="space-y-2">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 rounded-lg border p-2.5">
                            <div className="size-10 shrink-0 overflow-hidden rounded border bg-muted/40">
                                {item.previewUrl ? (
                                    <img src={item.previewUrl} alt="" className="size-full object-cover" />
                                ) : (
                                    <div className="flex size-full items-center justify-center">
                                        <FileIcon type="other" className="size-4" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">{item.name}</div>

                                {item.status === 'uploading' ? (
                                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                                        <div className="h-full bg-primary transition-all" style={{ width: `${item.progress}%` }} />
                                    </div>
                                ) : (
                                    <div
                                        className={cn(
                                            'text-xs',
                                            item.status === 'error' ? 'text-destructive' : 'text-muted-foreground',
                                        )}
                                    >
                                        {item.status === 'done' && 'Uploaded'}
                                        {item.status === 'queued' && `${(item.file.size / 1024).toFixed(0)} KB, ready`}
                                        {item.status === 'cancelled' && 'Cancelled'}
                                        {item.status === 'error' && item.error}
                                    </div>
                                )}
                            </div>

                            {isImage(item.file) && item.status !== 'done' && item.status !== 'uploading' && (
                                <Button type="button" size="icon" variant="ghost" onClick={() => setEditing(item)} aria-label="Edit image">
                                    <Pencil className="size-4" />
                                </Button>
                            )}

                            {item.status !== 'done' && (
                                <Button type="button" size="icon" variant="ghost" onClick={() => remove(item)} aria-label="Remove">
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                    ))}

                    <div className="flex items-center justify-between pt-1">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setItems([])}>
                            Clear
                        </Button>
                        <Button type="button" size="sm" onClick={uploadAll} disabled={pendingCount === 0}>
                            Upload {pendingCount > 0 && `(${pendingCount})`}
                        </Button>
                    </div>
                </div>
            )}

            <ImageEditor file={editing?.file ?? null} open={!!editing} onCancel={() => setEditing(null)} onApply={applyEdit} />
        </div>
    );
}
