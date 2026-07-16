import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { fileManagerApi } from './api';
import { FileIcon } from './file-icon';
import type { MediaFile } from './types';

function Meta({ label, value }: { label: string; value: string | number | null | undefined }) {
    if (value === null || value === undefined || value === '') return null;

    return (
        <div className="flex justify-between gap-4 py-1.5 text-sm">
            <dt className="shrink-0 text-muted-foreground">{label}</dt>
            <dd className="truncate text-right font-medium">{value}</dd>
        </div>
    );
}

export function FilePreview({
    file,
    files,
    onClose,
    onNavigate,
}: {
    file: MediaFile | null;
    files: MediaFile[];
    onClose: () => void;
    onNavigate: (file: MediaFile) => void;
}) {
    const [zoom, setZoom] = useState(1);

    const index = file ? files.findIndex((f) => f.id === file.id) : -1;
    const previous = index > 0 ? files[index - 1] : null;
    const next = index >= 0 && index < files.length - 1 ? files[index + 1] : null;

    useEffect(() => setZoom(1), [file?.id]);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (!file) return;
            if (e.key === 'ArrowLeft' && previous) onNavigate(previous);
            if (e.key === 'ArrowRight' && next) onNavigate(next);
        }

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [file, previous, next, onNavigate]);

    if (!file) return null;

    return (
        <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl gap-0 overflow-hidden p-0">
                <DialogTitle className="sr-only">{file.name}</DialogTitle>

                <div className="grid lg:grid-cols-[1fr_280px]">
                    {/* Stage */}
                    <div className="relative flex h-[60vh] items-center justify-center overflow-auto bg-muted/50">
                        {file.type === 'image' && file.url ? (
                            <img
                                src={file.url}
                                alt={file.name}
                                style={{ transform: `scale(${zoom})` }}
                                className="max-h-full max-w-full object-contain transition-transform"
                            />
                        ) : file.type === 'video' && file.url ? (
                            <video src={file.url} controls className="max-h-full max-w-full" />
                        ) : (
                            <div className="text-center">
                                <FileIcon type={file.type} className="mx-auto size-16" />
                                <p className="mt-3 text-sm text-muted-foreground">No preview available</p>
                            </div>
                        )}

                        {previous && (
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => onNavigate(previous)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full"
                                aria-label="Previous file"
                            >
                                <ChevronLeft className="size-5" />
                            </Button>
                        )}
                        {next && (
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={() => onNavigate(next)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full"
                                aria-label="Next file"
                            >
                                <ChevronRight className="size-5" />
                            </Button>
                        )}

                        {file.type === 'image' && (
                            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-background/90 p-1 shadow-sm backdrop-blur">
                                <Button variant="ghost" size="icon" className="size-8" onClick={() => setZoom((z) => Math.max(1, z - 0.25))} aria-label="Zoom out">
                                    <ZoomOut className="size-4" />
                                </Button>
                                <span className="w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
                                <Button variant="ghost" size="icon" className="size-8" onClick={() => setZoom((z) => Math.min(4, z + 0.25))} aria-label="Zoom in">
                                    <ZoomIn className="size-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <aside className="border-t p-5 lg:border-l lg:border-t-0">
                        <h2 className="truncate font-semibold">{file.name}</h2>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{file.original_filename}</p>

                        <dl className="mt-4 divide-y">
                            <Meta label="Type" value={file.mime_type} />
                            <Meta label="Extension" value={file.extension?.toUpperCase()} />
                            <Meta label="Size" value={file.size_for_humans} />
                            {file.width && <Meta label="Dimensions" value={`${file.width} × ${file.height}`} />}
                            <Meta label="Uploaded" value={file.created_at_for_humans} />
                            <Meta label="Uploaded by" value={file.uploaded_by} />
                            <Meta label="Shared" value={file.is_shared ? 'Yes' : 'No'} />
                        </dl>

                        <Button asChild variant="outline" className="mt-5 w-full">
                            <a href={fileManagerApi.downloadUrl(file.id)}>
                                <Download className="size-4" /> Download
                            </a>
                        </Button>
                    </aside>
                </div>
            </DialogContent>
        </Dialog>
    );
}
