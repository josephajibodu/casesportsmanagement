import { Check, Copy, Download, Eye, FolderInput, Link2, MoreVertical, Pencil, Share2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { fileManagerApi } from './api';
import { FileIcon } from './file-icon';
import type { MediaFile, ViewMode } from './types';

export type FileCardActions = {
    onPreview: (file: MediaFile) => void;
    onRename: (file: MediaFile) => void;
    onMove: (file: MediaFile) => void;
    onShare: (file: MediaFile) => void;
    onCopyLink: (file: MediaFile) => void;
    onDelete: (file: MediaFile) => void;
};

function Thumb({ file, className }: { file: MediaFile; className?: string }) {
    if (file.type === 'image' && file.url) {
        return <img src={file.url} alt={file.name} loading="lazy" className={cn('size-full object-cover', className)} />;
    }

    return (
        <div className="flex size-full items-center justify-center bg-muted/40">
            <FileIcon type={file.type} className="size-8" />
        </div>
    );
}

function ActionsMenu({ file, actions }: { file: MediaFile; actions: FileCardActions }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => actions.onPreview(file)}>
                    <Eye className="size-4" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => actions.onRename(file)}>
                    <Pencil className="size-4" /> Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => actions.onMove(file)}>
                    <FolderInput className="size-4" /> Move
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href={fileManagerApi.downloadUrl(file.id)}>
                        <Download className="size-4" /> Download
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => actions.onShare(file)}>
                    <Share2 className="size-4" /> Share
                </DropdownMenuItem>
                {file.is_shared && (
                    <DropdownMenuItem onClick={() => actions.onCopyLink(file)}>
                        <Copy className="size-4" /> Copy share link
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => actions.onDelete(file)}>
                    <Trash2 className="size-4" /> Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function FileCard({
    file,
    view,
    selected,
    selectable = true,
    onSelect,
    actions,
}: {
    file: MediaFile;
    view: ViewMode;
    selected: boolean;
    selectable?: boolean;
    onSelect: (file: MediaFile) => void;
    actions: FileCardActions;
}) {
    const dragProps = {
        draggable: true,
        onDragStart: (e: React.DragEvent) => {
            e.dataTransfer.setData('application/x-media-file', String(file.id));
            e.dataTransfer.effectAllowed = 'move';
        },
    };

    const handleClick = () => selectable && onSelect(file);

    if (view === 'list') {
        return (
            <tr
                {...dragProps}
                onClick={handleClick}
                onDoubleClick={() => actions.onPreview(file)}
                className={cn(
                    'border-b transition',
                    selectable ? 'cursor-pointer hover:bg-accent/40' : 'opacity-40',
                    selected && 'bg-primary/10',
                )}
            >
                <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                        <div className="size-9 shrink-0 overflow-hidden rounded border">
                            <Thumb file={file} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="truncate font-medium">{file.name}</span>
                                {file.is_shared && <Link2 className="size-3.5 shrink-0 text-primary" />}
                            </div>
                            <span className="text-xs text-muted-foreground">{file.extension?.toUpperCase()}</span>
                        </div>
                    </div>
                </td>
                <td className="px-3 py-2 text-sm text-muted-foreground capitalize">{file.type}</td>
                <td className="px-3 py-2 text-sm text-muted-foreground">{file.size_for_humans}</td>
                <td className="px-3 py-2 text-sm text-muted-foreground">{file.created_at_for_humans}</td>
                <td className="px-3 py-2 text-right">
                    <ActionsMenu file={file} actions={actions} />
                </td>
            </tr>
        );
    }

    return (
        <div
            {...dragProps}
            onClick={handleClick}
            onDoubleClick={() => actions.onPreview(file)}
            className={cn(
                'group relative overflow-hidden rounded-xl border bg-card transition',
                selectable ? 'cursor-pointer hover:border-primary/40' : 'cursor-not-allowed opacity-40',
                selected && 'border-primary ring-2 ring-primary/30',
            )}
        >
            <div className="relative aspect-square">
                <Thumb file={file} />

                {selected && (
                    <span className="absolute left-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3.5" />
                    </span>
                )}

                {file.is_shared && (
                    <Badge variant="secondary" className="absolute right-2 top-2 gap-1">
                        <Link2 className="size-3" /> Shared
                    </Badge>
                )}

                <div className="absolute bottom-1 right-1 opacity-0 transition group-hover:opacity-100">
                    <div className="rounded-md bg-background/80 backdrop-blur">
                        <ActionsMenu file={file} actions={actions} />
                    </div>
                </div>
            </div>

            <div className="border-t p-2.5">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{file.size_for_humans}</span>
                    <span className="uppercase">{file.extension}</span>
                </div>
            </div>
        </div>
    );
}
