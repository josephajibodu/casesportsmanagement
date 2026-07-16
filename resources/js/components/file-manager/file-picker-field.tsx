import { GripVertical, ImagePlus, X } from 'lucide-react';
import { useState } from 'react';
import { Field } from '@/components/admin/layout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileIcon } from './file-icon';
import { FileManagerModal } from './file-manager-modal';
import type { MediaFile } from './types';

/** A picked file as stored by a form: the storage path plus a URL to preview. */
export type PickedFile = { path: string; url: string | null; name?: string; type?: MediaFile['type'] };

function toPicked(file: MediaFile): PickedFile {
    return { path: file.path, url: file.url, name: file.name, type: file.type };
}

/**
 * Single-file picker. Replaces native file inputs: opens the File Manager so
 * every upload and selection flows through one place.
 */
export function FilePicker({
    label,
    value,
    onChange,
    accept = ['image/*'],
    error,
    hint,
    required,
    buttonLabel = 'Choose file',
}: {
    label: string;
    value: PickedFile | null;
    onChange: (file: PickedFile | null) => void;
    accept?: string[];
    error?: string;
    hint?: string;
    required?: boolean;
    buttonLabel?: string;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Field label={label} error={error} hint={hint} required={required}>
            <div className="flex items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/40">
                    {value?.url && (value.type === 'image' || !value.type) ? (
                        <img src={value.url} alt="" className="size-full object-cover" />
                    ) : value ? (
                        <FileIcon type={value.type ?? 'other'} className="size-6" />
                    ) : (
                        <ImagePlus className="size-5 text-muted-foreground" />
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
                        {value ? 'Change' : buttonLabel}
                    </Button>
                    {value && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
                            <X className="size-4" /> Remove
                        </Button>
                    )}
                    {value?.name && <span className="truncate text-xs text-muted-foreground">{value.name}</span>}
                </div>
            </div>

            <FileManagerModal
                open={open}
                onClose={() => setOpen(false)}
                accept={accept}
                multiple={false}
                title={label}
                onSelect={(files) => files[0] && onChange(toPicked(files[0]))}
            />
        </Field>
    );
}

/**
 * Multi-file picker for galleries. Keeps order and allows removal.
 */
export function MultiFilePicker({
    label,
    values,
    onChange,
    accept = ['image/*'],
    error,
    hint,
    buttonLabel = 'Add files',
}: {
    label: string;
    values: PickedFile[];
    onChange: (files: PickedFile[]) => void;
    accept?: string[];
    error?: string;
    hint?: string;
    buttonLabel?: string;
}) {
    const [open, setOpen] = useState(false);

    function add(files: MediaFile[]) {
        const picked = files.map(toPicked);
        const merged = [...values];

        picked.forEach((file) => {
            if (!merged.some((existing) => existing.path === file.path)) merged.push(file);
        });

        onChange(merged);
    }

    return (
        <Field label={label} error={error} hint={hint}>
            <div className="space-y-3">
                {values.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                        {values.map((file) => (
                            <div key={file.path} className="group relative size-24 overflow-hidden rounded-lg border">
                                {file.url && (file.type === 'image' || !file.type) ? (
                                    <img src={file.url} alt="" className="size-full object-cover" />
                                ) : (
                                    <div className="flex size-full flex-col items-center justify-center gap-1 bg-muted/40 p-1">
                                        <FileIcon type={file.type ?? 'other'} className="size-5" />
                                        <span className="line-clamp-2 text-center text-[10px] text-muted-foreground">{file.name}</span>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => onChange(values.filter((f) => f.path !== file.path))}
                                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
                                    aria-label={`Remove ${file.name ?? 'file'}`}
                                >
                                    <X className="size-3" />
                                </button>
                                <span className={cn('absolute bottom-1 left-1 rounded bg-black/50 p-0.5 text-white opacity-0 transition group-hover:opacity-100')}>
                                    <GripVertical className="size-3" />
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
                    <ImagePlus className="size-4" /> {buttonLabel}
                </Button>
            </div>

            <FileManagerModal
                open={open}
                onClose={() => setOpen(false)}
                accept={accept}
                multiple
                title={label}
                onSelect={add}
            />
        </Field>
    );
}
